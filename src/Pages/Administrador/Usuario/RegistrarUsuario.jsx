import React, { useState, useEffect } from "react";
import { registrarUsuario, listarRoles } from "../../../Services/UsuarioService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../../Styles/RegistroUsuario.css";

const RegistroUsuario = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "", contrasenia: "", nombres: "", apellidos: "",
        dni: "", telefono: "", correo: "", rol: "",
    });

    const [archivo, setArchivo] = useState(null);
    const [preview, setPreview] = useState(null);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erroresServidor, setErroresServidor] = useState({});

    useEffect(() => {
        const cargarRoles = async () => {
            try {
                const response = await listarRoles();
                setRoles(response.data);
                if (response.data.length > 0) {
                    setFormData((prev) => ({ ...prev, rol: response.data[0].value }));
                }
            } catch (error) {
                console.error("Error al cargar roles", error);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErroresServidor({});

        const dataToSend = new FormData();
        Object.keys(formData).forEach((key) => dataToSend.append(key, formData[key]));
        if (archivo) dataToSend.append("archivo", archivo);

        try {
            await registrarUsuario(dataToSend);
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Usuario registrado exitosamente',
                confirmButtonColor: '#3182ce'
            }).then(() => {
                navigate("/administrador/usuario/nuevo");
                window.location.reload();
            });
        } catch (error) {
            if (error.response?.data?.errores) {
                setErroresServidor(error.response.data.errores);
                Swal.fire("Atención", "Por favor, verifique los datos ingresados.", "error");
            } else {
                Swal.fire("Error", error.response?.data?.mensaje || "Error de conexión", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    // Helper para renderizar inputs con diseño unificado e iconos
    const renderField = (label, name, type = "text", icon = null, col = "6") => (
        <div className={`col-md-${col}`}>
            <label className="form-label">{label}</label>
            <div className={icon ? "input-group has-validation" : ""}>
                {icon && <span className="input-group-text input-group-text-modern"><i className={`bi ${icon}`}></i></span>}
                <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className={`form-control ${icon ? 'border-start-0 ps-0' : ''} ${erroresServidor[name] ? "is-invalid" : ""}`}
                    placeholder={`  Ingrese ${label.toLowerCase()}`}
                />
                {erroresServidor[name] && <div className="invalid-feedback">{erroresServidor[name]}</div>}
            </div>
        </div>
    );

    return (
        <div className="container page-container pb-5">
            <div className="card card-modern shadow-sm">
                <div className="card-header-modern">
                    <h5 className="card-title">
                        <i className="bi bi-person-plus-fill me-2 text-primary"></i>Registro de Usuario
                    </h5>
                    <div className="sub-header">Cree credenciales de acceso para el personal administrativo y de atención</div>
                </div>

                <div className="card-body p-4 p-md-5">
                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="row g-4">
                        
                        {/* Fila 1: Credenciales */}
                        {renderField("Nombre de Usuario", "username", "text", "bi-at")}
                        {renderField("Contraseña", "contrasenia", "password", "bi-key")}

                        <hr className="divider-modern" />

                        {/* Fila 2: Datos Personales */}
                        {renderField("Nombres", "nombres")}
                        {renderField("Apellidos", "apellidos")}

                        {/* Fila 3: Triple columna */}
                        {renderField("DNI", "dni", "text", null, "4")}
                        {renderField("Teléfono", "telefono", "text", null, "4")}

                        <div className="col-md-4">
                            <label className="form-label">Rol en el Sistema</label>
                            <select 
                                name="rol" 
                                className={`form-select ${erroresServidor.rol ? "is-invalid" : ""}`}
                                value={formData.rol}
                                onChange={handleChange}
                            >
                                {roles.map((r, i) => <option key={i} value={r.value}>{r.label}</option>)}
                            </select>
                            {erroresServidor.rol && <div className="invalid-feedback">{erroresServidor.rol}</div>}
                        </div>

                        {renderField("Correo Electrónico", "correo", "email", null, "6")}

                        <div className="col-md-6">
                            <label className="form-label">Foto de Perfil</label>
                            <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
                        </div>

                        {/* Vista previa de imagen */}
                        {preview && (
                            <div className="col-12 text-center my-3 animate__animated animate__fadeIn">
                                <img src={preview} className="preview-img" alt="Vista previa" />
                                <p className="text-muted small mt-2">Vista previa de la foto seleccionada</p>
                            </div>
                        )}

                        {/* Botonera de Acciones */}
                        <div className="col-12 mt-4 d-flex justify-content-between border-top pt-4">
                            <button type="button" onClick={() => navigate(-1)} className="btn btn-light border px-4">
                                <i className="bi bi-arrow-left me-1"></i> Cancelar
                            </button>
                            <div className="d-flex gap-2">
                                <button type="button" onClick={() => navigate("/administrador/usuario/editar")} className="btn btn-outline-secondary px-4">
                                    Ver Usuarios
                                </button>
                                <button type="submit" className="btn btn-primary px-5 shadow-sm" disabled={loading} style={{backgroundColor: '#0d6efd', border: 'none'}}>
                                    {loading ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</>
                                    ) : (
                                        <><i className="bi bi-check-circle me-1"></i> Registrar Usuario</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="footer-hospital text-center">
                    <i className="bi bi-shield-lock me-1"></i> El registro de usuarios es responsabilidad exclusiva del Administrador.
                </div>
            </div>
        </div>
    );
};

export default RegistroUsuario;