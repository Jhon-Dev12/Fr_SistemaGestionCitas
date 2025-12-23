import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listarPacientes,
  buscarPacientePorCriterio,
  eliminarPaciente,
  actualizarPaciente,
} from "../../../Services/PacienteService";

const PacienteList = () => {
  const [pacientes, setPacientes] = useState([]);
  const [criterio, setCriterio] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  // Estados para Modal y Errores
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [erroresServidor, setErroresServidor] = useState({});
  const [mensajeGlobal, setMensajeGlobal] = useState({ texto: "", tipo: "" });

  // Cargar pacientes inicial
  useEffect(() => {
    listarPacientes()
      .then((res) => setPacientes(res.data || []))
      .catch(() =>
        setMensajeGlobal({
          texto: "Error al conectar con el servidor",
          tipo: "danger",
        })
      );
  }, []);

  // Búsqueda con debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      setMensajeGlobal({ texto: "", tipo: "" });
      if (criterio.trim() === "") {
        listarPacientes().then((res) => setPacientes(res.data || []));
      } else {
        setCargando(true);
        buscarPacientePorCriterio(criterio)
          .then((res) => setPacientes(res.data || []))
          .catch(() =>
            setMensajeGlobal({ texto: "Error en la búsqueda", tipo: "danger" })
          )
          .finally(() => setCargando(false));
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [criterio]);

  const handleEliminar = (id) => {
    setMensajeGlobal({ texto: "", tipo: "" });
    if (window.confirm("¿Estás seguro de eliminar este paciente?")) {
      eliminarPaciente(id)
        .then(() => {
          setMensajeGlobal({
            texto: "Paciente eliminado exitosamente",
            tipo: "success",
          });
          setPacientes((prev) => prev.filter((p) => p.idPaciente !== id));
        })
        .catch((error) => {
          const msg =
            error.response?.data?.mensaje ||
            "No se puede eliminar el paciente.";
          setMensajeGlobal({ texto: msg, tipo: "danger" });
        });
    }
  };

  const handleEditar = (paciente) => {
    setErroresServidor({});
    setMensajeGlobal({ texto: "", tipo: "" });
    setPacienteSeleccionado({ ...paciente });
    setMostrarModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErroresServidor({});
    setMensajeGlobal({ texto: "", tipo: "" }); // Limpiar alertas previas

    actualizarPaciente(pacienteSeleccionado.idPaciente, pacienteSeleccionado)
      .then(() => {
        alert("Paciente actualizado exitosamente");
        setPacientes((prev) =>
          prev.map((p) =>
            p.idPaciente === pacienteSeleccionado.idPaciente
              ? pacienteSeleccionado
              : p
          )
        );
        setMostrarModal(false);
      })
      .catch((error) => {
        if (error.response) {
          const data = error.response.data;
          // Captura mapa de errores para pintar bordes rojos si deseas
          if (data.errores) setErroresServidor(data.errores);

          // MOSTRAR ERROR COMO ALERTA (ALERT)
          setMensajeGlobal({
            texto: data.mensaje || "Error al actualizar los datos.",
            tipo: "danger",
          });
        } else {
          setMensajeGlobal({
            texto: "No hay conexión con el servidor",
            tipo: "danger",
          });
        }
      });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Listado de Pacientes</h2>
        <button
          onClick={() => navigate("/recepcionista/paciente/nuevo")}
          className="btn btn-success shadow-sm"
        >
          <i className="bi bi-person-plus-fill me-2"></i>Nuevo Paciente
        </button>
      </div>

      {/* Alerta Global (Fuera del modal, para eliminación y búsqueda) */}
      {!mostrarModal && mensajeGlobal.texto && (
        <div
          className={`alert alert-${mensajeGlobal.tipo} alert-dismissible fade show`}
          role="alert"
        >
          {mensajeGlobal.texto}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMensajeGlobal({ texto: "", tipo: "" })}
          ></button>
        </div>
      )}

      <input
        type="text"
        className="form-control mb-3 shadow-sm"
        placeholder="🔍 Buscar por nombre o DNI..."
        value={criterio}
        onChange={(e) => setCriterio(e.target.value)}
      />

      {cargando ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-bordered table-hover bg-white mb-0">
            <thead className="table-dark">
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
              {pacientes.map((p) => (
                <tr key={p.idPaciente}>
                  <td>{p.idPaciente}</td>
                  <td>
                    {p.nombres} {p.apellidos}
                  </td>
                  <td>
                    <code>{p.dni}</code>
                  </td>
                  <td>{p.fechaNacimiento}</td>
                  <td>{p.telefono}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEditar(p)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleEliminar(p.idPaciente)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de edición */}
      {mostrarModal && pacienteSeleccionado && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  Editar Paciente #{pacienteSeleccionado.idPaciente}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setMostrarModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  {/* AQUÍ APARECE EL ERROR COMO ALERTA DENTRO DEL MODAL */}
                  {mensajeGlobal.texto && (
                    <div
                      className={`alert alert-${mensajeGlobal.tipo} alert-dismissible fade show`}
                      role="alert"
                    >
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {mensajeGlobal.texto}
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() =>
                          setMensajeGlobal({ texto: "", tipo: "" })
                        }
                      ></button>
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label fw-bold small text-secondary">
                      Nombres
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        erroresServidor.nombres ? "is-invalid" : ""
                      }`}
                      value={pacienteSeleccionado.nombres}
                      onChange={(e) =>
                        setPacienteSeleccionado({
                          ...pacienteSeleccionado,
                          nombres: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold small text-secondary">
                      Apellidos
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        erroresServidor.apellidos ? "is-invalid" : ""
                      }`}
                      value={pacienteSeleccionado.apellidos}
                      onChange={(e) =>
                        setPacienteSeleccionado({
                          ...pacienteSeleccionado,
                          apellidos: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold small text-secondary">
                        DNI
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          erroresServidor.dni ? "is-invalid" : ""
                        }`}
                        value={pacienteSeleccionado.dni}
                        onChange={(e) =>
                          setPacienteSeleccionado({
                            ...pacienteSeleccionado,
                            dni: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold small text-secondary">
                        Teléfono
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          erroresServidor.telefono ? "is-invalid" : ""
                        }`}
                        value={pacienteSeleccionado.telefono}
                        onChange={(e) =>
                          setPacienteSeleccionado({
                            ...pacienteSeleccionado,
                            telefono: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setMostrarModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    Guardar Cambios
                  </button>
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
