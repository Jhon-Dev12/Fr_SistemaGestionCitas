import { useEffect, useState } from "react";
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

  // Modal de edición
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  // Cargar pacientes inicial
  useEffect(() => {
    listarPacientes()
      .then((res) => setPacientes(res.data || []))
      .catch((err) => console.error("Error al listar pacientes", err));
  }, []);

  // Búsqueda con debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (criterio.trim() === "") {
        listarPacientes().then((res) => setPacientes(res.data || []));
      } else {
        setCargando(true);
        buscarPacientePorCriterio(criterio)
          .then((res) => setPacientes(res.data || []))
          .finally(() => setCargando(false));
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [criterio]);

  // Eliminar paciente
  const handleEliminar = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este paciente?")) {
      eliminarPaciente(id)
        .then(() => {
          alert("Paciente eliminado");
          setPacientes((prev) => prev.filter((p) => p.idPaciente !== id));
        })
        .catch((err) => {
          console.error("Error al eliminar paciente", err);
          alert("Error al eliminar paciente");
        });
    }
  };

  // Abrir modal para editar
  const handleEditar = (paciente) => {
    setPacienteSeleccionado(paciente);
    setMostrarModal(true);
  };

  // Guardar cambios desde modal
  const handleSubmit = (e) => {
    e.preventDefault();
    actualizarPaciente(pacienteSeleccionado.idPaciente, pacienteSeleccionado)
      .then(() => {
        alert("Paciente actualizado");
        setPacientes((prev) =>
          prev.map((p) =>
            p.idPaciente === pacienteSeleccionado.idPaciente
              ? pacienteSeleccionado
              : p
          )
        );
        setMostrarModal(false);
      })
      .catch((err) => {
        console.error("Error al actualizar", err);
        alert("Error al actualizar paciente");
      });
  };

  return (
    <div className="container mt-4">
      <h2>Listado de Pacientes</h2>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar por nombre o DNI"
        value={criterio}
        onChange={(e) => setCriterio(e.target.value)}
      />

      {cargando && <p>Buscando...</p>}

      {!cargando && pacientes.length === 0 && (
        <p>No se encontraron pacientes</p>
      )}

      {!cargando && pacientes.length > 0 && (
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>DNI</th>
              <th>Fecha Nacimiento</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((p) => (
              <tr key={p.idPaciente}>
                <td>{p.idPaciente}</td>
                <td>{p.nombres}</td>
                <td>{p.apellidos}</td>
                <td>{p.dni}</td>
                <td>{p.fechaNacimiento}</td>
                <td>{p.telefono}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEditar(p)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleEliminar(p.idPaciente)}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de edición */}
      {mostrarModal && pacienteSeleccionado && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)", // overlay oscuro
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
          }}
          onClick={() => setMostrarModal(false)}
        >
          <div
            className="modal-dialog"
            style={{ maxWidth: "600px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-content"
              style={{
                backgroundColor: "white", // fondo blanco
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <div className="modal-header">
                <h5 className="modal-title">Editar Paciente</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMostrarModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Nombres"
                    value={pacienteSeleccionado.nombres}
                    onChange={(e) =>
                      setPacienteSeleccionado({
                        ...pacienteSeleccionado,
                        nombres: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Apellidos"
                    value={pacienteSeleccionado.apellidos}
                    onChange={(e) =>
                      setPacienteSeleccionado({
                        ...pacienteSeleccionado,
                        apellidos: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="DNI"
                    value={pacienteSeleccionado.dni}
                    onChange={(e) =>
                      setPacienteSeleccionado({
                        ...pacienteSeleccionado,
                        dni: e.target.value,
                      })
                    }
                  />
                  <input
                    type="date"
                    className="form-control mb-2"
                    value={pacienteSeleccionado.fechaNacimiento}
                    onChange={(e) =>
                      setPacienteSeleccionado({
                        ...pacienteSeleccionado,
                        fechaNacimiento: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Teléfono"
                    value={pacienteSeleccionado.telefono}
                    onChange={(e) =>
                      setPacienteSeleccionado({
                        ...pacienteSeleccionado,
                        telefono: e.target.value,
                      })
                    }
                  />

                  <div className="d-flex justify-content-end mt-3">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => setMostrarModal(false)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PacienteList;
