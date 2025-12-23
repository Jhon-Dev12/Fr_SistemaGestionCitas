import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { guardarEspecialidad } from "../../../Services/EspecialidadService";

const RegistrarEspecialidad = () => {
    const [nombre, setNombre] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // ESTADOS DE ERROR (Consistentes con tus otros módulos)
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
            alert("Especialidad registrada con éxito");
            navigate("/administrador/especialidad");
        } catch (err) {
            if (err.response && err.response.data) {
                const data = err.response.data;
                // 1. Captura mapa de errores de validación (@Valid del DTO)
                if (data.errores) {
                    setErroresServidor(data.errores);
                } 
                // 2. Captura mensaje global (ej: "Especialidad ya existe")
                setMensajeGlobal({ 
                    texto: data.mensaje || "Error al registrar la especialidad.", 
                    tipo: "danger" 
                });
            } else {
                setMensajeGlobal({ texto: "Error de conexión con el servidor", tipo: "danger" });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-primary">
                <i className="bi bi-mortarboard-fill me-2"></i>Registrar Nueva Especialidad
            </h2>

            {/* MENSAJE GLOBAL */}
            {mensajeGlobal.texto && (
                <div className={`alert alert-${mensajeGlobal.tipo} alert-dismissible fade show`} role="alert">
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
                            if (erroresServidor.nombreEspecialidad) {
                                setErroresServidor({});
                            }
                        }}
                        placeholder="Ej: Pediatría"
                        disabled={loading}
                    />
                    {/* FEEDBACK DE ERROR POR CAMPO */}
                    {erroresServidor.nombreEspecialidad && (
                        <div className="invalid-feedback">
                            {erroresServidor.nombreEspecialidad}
                        </div>
                    )}
                    <small className="form-text text-muted">Use solo letras y espacios sencillos.</small>
                </div>

                <div className="d-flex gap-2 mt-3">
                    <button 
                        type="submit" 
                        className="btn btn-success px-4 fw-bold" 
                        disabled={loading}
                    >
                        {loading ? (
                            <><span className="spinner-border spinner-border-sm me-2"></span>GUARDANDO...</>
                        ) : (
                            "GUARDAR ESPECIALIDAD"
                        )}
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-outline-secondary px-4" 
                        onClick={() => navigate("/administrador/especialidad")}
                        disabled={loading}
                    >
                        CANCELAR
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegistrarEspecialidad;