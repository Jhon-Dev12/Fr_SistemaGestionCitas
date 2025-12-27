import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { obtenerDatosEditar, actualizarMedico } from "../../../Services/MedicoService";
import { listarEspecialidades } from "../../../Services/EspecialidadService";
import "../../../Styles/EditarMedico.css"; 

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
            
            Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'La información del médico se guardó correctamente',
                confirmButtonColor: '#3182ce'
            }).then(() => {
                navigate("/administrador/medico");
            });
        } catch (err) {
            if (err.response && err.response.data) {
                const data = err.response.data;
                if (data.errores) setErroresServidor(data.errores);
                
                setMensajeGlobal({ 
                    texto: data.mensaje || "Error al actualizar el médico.", 
                    tipo: "danger" 
                });
                Swal.fire("Atención", "Por favor, revise los campos marcados.", "error");
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
                <h5 className="mt-2 text-muted">Cargando perfil del médico...</h5>
            </div>
        );
    }

    return (
        <div className="container page-container pb-5">
            <div className="card card-modern shadow-sm">
                <div className="card-header-modern">
                    <h5 className="card-title">
                        <i className="bi bi-pencil-square me-2 text-primary"></i>Modificar Información de Médico
                    </h5>
                    <div className="sub-header">Actualice la colegiatura o especialidad del profesional seleccionado</div>
                </div>

                <div className="card-body p-4 p-md-5">
                    {mensajeGlobal.texto && (
                        <div className={`alert alert-${mensajeGlobal.tipo} alert-dismissible fade show mb-4 shadow-sm`} role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            {mensajeGlobal.texto}
                            <button type="button" className="btn-close" onClick={() => setMensajeGlobal({ texto: "", tipo: "" })}></button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="row g-4">
                        
                        {/* SECCIÓN 1: Datos de Usuario (Solo Lectura) */}
                        <div className="col-12">
                            <label className="form-label">Médico vinculado</label>
                            <div className="input-group">
                                <span className="input-group-text input-group-text-modern"><i className="bi bi-person-check-fill"></i></span>
                                <input 
                                    type="text" 
                                    className="form-control bg-light border-start-0 ps-0" 
                                    value={formData.nombreCompletoUsuario} 
                                    readOnly 
                                />
                            </div>
                            <small className="text-muted mt-2 d-block">
                                <i className="bi bi-info-circle me-1"></i> El usuario base no puede ser modificado desde este formulario.
                            </small>
                        </div>

                        <hr className="divider-modern" />

                        {/* SECCIÓN 2: Datos Profesionales Editables */}
                        <div className="col-md-6">
                            <label className="form-label">Nro. Colegiatura</label>
                            <div className="input-group has-validation">
                                <span className="input-group-text input-group-text-modern"><i className="bi bi-card-text"></i></span>
                                <input 
                                    type="text" 
                                    name="nroColegiatura"
                                    className={`form-control border-start-0 ps-0 ${erroresServidor.nroColegiatura ? "is-invalid" : ""}`} 
                                    value={formData.nroColegiatura}
                                    onChange={handleInputChange}
                                    placeholder="Ingrese nro de colegiatura"
                                />
                                {erroresServidor.nroColegiatura && <div className="invalid-feedback">{erroresServidor.nroColegiatura}</div>}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Especialidad Médica</label>
                            <div className="input-group has-validation">
                                <span className="input-group-text input-group-text-modern"><i className="bi bi-shield-plus"></i></span>
                                <select 
                                    name="idEspecialidad"
                                    className={`form-select border-start-0 ps-0 ${erroresServidor.idEspecialidad ? "is-invalid" : ""}`} 
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
                                {erroresServidor.idEspecialidad && <div className="invalid-feedback">{erroresServidor.idEspecialidad}</div>}
                            </div>
                        </div>

                        {/* Botonera de Acciones */}
                        <div className="col-12 mt-5 d-flex justify-content-between border-top pt-4">
                            <button 
                                type="button" 
                                className="btn btn-light border px-4" 
                                onClick={() => navigate("/administrador/medico")}
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
                                    <><span className="spinner-border spinner-border-sm me-2"></span>GUARDANDO...</>
                                ) : (
                                    <><i className="bi bi-check-circle me-1"></i> Actualizar Médico</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="footer-hospital text-center">
                    <i className="bi bi-shield-check me-1"></i> Los cambios se verán reflejados en la agenda de citas y en el catálogo público de la clínica.
                </div>
            </div>
        </div>
    );
};

export default EditarMedico;