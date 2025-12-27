import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { buscarMedicoPorNombre } from "../../../Services/MedicoService";
import { buscarPacientePorCriterio } from "../../../Services/PacienteService";
import { obtenerDisponibilidad } from "../../../Services/SlotHorarioService";
import { registrarCita } from "../../../Services/CitaService";
import { proyeccionPorMedico } from "../../../Services/HorarioService";
import "../../../Styles/RegistrarCita.css";

const RegistrarCita = () => {
    const navigate = useNavigate();

    const [medicoSel, setMedicoSel] = useState(null);
    const [pacienteSel, setPacienteSel] = useState(null);
    const [fecha, setFecha] = useState("");
    const [slotIdSel, setSlotIdSel] = useState(null);
    const [motivo, setMotivo] = useState("");

    const [proyeccion, setProyeccion] = useState([]); 
    const [slotsDisponibles, setSlotsDisponibles] = useState([]); 

    const [modalMedico, setModalMedico] = useState(false);
    const [modalPaciente, setModalPaciente] = useState(false);
    const [resultadosMed, setResultadosMed] = useState([]);
    const [resultadosPac, setResultadosPac] = useState([]);

    const [loading, setLoading] = useState(false);
    const [mensajeGlobal, setMensajeGlobal] = useState({ texto: "", tipo: "" });

    const buscarMedicos = async (criterio = "") => {
        try {
            const res = await buscarMedicoPorNombre(criterio);
            setResultadosMed(Array.isArray(res.data) ? res.data : [res.data]);
        } catch { setResultadosMed([]); }
    };

    const buscarPacientes = async (criterio = "") => {
        try {
            const res = await buscarPacientePorCriterio(criterio);
            setResultadosPac(Array.isArray(res.data) ? res.data : [res.data]);
        } catch { setResultadosPac([]); }
    };

    const seleccionarMedico = (m) => {
        setMedicoSel(m);
        setModalMedico(false);
        setSlotsDisponibles([]); 
        setSlotIdSel(null);
        proyeccionPorMedico(m.idMedico).then((res) => setProyeccion(res.data || []));
    };

    useEffect(() => {
        if (medicoSel && fecha) {
            obtenerDisponibilidad(medicoSel.idMedico, fecha)
                .then((res) => setSlotsDisponibles(res.data || []))
                .catch(() => setSlotsDisponibles([]));
        }
    }, [medicoSel, fecha]);

    const handleConfirmar = () => {
        if (!pacienteSel || !medicoSel || !slotIdSel) {
            Swal.fire("Atención", "Complete todos los campos obligatorios", "warning");
            return;
        }

        setLoading(true);
        const dto = { idSlot: slotIdSel, idPaciente: pacienteSel.idPaciente, motivo };

        registrarCita(dto)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Cita Reservada!',
                    text: 'La cita se registró correctamente.',
                    confirmButtonColor: '#3182ce'
                }).then(() => navigate("/recepcionista/cita"));
            })
            .catch((err) => {
                const msg = err.response?.data?.mensaje || "Error al reservar";
                setMensajeGlobal({ texto: msg, tipo: "danger" });
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="container page-container pb-5">
            <div className="card card-modern">
                <div className="card-header-modern">
                    <h5 className="card-title">
                        <i className="bi bi-calendar-plus me-2 text-primary"></i>Registrar Nueva Cita
                    </h5>
                </div>

                <div className="card-body p-4 p-md-5">
                    {mensajeGlobal.texto && (
                        <div className={`alert alert-${mensajeGlobal.tipo} alert-dismissible fade show shadow-sm mb-4`} role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>{mensajeGlobal.texto}
                            <button type="button" className="btn-close" onClick={() => setMensajeGlobal({ texto: "", tipo: "" })}></button>
                        </div>
                    )}

                    <div className="row g-4 mb-4">
                        {/* PACIENTE */}
                        <div className="col-md-6">
                            <label className="form-label"><i className="bi bi-person me-1"></i>Paciente</label>
                            <div className="input-group">
                                <input type="text" className="form-control bg-light" readOnly 
                                    value={pacienteSel ? `${pacienteSel.nombres} ${pacienteSel.apellidos}` : ""} 
                                    placeholder="Seleccione un paciente" />
                                <button className="btn btn-outline-primary" onClick={() => { setModalPaciente(true); buscarPacientes(""); }}>
                                    <i className="bi bi-search"></i>
                                </button>
                            </div>
                        </div>

                        {/* MÉDICO */}
                        <div className="col-md-6">
                            <label className="form-label"><i className="bi bi-person-badge me-1"></i>Médico</label>
                            <div className="input-group">
                                <input type="text" className="form-control bg-light" readOnly 
                                    value={medicoSel ? `${medicoSel.nombres} ${medicoSel.apellidos}` : ""} 
                                    placeholder="Seleccione un médico" />
                                <button className="btn btn-outline-primary" onClick={() => { setModalMedico(true); buscarMedicos(""); }}>
                                    <i className="bi bi-search"></i>
                                </button>
                            </div>
                            
                              {medicoSel && proyeccion.length > 0 && (
                                  <div className="info-box-hours mt-3 animate__animated animate__fadeIn shadow-sm">
                                      <small className="fw-bold d-block mb-2 text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                                          <i className="bi bi-clock-history me-1"></i> Horarios de atención:
                                      </small>
                                      <div className="schedule-list">
                                          {proyeccion.map((p, index) => (
                                              <div key={index} className="d-flex justify-content-between align-items-center py-1 border-bottom border-info border-opacity-10 last-child-border-0">
                                                  <span className="fw-bold small" style={{ minWidth: '80px' }}>
                                                      {p.diaSemana}
                                                  </span>
                                                  <span className="badge bg-white text-primary border border-info border-opacity-25 small fw-medium">
                                                      {p.horarioEntrada.substring(0, 5)} - {p.horarioSalida.substring(0, 5)}
                                                  </span>
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                              )}
                        </div>
                    </div>

                    <div className="row g-4 mb-4">
                        {/* FECHA */}
                        <div className="col-md-6">
                            <label className="form-label"><i className="bi bi-calendar-event me-1"></i>Fecha de Cita</label>
                            <input type="date" className="form-control" value={fecha}
                                onChange={(e) => { setFecha(e.target.value); setSlotIdSel(null); }}
                                min={new Date().toISOString().split("T")[0]} />
                        </div>

                        {/* SLOTS (Habilitado solo si hay médico y fecha) */}
                        <div className="col-md-6">
                            <label className="form-label"><i className="bi bi-clock me-1"></i>Horarios Disponibles</label>
                            {medicoSel && fecha ? (
                                slotsDisponibles.length > 0 ? (
                                    <div className="slot-grid">
                                        {slotsDisponibles.map((s) => (
                                            <button key={s.idSlot}
                                                className={`btn btn-sm btn-slot ${slotIdSel === s.idSlot ? 'btn-success' : s.estadoSlot === 'DISPONIBLE' ? 'btn-outline-primary' : 'btn-light text-muted'}`}
                                                disabled={s.estadoSlot !== 'DISPONIBLE'}
                                                onClick={() => setSlotIdSel(s.idSlot)}
                                            >
                                                {s.hora.substring(0, 5)}
                                            </button>
                                        ))}
                                    </div>
                                ) : <div className="text-muted small italic mt-2">No hay turnos disponibles para esta fecha.</div>
                            ) : <div className="text-muted small italic mt-2">Seleccione médico y fecha para ver horarios.</div>}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label"><i className="bi bi-pencil-square me-1"></i>Motivo de Consulta (Opcional)</label>
                        <textarea className="form-control" rows="3" placeholder="Breve descripción..." 
                            value={motivo} onChange={(e) => setMotivo(e.target.value)} />
                    </div>

                    <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                        <button onClick={() => navigate("/recepcionista/cita")} className="btn btn-light border px-4">Cancelar</button>
                        <button onClick={handleConfirmar} disabled={loading || !slotIdSel} className="btn btn-primary px-4 shadow-sm">
                            <i className="bi bi-check-circle me-1"></i>{loading ? <span className="spinner-border spinner-border-sm me-2"></span> : "Confirmar Registro"}
                        </button>
                    </div>
                </div>
            </div>

            {/* MODALES ESTILIZADOS */}
            {modalPaciente && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content modal-content-modern shadow-lg">
                            <div className="modal-header border-bottom-0 p-4">
                                <h6 className="modal-title  text-primary">Seleccionar Paciente</h6>
                                <button className="btn-close" onClick={() => setModalPaciente(false)}></button>
                            </div>
                            <div className="modal-body p-4 pt-0">
                                <input type="text" className="form-control mb-4" placeholder="Buscar por DNI o Apellido..." onChange={(e) => buscarPacientes(e.target.value)} />
                                <div className="table-responsive" style={{maxHeight: '350px'}}>
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light text-muted small"><tr><th>DNI</th><th>Nombres</th><th className="text-end">Acción</th></tr></thead>
                                        <tbody>
                                            {resultadosPac.map(p => (
                                                <tr key={p.idPaciente}>
                                                    <td><code>{p.dni}</code></td>
                                                    <td>{p.nombres} {p.apellidos}</td>
                                                    <td className="text-end"><button className="btn btn-sm btn-primary rounded-pill px-3" onClick={() => { setPacienteSel(p); setModalPaciente(false); }}>Seleccionar</button></td>
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

            {modalMedico && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content modal-content-modern shadow-lg">
                            <div className="modal-header border-bottom-0 p-4">
                                <h6 className="modal-title text-primary">Seleccionar Médico</h6>
                                <button className="btn-close" onClick={() => setModalMedico(false)}></button>
                            </div>
                            <div className="modal-body p-4 pt-0">
                                <input type="text" className="form-control mb-4" placeholder="Buscar por nombre o dni..." onChange={(e) => buscarMedicos(e.target.value)} />
                                <div className="table-responsive" style={{maxHeight: '350px'}}>
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light text-muted small"><tr><th>DNI</th><th>Especialidad</th><th className="text-end">Acción</th></tr></thead>
                                        <tbody>
                                            {resultadosMed.map(m => (
                                                <tr key={m.idMedico}>
                                                    <td>{m.dni}</td>
                                                    <td>{m.nombres} {m.apellidos}</td>
                                                    <td><span className="badge bg-info-subtle text-info border border-info-subtle">{m.nombreEspecialidad}</span></td>
                                                    <td className="text-end"><button className="btn btn-sm btn-primary rounded-pill px-3" onClick={() => seleccionarMedico(m)}>Seleccionar</button></td>
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

export default RegistrarCita;