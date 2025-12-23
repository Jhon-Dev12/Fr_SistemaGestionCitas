import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { obtenerDisponibilidad } from "../../../Services/SlotHorarioService";
import { proyeccionPorMedico } from "../../../Services/HorarioService";
import { buscarCitaPorId, actualizarCita } from "../../../Services/CitaService";

const EditarCita = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // --- ESTADOS PRINCIPALES ---
    const [citaDetalle, setCitaDetalle] = useState(null);
    const [fecha, setFecha] = useState("");
    const [slotIdSel, setSlotIdSel] = useState(null);
    const [motivo, setMotivo] = useState("");

    // --- ESTADOS DINÁMICOS ---
    const [proyeccion, setProyeccion] = useState([]);
    const [slotsDisponibles, setSlotsDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- ESTADOS DE PROCESAMIENTO ---
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mensajeGlobal, setMensajeGlobal] = useState({ texto: "", tipo: "" });

    // 1. CARGA INICIAL
    useEffect(() => {
        const idNumerico = Number(id);
        if (isNaN(idNumerico)) return;

        buscarCitaPorId(idNumerico)
            .then(res => {
                const data = res.data;
                setCitaDetalle(data);
                setFecha(data.fecha);
                setMotivo(data.motivo || "");
                
                if (data.idMedico) {
                    proyeccionPorMedico(data.idMedico)
                        .then(resProj => setProyeccion(resProj.data || []));
                }
                setLoading(false);
            })
            .catch(err => {
                setMensajeGlobal({ texto: "No se pudo cargar la información de la cita.", tipo: "danger" });
                setLoading(false);
            });
    }, [id]);

    // 2. CONSULTA DE SLOTS
    useEffect(() => {
        if (citaDetalle?.idMedico && fecha) {
            obtenerDisponibilidad(citaDetalle.idMedico, fecha)
                .then(res => setSlotsDisponibles(res.data || []))
                .catch(() => setSlotsDisponibles([]));
        }
    }, [citaDetalle, fecha]);

    const handleGuardarCambios = () => {
        setMensajeGlobal({ texto: "", tipo: "" });
        if (!motivo.trim()) return setMensajeGlobal({ texto: "Por favor, ingrese un motivo.", tipo: "danger" });

        setIsSubmitting(true);
        actualizarCita(id, { idCita: Number(id), idSlotNuevo: slotIdSel, motivo: motivo })
            .then(() => {
                alert("¡Cita actualizada correctamente!");
                navigate("/recepcionista/cita");
            })
            .catch(err => setMensajeGlobal({ texto: err.response?.data?.mensaje || "Error al actualizar", tipo: "danger" }))
            .finally(() => setIsSubmitting(false));
    };

    if (loading) return <div className="container mt-5 text-center"><div className="spinner-border text-primary"></div><p>Cargando datos...</p></div>;

    return (
        <div className="container mt-5 pb-5">
            <h2 className="text-primary mb-4 text-center">Editar Cita Médica N° {id}</h2>

            {/* --- BLOQUE DE INFORMACIÓN FIJA (Similar al buscador de usuarios) --- */}
            <div className="card mb-4 border-primary shadow-sm">
                <div className="card-body bg-light">
                    <div className="row g-3">
                        <div className="col-md-6 border-end text-center">
                            <label className="fw-bold text-muted d-block small mb-1">PACIENTE VINCULADO</label>
                            <h5 className="mb-0 text-dark">{citaDetalle?.pacienteNombreCompleto}</h5>
                            <code className="text-primary">{citaDetalle?.pacienteDni}</code>
                        </div>
                        <div className="col-md-6 text-center">
                            <label className="fw-bold text-muted d-block small mb-1">MÉDICO Y ESPECIALIDAD</label>
                            <h5 className="mb-0 text-dark">Dr(a). {citaDetalle?.medicoNombreCompleto}</h5>
                            <span className="badge bg-info text-dark">{citaDetalle?.especialidadNombre}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FORMULARIO DE EDICIÓN (Estilo ActualizarUsuario / bg-success header) --- */}
            <div className="card shadow border-0">
                <div className="card-header bg-success text-white py-3">
                    <h4 className="mb-0 text-center">Modificar Horario y Motivo</h4>
                </div>
                <div className="card-body p-4">
                    {mensajeGlobal.texto && (
                        <div className={`alert alert-${mensajeGlobal.tipo} alert-dismissible fade show`} role="alert">
                            {mensajeGlobal.texto}
                            <button type="button" className="btn-close" onClick={() => setMensajeGlobal({ texto: "", tipo: "" })}></button>
                        </div>
                    )}

                    <div className="row">
                        {/* Selección de Fecha */}
                        <div className="col-md-12 mb-4 border-bottom pb-3">
                            <label className="form-label fw-bold"><i className="bi bi-calendar-event me-2"></i>Nueva Fecha de Atención</label>
                            <div className="d-flex gap-3 align-items-center">
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    value={fecha} 
                                    min={new Date().toISOString().split("T")[0]}
                                    onChange={(e) => { setFecha(e.target.value); setSlotIdSel(null); }}
                                    style={{maxWidth: '300px'}}
                                />
                                <div className="text-muted small bg-white p-2 rounded border">
                                    <i className="bi bi-info-circle me-1"></i>
                                    Actual: <strong>{citaDetalle?.fecha}</strong> a las <strong>{citaDetalle?.hora}</strong>
                                </div>
                            </div>
                        </div>

                        {/* Programación de Médico */}
                        <div className="col-12 mb-4">
                            <label className="form-label fw-bold small text-muted">DÍAS QUE ATIENDE EL MÉDICO:</label>
                            <div className="d-flex flex-wrap gap-2">
                                {proyeccion.map(p => (
                                    <span key={p.diaSemana} className="badge bg-primary bg-opacity-75">{p.diaSemana}</span>
                                ))}
                            </div>
                        </div>

                        {/* GRID DE HORARIOS (SLOTS) */}
                        <div className="col-12 mt-2 p-3 bg-light rounded border">
                            <h5 className="mb-3 fw-bold"><i className="bi bi-clock me-2"></i>Horarios Disponibles para {fecha}</h5>
                            {slotsDisponibles.length > 0 ? (
                                <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-2">
                                    {slotsDisponibles.map(s => {
                                        const esDisponible = s.estadoSlot === "DISPONIBLE"; 
                                        const estaSeleccionado = slotIdSel === s.idSlot;
                                        return (
                                            <div key={s.idSlot} className="col">
                                                <button 
                                                    disabled={!esDisponible} 
                                                    onClick={() => setSlotIdSel(s.idSlot)}
                                                    className={`btn w-100 py-2 fw-bold ${estaSeleccionado ? "btn-success" : esDisponible ? "btn-outline-primary bg-white" : "btn-light text-muted"}`}
                                                >
                                                    {s.hora}
                                                    {!esDisponible && <div style={{ fontSize: "9px" }}>OCUPADO</div>}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="alert alert-warning mb-0">No hay horarios disponibles en esta fecha.</div>
                            )}
                        </div>

                        {/* Motivo */}
                        <div className="col-12 mt-4">
                            <label className="form-label fw-bold">Motivo de la Cita</label>
                            <textarea 
                                className="form-control" 
                                rows="3" 
                                value={motivo} 
                                onChange={(e) => setMotivo(e.target.value)}
                                placeholder="Describa el motivo del cambio o consulta..."
                            ></textarea>
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="d-grid gap-2 mt-4 pt-4 border-top">
                        <button 
                            onClick={handleGuardarCambios} 
                            disabled={isSubmitting} 
                            className="btn btn-warning btn-lg fw-bold shadow-sm"
                        >
                            {isSubmitting ? <><span className="spinner-border spinner-border-sm me-2"></span>ACTUALIZANDO...</> : "💾 GUARDAR CAMBIOS"}
                        </button>
                        <button 
                            onClick={() => navigate("/recepcionista/cita")} 
                            className="btn btn-outline-secondary"
                        >
                            Cancelar y Volver
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarCita;