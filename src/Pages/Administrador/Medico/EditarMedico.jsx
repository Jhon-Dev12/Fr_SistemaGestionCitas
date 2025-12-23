import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerDatosEditar, actualizarMedico } from "../../../Services/MedicoService";
import { listarEspecialidades } from "../../../Services/EspecialidadService";

const EditarMedico = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombreCompletoUsuario: "", 
        nroColegiatura: "",        
        idEspecialidad: ""         
    });

    const [especialidades, setEspecialidades] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // --- ESTADOS DE ERROR Y PROCESAMIENTO ---
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [erroresServidor, setErroresServidor] = useState({});
    const [mensajeGlobal, setMensajeGlobal] = useState({ texto: "", tipo: "" });

    useEffect(() => {
        const cargarPagina = async () => {
            try {
                const [resEspecialidades, resMedico] = await Promise.all([
                    listarEspecialidades(),
                    obtenerDatosEditar(id) 
                ]);

                setEspecialidades(resEspecialidades.data || []);
                
                const data = resMedico.data;
                setFormData({
                    nombreCompletoUsuario: data.nombreCompletoUsuario,
                    nroColegiatura: data.nroColegiatura,
                    idEspecialidad: data.idEspecialidad || "" 
                });
            } catch (err) {
                setMensajeGlobal({ texto: "Error al cargar los datos del médico.", tipo: "danger" });
            } finally {
                setLoading(false);
            }
        };
        cargarPagina();
    }, [id]);

    // Limpia errores específicos mientras el usuario edita
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        if (erroresServidor[name]) {
            setErroresServidor(prev => {
                const nuevos = { ...prev };
                delete nuevos[name];
                return nuevos;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensajeGlobal({ texto: "", tipo: "" });
        setErroresServidor({});
        setIsSubmitting(true);

        try {
            const payload = {
                idMedico: Number(id),
                nroColegiatura: formData.nroColegiatura.trim(),
                idEspecialidad: Number(formData.idEspecialidad)
            };

            await actualizarMedico(id, payload);
            alert("Información actualizada con éxito");
            navigate("/administrador/medico");
        } catch (err) {
            if (err.response && err.response.data) {
                const data = err.response.data;
                // Captura mapa de errores de validación (@Valid)
                if (data.errores) {
                    setErroresServidor(data.errores);
                }
                // Captura mensaje global (ej: "La colegiatura ya está registrada por otro médico")
                setMensajeGlobal({ 
                    texto: data.mensaje || "Error al actualizar el médico.", 
                    tipo: "danger" 
                });
            } else {
                setMensajeGlobal({ texto: "Error de conexión con el servidor.", tipo: "danger" });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <h5 className="mt-2">Cargando datos del médico...</h5>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-primary">
                <i className="bi bi-pencil-square me-2"></i>Modificar Médico
            </h2>

            {/* ALERTA GLOBAL */}
            {mensajeGlobal.texto && (
                <div className={`alert alert-${mensajeGlobal.tipo} alert-dismissible fade show shadow-sm`} role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {mensajeGlobal.texto}
                    <button type="button" className="btn-close" onClick={() => setMensajeGlobal({ texto: "", tipo: "" })}></button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0 bg-white">
                {/* INFORMACIÓN DE SOLO LECTURA */}
                <div className="mb-4 border-bottom pb-3">
                    <label className="form-label fw-bold text-secondary">Médico vinculado:</label>
                    <div className="input-group">
                        <span className="input-group-text bg-light">
                            <i className="bi bi-person-check-fill"></i>
                        </span>
                        <input 
                            type="text" 
                            className="form-control bg-light" 
                            value={formData.nombreCompletoUsuario} 
                            readOnly 
                        />
                    </div>
                    <div className="form-text text-muted">El usuario vinculado no puede ser modificado desde este módulo.</div>
                </div>

                <div className="row">
                    {/* COLEGIATURA EDITABLE */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Nro. Colegiatura:</label>
                        <input 
                            type="text" 
                            name="nroColegiatura"
                            className={`form-control ${erroresServidor.nroColegiatura ? "is-invalid" : ""}`} 
                            value={formData.nroColegiatura}
                            onChange={handleInputChange}
                        />
                        {erroresServidor.nroColegiatura && (
                            <div className="invalid-feedback">{erroresServidor.nroColegiatura}</div>
                        )}
                    </div>

                    {/* CAMBIO DE ESPECIALIDAD */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Especialidad Médica:</label>
                        <select 
                            name="idEspecialidad"
                            className={`form-select ${erroresServidor.idEspecialidad ? "is-invalid" : ""}`} 
                            value={formData.idEspecialidad}
                            onChange={handleInputChange}
                        >
                            <option value="">-- Seleccione una especialidad --</option>
                            {especialidades.map(e => (
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
                    <button type="submit" className="btn btn-primary px-4 fw-bold" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <><span className="spinner-border spinner-border-sm me-2"></span>ACTUALIZANDO...</>
                        ) : (
                            "ACTUALIZAR MÉDICO"
                        )}
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-outline-secondary px-4" 
                        onClick={() => navigate("/administrador/medico")}
                        disabled={isSubmitting}
                    >
                        CANCELAR
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditarMedico;