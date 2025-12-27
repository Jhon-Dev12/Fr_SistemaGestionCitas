import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { listarLogs, buscarLogsPorFecha } from "../../../Services/LogService"; 
import "../../../Styles/ListadoLogs.css";

const ListadoLogs = () => {
    const [logs, setLogs] = useState([]);
    const [fechaFiltro, setFechaFiltro] = useState(""); 
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const cargarDatos = useCallback(async (fecha = "") => {
        setLoading(true);
        try {
            const peticion = fecha 
                ? await buscarLogsPorFecha(fecha) 
                : await listarLogs();
            setLogs(peticion.data || []);
        } catch (err) {
            console.error("Error:", err);
            setLogs([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const inicializar = async () => { await cargarDatos(); };
        inicializar();
    }, [cargarDatos]);

    const handleSearch = (e) => {
        const valor = e.target.value;
        setFechaFiltro(valor);
        cargarDatos(valor); 
    };

    const getBadgeClass = (accion) => {
        switch (accion?.toUpperCase()) {
            case 'CREAR': return 'st-crear';
            case 'ACTUALIZAR': return 'st-actualizar';
            case 'ELIMINAR': return 'st-eliminar';
            default: return 'bg-light text-dark';
        }
    };

    return (
        <div className="page-container container-fluid px-4">
            <div className="card card-modern shadow-sm">
                
                <div className="card-header-modern d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="card-title">
                            <i className="bi bi-journal-text me-2 text-primary"></i>Historial de Acciones (Logs)
                        </h5>
                        <small className="text-muted">Auditoría de movimientos en el sistema</small>
                    </div>
                    {/* BOTÓN CON NUEVO DISEÑO SOFT */}
                    <button 
                        onClick={() => { setFechaFiltro(""); cargarDatos(""); }} 
                        className="btn-soft-clean shadow-sm"
                    >
                        <i className="bi bi-eraser-fill me-1"></i> Limpiar Filtro
                    </button>
                </div>

                <div className="p-3 border-bottom bg-light bg-opacity-50">
                    <div className="search-container-logs" style={{maxWidth: '300px'}}>
                        <label className="form-label small fw-bold text-muted text-uppercase mb-1">Filtrar por día:</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                                <i className="bi bi-calendar-event text-muted"></i>
                            </span>
                            <input
                                type="date"
                                className="form-control border-start-0 ps-0 input-date-modern"
                                value={fechaFiltro}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                </div>

                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover table-modern mb-0">
                            <thead>
                                <tr>
                                    <th>ID Log</th>
                                    <th>Fecha y Hora</th>
                                    <th>Acción</th>
                                    <th>ID Cita</th>
                                    <th>Usuario Actor</th>
                                    <th>Detalle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5">
                                            <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                                            Sincronizando...
                                        </td>
                                    </tr>
                                ) : logs.length > 0 ? (
                                    logs.map((log) => (
                                        <tr key={log.idLog}>
                                            <td className="text-muted small">#{log.idLog}</td>
                                                <td>
                                                    <div className="fw-bold text-dark">{new Date(log.fechaAccion).toLocaleDateString()}</div>
                                                    <small className="text-muted">{new Date(log.fechaAccion).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                                                </td>
                                                <td>
                                                <span className={`badge-status ${getBadgeClass(log.accion)}`}>
                                                    {log.accion}
                                                </span>
                                            </td>
                                            <td className="text-dark">CITA-{log.idCita}</td>
                                            <td>
                                                <div className="fw-bold text-dark" style={{fontSize: '0.9rem'}}>{log.usuarioActorNombreCompleto}</div>
                                                <span className="text-muted small">Rol: {log.rolUsuarioActor}</span>
                                            </td>
                                            <td className="small text-muted italic" style={{maxWidth: '300px'}}>
                                                {log.detalle}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6" className="text-center py-4">No hay registros.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center p-3">
                    <button onClick={() => navigate("/administrador")} className="btn btn-outline-secondary btn-sm px-3 shadow-sm">
                        <i className="bi bi-arrow-left-short"></i> Volver
                    </button>
                    <span className="text-muted small fw-medium">
                        Total: <span className="badge bg-primary rounded-pill">{logs.length}</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ListadoLogs;