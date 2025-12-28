import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; 
import Swal from "sweetalert2";
import { registrarHistorial } from "../../../Services/HistorialService";
import { buscarCitasConfirmadas, buscarCitaPorId } from "../../../Services/CitaService"; 
import "../../../Styles/RegistrarHistorial.css"; // CSS Separado como solicitaste

const RegistrarHistorialMedico = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [erroresServidor, setErroresServidor] = useState({});
    const [mensajeGlobal, setMensajeGlobal] = useState({ texto: "", tipo: "" });

    const [form, setForm] = useState({
        idCita: "",
        citaInfo: "", 
        diagnostico: "",
        tratamiento: "",
        notasAdicionales: "",
        peso: "",
        presionArterial: ""
    });

    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [citasParaModal, setCitasParaModal] = useState([]);
    const [busquedaCita, setBusquedaCita] = useState("");

    const citaIdURL = searchParams.get("citaId");

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
                citaInfo: `Cita #${c.idCita} - Paciente: ${c.pacienteNombreCompleto}`
            }));
            setCitaSeleccionada(c);
        } catch (err) {
            Swal.fire("Error", "No se pudo cargar la cita desde la URL.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (erroresServidor[name]) {
            setErroresServidor(prev => {
                const nuevos = { ...prev };
                delete nuevos[name];
                return nuevos;
            });
        }
    };

    const abrirModal = () => {
        setShowModal(true);
        cargarCitasModal("");
    };

    const cargarCitasModal = async (criterio = "") => {
        try {
            const res = await buscarCitasConfirmadas(criterio);
            setCitasParaModal(Array.isArray(res.data) ? res.data : []);
        } catch (err) { console.error(err); }
    };

    const seleccionarCita = (c) => {
        setForm({
            ...form,
            idCita: c.idCita,
            citaInfo: `Cita #${c.idCita} - ${c.nombreCompletoPaciente}`
        });
        setCitaSeleccionada(c);
        setErroresServidor({});
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErroresServidor({});
        if (!form.idCita) {
            Swal.fire("Atención", "Debe seleccionar una cita para registrar la atención.", "warning");
            return;
        }

        setLoading(true);
        try {
            await registrarHistorial(form);
            await Swal.fire({
                icon: 'success',
                title: 'Atención Registrada',
                text: 'El historial médico se guardó correctamente.',
                timer: 2000,
                showConfirmButton: false
            });
            navigate("/medico/historial");
        } catch (err) {
            const data = err.response?.data;
            if (data?.errores) {
                setErroresServidor(data.errores);
                Swal.fire("Validación", "Por favor, revise los campos marcados.", "error");
            } else {
                const msg = data?.mensaje || "Error al procesar el registro.";
                setMensajeGlobal({ texto: msg, tipo: "danger" });
                Swal.fire("Error", msg, "error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container page-container pb-5">
            <div className="card card-modern shadow-sm">
                <div className="card-header-modern">
                    <div>
                    <h5 className="card-title">
                        <i className="bi bi-people-fill me-2 text-primary"></i>Registro de Historial Médico
                    </h5>
                                        <div className="sub-header">Ingrese diagnóstico y tratamiento del paciente atendido</div>
                    </div>
                </div>

                <div className="card-body p-4 p-md-5">
                    {mensajeGlobal.texto && (
                        <div className={`alert alert-${mensajeGlobal.tipo} shadow-sm mb-4`}>{mensajeGlobal.texto}</div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        {/* SELECCIÓN DE CITA */}
                        <div className="mb-4">
                            <label className="form-label">Vincular Cita Confirmada *</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light"><i className="bi bi-calendar-check"></i></span>
                                <input type="text" className={`form-control bg-light ${erroresServidor.idCita ? "is-invalid" : ""}`}
                                    value={form.citaInfo} readOnly placeholder="Busque la cita confirmada..." />
                                {!citaIdURL && (
                                    <button type="button" className="btn btn-primary px-4" onClick={abrirModal}>
                                        <i className="bi bi-search me-1"></i> Buscar
                                    </button>
                                )}
                                {erroresServidor.idCita && <div className="invalid-feedback d-block">{erroresServidor.idCita}</div>}
                            </div>
                        </div>

                        {/* RESUMEN DEL PACIENTE */}
                        {citaSeleccionada && (
                            <div className="info-box-hours mb-4 animate__animated animate__fadeIn">
                                <small className="fw-bold d-block mb-2 text-uppercase text-primary">
                                    <i className="bi bi-person-vcard me-1"></i> Información del Paciente:
                                </small>
                                <div className="row g-2 small">
                                    <div className="col-md-6"><strong>Paciente:</strong> {citaSeleccionada.nombreCompletoPaciente || citaSeleccionada.pacienteNombreCompleto}</div>
                                    <div className="col-md-6"><strong>DNI:</strong> {citaSeleccionada.dniPaciente || "Ver ficha"}</div>
                                    <div className="col-md-6"><strong>Fecha:</strong> {citaSeleccionada.fecha}</div>
                                    <div className="col-md-6"><strong>Hora:</strong> {citaSeleccionada.hora}</div>
                                </div>
                            </div>
                        )}

                        <div className="row g-4 mb-4">
                            <div className="col-md-6">
                                <label className="form-label">Peso (Kg)</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white"><i className="bi bi-speedometer2"></i></span>
                                    <input name="peso" type="number" step="0.01" className={`form-control ${erroresServidor.peso ? "is-invalid" : ""}`}
                                        placeholder="0.00" value={form.peso} onChange={handleChange} />
                                    {erroresServidor.peso && <div className="invalid-feedback">{erroresServidor.peso}</div>}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Presión Arterial</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white"><i className="bi bi-heart-pulse"></i></span>
                                    <input name="presionArterial" type="text" className={`form-control ${erroresServidor.presionArterial ? "is-invalid" : ""}`}
                                        placeholder="120/80" value={form.presionArterial} onChange={handleChange} />
                                    {erroresServidor.presionArterial && <div className="invalid-feedback">{erroresServidor.presionArterial}</div>}
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Diagnóstico *</label>
                            <textarea name="diagnostico" rows="3" className={`form-control ${erroresServidor.diagnostico ? "is-invalid" : ""}`}
                                placeholder="Escriba el diagnóstico..." value={form.diagnostico} onChange={handleChange} />
                            {erroresServidor.diagnostico && <div className="invalid-feedback">{erroresServidor.diagnostico}</div>}
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Tratamiento / Plan Médico *</label>
                            <textarea name="tratamiento" rows="3" className={`form-control ${erroresServidor.tratamiento ? "is-invalid" : ""}`}
                                placeholder="Medicamentos y dosis..." value={form.tratamiento} onChange={handleChange} />
                            {erroresServidor.tratamiento && <div className="invalid-feedback">{erroresServidor.tratamiento}</div>}
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Notas Adicionales</label>
                            <textarea name="notasAdicionales" rows="2" className={`form-control ${erroresServidor.notasAdicionales ? "is-invalid" : ""}`}
                                placeholder="Opcional..." value={form.notasAdicionales} onChange={handleChange} />
                            {erroresServidor.notasAdicionales && <div className="invalid-feedback">{erroresServidor.notasAdicionales}</div>}
                        </div>

                        <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                            <button type="button" className="btn btn-light border px-4" onClick={() => navigate(-1)}>Cancelar</button>
                            <button type="submit" disabled={loading} className="btn btn-success px-5 shadow-sm">
                                {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-check-circle me-1"></i>}
                                Guardar Atención
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* MODAL CITAS */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content modal-content-modern shadow-lg">
                            <div className="modal-header border-bottom-0 p-4">
                                <h6 className="modal-title text-primary fw-bold">Citas Confirmadas</h6>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body p-4 pt-0">
                                <input type="text" className="form-control mb-4" placeholder="Buscar por paciente o DNI..."
                                    value={busquedaCita} onChange={(e) => { setBusquedaCita(e.target.value); cargarCitasModal(e.target.value); }} />
                                <div className="table-responsive" style={{ maxHeight: '350px' }}>
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light text-muted small">
                                            <tr><th>Paciente</th><th>Fecha / Hora</th><th className="text-end">Acción</th></tr>
                                        </thead>
                                        <tbody>
                                            {citasParaModal.map(c => (
                                                <tr key={c.idCita}>
                                                    <td>
                                                        <div className="fw-bold">{c.nombreCompletoPaciente}</div>
                                                        <small className="text-muted">{c.dniPaciente}</small>
                                                    </td>
                                                    <td className="small">{c.fecha} - {c.hora}</td>
                                                    <td className="text-end">
                                                        <button className="btn btn-sm btn-primary rounded-pill px-3 fw-bold" onClick={() => seleccionarCita(c)}>Seleccionar</button>
                                                    </td>
                                                </tr>
                                            ))}
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