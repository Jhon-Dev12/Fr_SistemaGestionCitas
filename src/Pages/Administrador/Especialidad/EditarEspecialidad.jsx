import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { obtenerEspecialidadPorId, actualizarEspecialidad } from "../../../Services/EspecialidadService";

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

        // Validación básica frontend (coincidente con @Pattern del back)
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
            // Enviamos el objeto al backend
            await actualizarEspecialidad(id, { idEspecialidad: id, nombreEspecialidad: nombre });
            alert("Especialidad actualizada correctamente");
            navigate("/administrador/especialidad");
        } catch (err) {
            if (err.response && err.response.data) {
                const data = err.response.data;
                // Captura errores de validación específicos (ej: nombre duplicado o @Valid)
                if (data.errores) {
                    setErroresServidor(data.errores);
                }
                setMensajeGlobal({ 
                    texto: data.mensaje || "Error al actualizar la especialidad.", 
                    tipo: "danger" 
                });
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
                <h5 className="mt-2">Cargando especialidad...</h5>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-primary">
                <i className="bi bi-pencil-square me-2"></i>Editar Especialidad #{id}
            </h2>

            {/* ALERTA GLOBAL */}
            {mensajeGlobal.texto && (
                <div className={`alert alert-${mensajeGlobal.tipo} alert-dismissible fade show shadow-sm`} role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {mensajeGlobal.texto}
                    <button type="button" className="btn-close" onClick={() => setMensajeGlobal({ texto: "", tipo: "" })}></button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0 bg-white" style={{ maxWidth: "500px" }}>
                <div className="mb-3">
                    <label className="form-label fw-bold text-secondary">Nombre de la Especialidad:</label>
                    <input
                        type="text"
                        className={`form-control ${erroresServidor.nombreEspecialidad ? "is-invalid" : ""}`}
                        value={nombre}
                        onChange={(e) => {
                            setNombre(e.target.value);
                            if (erroresServidor.nombreEspecialidad) setErroresServidor({});
                        }}
                        placeholder="Ej: Odontología"
                        disabled={isSubmitting}
                    />
                    {/* FEEDBACK DE ERROR ESPECÍFICO */}
                    {erroresServidor.nombreEspecialidad && (
                        <div className="invalid-feedback">
                            {erroresServidor.nombreEspecialidad}
                        </div>
                    )}
                </div>

                <div className="d-flex gap-2 mt-3">
                    <button 
                        type="submit" 
                        className="btn btn-primary px-4 fw-bold" 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <><span className="spinner-border spinner-border-sm me-2"></span>ACTUALIZANDO...</>
                        ) : (
                            "ACTUALIZAR"
                        )}
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-outline-secondary px-4" 
                        onClick={() => navigate("/administrador/especialidad")}
                        disabled={isSubmitting}
                    >
                        CANCELAR
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditarEspecialidad;