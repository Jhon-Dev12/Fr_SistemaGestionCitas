import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { obtenerDisponibilidad } from "../../../Services/SlotHorarioService";
import { proyeccionPorMedico } from "../../../Services/HorarioService";
import { buscarCitaPorId, actualizarCita } from "../../../Services/CitaService";
import "../../../Styles/EditarCita.css";

const EditarCita = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [citaDetalle, setCitaDetalle] = useState(null);
    const [fecha, setFecha] = useState("");
    const [slotIdSel, setSlotIdSel] = useState(null);
    const [motivo, setMotivo] = useState("");

    const [proyeccion, setProyeccion] = useState([]);
    const [slotsDisponibles, setSlotsDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mensajeGlobal, setMensajeGlobal] = useState({ texto: "", tipo: "" });

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
            .catch(() => {
                setMensajeGlobal({ texto: "No se pudo cargar la información de la cita.", tipo: "danger" });
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        if (citaDetalle?.idMedico && fecha) {
            obtenerDisponibilidad(citaDetalle.idMedico, fecha)
                .then(res => setSlotsDisponibles(res.data || []))
                .catch(() => setSlotsDisponibles([]));
        }
    }, [citaDetalle, fecha]);

    const handleGuardarCambios = () => {
        setMensajeGlobal({ texto: "", tipo: "" });
        if (!motivo.trim()) {
            Swal.fire("Atención", "Debe ingresar un motivo para la modificación.", "warning");
            return;
        }

        setIsSubmitting(true);
actualizarCita(id, { idCita: Number(id), idSlotNuevo: slotIdSel, motivo: motivo })
            .then((res) => {
                const citaActualizada = res.data;

                // VALIDACIÓN: ¿La cita venció mientras editábamos?
                if (citaActualizada.estado === 'VENCIDO' || citaActualizada.estado === 'NO_ATENDIDO') {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Operación no permitida',
                        text: `El periodo de gracia de 20 min. ha expirado. La cita se ha marcado automáticamente como ${citaActualizada.estado} y no puede ser modificada.`,
                        confirmButtonColor: '#f8bb86'
                    }).then(() => navigate("/recepcionista/cita"));
                    return; // Detenemos el flujo aquí
                }

                // ÉXITO: La cita se reprogramó correctamente
                Swal.fire({
                    icon: 'success',
                    title: '¡Cita Actualizada!',
                    text: 'Los cambios se guardaron correctamente.',
                    confirmButtonColor: '#3182ce'
                }).then(() => navigate("/recepcionista/cita"));
            })
            .catch(err => {
                // Manejo de errores de servidor (400, 404, 500)
                const msg = err.response?.data?.mensaje || "Error al actualizar la cita.";
                setMensajeGlobal({ texto: msg, tipo: "danger" });
            })
            .finally(() => setIsSubmitting(false));
    };

    if (loading) return <div className="container mt-5 text-center"><div className="spinner-border text-primary"></div><p className="mt-2 fw-bold">Cargando datos de la cita...</p></div>;

    return (
        <div className="container page-container pb-5">
            <div className="card card-modern shadow-sm animate__animated animate__fadeIn">
                
                <div className="card-header-modern">
                    <h5 className="card-title">
                        <i className="bi bi-pencil-square me-2 text-primary"></i>Reprogramar Cita Médica
                    </h5>
                    <div className="sub-header">Modifique la fecha, hora o el motivo de la cita seleccionada</div>
                </div>

                <div className="card-body p-4 p-md-5">
                    {mensajeGlobal.texto && (
                        <div className={`alert alert-${mensajeGlobal.tipo} alert-dismissible fade show mb-4 shadow-sm`} role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>{mensajeGlobal.texto}
                            <button type="button" className="btn-close" onClick={() => setMensajeGlobal({ texto: "", tipo: "" })}></button>
                        </div>
                    )}

                    {/* SECCIÓN 1: Información Fija del Paciente y Médico */}
                    <div className="row g-4 mb-4">
                        <div className="col-md-6">
                            <label className="form-label-custom">Paciente</label>
                            <div className="info-box-readonly d-flex align-items-center">
                                <div>
                                    <div className="fw-bold text-dark">{citaDetalle?.pacienteNombreCompleto}</div>
                                    <code className="text-primary small">DNI: {citaDetalle?.pacienteDni}</code>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label-custom">Médico Responsable</label>
                            <div className="info-box-readonly d-flex align-items-center">
                                <div>
                                    <div className="fw-bold text-dark">Dr(a). {citaDetalle?.medicoNombreCompleto}</div>
                                    <span className="badge bg-info-subtle text-info border border-info-subtle uppercase" style={{fontSize: '0.7rem'}}>
                                        {citaDetalle?.especialidadNombre}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="divider-modern" />

                    {/* SECCIÓN 2: Reprogramación */}
                    <div className="row g-4 mb-4">
                        <div className="col-md-6">
                            <label className="form-label-custom"><i className="bi bi-calendar-event me-1"></i>Nueva Fecha</label>
                            <input 
                                type="date" 
                                className="form-control mb-2" 
                                value={fecha} 
                                min={new Date().toISOString().split("T")[0]}
                                onChange={(e) => { setFecha(e.target.value); setSlotIdSel(null); }}
                            />
                            <div className="text-muted small p-2 bg-light rounded border">
                                <i className="bi bi-info-circle me-1"></i>
                                Actual: <strong>{citaDetalle?.fecha}</strong> - <strong>{citaDetalle?.hora}</strong>
                            </div>

                            {/* Horarios del Médico */}
                            {proyeccion.length > 0 && (
                                <div className="info-box-hours mt-4 shadow-sm">
                                    <small className="fw-bold d-block mb-2 text-uppercase" style={{ fontSize: '0.7rem' }}>
                                        <i className="bi bi-clock-history me-1"></i> Días de Atención:
                                    </small>
                                    <div className="schedule-list">
                                        {proyeccion.map((p, index) => (
                                            <div key={index} className="d-flex justify-content-between py-1 border-bottom border-info border-opacity-10">
                                                <span className="fw-bold small">{p.diaSemana}</span>
                                                <span className="badge bg-white text-primary border border-info border-opacity-25 small">
                                                    {p.horarioEntrada.substring(0, 5)} - {p.horarioSalida.substring(0, 5)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* GRID DE SLOTS */}
                        <div className="col-md-6">
                            <label className="form-label-custom"><i className="bi bi-clock me-1"></i>Horarios Disponibles</label>
                            {slotsDisponibles.length > 0 ? (
                                <div className="slot-grid">
                                    {slotsDisponibles.map(s => {
                                        const esDisponible = s.estadoSlot === "DISPONIBLE"; 
                                        const estaSeleccionado = slotIdSel === s.idSlot;
                                        return (
                                            <button 
                                                key={s.idSlot}
                                                disabled={!esDisponible} 
                                                onClick={() => setSlotIdSel(s.idSlot)}
                                                className={`btn btn-slot shadow-sm ${estaSeleccionado ? "btn-success" : esDisponible ? "btn-outline-primary bg-white" : "btn-light text-muted"}`}
                                            >
                                                {s.hora.substring(0, 5)}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="alert alert-warning py-2 small">No hay horarios libres para esta fecha.</div>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label-custom"><i className="bi bi-chat-left-text me-1"></i>Motivo de la Cita</label>
                        <textarea 
                            className="form-control" 
                            rows="3" 
                            value={motivo} 
                            onChange={(e) => setMotivo(e.target.value)}
                            placeholder="Describa el motivo médico o del cambio..."
                        ></textarea>
                    </div>

                    <div className="d-flex justify-content-between mt-5 pt-4 border-top">
                        <button onClick={() => navigate("/recepcionista/cita")} className="btn btn-light border px-4 shadow-sm">
                            <i className="bi bi-arrow-left me-1"></i> Volver
                        </button>
                        <button 
                            onClick={handleGuardarCambios} 
                            disabled={isSubmitting} 
                            className="btn btn-primary px-5 shadow-sm"
                            style={{backgroundColor: '#0d6efd', border: 'none'}}
                        >
                            {isSubmitting ? <><span className="spinner-border spinner-border-sm me-2"></span>GUARDANDO...</> : <><i className="bi bi-check-circle me-1"></i> Guardar Cambios</>}
                        </button>
                    </div>
                </div>

                <div className="footer-hospital text-center">
                    <i className="bi bi-shield-lock me-1"></i> La reprogramación de citas está sujeta a la disponibilidad del médico seleccionado.
                </div>
            </div>
        </div>
    );
};

export default EditarCita;