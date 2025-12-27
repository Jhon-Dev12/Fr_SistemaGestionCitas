import React, { useState, useEffect } from "react";
import {
  buscarUsuariosPorUserName,
  actualizarUsuario,
  cambiarEstadoUsuario,
} from "../../../Services/UsuarioService";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../Services/authService";
import Swal from "sweetalert2";
import "../../../Styles/ActualizarUsuario.css";

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
    const accion = formData.estado === "ACTIVO" ? "DESACTIVAR" : "ACTIVAR";
    
    Swal.fire({
      title: `¿Confirmar cambio?`,
      text: `¿Está seguro de que desea ${accion} a este usuario?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: formData.estado === "ACTIVO" ? '#e53e3e' : '#38a169',
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await cambiarEstadoUsuario(formData.idUsuario);
          Swal.fire("¡Éxito!", "Estado actualizado correctamente", "success")
            .then(() => window.location.reload());
        } catch (error) {
          const msg = error.response?.data?.mensaje || "Error al cambiar el estado";
          Swal.fire("Error", msg, "error");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire("Atención", "El archivo es demasiado grande (máx 2MB)", "warning");
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
      } else {
        Swal.fire("No encontrado", "No se encontró el usuario", "info");
        setFormData((prev) => ({ ...prev, idUsuario: "" }));
      }
    } catch (error) {
      const msg = error.response?.data?.mensaje || "Error en la búsqueda";
      Swal.fire("Error", msg, "error");
      setFormData((prev) => ({ ...prev, idUsuario: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErroresServidor({});
    setMensajeGlobal({ texto: "", tipo: "" });

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
        Swal.fire("Perfil Actualizado", "Por seguridad, inicie sesión nuevamente.", "info")
          .then(() => {
            logout();
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "/login";
          });
      } else {
        Swal.fire("¡Éxito!", "Usuario actualizado correctamente", "success")
          .then(() => window.location.replace("/administrador/usuario/editar"));
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const data = error.response.data;
        if (data.errores) setErroresServidor(data.errores);
        if (data.mensaje) setMensajeGlobal({ texto: data.mensaje, tipo: "danger" });
      } else {
        setMensajeGlobal({ texto: "Error de conexión con el servidor", tipo: "danger" });
      }
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, name, type = "text", icon = null, col = "6") => (
    <div className={`col-md-${col}`}>
      <label className="form-label">{label}</label>
      <div className={icon ? "input-group has-validation" : ""}>
        {icon && <span className="input-group-text bg-white text-muted border-end-0"><i className={`bi ${icon}`}></i></span>}
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`form-control ${icon ? 'border-start-0 ps-0' : ''} ${erroresServidor[name] ? "is-invalid" : ""}`}
          placeholder={type === "password" ? "Dejar vacío para mantener" : `Ingrese ${label.toLowerCase()}`}
        />
        {erroresServidor[name] && <div className="invalid-feedback">{erroresServidor[name]}</div>}
      </div>
    </div>
  );

  const esMismaCuenta = adminLogueado?.idUsuario == formData.idUsuario || adminLogueado?.username === formData.username;

  return (
    <div className="container page-container pb-5">
      
      <div className="search-box mb-4 shadow-sm">
        <h6 className="text-primary fw-bold mb-3"><i className="bi bi-search me-2"></i>Localizar Usuario</h6>
        <form onSubmit={manejarBusqueda} className="row g-3 align-items-center">
          <div className="col-md-9">
            <input
              type="text"
              className="form-control border-0 shadow-sm"
              placeholder="  Username exacto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              required
            />
          </div>
          <div className="col-md-3">
            <button type="submit" className="btn btn-primary w-100 shadow-sm">
              <i className="bi bi-search me-1"></i> Buscar
            </button>
          </div>
        </form>
      </div>

      {formData.idUsuario && (
        <div className="card card-modern animate__animated animate__fadeIn">
          <div className="card-header-modern">
            <div className="d-flex align-items-center">
              <div className="bg-success bg-opacity-10 p-2 rounded-3 me-3">
                <i className="bi bi-pencil-square text-success fs-4"></i>
              </div>
              <div>
                <h5 className="card-title">Editando Perfil</h5>
                <small className="text-muted">ID: #{formData.idUsuario} | Username: <strong>{formData.username}</strong></small>
              </div>
            </div>
          </div>

          <div className="card-body p-4 p-md-5">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="row g-4">
                
                <div className="col-12 text-center my-4 py-3 bg-light rounded-3 border">
                  <label className="form-label d-block mb-3 fw-bold">Foto de Perfil</label>
                  <img src={preview || "/images/img_default.jpg"} className="preview-img mb-3 border" alt="Perfil" />
                  <div className="mx-auto" style={{maxWidth: '400px'}}>
                    <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Rol</label>
                  <input type="text" className="form-control bg-light" value={formData.rol} disabled />
                </div>

                {renderInput("Username", "username", "text", "bi-at")}
                {renderInput("Nombres", "nombres")}
                {renderInput("Apellidos", "apellidos")}
                {renderInput("DNI", "dni", "text", null, "4")}
                {renderInput("Teléfono", "telefono", "text", null, "4")}
                {renderInput("Nueva Contraseña", "contrasenia", "password", "bi-key", "4")}
                
                {renderInput("Correo Electrónico", "correo", "email", null, "12")}

                <div className="col-12 mt-4">
                  <div className={`status-section d-flex justify-content-between align-items-center ${esMismaCuenta ? 'opacity-75' : ''}`}>
                    <div>
                      <h6 className="mb-0 fw-bold">Estado de Cuenta</h6>
                      <small className={esMismaCuenta ? "text-primary fw-bold" : "text-muted"}>
                        {esMismaCuenta ? "Tu propia cuenta (Protegida)" : `Actualmente: ${formData.estado}`}
                      </small>
                    </div>
                    <button
                      type="button"
                      className={`btn btn-sm ${formData.estado === "ACTIVO" ? "btn-outline-danger" : "btn-outline-success"} px-4 fw-bold`}
                      onClick={handleCambiarEstado}
                      disabled={esMismaCuenta || loading}
                    >
                      {formData.estado === "ACTIVO" ? "Desactivar" : "Activar"}
                    </button>
                  </div>
                </div>

                {/* MENSAJE RENDERIZADO EN LA PARTE INFERIOR */}
                {mensajeGlobal.texto && (
                  <div className="col-12 mt-3">
                    <div className={`alert alert-${mensajeGlobal.tipo} alert-dismissible fade show shadow-sm mb-0`} role="alert">
                      <i className={`bi ${mensajeGlobal.tipo === 'danger' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill'} me-2`}></i>
                      {mensajeGlobal.texto}
                      <button type="button" className="btn-close" onClick={() => setMensajeGlobal({ texto: "", tipo: "" })}></button>
                    </div>
                  </div>
                )}

                <div className="col-12 d-flex justify-content-between border-top pt-4 mt-4">
                  <button type="button" onClick={() => navigate("/administrador")} className="btn btn-light border px-4">
                    <i className="bi bi-house me-1"></i> Inicio
                  </button>
                  <div className="d-flex gap-2">
                    <button type="button" onClick={() => navigate("/administrador/usuario/nuevo")} className="btn btn-outline-primary">
                       Nuevo
                    </button>
                    <button type="submit" className="btn btn-primary px-5 shadow-sm" disabled={loading} style={{backgroundColor: '#0d6efd', border: 'none'}}>
                                    {loading ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</>
                                    ) : (
                                        <><i className="bi bi-check-circle me-1"></i>Guardar Cambios</>
                                    )}
                    </button>
                  </div>
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