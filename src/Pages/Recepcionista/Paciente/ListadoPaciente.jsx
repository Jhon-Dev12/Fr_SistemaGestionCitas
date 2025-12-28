import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  listarPacientes,
  buscarPacientePorCriterio,
  eliminarPaciente,
  actualizarPaciente,
} from "../../../Services/PacienteService";
import "../../../Styles/ListadoPaciente.css";

const PacienteList = () => {
  const [pacientes, setPacientes] = useState([]);
  const [criterio, setCriterio] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [mostrarModal, setMostrarModal] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [erroresServidor, setErroresServidor] = useState({});

  // 1. Carga de datos memorizada
  const cargarDatos = useCallback(async (search = "") => {
    setLoading(true);
    try {
      const res = search.trim() === "" 
        ? await listarPacientes() 
        : await buscarPacientePorCriterio(search);
      setPacientes(res.data || []);
    } catch (err) {
      console.error("Error al cargar pacientes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Efecto de búsqueda con Debounce (ESLint friendly)
  useEffect(() => {
    const timeout = setTimeout(() => {
        const inicializar = async () => { await cargarDatos(criterio); };
        inicializar();
    }, 100);
    return () => clearTimeout(timeout);
  }, [criterio, cargarDatos]);

  const handleEliminar = (id) => {
    Swal.fire({
      title: "¿Eliminar paciente?",
      text: "Se borrarán todos los registros asociados a este paciente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: { cancelButton: 'text-dark border' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await eliminarPaciente(id);
          Swal.fire("Eliminado", "El paciente ha sido removido exitosamente.", "success");
          setPacientes((prev) => prev.filter((p) => p.idPaciente !== id));
        } catch (error) {
          const msg = error.response?.data?.mensaje || "No se puede eliminar el paciente.";
          Swal.fire("Error", msg, "error");
        }
      }
    });
  };

  const handleEditar = (paciente) => {
    setErroresServidor({});
    setPacienteSeleccionado({ ...paciente });
    setMostrarModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroresServidor({});

    try {
      await actualizarPaciente(pacienteSeleccionado.idPaciente, pacienteSeleccionado);
      Swal.fire("¡Actualizado!", "Los datos del paciente han sido modificados.", "success");
      setPacientes((prev) =>
        prev.map((p) =>
          p.idPaciente === pacienteSeleccionado.idPaciente ? pacienteSeleccionado : p
        )
      );
      setMostrarModal(false);
    } catch (error) {
      if (error.response?.data?.errores) {
        setErroresServidor(error.response.data.errores);
      } else {
        Swal.fire("Error", "No se pudo actualizar el registro.", "error");
      }
    }
  };

  return (
    <div className="page-container container-fluid px-4">
      <div className="card card-modern shadow-sm animate__animated animate__fadeIn">
        
        {/* CABECERA (Consistente con Citas) */}
        <div className="card-header-modern d-flex justify-content-between align-items-center">
          <div>
          <h5 className="card-title">
            <i className="bi bi-people-fill me-2 text-primary"></i>Gestión de Pacientes
          </h5>
                              <div className="sub-header">Administre el catálogo de pacientes de la clínica</div>
          </div>
          <button
            onClick={() => navigate("/recepcionista/paciente/nuevo")}
            className="btn btn-primary btn-action-modern shadow-sm"
          >
            <i className="bi bi-person-plus-fill me-2"></i> Nuevo Paciente
          </button>
        </div>

        <div className="card-body">
          {/* BUSCADOR INTERNO INTEGRADO */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="input-group search-group-modern shadow-sm">
                <span className="input-group-text text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nombre, apellidos o DNI..."
                  value={criterio}
                  onChange={(e) => setCriterio(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover table-modern mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre Completo</th>
                  <th>DNI</th>
                  <th>Fecha Nacimiento</th>
                  <th>Teléfono</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                      Buscando en la base de datos...
                    </td>
                  </tr>
                ) : pacientes.length > 0 ? (
                  pacientes.map((p) => (
                    <tr key={p.idPaciente}>
                      <td className="text-muted small">#{p.idPaciente}</td>
                      <td className="fw-bold text-dark">{p.nombres} {p.apellidos}</td>
                      <td><code className="text-primary fw-bold" style={{fontSize: '0.9rem'}}>{p.dni}</code></td>
                      <td className="small text-secondary">{p.fechaNacimiento}</td>
                      <td>
                        <i className="bi bi-telephone me-1 text-muted small"></i>
                        {p.telefono || "---"}
                      </td>
                      <td className="text-center">
                        <div className="btn-group gap-1">
                          <button 
                            className="btn btn-light btn-sm text-warning border shadow-sm" 
                            onClick={() => handleEditar(p)}
                            title="Editar Datos"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button 
                            className="btn btn-light btn-sm text-danger border shadow-sm" 
                            onClick={() => handleEliminar(p.idPaciente)}
                            title="Eliminar Registro"
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <i className="bi bi-person-x d-block fs-2 mb-2"></i>
                      No se encontraron pacientes registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div className="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center p-3">
          <button onClick={() => navigate("/recepcionista")} className="btn btn-outline-secondary btn-sm px-3 shadow-sm">
            <i className="bi bi-arrow-left-short"></i> Volver
          </button>
          <span className="text-muted small fw-medium">
            Total Pacientes: <span className="badge bg-primary rounded-pill">{pacientes.length}</span>
          </span>
        </div>
      </div>

      {/* MODAL DE EDICIÓN (Estilo Moderno) */}
      {mostrarModal && pacienteSeleccionado && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-content-modern shadow-lg">
              <div className="modal-header modal-header-modern">
                <h6 className="modal-title fw-bold">
                    <i className="bi bi-pencil-square me-2"></i>Editar Paciente #{pacienteSeleccionado.idPaciente}
                </h6>
                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted text-uppercase">Nombres</label>
                    <input
                      type="text"
                      className={`form-control ${erroresServidor.nombres ? "is-invalid" : ""}`}
                      value={pacienteSeleccionado.nombres}
                      onChange={(e) => setPacienteSeleccionado({ ...pacienteSeleccionado, nombres: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted text-uppercase">Apellidos</label>
                    <input
                      type="text"
                      className={`form-control ${erroresServidor.apellidos ? "is-invalid" : ""}`}
                      value={pacienteSeleccionado.apellidos}
                      onChange={(e) => setPacienteSeleccionado({ ...pacienteSeleccionado, apellidos: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold text-muted text-uppercase">DNI</label>
                      <input
                        type="text"
                        className={`form-control ${erroresServidor.dni ? "is-invalid" : ""}`}
                        value={pacienteSeleccionado.dni}
                        onChange={(e) => setPacienteSeleccionado({ ...pacienteSeleccionado, dni: e.target.value })}
                        maxLength="8"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold text-muted text-uppercase">Teléfono</label>
                      <input
                        type="text"
                        className={`form-control ${erroresServidor.telefono ? "is-invalid" : ""}`}
                        value={pacienteSeleccionado.telefono}
                        onChange={(e) => setPacienteSeleccionado({ ...pacienteSeleccionado, telefono: e.target.value })}
                        maxLength="9"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light border-top-0">
                  <button type="button" className="btn btn-light border" onClick={() => setMostrarModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary px-4 shadow-sm fw-bold">Guardar Cambios</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PacienteList;