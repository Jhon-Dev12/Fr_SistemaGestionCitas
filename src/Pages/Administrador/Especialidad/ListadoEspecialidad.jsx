import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { 
    listarEspecialidades, 
    buscarEspecialidadPorNombre, 
    eliminarEspecialidad 
} from "../../../Services/EspecialidadService";
import "../../../Styles/ListadoEspecialidad.css";

const ListadoEspecialidad = () => {
    const [especialidades, setEspecialidades] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 1. Mantenemos la función memorizada igual que en Médicos
    const cargarDatos = useCallback(async (nombre = "") => {
        setLoading(true);
        try {
            const peticion = nombre 
                ? await buscarEspecialidadPorNombre(nombre) 
                : await listarEspecialidades();
            setEspecialidades(peticion.data || []);
        } catch (err) {
            console.error("Error al cargar especialidades:", err);
            Swal.fire("Error", "No se pudo conectar con el servidor", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    // 2. CORRECCIÓN DEL ERROR DE ESLINT: Función asíncrona autoejecutable
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

    const handleEliminar = (id) => {
        Swal.fire({
            title: '¿Eliminar especialidad?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e53e3e',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await eliminarEspecialidad(id);
                    Swal.fire("¡Borrado!", "Eliminado correctamente.", "success");
                    await cargarDatos(filtro);
                } catch (err) {
                    Swal.fire("Atención", "No se puede eliminar: tiene médicos vinculados.", "error");
                }
            }
        });
    };

    return (
        <div className="page-container container-fluid px-4">
            <div className="card card-modern">
                {/* CABECERA IDÉNTICA A MÉDICOS */}
                <div className="card-header-modern d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="card-title">
                            <i className="bi bi-shield-plus me-2 text-primary"></i>Gestión de Especialidades
                        </h5>
                        <small className="text-muted">Administre el catálogo de especialidades de la clínica</small>
                    </div>
                    <button onClick={() => navigate("/administrador/especialidad/nuevo")} className="btn btn-primary shadow-sm btn-sm px-3">
                        <i className="bi bi-plus-lg me-1"></i> Nueva Especialidad
                    </button>
                </div>

                {/* BUSCADOR IDÉNTICO A MÉDICOS */}
                <div className="p-3 border-bottom bg-light bg-opacity-50">
                    <div className="input-group" style={{ maxWidth: '450px' }}>
                        <span className="input-group-text bg-white border-end-0">
                            <i className="bi bi-search text-muted"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0 ps-0"
                            placeholder="Buscar especialidad por nombre..."
                            value={filtro}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                {/* CUERPO DE TABLA IDÉNTICO A MÉDICOS */}
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover table-modern mb-0">
                            <thead>
                                <tr>
                                    <th style={{ width: '15%' }}>ID</th>
                                    <th style={{ width: '65%' }}>Nombre de Especialidad</th>
                                    <th style={{ width: '20%' }} className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="3" className="text-center py-5">
                                            <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                                            Cargando catálogo...
                                        </td>
                                    </tr>
                                ) : especialidades.length > 0 ? (
                                    especialidades.map((item) => (
                                        <tr key={item.idEspecialidad}>
                                            <td className="text-muted small">#{item.idEspecialidad}</td>
                                            <td>
                                                <span className="badge-status st-especialidad">
                                                    <i className="bi bi-patch-check me-1 small"></i>
                                                    {item.nombreEspecialidad}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <div className="btn-group btn-action-group gap-1">
                                                    <button 
                                                        onClick={() => navigate(`/administrador/especialidad/editar/${item.idEspecialidad}`)}
                                                        className="btn btn-light text-warning border"
                                                        title="Editar"
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleEliminar(item.idEspecialidad)} 
                                                        className="btn btn-light text-danger border"
                                                        title="Eliminar"
                                                    >
                                                        <i className="bi bi-trash3"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center py-5 text-muted">
                                            No se encontraron especialidades.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* FOOTER IDÉNTICO A MÉDICOS */}
                <div className="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center p-3">
                    <button onClick={() => navigate("/administrador")} className="btn btn-outline-secondary btn-sm px-3">
                        <i className="bi bi-arrow-left-short"></i> Volver
                    </button>
                    <span className="text-muted small fw-medium">
                        Total: <span className="badge bg-primary rounded-pill">{especialidades.length}</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ListadoEspecialidad;