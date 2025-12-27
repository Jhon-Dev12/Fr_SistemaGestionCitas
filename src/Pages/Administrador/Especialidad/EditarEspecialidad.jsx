import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { obtenerEspecialidadPorId, actualizarEspecialidad } from "../../../Services/EspecialidadService";
import "../../../Styles/RegistrarEspecialidad.css"; 

const EditarEspecialidad = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const [nombre, setNombre] = useState("");
    const [loading, setLoading] = useState(true);
    
    // --- ESTADOS DE ERROR Y PROCESAMIENTO ---
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [erroresServidor, setErroresServidor] = useState({});
    const [mensajeGlobal, setMensajeGlobal] = useState({ texto: "", tipo: "" });

    // 1. Cargar el nombre actual al entrar
    useEffect(() => {
        obtenerEspecialidadPorId(id)
            .then(res => {
                setNombre(res.data.nombreEspecialidad); 
                setLoading(false);
            })
            .catch(err => {
                console.error("Detalle del error:", err); 
                setMensajeGlobal({ 
                    texto: "No se pudo cargar la información de la especialidad.", 
                    tipo: "danger" 
                });
                setLoading(false);
            }); 
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensajeGlobal({ texto: "", tipo: "" });
        setErroresServidor({});
        setIsSubmitting(true);

        // Validación básica frontend
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(\s?[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;
        
        if (!nombre.trim()) {
            setErroresServidor({ nombreEspecialidad: "El nombre no puede estar vacío." });
            setIsSubmitting(false);
            return;
        }

        if (!regex.test(nombre)) {
            setErroresServidor({ nombreEspecialidad: "Solo se permiten letras y espacios sencillos." });
            setIsSubmitting(false);
            return;
        }

        try {
            await actualizarEspecialidad(id, { idEspecialidad: id, nombreEspecialidad: nombre });
            
            Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'La especialidad ha sido modificada correctamente',
                confirmButtonColor: '#3182ce'
            }).then(() => {
                navigate("/administrador/especialidad");
            });
        } catch (err) {
            if (err.response && err.response.data) {
                const data = err.response.data;
                if (data.errores) setErroresServidor(data.errores);
                
                setMensajeGlobal({ 
                    texto: data.mensaje || "Error al actualizar la especialidad.", 
                    tipo: "danger" 
                });
                Swal.fire("Atención", "Por favor, revise el nombre ingresado.", "error");
            } else {
                setMensajeGlobal({ texto: "Error de conexión con el servidor", tipo: "danger" });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <h5 className="mt-2 text-muted">Cargando datos de la especialidad...</h5>
            </div>
        );
    }

    return (
        <div className="container page-container pb-5">
            <div className="card card-modern shadow-sm">
                
                <div className="card-header-modern">
                    <h5 className="card-title">
                        <i className="bi bi-pencil-square me-2 text-primary"></i>Modificar Especialidad
                    </h5>
                    <div className="sub-header">Editando la especialidad médica con ID #{id}</div>
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
                                        value={nombre}
                                        onChange={(e) => {
                                            setNombre(e.target.value);
                                            if (erroresServidor.nombreEspecialidad) setErroresServidor({});
                                        }}
                                        placeholder="Ej: Ginecología"
                                        disabled={isSubmitting}
                                        autoFocus
                                    />
                                    {erroresServidor.nombreEspecialidad && (
                                        <div className="invalid-feedback">{erroresServidor.nombreEspecialidad}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <hr className="divider-modern" />

                        {/* Botonera de Acciones */}
                        <div className="col-12 mt-4 d-flex justify-content-between">
                            <button 
                                type="button" 
                                className="btn btn-light border px-4" 
                                onClick={() => navigate("/administrador/especialidad")}
                                disabled={isSubmitting}
                            >
                                <i className="bi bi-arrow-left me-1"></i> Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary px-5 shadow-sm" 
                                disabled={isSubmitting}
                                style={{backgroundColor: '#0d6efd', border: 'none'}}
                            >
                                {isSubmitting ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>ACTUALIZANDO...</>
                                ) : (
                                    <><i className="bi bi-check-circle me-1"></i> Guardar Cambios</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="footer-hospital text-center">
                    <i className="bi bi-info-circle me-1"></i> Verifique que el nombre de la especialidad no esté duplicado en el sistema.
                </div>
            </div>
        </div>
    );
};

export default EditarEspecialidad;