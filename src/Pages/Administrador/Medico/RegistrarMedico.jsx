import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { guardarMedico } from "../../../Services/MedicoService";
import { listarEspecialidades } from "../../../Services/EspecialidadService";
import { buscarDisponiblesParaMedico } from "../../../Services/UsuarioService";
import "../../../Styles/RegistrarMedico.css"; // Asegúrate de vincular el CSS

const RegistrarMedico = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        idUsuario: "",
        usuarioNombre: "",
        nroColegiatura: "",
        idEspecialidad: "",
    });

    const [showModal, setShowModal] = useState(false);
    const [usuariosParaModal, setUsuariosParaModal] = useState([]);
    const [busquedaUsuario, setBusquedaUsuario] = useState("");
    const [especialidades, setEspecialidades] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [erroresServidor, setErroresServidor] = useState({});
    const [mensajeGlobal, setMensajeGlobal] = useState({ texto: "", tipo: "" });

    useEffect(() => {
        listarEspecialidades()
            .then((res) => setEspecialidades(res.data || []))
            .catch(() => setMensajeGlobal({ texto: "Error al cargar especialidades", tipo: "danger" }));
    }, []);

    const abrirModal = () => {
        setShowModal(true);
        cargarUsuariosModal("");
    };

    const cargarUsuariosModal = async (criterio = "") => {
        try {
            const res = await buscarDisponiblesParaMedico(criterio);
            const lista = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
            setUsuariosParaModal(lista);
        } catch (err) {
            if (err.response?.status === 404) {
                setUsuariosParaModal([]);
            } else {
                console.error("Error al filtrar usuarios:", err);
            }
        }
    };

    const seleccionarUsuario = (u) => {
        setFormData({
            ...formData,
            idUsuario: u.idUsuario,
            usuarioNombre: `${u.nombres} ${u.apellidos}`,
        });
        
        if (erroresServidor["idUsuario"]) {
            setErroresServidor((prev) => {
                const nuevos = { ...prev };
                delete nuevos["idUsuario"];
                return nuevos;
            });
        }
        setShowModal(false);
        setBusquedaUsuario("");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (erroresServidor[name]) {
            setErroresServidor((prev) => {
                const nuevos = { ...prev };
                delete nuevos[name];
                return nuevos;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErroresServidor({});
        setMensajeGlobal({ texto: "", tipo: "" });

        if (!formData.idUsuario) {
            Swal.fire("Atención", "Debe seleccionar un usuario antes de guardar.", "warning");
            setLoading(false);
            return;
        }

        try {
            const payload = {
                idUsuario: Number(formData.idUsuario),
                nroColegiatura: formData.nroColegiatura.trim(),
                idEspecialidad: Number(formData.idEspecialidad),
            };

            await guardarMedico(payload);
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Médico registrado correctamente en el sistema',
                confirmButtonColor: '#3182ce'
            }).then(() => {
                navigate("/administrador/medico");
            });
        } catch (err) {
            if (err.response) {
                const data = err.response.data;
                if (data.errores) {
                    setErroresServidor(data.errores);
                    Swal.fire("Verificar datos", data.mensaje || "Hay errores en el formulario", "error");
                } else if (data.mensaje) {
                    setMensajeGlobal({ texto: data.mensaje, tipo: "danger" });
                }
            } else {
                setMensajeGlobal({ texto: "No hay conexión con el servidor", tipo: "danger" });
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
                        <i className="bi bi-person-badge-fill me-2 text-primary"></i>Registro de Nuevo Médico
                    </h5>
                    <div className="sub-header">Asigne un usuario al staff médico y complete su información profesional</div>
                </div>

                <div className="card-body p-4 p-md-5">
                    {mensajeGlobal.texto && (
                        <div className={`alert alert-${mensajeGlobal.tipo} alert-dismissible fade show mb-4`} role="alert">
                            {mensajeGlobal.texto}
                            <button type="button" className="btn-close" onClick={() => setMensajeGlobal({ texto: "", tipo: "" })}></button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="row g-4">
                        
                        {/* SECCIÓN 1: Selección de Candidato */}
                        <div className="col-12">
                            <label className="form-label">Candidato Seleccionado</label>
                            <div className="input-group has-validation">
                                <span className={`input-group-text input-group-text-modern ${erroresServidor.idUsuario ? "border-danger text-danger" : ""}`}>
                                    <i className="bi bi-person-check"></i>
                                </span>
                                <input
                                    type="text"
                                    className={`form-control ${erroresServidor.idUsuario ? "is-invalid border-start-0" : "bg-light border-start-0"} ps-0`}
                                    value={formData.usuarioNombre}
                                    placeholder="Use el botón 'Asignar' para elegir un usuario..."
                                    readOnly
                                />
                                <button
                                    type="button"
                                    className="btn btn-primary px-4 shadow-sm"
                                    onClick={abrirModal}
                                    disabled={loading}
                                >
                                    <i className="bi bi-search me-1"></i> Asignar
                                </button>
                                {erroresServidor.idUsuario && <div className="invalid-feedback">{erroresServidor.idUsuario}</div>}
                            </div>
                            <small className="text-muted mt-2 d-block">
                                <i className="bi bi-info-circle me-1"></i> Solo se muestran usuarios registrados que no son médicos.
                            </small>
                        </div>

                        <hr className="divider-modern" />

                        {/* SECCIÓN 2: Datos Profesionales */}
                        <div className="col-md-6">
                            <label className="form-label">Número de Colegiatura</label>
                            <div className="input-group has-validation">
                                <span className="input-group-text input-group-text-modern"><i className="bi bi-card-text"></i></span>
                                <input
                                    type="text"
                                    name="nroColegiatura"
                                    className={`form-control border-start-0 ps-0 ${erroresServidor.nroColegiatura ? "is-invalid" : ""}`}
                                    placeholder="Ej: CMP-12345"
                                    value={formData.nroColegiatura}
                                    onChange={handleInputChange}
                                    maxLength="20"
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
                                    <option value="">-- Seleccione especialidad --</option>
                                    {especialidades.map((e) => (
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
                                onClick={() => navigate("/administrador/medico")} 
                                className="btn btn-light border px-4"
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
                                    <><span className="spinner-border spinner-border-sm me-2"></span>Registrando...</>
                                ) : (
                                    <><i className="bi bi-check-circle me-1"></i> Guardar Médico</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="footer-hospital text-center">
                    <i className="bi bi-info-circle me-1"></i> El personal registrado tendrá acceso inmediato al módulo de gestión de citas y pacientes.
                </div>
            </div>

            {/* --- MODAL DE SELECCIÓN (Mismo estilo modernizado) --- */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content shadow-lg">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title">
                                    <i className="bi bi-people me-2"></i>Buscador de Usuarios Disponibles
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="input-group mb-4">
                                    <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0"
                                        placeholder="Filtrar por nombre, apellidos o DNI..."
                                        value={busquedaUsuario}
                                        onChange={(e) => {
                                            setBusquedaUsuario(e.target.value);
                                            cargarUsuariosModal(e.target.value);
                                        }}
                                    />
                                </div>
                                <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                                    <table className="table table-hover align-middle border">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Nombre Completo</th>
                                                <th>DNI</th>
                                                <th className="text-center">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {usuariosParaModal.length > 0 ? (
                                                usuariosParaModal.map((u) => (
                                                    <tr key={u.idUsuario}>
                                                        <td>{u.nombres} {u.apellidos}</td>
                                                        <td><code className="text-dark">{u.dni}</code></td>
                                                        <td className="text-center">
                                                            <button
                                                                className="btn btn-sm btn-outline-success px-3 fw-bold rounded-pill"
                                                                onClick={() => seleccionarUsuario(u)}
                                                            >
                                                                Seleccionar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="text-center py-5 text-muted">
                                                        No se encontraron usuarios aptos.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer bg-light">
                                <button type="button" className="btn btn-secondary px-4" onClick={() => setShowModal(false)}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegistrarMedico;