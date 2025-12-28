import React, { useEffect, useState } from 'react';
import { obtenerStatsAdmin } from "../../Services/DashboardService";
import "../../Styles/DetalleCita.css"; 

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const response = await obtenerStatsAdmin();
                setStats(response.data);
            } catch (error) {
                console.error("Error al cargar dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, []);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="spinner-border text-primary" role="status"></div>
            <span className="ms-3 fw-bold text-muted">Sincronizando métricas...</span>
        </div>
    );

    return (
        /* px-md-5 asegura que en pantallas medianas/grandes el contenido no toque los bordes */
        <div className="container-fluid py-4 animate__animated animate__fadeIn">
            
            <header className="mb-4">
                <h3 className="fw-bold text-dark mb-1">Resumen de Gestión</h3>
                <p className="text-muted small">Estado actual de la infraestructura y operaciones.</p>
            </header>

            {/* KPI CARDS - RESUMEN NUMÉRICO */}
            <div className="row g-4 mb-5">
                {/* MÉDICOS */}
                <div className="col-md-4">
                    <div className="card card-modern border-0 shadow-sm h-100 overflow-hidden" style={{ borderLeft: '5px solid #0d6efd' }}>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 className="label-detail text-uppercase mb-2">Staff Médico</h6>
                                    <h2 className="fw-bold mb-0 text-dark">{stats?.totalMedicos || 0}</h2>
                                    <div className="small text-success mt-2">
                                        <i className="bi bi-check-circle-fill me-1"></i>Especialistas activos
                                    </div>
                                </div>
                                <div className="bg-primary bg-opacity-10 p-3 rounded-3">
                                    <i className="bi bi-person-vcard-fill fs-2 text-primary"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* USUARIOS */}
                <div className="col-md-4">
                    <div className="card card-modern border-0 shadow-sm h-100 overflow-hidden" style={{ borderLeft: '5px solid #198754' }}>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 className="label-detail text-uppercase mb-2">Usuarios en Sistema</h6>
                                    <h2 className="fw-bold mb-0 text-dark">{stats?.usuariosActivos || 0}</h2>
                                    <div className="small text-muted mt-2">Personal administrativo</div>
                                </div>
                                <div className="bg-success bg-opacity-10 p-3 rounded-3">
                                    <i className="bi bi-people-fill fs-2 text-success"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RECAUDACIÓN */}
                <div className="col-md-4">
                    <div className="card card-modern border-0 shadow-sm h-100 overflow-hidden" style={{ borderLeft: '5px solid #0dcaf0' }}>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 className="label-detail text-uppercase mb-2">Ingresos del Mes</h6>
                                    <h2 className="fw-bold mb-0 text-dark">S/ {stats?.ingresosMensuales?.toFixed(2) || "0.00"}</h2>
                                    <div className="small text-primary mt-2 fw-medium">
                                        <i className="bi bi-graph-up-arrow me-1"></i>Recaudación total
                                    </div>
                                </div>
                                <div className="bg-info bg-opacity-10 p-3 rounded-3">
                                    <i className="bi bi-cash-stack fs-2 text-info"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ACTIVIDAD RECIENTE - TABLA DE LOGS */}
            <div className="card card-modern shadow-sm border-0 mb-5">
                <div className="card-header bg-white py-3 border-bottom-0">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0 fw-bold text-dark">
                            <i className="bi bi-clock-history me-2 text-primary"></i>
                            Actividad Reciente
                        </h5>
                        <span className="badge bg-light text-dark border fw-normal">Últimos 5 movimientos</span>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light text-muted small text-uppercase fw-bold">
                                <tr>
                                    <th className="ps-4 py-3">Fecha y Hora</th>
                                    <th className="py-3">Acción</th>
                                    <th className="py-3">Usuario</th>
                                    <th className="py-3">Detalle</th>
                                </tr>
                            </thead>
                            <tbody className="border-top-0">
                                {stats?.logsRecientes.map((log) => (
                                    <tr key={log.idLog} className="small">
                                        <td className="ps-4 text-secondary">
                                            {new Date(log.fechaAccion).toLocaleString('es-PE', {
                                                day: '2-digit', month: '2-digit', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                        <td>
                                            <span className={`badge rounded-pill px-3 py-2 ${
                                                log.accion === 'CREACION' ? 'bg-success-subtle text-success' : 
                                                log.accion === 'CANCELACION' ? 'bg-danger-subtle text-danger' : 
                                                'bg-primary-subtle text-primary'
                                            } border`}>
                                                {log.accion}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="fw-bold text-dark">{log.usuarioActorNombreCompleto}</div>
                                            <div className="text-muted" style={{fontSize: '0.7rem'}}>{log.rolUsuarioActor}</div>
                                        </td>
                                        <td className="text-secondary italic">
                                            <i className="bi bi-info-circle me-1"></i>
                                            Cita #{log.idCita}: {log.detalle}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer bg-white text-center py-3 border-top-0">
                    <button 
                        className="btn btn-sm btn-outline-primary rounded-pill px-4 fw-bold" 
                        onClick={() => window.location.href='/administrador/logcita'}
                    >
                        VER REGISTRO COMPLETO <i className="bi bi-chevron-right ms-1"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;