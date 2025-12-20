import { useState } from "react";
import { 
    registrarHorario, 
    listarHorariosPorMedico, 
    buscarMedicosParaHorario, 
    eliminarHorario 
} from "../../../Services/HorarioService";

const GestionarHorario = () => {
    // ESTADOS
    const [medico, setMedico] = useState(null);
    const [criterioBusqueda, setCriterioBusqueda] = useState("");
    const [medicosResultados, setMedicosResultados] = useState([]);
    const [listaHorarios, setListaHorarios] = useState([]);
    const [nuevoHorario, setNuevoHorario] = useState({
        diaSemana: "", horarioEntrada: "", horarioSalida: ""
    });
    const [showModal, setShowModal] = useState(false);

    // --- LÓGICA DE BÚSQUEDA (IGUAL A TU EJEMPLO DE LISTADO) ---
    
    // Función para abrir el modal y cargar lista inicial
    const abrirModal = () => {
        setShowModal(true);
        cargarMedicosModal(""); // Carga todos al abrir
    };

    // Función que hace la petición al servidor (como tu cargarDatos)
    const cargarMedicosModal = (criterio = "") => {
        buscarMedicosParaHorario(criterio)
            .then((res) => {
                setMedicosResultados(res.data || []);
            })
            .catch((err) => console.error("Error al buscar médicos:", err));
    };

    // Manejador del input (como tu handleSearch)
    const handleSearchInput = (e) => {
        const valor = e.target.value;
        setCriterioBusqueda(valor);
        cargarMedicosModal(valor); // Llama a la API en cada tecla presionada
    };

    // --- LÓGICA DE SELECCIÓN Y HORARIOS ---

    const seleccionarMedico = async (m) => {
        setMedico(m);
        setShowModal(false);
        setCriterioBusqueda("");
        
        // Cargar horarios del médico seleccionado
        listarHorariosPorMedico(m.idMedico)
            .then(res => setListaHorarios(res.data || []))
            .catch(() => setListaHorarios([]));
    };

    const handleRegistrar = async (e) => {
        e.preventDefault();
        if (!medico) return alert("Seleccione un médico primero");

        try {
            const dto = { idMedico: medico.idMedico, ...nuevoHorario };
            const res = await registrarHorario(dto);
            setListaHorarios([...listaHorarios, res.data]); 
            setNuevoHorario({ diaSemana: "", horarioEntrada: "", horarioSalida: "" });
            alert("Horario registrado con éxito");
        } catch (err) {
            alert(err.response?.data?.message || "Error al registrar");
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm("¿Desea eliminar este horario?")) {
            eliminarHorario(id)
                .then(() => {
                    setListaHorarios(listaHorarios.filter(h => h.idHorario !== id));
                })
                .catch(() => alert("Error al eliminar"));
        }
    };

    const generarOpcionesHora = () => {
        const horas = [];
        for (let i = 7; i <= 22; i++) {
            const horaStr = i < 10 ? `0${i}:00` : `${i}:00`;
            horas.push(horaStr);
        }
        return horas;
    };

    const opcionesHora = generarOpcionesHora();
    return (
        <div className="container mt-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <h2 className="mb-4 text-primary">Gestión de Horarios</h2>

            {/* SECCIÓN INFORMACIÓN MÉDICO (Card Estilo Thymeleaf) */}
            <div className="card p-4 shadow-sm border-0 mb-4 bg-white">
                <div className="row g-3 align-items-end">
                    <div className="col-md-4">
                        <label className="form-label fw-bold text-secondary small">Médico Seleccionado</label>
                        <input className="form-control bg-light" 
                               value={medico ? `${medico.nombres} ${medico.apellidos}` : ""} 
                               placeholder="Use el botón buscar..." readOnly />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold text-secondary small">Especialidad</label>
                        <input className="form-control bg-light" value={medico?.nombreEspecialidad || ""} readOnly />
                    </div>
                    <div className="col-md-4">
                        <button type="button" className="btn btn-primary w-100 fw-bold shadow-sm" onClick={abrirModal}>
                            <i className="bi bi-search me-2"></i>BUSCAR MÉDICO
                        </button>
                    </div>
                </div>
            </div>

            {/* TABLA DE HORARIOS */}
            <h5 className="mb-3 fw-bold text-muted"><i className="bi bi-calendar3 me-2"></i>Horarios del Médico</h5>
            <div className="table-responsive shadow-sm rounded-3 mb-4 border">
                <table className="table table-hover align-middle text-center m-0">
                    <thead className="table-dark">
                        <tr><th>Día</th><th>Entrada</th><th>Salida</th><th>Acción</th></tr>
                    </thead>
                    <tbody>
                        {listaHorarios.length > 0 ? (
                            listaHorarios.map((h) => (
                                <tr key={h.idHorario}>
                                    <td>{h.diaSemana}</td>
                                    <td>{h.horarioEntrada}</td>
                                    <td>{h.horarioSalida}</td>
                                    <td>
                                        <button className="btn btn-outline-danger btn-sm border-0" onClick={() => handleEliminar(h.idHorario)}>
                                            <i className="bi bi-trash-fill"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="text-muted py-4 italic">No hay horarios registrados.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* FORMULARIO DE REGISTRO */}
            <div className="card p-4 shadow-sm border-0 bg-light">
                <form className="row g-3 align-items-end" onSubmit={handleRegistrar}>
                    <div className="col-md-3">
                        <label className="form-label small fw-bold">Día</label>
                        <select className="form-select" value={nuevoHorario.diaSemana} 
                                onChange={(e) => setNuevoHorario({...nuevoHorario, diaSemana: e.target.value})} required>
                            <option value="">Seleccionar...</option>
                            <option value="LUNES">LUNES</option>
                            <option value="MARTES">MARTES</option>
                            <option value="MIERCOLES">MIERCOLES</option>
                            <option value="JUEVES">JUEVES</option>
                            <option value="VIERNES">VIERNES</option>
                        </select>
                    </div>
                  <div className="col-md-3">
                      <label className="form-label small fw-bold">Hora Entrada</label>
                      <select 
                          className="form-select" 
                          value={nuevoHorario.horarioEntrada}
                          onChange={(e) => setNuevoHorario({...nuevoHorario, horarioEntrada: e.target.value})}
                          required
                      >
                          <option value="">Seleccionar...</option>
                          {opcionesHora.map(hora => (
                              <option key={hora} value={hora}>{hora}</option>
                          ))}
                      </select>
                  </div>

                  <div className="col-md-3">
                      <label className="form-label small fw-bold">Hora Salida</label>
                      <select 
                          className="form-select" 
                          value={nuevoHorario.horarioSalida}
                          onChange={(e) => setNuevoHorario({...nuevoHorario, horarioSalida: e.target.value})}
                          required
                      >
                          <option value="">Seleccionar...</option>
                          {opcionesHora.map(hora => (
                              <option key={hora} value={hora}>{hora}</option>
                          ))}
                      </select>
                  </div>
                    <div className="col-md-3">
                        <button type="submit" className="btn btn-success w-100 fw-bold">REGISTRAR</button>
                    </div>
                </form>
            </div>

            {/* MODAL MANUAL CON BÚSQUEDA LIVE */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Seleccionar Médico</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                {/* BUSCADOR LIVE (COMO TU EJEMPLO) */}
                                <div className="mb-3">
                                    <input 
                                        type="text" 
                                        className="form-control p-2 border-primary" 
                                        placeholder="Escriba nombre o especialidad..." 
                                        value={criterioBusqueda} 
                                        onChange={handleSearchInput} // Lógica real-time
                                        autoFocus
                                    />
                                </div>
                                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                    <table className="table table-hover">
                                        <thead className="table-light">
                                            <tr><th>DNI</th><th>Médico</th><th>Especialidad</th><th>Acción</th></tr>
                                        </thead>
                                        <tbody>
                                            {medicosResultados.map(m => (
                                                <tr key={m.idMedico}>
                                                    <td>{m.dni}</td>
                                                    <td>{m.nombres} {m.apellidos}</td>
                                                    <td><span className="badge bg-info text-dark">{m.nombreEspecialidad}</span></td>
                                                    <td>
                                                        <button className="btn btn-sm btn-success fw-bold" onClick={() => seleccionarMedico(m)}>
                                                            Seleccionar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {medicosResultados.length === 0 && (
                                                <tr><td colSpan="3" className="text-center py-3 text-muted">No se encontraron resultados.</td></tr>
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

export default GestionarHorario;