import { useState } from "react";
// Se eliminaron useCallback y useNavigate porque no se usaban según tu ESLint
import Swal from "sweetalert2";
import {
    registrarHorario,
    listarHorariosPorMedico,
    buscarMedicosParaHorario,
    eliminarHorario,
} from "../../../Services/HorarioService";
import "../../../Styles/MantenerHorarios.css";

const GestionarHorario = () => {
    const [medico, setMedico] = useState(null);
    const [criterioBusqueda, setCriterioBusqueda] = useState("");
    const [medicosResultados, setMedicosResultados] = useState([]);
    const [listaHorarios, setListaHorarios] = useState([]);
    const [nuevoHorario, setNuevoHorario] = useState({
        diaSemana: "",
        horarioEntrada: "",
        horarioSalida: "",
    });
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [erroresServidor, setErroresServidor] = useState({});
    const [mensajeGlobal, setMensajeGlobal] = useState({ texto: "", tipo: "" });

    // --- LÓGICA DE BÚSQUEDA ---
    const handleSearchInput = (e) => {
        const valor = e.target.value;
        setCriterioBusqueda(valor);
        cargarMedicosModal(valor);
    };

    const abrirModal = () => {
        setShowModal(true);
        cargarMedicosModal("");
    };

    const cargarMedicosModal = async (criterio = "") => {
        try {
            const res = await buscarMedicosParaHorario(criterio);
            const data = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);
            setMedicosResultados(data);
        } catch (err) {
            console.error("Error en búsqueda:", err);
            setMedicosResultados([]);
        }
    };

    const seleccionarMedico = async (m) => {
        setMedico(m);
        setShowModal(false);
        setCriterioBusqueda("");
        setMensajeGlobal({ texto: "", tipo: "" });
        setErroresServidor({});

        try {
            const res = await listarHorariosPorMedico(m.idMedico);
            setListaHorarios(res.data || []);
        } catch (err) {
            console.error("Error al cargar horarios:", err);
            setListaHorarios([]);
        }
    };

    const handleRegistrar = async (e) => {
        e.preventDefault();
        if (!medico) {
            Swal.fire("Atención", "Seleccione un médico primero", "warning");
            return;
        }
        setLoading(true);
        setErroresServidor({});
        setMensajeGlobal({ texto: "", tipo: "" });

        try {
            const dto = { idMedico: medico.idMedico, ...nuevoHorario };
            const res = await registrarHorario(dto);
            setListaHorarios([...listaHorarios, res.data]);
            setNuevoHorario({ diaSemana: "", horarioEntrada: "", horarioSalida: "" });
            Swal.fire({ icon: 'success', title: '¡Éxito!', text: 'Turno registrado' });
        } catch (err) {
            if (err.response?.data) {
                const data = err.response.data;
                if (data.errores) setErroresServidor(data.errores);
                setMensajeGlobal({ texto: data.mensaje || "Error al registrar", tipo: "danger" });
            }
        } finally { setLoading(false); }
    };

    const handleEliminar = (id) => {
        Swal.fire({
            title: "¿Eliminar turno?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await eliminarHorario(id);
                    setListaHorarios(listaHorarios.filter((h) => h.idHorario !== id));
                    Swal.fire("Eliminado", "Horario removido.", "success");
                } catch (err) {
                    Swal.fire("Error", err.response?.data?.mensaje || "No se pudo eliminar", "error");
                }
            }
        });
    };

    const opcionesHora = Array.from({ length: 16 }, (_, i) => {
        const h = i + 7;
        return h < 10 ? `0${h}:00` : `${h}:00`;
    });

    return (
        <div className="container page-container pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="card-title" style={{fontSize: '1.3rem'}}>
                        <i className="bi bi-calendar-range-fill me-2 text-primary"></i>Planificación de Horarios
                    </h4>
                    <p className="sub-header mb-0">Gestione los turnos semanales de atención del staff médico</p>
                </div>
                <button className="btn btn-primary shadow-sm px-4" onClick={abrirModal}>
                    <i className="bi bi-search me-2"></i>Buscar Médico
                </button>
            </div>

            {/* CARD INFO MÉDICO */}
            <div className="card card-modern shadow-sm mb-4">
                <div className="card-header-modern">
                    <h6 className="card-title text-primary" style={{fontSize: '1rem'}}>
                        <i className="bi bi-person-check-fill me-2"></i>Médico Seleccionado
                    </h6>
                </div>
                <div className="card-body p-4">
                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label-custom">DNI / Identificación</label>
                            <div className="info-box-modern">{medico?.dni || "—"}</div>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label-custom">Nombre Completo</label>
                            <div className="info-box-modern">
                                {medico ? `${medico.nombres} ${medico.apellidos}` : <span className="text-muted fst-italic fw-normal">Ningún médico vinculado</span>}
                            </div>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label-custom">Especialidad</label>
                            <div className="info-box-modern justify-content-center">
                                <span className="badge bg-info-subtle text-info border border-info-subtle px-3 py-2 uppercase" style={{fontSize: '0.75rem'}}>
                                    {medico?.nombreEspecialidad || "—"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-7">
                    <div className="card card-modern shadow-sm">
                        <div className="card-header-modern">
                            <h6 className="card-title" style={{fontSize: '1rem'}}><i className="bi bi-list-ul me-2 text-secondary"></i>Turnos Registrados</h6>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover table-modern mb-0">
                                    <thead>
                                        <tr><th className="ps-4">Día</th><th>Entrada</th><th>Salida</th><th className="text-center">Acción</th></tr>
                                    </thead>
                                    <tbody>
                                        {listaHorarios.length > 0 ? (
                                            listaHorarios.map((h) => (
                                                <tr key={h.idHorario}>
                                                    <td className="ps-4"><span className="day-badge">{h.diaSemana}</span></td>
                                                    <td className="fw-bold text-dark">{h.horarioEntrada}</td>
                                                    <td className="fw-bold text-dark">{h.horarioSalida}</td>
                                                    <td className="text-center">
                                                        <button className="btn btn-light btn-sm text-danger border shadow-sm" onClick={() => handleEliminar(h.idHorario)}>
                                                            <i className="bi bi-trash3"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="4" className="text-center py-5 text-muted small">No hay horarios registrados.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card card-modern shadow-sm border-top border-success border-4">
                        <div className="card-header-modern">
                            <h6 className="card-title" style={{fontSize: '1rem'}}><i className="bi bi-plus-circle-fill me-2 text-success"></i>Nuevo Turno</h6>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleRegistrar}>
                                <div className="mb-3">
                                    <label className="form-label-custom">Día de la semana</label>
                                    <select className="form-select" value={nuevoHorario.diaSemana} onChange={(e) => setNuevoHorario({ ...nuevoHorario, diaSemana: e.target.value })} required>
                                        <option value="">Seleccione día...</option>
                                        {["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"].map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="row g-3 mb-4">
                                    <div className="col-6">
                                        <label className="form-label-custom">Entrada</label>
                                        <select className="form-select" value={nuevoHorario.horarioEntrada} onChange={(e) => setNuevoHorario({...nuevoHorario, horarioEntrada: e.target.value})} required>
                                            {opcionesHora.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label-custom">Salida</label>
                                        <select className="form-select" value={nuevoHorario.horarioSalida} onChange={(e) => setNuevoHorario({...nuevoHorario, horarioSalida: e.target.value})} required>
                                            {opcionesHora.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary w-100 shadow-sm  py-2" disabled={loading || !medico}>
                                    <i className="bi bi-check-circle me-1"></i>Guardar Horario
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL DE BÚSQUEDA PROTEGIDO */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-dark text-white">
                                <h6 className="modal-title fw-bold">Buscador de Médicos</h6>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <input type="text" className="form-control mb-4" placeholder="Filtrar por nombre o DNI..." value={criterioBusqueda} onChange={handleSearchInput} autoFocus />
                                <div className="table-responsive border rounded-3" style={{ maxHeight: "350px" }}>
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr><th className="ps-3">Médico</th><th>Especialidad</th><th className="text-end pe-3">Acción</th></tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(medicosResultados) && medicosResultados.map((m) => (
                                                <tr key={m.idMedico}>
                                                    <td className="ps-3"><div>{m.nombres} {m.apellidos}</div></td>
                                                    <td><span className="badge bg-light text-primary border">{m.nombreEspecialidad}</span></td>
                                                    <td className="text-end pe-3"><button className="btn btn-outline-success btn-sm rounded-pill px-3 fw-bold" onClick={() => seleccionarMedico(m)}>Seleccionar</button></td>
                                                </tr>
                                            ))}
                                            {medicosResultados.length === 0 && (<tr><td colSpan="3" className="text-center py-4 text-muted">No se encontraron resultados.</td></tr>)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer bg-light">
                                <button type="button" className="btn btn-secondary px-4" onClick={() => setShowModal(false)}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionarHorario;