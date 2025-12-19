import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { guardarMedico } from "../../../Services/MedicoService";
import { listarEspecialidades } from "../../../Services/EspecialidadService";
import { buscarDisponiblesParaMedico } from "../../../Services/UsuarioService";

const RegistrarMedico = () => {
    const navigate = useNavigate();
    
    // Estado del formulario (idUsuario se mantiene en memoria pero no es editable manualmente)
    const [formData, setFormData] = useState({
        idUsuario: "",
        usuarioNombre: "", 
        nroColegiatura: "",
        idEspecialidad: ""
    });

    // Estados para el Modal
    const [showModal, setShowModal] = useState(false);
    const [usuariosParaModal, setUsuariosParaModal] = useState([]);
    const [busquedaUsuario, setBusquedaUsuario] = useState("");
    const [especialidades, setEspecialidades] = useState([]);
    const [error, setError] = useState(null);

    // Cargar especialidades al inicio para el <select>
    useEffect(() => {
        listarEspecialidades()
            .then(res => setEspecialidades(res.data || []))
            .catch(err => console.error("Error al cargar especialidades", err));
    }, []);

    // Lógica para abrir modal y cargar usuarios aptos (sin rol médico)
    const abrirModal = () => {
        setShowModal(true);
        cargarUsuariosModal(""); 
    };

    const cargarUsuariosModal = async (criterio = "") => {
        try {
            const res = await buscarDisponiblesParaMedico(criterio);
            // Aseguramos que la respuesta se maneje como un array para el .map()
            const lista = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);
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
            usuarioNombre: `${u.nombres} ${u.apellidos}`
        });
        setShowModal(false);
        setBusquedaUsuario("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.idUsuario) {
            setError("Debe seleccionar un usuario utilizando el buscador.");
            return;
        }

        try {
            // Preparamos el payload exacto que espera el MedicoRegistroDTO
            const payload = {
                idUsuario: Number(formData.idUsuario),
                nroColegiatura: formData.nroColegiatura.trim(),
                idEspecialidad: Number(formData.idEspecialidad)
            };

            await guardarMedico(payload);
            alert("Médico registrado con éxito");
            navigate("/administrador/medico"); 
        } catch (err) {
            // Captura errores 400 o mensajes de validación del backend
            const msg = err.response?.data?.message || "Error al registrar el médico.";
            setError(msg);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-primary">Registrar Nuevo Médico</h2>
            
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0 bg-white">
                {/* SELECCIÓN DE USUARIO */}
                <div className="mb-4">
                    <label className="form-label fw-bold text-secondary">Candidato Seleccionado</label>
                    <div className="input-group">
                        <span className="input-group-text bg-light"><i className="bi bi-person-fill"></i></span>
                        <input 
                            type="text" 
                            className="form-control bg-light" 
                            value={formData.usuarioNombre} 
                            placeholder="Haga clic en 'Buscar' para elegir un usuario..."
                            readOnly 
                        />
                        <button type="button" className="btn btn-primary" onClick={abrirModal}>
                            <i className="bi bi-search"></i> Buscar Candidato
                        </button>
                    </div>
                    <small className="text-muted">Solo se muestran usuarios que no tienen el rol de médico asignado.</small>
                </div>

                <div className="row">
                    {/* COLEGIATURA */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold text-secondary">Número de Colegiatura</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Ej: CMP-12345"
                            value={formData.nroColegiatura}
                            onChange={(e) => setFormData({...formData, nroColegiatura: e.target.value})}
                            maxLength="20"
                            required 
                        />
                    </div>

                    {/* ESPECIALIDAD */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold text-secondary">Especialidad Médica</label>
                        <select 
                            className="form-select" 
                            value={formData.idEspecialidad}
                            onChange={(e) => setFormData({...formData, idEspecialidad: e.target.value})}
                            required
                        >
                            <option value="">-- Seleccione una especialidad --</option>
                            {especialidades.map(e => (
                                <option key={e.idEspecialidad} value={e.idEspecialidad}>{e.nombreEspecialidad}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {error && <div className="alert alert-danger mt-3 py-2 shadow-sm">{error}</div>}

                <div className="d-flex gap-2 mt-4">
                    <button type="submit" className="btn btn-success px-4 fw-bold">GUARDAR MÉDICO</button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/administrador/medico")}>CANCELAR</button>
                </div>
            </form>

            {/* --- MODAL DE SELECCIÓN (CENTRADO Y AL FRENTE) --- */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content shadow-lg border-0">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title">Buscador de Candidatos</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <input 
                                    type="text" 
                                    className="form-control mb-4 py-2 shadow-sm" 
                                    placeholder="Escriba nombres, apellidos o DNI..." 
                                    value={busquedaUsuario}
                                    onChange={(e) => {
                                        setBusquedaUsuario(e.target.value);
                                        cargarUsuariosModal(e.target.value);
                                    }}
                                />
                                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
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
                                                usuariosParaModal.map(u => (
                                                    <tr key={u.idUsuario}>
                                                        <td>{u.nombres} {u.apellidos}</td>
                                                        <td><code className="text-dark">{u.dni}</code></td>
                                                        <td className="text-center">
                                                            <button 
                                                                className="btn btn-sm btn-outline-success px-3 fw-bold"
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
                                                        No se encontraron usuarios aptos para el registro.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer bg-light border-0">
                                <button type="button" className="btn btn-secondary px-4" onClick={() => setShowModal(false)}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegistrarMedico;