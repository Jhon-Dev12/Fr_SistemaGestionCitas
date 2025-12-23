import React, { useState, useEffect } from "react";
import {
  registrarUsuario,
  listarRoles,
} from "../../../Services/UsuarioService";
import { useNavigate } from "react-router-dom";

const RegistroUsuario = () => {
  const [formData, setFormData] = useState({
    username: "",
    contrasenia: "",
    nombres: "",
    apellidos: "",
    dni: "",
    telefono: "",
    correo: "",
    rol: "",
  });

  // NUEVO: Estado para el archivo de imagen
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null); // Para mostrar miniatura

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [erroresServidor, setErroresServidor] = useState({});
  const [mensajeGlobal, setMensajeGlobal] = useState({ texto: "", tipo: "" });

  useEffect(() => {
    const cargarRoles = async () => {
      try {
        const response = await listarRoles();
        setRoles(response.data);
        if (response.data.length > 0) {
          setFormData((prev) => ({ ...prev, rol: response.data[0].value }));
        }
      } catch (error) {
        setMensajeGlobal({
          texto: "Error al conectar con el servidor",
          tipo: "danger",
        });
      }
    };
    cargarRoles();
  }, []);

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

  // NUEVO: Manejador para el cambio de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErroresServidor({});
    setMensajeGlobal({ texto: "", tipo: "" });

    // CAMBIO CRÍTICO: Usar FormData en lugar de JSON simple
    const dataToSend = new FormData();

    // Agregar campos de texto
    Object.keys(formData).forEach((key) => {
      dataToSend.append(key, formData[key]);
    });

    // Agregar el archivo (el nombre "archivo" debe coincidir con el @RequestParam del backend)
    if (archivo) {
      dataToSend.append("archivo", archivo);
    }

    try {
      // registrarUsuario ahora recibe un FormData
      await registrarUsuario(dataToSend);
      alert("Usuario registrado exitosamente");
      navigate("/administrador/usuario/nuevo");
      e.target.reset(); // Limpia los inputs del navegador (especialmente el file)
      if (preview) URL.revokeObjectURL(preview); // Libera la memoria
      setPreview(null);
      window.location.reload();
    } catch (error) {
      if (error.response) {
        const data = error.response.data;
        if (data.errores) {
          setErroresServidor(data.errores);
          setMensajeGlobal({ texto: data.mensaje, tipo: "danger" });
        } else if (data.mensaje) {
          setMensajeGlobal({ texto: data.mensaje, tipo: "danger" });
        }
      } else {
        setMensajeGlobal({
          texto: "No hay conexión con el servidor",
          tipo: "danger",
        });
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

  return (
    <div className="container mt-5 pb-5">
      <div className="card shadow border-0">
        <div className="card-header bg-primary text-white py-3">
          <h3 className="mb-0 text-center">Registro de Nuevo Usuario</h3>
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
              {/* Sección de Foto de Perfil */}
              <div className="col-12 mb-4 d-flex align-items-center gap-4 border-bottom pb-4">
                <div className="position-relative">
                  <div
                    className="bg-light border rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                    style={{
                      width: "100px",
                      height: "100px",
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
                </div>
                <div className="flex-grow-1">
                  <label className="form-label fw-bold">
                    Imagen de Perfil (Opcional)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <small className="text-muted">
                    Formatos aceptados: JPG, PNG. Máx 2MB.
                  </small>
                </div>
              </div>

              {renderInput("Nombre de Usuario", "username")}
              {renderInput("Contraseña", "contrasenia", "password")}
              {renderInput("Nombres", "nombres")}
              {renderInput("Apellidos", "apellidos")}
              {renderInput("DNI (8 dígitos)", "dni", "text", {
                maxLength: "8",
              })}
              {renderInput("Teléfono (9 dígitos)", "telefono", "text", {
                maxLength: "9",
              })}

              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Rol</label>
                <select
                  name="rol"
                  className={`form-select ${
                    erroresServidor.rol ? "is-invalid" : ""
                  }`}
                  value={formData.rol}
                  onChange={handleChange}
                  required
                >
                  {roles.length === 0 && (
                    <option value="">Cargando roles...</option>
                  )}
                  {roles.map((rol, index) => (
                    <option key={index} value={rol.value}>
                      {rol.label}
                    </option>
                  ))}
                </select>
                {erroresServidor.rol && (
                  <div className="invalid-feedback">{erroresServidor.rol}</div>
                )}
              </div>

              {renderInput("Correo Electrónico", "correo", "email", {
                col: "12",
              })}
            </div>

            <div className="d-grid gap-2 mt-4">
              <button
                type="submit"
                className="btn btn-success btn-lg shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Guardando...
                  </>
                ) : (
                  "Guardar Usuario"
                )}
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => navigate("/administrador/usuario/editar")}
              >
                <i className="bi bi-pencil-square me-2"></i>Gestionar Usuarios
                Existentes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroUsuario;
