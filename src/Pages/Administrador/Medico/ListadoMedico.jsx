import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { listarMedicos, buscarMedicoPorNombre } from "../../../Services/MedicoService"; 
import "../../../Styles/ListadoMedico.css";

const ListadoMedico = () => {
    const [medicos, setMedicos] = useState([]);
    const [filtro, setFiltro] = useState(""); 
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 1. Mantenemos la función memorizada
    const cargarDatos = useCallback(async (criterio = "") => {
        setLoading(true);
        try {
            const peticion = criterio 
                ? await buscarMedicoPorNombre(criterio) 
                : await listarMedicos();
            
            setMedicos(peticion.data || []);
        } catch (err) {
            console.error("Error al cargar médicos:", err);
            Swal.fire("Error", "No se pudo conectar con el servidor", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    // 2. CORRECCIÓN DEL ERROR: Usamos una función asíncrona autoejecutable
    // Esto saca la ejecución del flujo sincrónico del render y satisface al linter.
    useEffect(() => {
        const inicializar = async () => {
            await cargarDatos();
        };
        inicializar();
    }, [cargarDatos]);

    const handleSearch = (e) => {
        const valor = e.target.value;
        setFiltro(valor);
        cargarDatos(valor); 
    };

    return (
        <div className="page-container container-fluid px-4">
            <div className="card card-modern">
                <div className="card-header-modern d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="card-title">
                            <i className="bi bi-person-vcard-fill me-2 text-primary"></i>Gestión de Médicos
                        </h5>
                        <small className="text-muted">Administre el staff médico de la clínica</small>
                    </div>
                    <button onClick={() => navigate("/administrador/medico/nuevo")} className="btn btn-primary shadow-sm btn-sm px-3">
                        <i className="bi bi-plus-lg me-1"></i> Nuevo Médico
                    </button>
                </div>

                <div className="p-3 border-bottom bg-light bg-opacity-50">
                    <div className="input-group" style={{ maxWidth: '450px' }}>
                        <span className="input-group-text bg-white border-end-0">
                            <i className="bi bi-search text-muted"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0 ps-0"
                            placeholder="Buscar por nombre, apellidos o DNI..."
                            value={filtro}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover table-modern mb-0">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Médico</th>
                                    <th>DNI</th>
                                    <th>Colegiatura</th>
                                    <th>Especialidad</th>
                                    <th className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5">
                                            <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                                            Cargando personal médico...
                                        </td>
                                    </tr>
                                ) : medicos.length > 0 ? (
                                    medicos.map((m) => (
                                        <tr key={m.idMedico}>
                                            <td className="text-muted small">#{m.idMedico}</td>
                                            <td>
                                                <div className="fw-bold text-dark">{`${m.nombres} ${m.apellidos}`}</div>
                                            </td>
                                            <td><code className="text-primary fw-bold">{m.dni}</code></td>
                                            <td><span className="text-secondary small">{m.nroColegiatura}</span></td>
                                            <td>
                                                <span className="badge-status st-especialidad">
                                                    <i className="bi bi-patch-check me-1 small"></i>
                                                    {m.nombreEspecialidad || "Sin especialidad"}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <button 
                                                    onClick={() => navigate(`/administrador/medico/editar/${m.idMedico}`)}
                                                    className="btn btn-light text-warning border"
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted">
                                            No se encontraron médicos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center p-3">
                    <button onClick={() => navigate("/administrador")} className="btn btn-outline-secondary btn-sm px-3">
                        <i className="bi bi-arrow-left-short"></i> Volver
                    </button>
                    <span className="text-muted small fw-medium">
                        Total: <span className="badge bg-primary rounded-pill">{medicos.length}</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ListadoMedico;