import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { buscarMedicoPorNombre } from "../../../Services/MedicoService";
import { buscarPacientePorCriterio } from "../../../Services/PacienteService";
import { obtenerDisponibilidad } from "../../../Services/SlotHorarioService";
import { registrarCita } from "../../../Services/CitaService";
import { proyeccionPorMedico } from "../../../Services/HorarioService";

const RegistrarCita = () => {
  const navigate = useNavigate();

  // --- ESTADOS DE SELECCIÓN FINAL ---
  const [medicoSel, setMedicoSel] = useState(null);
  const [pacienteSel, setPacienteSel] = useState(null);
  const [fecha, setFecha] = useState("");
  const [slotIdSel, setSlotIdSel] = useState(null);
  const [motivo, setMotivo] = useState("");

  // --- ESTADOS DE DATOS DINÁMICOS ---
  const [proyeccion, setProyeccion] = useState([]); 
  const [slotsDisponibles, setSlotsDisponibles] = useState([]); 

  // --- ESTADOS DE MODALES Y BÚSQUEDA ---
  const [modalMedico, setModalMedico] = useState(false);
  const [modalPaciente, setModalPaciente] = useState(false);
  const [resultadosMed, setResultadosMed] = useState([]);
  const [resultadosPac, setResultadosPac] = useState([]);

  // --- NUEVOS ESTADOS DE ERROR Y CARGA ---
  const [loading, setLoading] = useState(false);
  const [mensajeGlobal, setMensajeGlobal] = useState({ texto: "", tipo: "" });

  const abrirModalMedico = () => {
    setModalMedico(true);
    buscarMedicos("");
  };

  const abrirModalPaciente = () => {
    setModalPaciente(true);
    buscarPacientes("");
  };

  const buscarMedicos = async (criterio = "") => {
    try {
      const res = await buscarMedicoPorNombre(criterio);
      const lista = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
      setResultadosMed(lista);
    } catch (err) {
      setResultadosMed([]);
    }
  };

  const buscarPacientes = async (criterio = "") => {
    try {
      const res = await buscarPacientePorCriterio(criterio);
      const lista = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
      setResultadosPac(lista);
    } catch (err) {
      setResultadosPac([]);
    }
  };

  const seleccionarMedico = (m) => {
    setMedicoSel(m);
    setModalMedico(false);
    setSlotsDisponibles([]); 
    setSlotIdSel(null); // Resetear selección si cambia médico
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
    setMensajeGlobal({ texto: "", tipo: "" });

    if (!pacienteSel) return setMensajeGlobal({ texto: "Debe seleccionar un paciente", tipo: "danger" });
    if (!medicoSel) return setMensajeGlobal({ texto: "Debe seleccionar un médico", tipo: "danger" });
    if (!slotIdSel) return setMensajeGlobal({ texto: "Debe elegir un horario disponible", tipo: "danger" });

    setLoading(true);
    const dto = {
      idSlot: slotIdSel,
      idPaciente: pacienteSel.idPaciente,
      motivo,
    };

    registrarCita(dto)
      .then(() => {
        alert("¡Cita reservada exitosamente!");
        navigate("/recepcionista/cita");
      })
      .catch((err) => {
        const msg = err.response?.data?.mensaje || "Error al procesar la reserva";
        setMensajeGlobal({ texto: msg, tipo: "danger" });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container mt-4" style={{ fontFamily: "Arial, sans-serif" }}>
      <h2 className="mb-4 text-primary">🗓️ Registro de Nueva Cita Médica</h2>

      {/* ALERTA GLOBAL */}
      {mensajeGlobal.texto && (
        <div className={`alert alert-${mensajeGlobal.tipo} alert-dismissible fade show shadow-sm`} role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {mensajeGlobal.texto}
          <button type="button" className="btn-close" onClick={() => setMensajeGlobal({ texto: "", tipo: "" })}></button>
        </div>
      )}

      {/* SECCIÓN 1: PACIENTE */}
      <div className="card p-4 shadow-sm border-0 mb-4 bg-white">
        <h4 className="text-secondary mb-3">1. Datos del Paciente</h4>
        <button onClick={abrirModalPaciente} className="btn btn-primary mb-3 fw-bold">
          🔍 Buscar Paciente por DNI/Nombre
        </button>

        {pacienteSel && (
          <div className="row g-3 p-3 bg-light rounded border">
            <div className="col-md-4">
              <label className="form-label small fw-bold text-muted">DNI:</label>
              <input type="text" className="form-control bg-white" value={pacienteSel.dni} readOnly />
            </div>
            <div className="col-md-8">
              <label className="form-label small fw-bold text-muted">Nombre Completo:</label>
              <input type="text" className="form-control bg-white" value={`${pacienteSel.nombres} ${pacienteSel.apellidos}`} readOnly />
            </div>
          </div>
        )}
      </div>

      {/* SECCIÓN 2: MÉDICO Y FECHA */}
      <div className="card p-4 shadow-sm border-0 mb-4 bg-white">
        <h4 className="text-secondary mb-3">2. Selección de Médico y Fecha</h4>
        <div className="d-flex gap-3 mb-3 align-items-end">
          <button onClick={abrirModalMedico} className="btn btn-secondary fw-bold">
            🩺 Seleccionar Médico
          </button>
          <div className="flex-grow-1" style={{maxWidth: '300px'}}>
            <label className="form-label fw-bold">Fecha de la Cita:</label>
            <input
              type="date"
              className="form-control"
              value={fecha}
              onChange={(e) => {
                  setFecha(e.target.value);
                  setSlotIdSel(null); // Limpiar slot si cambia fecha
              }}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        {medicoSel && (
          <div className="p-3 bg-info bg-opacity-10 rounded border border-info">
            <div className="row g-3 mb-2">
              <div className="col-md-6">
                <label className="form-label small fw-bold">Médico:</label>
                <div className="fw-bold text-dark">{medicoSel.nombres} {medicoSel.apellidos}</div>
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">Especialidad:</label>
                <div><span className="badge bg-primary">{medicoSel.nombreEspecialidad}</span></div>
              </div>
            </div>
            <hr />
            <div className="small text-muted">
                <strong>Atención:</strong> {proyeccion.length > 0 
                ? proyeccion.map(p => `${p.diaSemana}`).join(", ") 
                : "Sin horarios programados"}
            </div>
          </div>
        )}
      </div>

      {/* SECCIÓN 3: SLOTS */}
      {slotsDisponibles.length > 0 && (
        <div className="card p-4 shadow-sm border-primary mb-4 bg-light">
          <h4 className="text-primary mb-4">3. Horarios Disponibles ({fecha})</h4>

          <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-2 mb-4">
            {slotsDisponibles.map((s) => {
              const esDisponible = s.estadoSlot === "DISPONIBLE";
              const estaSeleccionado = slotIdSel === s.idSlot;

              return (
                <div key={s.idSlot} className="col">
                  <button
                    disabled={!esDisponible}
                    onClick={() => setSlotIdSel(s.idSlot)}
                    className={`btn w-100 py-2 fw-bold ${
                      estaSeleccionado ? "btn-success" : esDisponible ? "btn-outline-primary bg-white" : "btn-light text-muted"
                    }`}
                  >
                    {s.hora}
                    {!esDisponible && <div style={{fontSize: '8px'}}>OCUPADO</div>}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Motivo de la Cita (Opcional):</label>
            <textarea
              className="form-control"
              placeholder="Ej. Dolor de espalda, control anual..."
              rows="2"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </div>

          <button
            onClick={handleConfirmar}
            disabled={loading || !slotIdSel}
            className="btn btn-primary btn-lg w-100 fw-bold shadow"
          >
            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : "✅ CONFIRMAR RESERVA"}
          </button>
        </div>
      )}

      {/* --- MODALES --- */}
      {/* (Mantengo tus modales, solo agregué clases Bootstrap para que se vean mejor) */}
      {modalMedico && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">Seleccionar Médico</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setModalMedico(false)}></button>
              </div>
              <div className="modal-body p-4">
                <input type="text" className="form-control mb-3" placeholder="Filtrar por nombre o especialidad..." 
                  onChange={(e) => buscarMedicos(e.target.value)} />
                <div className="table-responsive" style={{maxHeight: '400px'}}>
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr><th>DNI</th><th>Médico</th><th>Especialidad</th><th>Acción</th></tr>
                      </thead>
                      <tbody>
                        {resultadosMed.map(m => (
                          <tr key={m.idMedico}>
                            <td>{m.dni}</td>
                            <td className="fw-bold">{m.nombres} {m.apellidos}</td>
                            <td><span className="badge bg-info text-dark">{m.nombreEspecialidad}</span></td>
                            <td><button className="btn btn-sm btn-success" onClick={() => seleccionarMedico(m)}>Seleccionar</button></td>
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

      {/* MODAL PACIENTE */}
      {modalPaciente && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Seleccionar Paciente</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setModalPaciente(false)}></button>
              </div>
              <div className="modal-body p-4">
                <input type="text" className="form-control mb-3" placeholder="Escriba DNI o Apellidos..." 
                  onChange={(e) => buscarPacientes(e.target.value)} />
                <div className="table-responsive" style={{maxHeight: '400px'}}>
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr><th>DNI</th><th>Paciente</th><th>F. Nacimiento</th><th>Acción</th></tr>
                      </thead>
                      <tbody>
                        {resultadosPac.map(p => (
                          <tr key={p.idPaciente}>
                            <td><code>{p.dni}</code></td>
                            <td className="fw-bold">{p.nombres} {p.apellidos}</td>
                            <td>{p.fechaNacimiento}</td>
                            <td><button className="btn btn-sm btn-primary" onClick={() => { setPacienteSel(p); setModalPaciente(false); }}>Seleccionar</button></td>
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