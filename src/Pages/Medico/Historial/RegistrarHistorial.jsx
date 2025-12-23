import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; 
import { registrarHistorial } from "../../../Services/HistorialService";
import { buscarCitasConfirmadas, buscarCitaPorId } from "../../../Services/CitaService"; 

const RegistrarHistorialMedico = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // ESTADOS DE ERROR Y CARGA
    const [loading, setLoading] = useState(false);
    const [erroresServidor, setErroresServidor] = useState({});
    const [mensajeGlobal, setMensajeGlobal] = useState({ texto: "", tipo: "" });

    // Estado del formulario
    const [form, setForm] = useState({
        idCita: "",
        citaInfo: "", 
        diagnostico: "",
        tratamiento: "",
        notasAdicionales: "",
        peso: "",
        presionArterial: ""
    });

    // Estados para el Modal
    const [showModal, setShowModal] = useState(false);
    const [citasParaModal, setCitasParaModal] = useState([]);
    const [busquedaCita, setBusquedaCita] = useState("");

    const citaIdURL = searchParams.get("citaId");

    /* ===================== MANEJADORES ===================== */

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        
        // Limpiar error específico del campo al escribir
        if (erroresServidor[name]) {
            setErroresServidor((prev) => {
                const nuevosErrores = { ...prev };
                delete nuevosErrores[name];
                return nuevosErrores;
            });
        }
    };

    /* ===================== LÓGICA DE PRECARGA ===================== */

    useEffect(() => {
        if (citaIdURL) cargarCitaEspecifica(citaIdURL);
    }, [citaIdURL]);

    const cargarCitaEspecifica = async (id) => {
        setLoading(true);
        try {
            const res = await buscarCitaPorId(id);
            const c = res.data;
            setForm(prev => ({
                ...prev,
                idCita: c.idCita,
                citaInfo: `Cita #${c.idCita} - Paciente: ${c.pacienteNombreCompleto} (${c.fecha})`
            }));
        } catch (err) {
            setMensajeGlobal({ texto: "No se pudo cargar la cita seleccionada.", tipo: "danger" });
        } finally {
            setLoading(false);
        }
    };

    /* ===================== LÓGICA DEL MODAL ===================== */

    const abrirModal = () => {
        setShowModal(true);
        cargarCitasModal("");
    };

    const cargarCitasModal = async (criterio = "") => {
        try {
            const res = await buscarCitasConfirmadas(criterio);
            const lista = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);
            setCitasParaModal(lista);
        } catch (err) { console.error(err); }
    };

    const seleccionarCita = (c) => {
        setForm({
            ...form,
            idCita: c.idCita,
            citaInfo: `Cita #${c.idCita} - Paciente: ${c.nombreCompletoPaciente} (${c.fecha})`
        });
        // Limpiar error de idCita si existía
        if (erroresServidor.idCita) {
            const nuevos = { ...erroresServidor };
            delete nuevos.idCita;
            setErroresServidor(nuevos);
        }
        setShowModal(false);
    };

    /* ===================== ENVÍO DE DATOS ===================== */

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErroresServidor({});
        setMensajeGlobal({ texto: "", tipo: "" });

        if (!form.idCita) {
            setMensajeGlobal({ texto: "Debe seleccionar una cita confirmada.", tipo: "danger" });
            return;
        }

        setLoading(true);
        try {
            await registrarHistorial(form);
            alert("Atención médica registrada con éxito.");
            navigate("/medico/historial");
        } catch (err) {
            if (err.response && err.response.data) {
                const data = err.response.data;
                if (data.errores) setErroresServidor(data.errores);
                setMensajeGlobal({ texto: data.mensaje || "Error al registrar la atención", tipo: "danger" });
            } else {
                setMensajeGlobal({ texto: "Error de conexión con el servidor", tipo: "danger" });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4 pb-5">
            <h2 className="mb-4 text-primary fw-bold">
                <i className="bi bi-file-earmark-medical me-2"></i>Registrar Atención Médica
            </h2>

            {mensajeGlobal.texto && (
                <div className={`alert alert-${mensajeGlobal.tipo} alert-dismissible fade show shadow-sm`} role="alert">
                    {mensajeGlobal.texto}
                    <button type="button" className="btn-close" onClick={() => setMensajeGlobal({ texto: "", tipo: "" })}></button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0 bg-white" noValidate>
                
                {/* SELECCIÓN DE CITA */}
                <div className="mb-4">
                    <label className="form-label fw-bold text-secondary">Cita Médica a Atender *</label>
                    <div className="input-group has-validation shadow-sm">
                        <span className="input-group-text bg-white">
                            <i className="bi bi-calendar-check text-primary"></i>
                        </span>
                        <input 
                            type="text" 
                            className={`form-control ${erroresServidor.idCita ? "is-invalid" : "bg-light"}`}
                            value={form.citaInfo} 
                            placeholder="Busque la cita confirmada..."
                            readOnly 
                        />
                        {!citaIdURL && (
                            <button type="button" className="btn btn-primary" onClick={abrirModal} disabled={loading}>
                                <i className="bi bi-search me-1"></i> Buscar
                            </button>
                        )}
                        {erroresServidor.idCita && <div className="invalid-feedback">{erroresServidor.idCita}</div>}
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold text-secondary">Peso (Kg)</label>
                        <input 
                            name="peso" type="number" step="0.01" 
                            className={`form-control ${erroresServidor.peso ? "is-invalid" : ""}`} 
                            placeholder="0.00" value={form.peso} onChange={handleChange}
                        />
                        {erroresServidor.peso && <div className="invalid-feedback">{erroresServidor.peso}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold text-secondary">Presión Arterial</label>
                        <input 
                            name="presionArterial" type="text" 
                            className={`form-control ${erroresServidor.presionArterial ? "is-invalid" : ""}`} 
                            placeholder="Ej: 120/80" value={form.presionArterial} onChange={handleChange}
                        />
                        {erroresServidor.presionArterial && <div className="invalid-feedback">{erroresServidor.presionArterial}</div>}
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold text-secondary">Diagnóstico *</label>
                    <textarea 
                        name="diagnostico" rows="3"
                        className={`form-control shadow-sm ${erroresServidor.diagnostico ? "is-invalid" : ""}`}
                        placeholder="Escriba el diagnóstico detallado..."
                        value={form.diagnostico} onChange={handleChange}
                    />
                    {erroresServidor.diagnostico && <div className="invalid-feedback">{erroresServidor.diagnostico}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold text-secondary">Tratamiento / Plan Médico *</label>
                    <textarea 
                        name="tratamiento" rows="3"
                        className={`form-control shadow-sm ${erroresServidor.tratamiento ? "is-invalid" : ""}`}
                        placeholder="Medicamentos, dosis y recomendaciones..."
                        value={form.tratamiento} onChange={handleChange}
                    />
                    {erroresServidor.tratamiento && <div className="invalid-feedback">{erroresServidor.tratamiento}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold text-secondary">Notas Adicionales</label>
                    <textarea 
                        name="notasAdicionales" rows="2"
                        className={`form-control ${erroresServidor.notasAdicionales ? "is-invalid" : ""}`}
                        placeholder="Observaciones adicionales..."
                        value={form.notasAdicionales} onChange={handleChange}
                    />
                    {erroresServidor.notasAdicionales && <div className="invalid-feedback">{erroresServidor.notasAdicionales}</div>}
                </div>

                <div className="d-flex gap-2 mt-4">
                    <button type="submit" className="btn btn-success px-5 fw-bold" disabled={loading}>
                        {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-save me-2"></i>}
                        {loading ? "PROCESANDO..." : "REGISTRAR ATENCIÓN"}
                    </button>
                    <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate(-1)}>
                        CANCELAR
                    </button>
                </div>
            </form>

            {/* MODAL DE BÚSQUEDA (Sin cambios estructurales, solo integración) */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title fw-bold"><i className="bi bi-search me-2"></i>Buscar Cita Confirmada</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <input 
                                    type="text" className="form-control mb-4 py-2 border-primary-subtle shadow-sm" 
                                    placeholder="Nombre del paciente o DNI..." value={busquedaCita}
                                    onChange={(e) => { setBusquedaCita(e.target.value); cargarCitasModal(e.target.value); }}
                                />
                                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                    <table className="table table-hover border rounded">
                                        <thead className="table-light">
                                            <tr><th>Fecha/Hora</th><th>Paciente</th><th className="text-center">Acción</th></tr>
                                        </thead>
                                        <tbody>
                                            {citasParaModal.length > 0 ? (
                                                citasParaModal.map(c => (
                                                    <tr key={c.idCita}>
                                                        <td>{c.fecha} - {c.hora}</td>
                                                        <td>
                                                            <div className="fw-bold">{c.nombreCompletoPaciente}</div>
                                                            <small className="text-muted">{c.dniPaciente}</small>
                                                        </td>
                                                        <td className="text-center">
                                                            <button className="btn btn-sm btn-primary px-3 fw-bold" onClick={() => seleccionarCita(c)}>
                                                                Seleccionar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan="3" className="text-center py-4 text-muted fst-italic">No hay citas confirmadas.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegistrarHistorialMedico;