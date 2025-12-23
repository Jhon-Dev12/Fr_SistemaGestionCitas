import React, { useState, useEffect } from "react";
import {
  buscarUsuariosPorUserName,
  actualizarUsuario,
  cambiarEstadoUsuario,
} from "../../../Services/UsuarioService";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../Services/authService";

const ActualizarUsuario = () => {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);
  const [erroresServidor, setErroresServidor] = useState({});
  const [mensajeGlobal, setMensajeGlobal] = useState({ texto: "", tipo: "" });
  const [adminLogueado, setAdminLogueado] = useState(null);

  const IMAGES_URL = "http://localhost:8080/uploads/perfiles/";

  useEffect(() => {
    const sesion = localStorage.getItem("usuario_sesion");
    if (sesion) {
      setAdminLogueado(JSON.parse(sesion));
    }
  }, []);

  const [formData, setFormData] = useState({
    idUsuario: "",
    rol: "",
    username: "",
    nombres: "",
    apellidos: "",
    dni: "",
    telefono: "",
    correo: "",
    contrasenia: "",
    estado: "ACTIVO",
  });

  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (erroresServidor[name]) {
      setErroresServidor((prev) => {
        const nuevosErrores = { ...prev };
        delete nuevosErrores[name];
        return nuevosErrores;
      });
    }
  };

  const handleCambiarEstado = async () => {
    if (
      !window.confirm(
        `¿Está seguro de ${
          formData.estado === "ACTIVO" ? "DESACTIVAR" : "ACTIVAR"
        } a este usuario?`
      )
    )
      return;

    try {
      setLoading(true);
      await cambiarEstadoUsuario(formData.idUsuario);
      alert("Estado del usuario actualizado correctamente");
      window.location.reload();
    } catch (error) {
      const msg = error.response?.data?.mensaje || "Error al cambiar el estado";
      setMensajeGlobal({ texto: msg, tipo: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMensajeGlobal({
          texto: "El archivo es demasiado grande (máx 2MB)",
          tipo: "danger",
        });
        return;
      }
      setArchivo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const manejarBusqueda = async (e) => {
    e.preventDefault();
    setMensajeGlobal({ texto: "", tipo: "" });
    setErroresServidor({});
    setArchivo(null);

    try {
      const response = await buscarUsuariosPorUserName(busqueda);
      const u = Array.isArray(response.data) ? response.data[0] : response.data;

      if (u && u.idUsuario) {
        setFormData({
          idUsuario: u.idUsuario,
          rol: u.rol || "",
          username: u.username || "",
          nombres: u.nombres || "",
          apellidos: u.apellidos || "",
          dni: u.dni || "",
          telefono: u.telefono || "",
          correo: u.correo || "",
          contrasenia: "",
          estado: u.estado || "ACTIVO",
        });
        setPreview(
          u.imgPerfil
            ? `${IMAGES_URL}${u.imgPerfil}?t=${new Date().getTime()}`
            : null
        );
        setMensajeGlobal({
          texto: "Usuario cargado correctamente",
          tipo: "info",
        });
      } else {
        setMensajeGlobal({
          texto: "No se encontró el usuario",
          tipo: "danger",
        });
        setFormData((prev) => ({ ...prev, idUsuario: "" }));
      }
    } catch (error) {
      const msg = error.response?.data?.mensaje || "Error en la búsqueda";
      setMensajeGlobal({ texto: msg, tipo: "danger" });
      setFormData((prev) => ({ ...prev, idUsuario: "" }));
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErroresServidor({}); // Limpiar errores previos antes de enviar

    const dataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "contrasenia" && !formData[key]) return;
      dataToSend.append(key, formData[key]);
    });

    if (archivo) {
      dataToSend.append("archivo", archivo);
    }

    try {
      await actualizarUsuario(formData.idUsuario, dataToSend);

      const sesionActual = JSON.parse(localStorage.getItem("usuario_sesion"));
      const esMismoUsuario =
        sesionActual &&
        ((sesionActual.idUsuario && sesionActual.idUsuario == formData.idUsuario) ||
          sesionActual.username === formData.username);

      if (esMismoUsuario) {
        alert("Perfil actualizado. Por seguridad, debe iniciar sesión nuevamente.");
        try { await logout(); } catch (e) {}
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
      } else {
        alert("Usuario actualizado exitosamente");
        window.location.replace("/administrador/usuario/editar");
      }
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      if (error.response && error.response.data) {
        const data = error.response.data;
        
        // 1. Si el back envía un mapa de errores por campo (ej: @Valid)
        if (data.errores) {
          setErroresServidor(data.errores);
        } 
        
        // 2. Si el back envía un mensaje global (ej: "DNI ya existe")
        if (data.mensaje) {
          setMensajeGlobal({ texto: data.mensaje, tipo: "danger" });
        }
      } else {
        setMensajeGlobal({ texto: "Error de conexión con el servidor", tipo: "danger" });
      }
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, name, type = "text", extraProps = {}) => (
    <div className={`col-md-${extraProps.col || "6"} mb-3`}>
      <label className="form-label fw-bold">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        className={`form-control ${erroresServidor[name] ? "is-invalid" : ""}`}
        onChange={handleChange}
        {...extraProps}
      />
      {erroresServidor[name] && (
        <div className="invalid-feedback">{erroresServidor[name]}</div>
      )}
    </div>
  );

  const esMismaCuenta = adminLogueado?.username === formData.username;

  return (
    <div className="container mt-5 pb-5">
      <h2 className="text-primary mb-4 text-center">Gestión de Usuarios</h2>

      <div className="card mb-4 border-primary shadow-sm">
        <div className="card-body">
          <form
            onSubmit={manejarBusqueda}
            className="row g-2 align-items-center justify-content-center"
          >
            <div className="col-auto">
              <label className="fw-bold">Username del usuario:</label>
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Escriba el username..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                required
              />
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary px-4 shadow-sm">
                <i className="bi bi-search me-2"></i>Buscar
              </button>
            </div>
          </form>
        </div>
      </div>

      {formData.idUsuario && (
        <div className="card shadow border-0">
          <div className="card-header bg-success text-white py-3">
            <h4 className="mb-0 text-center">Editando: {formData.username}</h4>
          </div>
          <div className="card-body p-4">
            {mensajeGlobal.texto && (
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

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="row">
                <div className="col-12 mb-4 d-flex align-items-center gap-4 border-bottom pb-4">
                  <div
                    className="bg-light border rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                    style={{
                      width: "120px",
                      height: "120px",
                      overflow: "hidden",
                    }}
                  >
                    {preview ? (
                      <img
                        src={preview}
                        alt="Vista previa"
                        className="w-100 h-100 object-fit-cover"
                      />
                    ) : (
                      <i className="bi bi-person text-secondary fs-1"></i>
                    )}
                  </div>
                  <div className="flex-grow-1">
                    <label className="form-label fw-bold">
                      Actualizar Foto de Perfil
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Rol Actual</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={formData.rol}
                    disabled
                  />
                </div>

                {renderInput("Nombre de Usuario", "username")}
                {renderInput("Nombres", "nombres")}
                {renderInput("Apellidos", "apellidos")}
                {renderInput("DNI", "dni", "text", { maxLength: "8" })}
                {renderInput("Teléfono", "telefono", "text", {
                  maxLength: "9",
                })}
                {renderInput("Correo", "correo", "email", { col: "12" })}

                <div className="col-12 bg-light p-3 rounded border mb-3">
                  <label className="form-label fw-bold text-dark">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    className={`form-control border-success ${
                      erroresServidor.contrasenia ? "is-invalid" : ""
                    }`}
                    name="contrasenia"
                    placeholder="Deje en blanco para no cambiarla"
                    value={formData.contrasenia}
                    onChange={handleChange}
                  />
                </div>

                <div
                  className={`col-12 mt-4 p-3 border rounded d-flex justify-content-between align-items-center ${
                    esMismaCuenta ? "bg-light opacity-75" : "bg-light shadow-sm"
                  }`}
                >
                  <div>
                    <h5 className="mb-0 fw-bold">Estado de la Cuenta</h5>
                    {esMismaCuenta ? (
                      <small className="text-primary fw-bold">
                        No puedes desactivar tu propia cuenta.
                      </small>
                    ) : (
                      <small className="text-muted">
                        El usuario está: <strong>{formData.estado}</strong>
                      </small>
                    )}
                  </div>
                  <button
                    type="button"
                    className={`btn ${
                      formData.estado === "ACTIVO"
                        ? "btn-outline-danger"
                        : "btn-outline-success"
                    } fw-bold px-4`}
                    onClick={handleCambiarEstado}
                    disabled={esMismaCuenta || loading}
                  >
                    {formData.estado === "ACTIVO"
                      ? "Desactivar Cuenta"
                      : "Activar Cuenta"}
                  </button>
                </div>
              </div>

<div className="d-grid gap-2 mt-4">
  <button
    type="submit"
    className="btn btn-warning btn-lg fw-bold shadow-sm"
    disabled={loading}
  >
    {loading ? "Procesando..." : "Guardar Cambios"}
  </button>
  
  <div className="d-flex gap-2">
    <button
      type="button"
      className="btn btn-outline-primary flex-grow-1"
      onClick={() => navigate("/administrador/usuario/registrar")} // Ajusta esta ruta según tu App.js
    >
      <i className="bi bi-person-plus me-2"></i>Registrar Nuevo
    </button>
    
    <button
      type="button"
      className="btn btn-outline-secondary flex-grow-1"
      onClick={() => navigate("/administrador")}
    >
      Volver al Inicio
    </button>
  </div>
</div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActualizarUsuario;
