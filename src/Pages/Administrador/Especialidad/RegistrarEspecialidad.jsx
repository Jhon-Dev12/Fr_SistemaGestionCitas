import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { guardarEspecialidad } from "../../../Services/EspecialidadService";
import "../../../Styles/RegistrarEspecialidad.css"; 

const RegistrarEspecialidad = () => {
    const [nombre, setNombre] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // ESTADOS DE ERROR
    const [erroresServidor, setErroresServidor] = useState({});
    const [mensajeGlobal, setMensajeGlobal] = useState({ texto: "", tipo: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErroresServidor({});
        setMensajeGlobal({ texto: "", tipo: "" });

        // Validación básica frontend
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(\s?[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;
        
        if (!nombre.trim()) {
            setErroresServidor({ nombreEspecialidad: "El nombre es obligatorio." });
            setLoading(false);
            return;
        }
        
        if (!regex.test(nombre)) {
            setErroresServidor({ nombreEspecialidad: "Solo se permiten letras y espacios." });
            setLoading(false);
            return;
        }

        try {
            await guardarEspecialidad({ nombreEspecialidad: nombre });
            
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Especialidad registrada correctamente',
                confirmButtonColor: '#3182ce'
            }).then(() => {
                navigate("/administrador/especialidad");
            });
        } catch (err) {
            if (err.response && err.response.data) {
                const data = err.response.data;
                if (data.errores) setErroresServidor(data.errores);
                
                setMensajeGlobal({ 
                    texto: data.mensaje || "Error al registrar la especialidad.", 
                    tipo: "danger" 
                });
                Swal.fire("Atención", "Por favor, verifique los datos ingresados.", "error");
            } else {
                setMensajeGlobal({ texto: "Error de conexión con el servidor", tipo: "danger" });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container page-container pb-5">
            <div className="card card-modern shadow-sm">
                <div className="card-header-modern">
                    <h5 className="card-title">
                        <i className="bi bi-shield-plus me-2 text-primary"></i>Registrar Nueva Especialidad
                    </h5>
                    <div className="sub-header">Añada nuevas áreas médicas al catálogo de servicios de la clínica</div>
                </div>

                <div className="card-body p-4 p-md-5">
                    {mensajeGlobal.texto && (
                        <div className={`alert alert-${mensajeGlobal.tipo} alert-dismissible fade show mb-4 shadow-sm`} role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            {mensajeGlobal.texto}
                            <button type="button" className="btn-close" onClick={() => setMensajeGlobal({ texto: "", tipo: "" })}></button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                            <div className="col-12">
                                <label className="form-label">Nombre de la Especialidad</label>
                                <div className="input-group has-validation">
                                    <span className={`input-group-text input-group-text-modern ${erroresServidor.nombreEspecialidad ? "border-danger text-danger" : ""}`}>
                                        <i className="bi bi-tag-fill"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className={`form-control border-start-0 ps-0 ${erroresServidor.nombreEspecialidad ? "is-invalid" : ""}`}
                                        placeholder="Ej: Cardiología, Pediatría, Dermatología..."
                                        value={nombre}
                                        onChange={(e) => {
                                            setNombre(e.target.value);
                                            if (erroresServidor.nombreEspecialidad) setErroresServidor({});
                                        }}
                                        disabled={loading}
                                        autoFocus
                                    />
                                    {erroresServidor.nombreEspecialidad && (
                                        <div className="invalid-feedback">{erroresServidor.nombreEspecialidad}</div>
                                    )}
                                </div>
                                <small className="form-text text-muted mt-2 d-block">
                                    <i className="bi bi-info-circle me-1"></i> Use un nombre descriptivo y verifique que no exista previamente.
                                </small>
                            </div>
                        </div>

                        <hr className="divider-modern" />

                        {/* Botonera de Acciones */}
                        <div className="col-12 mt-4 d-flex justify-content-between">
                            <button 
                                type="button" 
                                className="btn btn-light border px-4" 
                                onClick={() => navigate("/administrador/especialidad")}
                                disabled={loading}
                            >
                                <i className="bi bi-arrow-left me-1"></i> Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary px-5 shadow-sm" 
                                disabled={loading}
                                style={{backgroundColor: '#0d6efd', border: 'none'}}
                            >
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>GUARDANDO...</>
                                ) : (
                                    <><i className="bi bi-check-circle me-1"></i> Guardar Especialidad</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="footer-hospital text-center">
                    <i className="bi bi-mortarboard-fill me-1"></i> Las especialidades registradas aparecerán inmediatamente en el formulario de médicos.
                </div>
            </div>
        </div>
    );
};

export default RegistrarEspecialidad;