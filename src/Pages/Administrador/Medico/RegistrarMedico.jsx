import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { guardarMedico } from "../../../Services/MedicoService";
import { listarEspecialidades } from "../../../Services/EspecialidadService";
import { buscarDisponiblesParaMedico } from "../../../Services/UsuarioService";

const RegistrarMedico = () => {
  const navigate = useNavigate();

  // Estado del formulario
  const [formData, setFormData] = useState({
    idUsuario: "",
    usuarioNombre: "",
    nroColegiatura: "",
    idEspecialidad: "",
  });

  // Estados para el Modal y carga
  const [showModal, setShowModal] = useState(false);
  const [usuariosParaModal, setUsuariosParaModal] = useState([]);
  const [busquedaUsuario, setBusquedaUsuario] = useState("");
  const [especialidades, setEspecialidades] = useState([]);
  
  // ESTADOS DE ERROR (Basados en el módulo de referencia)
  const [loading, setLoading] = useState(false);
  const [erroresServidor, setErroresServidor] = useState({});
  const [mensajeGlobal, setMensajeGlobal] = useState({ texto: "", tipo: "" });

  // Cargar especialidades al inicio
  useEffect(() => {
    listarEspecialidades()
      .then((res) => setEspecialidades(res.data || []))
      .catch(() => setMensajeGlobal({ texto: "Error al cargar especialidades", tipo: "danger" }));
  }, []);

  // Lógica para abrir modal y cargar usuarios
  const abrirModal = () => {
    setShowModal(true);
    cargarUsuariosModal("");
  };

  const cargarUsuariosModal = async (criterio = "") => {
    try {
      const res = await buscarDisponiblesParaMedico(criterio);
      const lista = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
      setUsuariosParaModal(lista);
    } catch (err) {
      if (err.response?.status === 404) {
        setUsuariosParaModal([]);
      } else {
        console.error("Error al filtrar usuarios:", err);
      }
    }
  };

  const seleccionarUsuario = (u) => {
    setFormData({
      ...formData,
      idUsuario: u.idUsuario,
      usuarioNombre: `${u.nombres} ${u.apellidos}`,
    });
    
    // Limpiar error de idUsuario si existía al seleccionar uno nuevo
    if (erroresServidor["idUsuario"]) {
      setErroresServidor((prev) => {
        const nuevos = { ...prev };
        delete nuevos["idUsuario"];
        return nuevos;
      });
    }

    setShowModal(false);
    setBusquedaUsuario("");
  };

  // Manejador para limpiar errores mientras se escribe
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (erroresServidor[name]) {
      setErroresServidor((prev) => {
        const nuevos = { ...prev };
        delete nuevos[name];
        return nuevos;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErroresServidor({});
    setMensajeGlobal({ texto: "", tipo: "" });

    if (!formData.idUsuario) {
      setMensajeGlobal({ texto: "Debe seleccionar un usuario utilizando el buscador.", tipo: "danger" });
      setLoading(false);
      return;
    }

    try {
      const payload = {
        idUsuario: Number(formData.idUsuario),
        nroColegiatura: formData.nroColegiatura.trim(),
        idEspecialidad: Number(formData.idEspecialidad),
      };

      await guardarMedico(payload);
      alert("Médico registrado con éxito");
      navigate("/administrador/medico");
    } catch (err) {
      if (err.response) {
        const data = err.response.data;
        if (data.errores) {
          setErroresServidor(data.errores);
          setMensajeGlobal({ texto: data.mensaje || "Error de validación", tipo: "danger" });
        } else if (data.mensaje) {
          setMensajeGlobal({ texto: data.mensaje, tipo: "danger" });
        }
      } else {
        setMensajeGlobal({ texto: "No hay conexión con el servidor", tipo: "danger" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary">Registrar Nuevo Médico</h2>

      {/* MENSAJE GLOBAL */}
      {mensajeGlobal.texto && (
        <div className={`alert alert-${mensajeGlobal.tipo} alert-dismissible fade show`} role="alert">
          {mensajeGlobal.texto}
          <button type="button" className="btn-close" onClick={() => setMensajeGlobal({ texto: "", tipo: "" })}></button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0 bg-white">
        
        {/* SELECCIÓN DE USUARIO */}
        <div className="mb-4">
          <label className="form-label fw-bold text-secondary">
            Candidato Seleccionado
          </label>
          <div className="input-group">
            <span className={`input-group-text ${erroresServidor.idUsuario ? "border-danger text-danger" : "bg-light"}`}>
              <i className="bi bi-person-fill"></i>
            </span>
            <input
              type="text"
              className={`form-control ${erroresServidor.idUsuario ? "is-invalid bg-white" : "bg-light"}`}
              value={formData.usuarioNombre}
              placeholder="Haga clic en 'Asignar' para elegir un usuario..."
              readOnly
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={abrirModal}
              disabled={loading}
            >
              <i className="bi bi-search"></i> Asignar Usuario
            </button>
            {erroresServidor.idUsuario && (
              <div className="invalid-feedback">{erroresServidor.idUsuario}</div>
            )}
          </div>
          <small className="text-muted">
            Solo se muestran usuarios que no tienen el rol de médico asignado.
          </small>
        </div>

        <div className="row">
          {/* COLEGIATURA */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold text-secondary">
              Número de Colegiatura
            </label>
            <input
              type="text"
              name="nroColegiatura"
              className={`form-control ${erroresServidor.nroColegiatura ? "is-invalid" : ""}`}
              placeholder="Ej: CMP-12345"
              value={formData.nroColegiatura}
              onChange={handleInputChange}
              maxLength="20"
            />
            {erroresServidor.nroColegiatura && (
              <div className="invalid-feedback">{erroresServidor.nroColegiatura}</div>
            )}
          </div>

          {/* ESPECIALIDAD */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold text-secondary">
              Especialidad Médica
            </label>
            <select
              name="idEspecialidad"
              className={`form-select ${erroresServidor.idEspecialidad ? "is-invalid" : ""}`}
              value={formData.idEspecialidad}
              onChange={handleInputChange}
            >
              <option value="">-- Seleccione una especialidad --</option>
              {especialidades.map((e) => (
                <option key={e.idEspecialidad} value={e.idEspecialidad}>
                  {e.nombreEspecialidad}
                </option>
              ))}
            </select>
            {erroresServidor.idEspecialidad && (
              <div className="invalid-feedback">{erroresServidor.idEspecialidad}</div>
            )}
          </div>
        </div>

        <div className="d-flex gap-2 mt-4">
          <button type="submit" className="btn btn-success px-4 fw-bold" disabled={loading}>
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2"></span>GUARDANDO...</>
            ) : ("GUARDAR MÉDICO")}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate("/administrador/medico")}
            disabled={loading}
          >
            CANCELAR
          </button>
        </div>
      </form>

      {/* --- MODAL DE SELECCIÓN --- */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">Buscador de Usuarios</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <input
                  type="text"
                  className="form-control mb-4 py-2 shadow-sm"
                  placeholder="Escriba nombre o DNI..."
                  value={busquedaUsuario}
                  onChange={(e) => {
                    setBusquedaUsuario(e.target.value);
                    cargarUsuariosModal(e.target.value);
                  }}
                />
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <table className="table table-hover align-middle border">
                    <thead className="table-light">
                      <tr>
                        <th>Nombre Completo</th>
                        <th>DNI</th>
                        <th>Usuario</th>
                        <th className="text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosParaModal.length > 0 ? (
                        usuariosParaModal.map((u) => (
                          <tr key={u.idUsuario}>
                            <td>{u.nombres} {u.apellidos}</td>
                            <td><code className="text-dark">{u.dni}</code></td>
                            <td>{u.username}</td>
                            <td className="text-center">
                              <button
                                className="btn btn-sm btn-outline-success px-3 fw-bold"
                                onClick={() => seleccionarUsuario(u)}
                              >
                                Seleccionar
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center py-5 text-muted">
                            No se encontraron usuarios aptos para el registro.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer bg-light border-0">
                <button
                  type="button"
                  className="btn btn-secondary px-4"
                  onClick={() => setShowModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrarMedico;