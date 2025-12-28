import React, { useEffect, useState } from 'react';
import { obtenerStatsRecep } from "../../Services/DashboardService";
import "../../Styles/DetalleCita.css"; 

const RecepcionistaDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const response = await obtenerStatsRecep();
                setStats(response.data);
            } catch (error) {
                console.error("Error al cargar dashboard de recepción", error);
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, []);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="spinner-border text-primary" role="status"></div>
            <span className="ms-3 fw-bold text-muted">Sincronizando agenda...</span>
        </div>
    );

    return (
        <div className="container-fluid py-4 animate__animated animate__fadeIn">
            
            <header className="mb-4">
                <h3 className="fw-bold text-dark mb-1">Panel de Recepción</h3>
                <p className="text-muted small">Control de flujo de pacientes y disponibilidad de turnos.</p>
            </header>

            {/* KPI CARDS - MÉTRICAS OPERATIVAS */}
            <div className="row g-4 mb-5">
                {/* CITAS DE HOY */}
                <div className="col-md-4">
                    <div className="card card-modern border-0 shadow-sm h-100 overflow-hidden" style={{ borderLeft: '5px solid #0d6efd' }}>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 className="label-detail text-uppercase mb-2">Citas para Hoy</h6>
                                    <h2 className="fw-bold mb-0 text-dark">{stats?.citasHoy || 0}</h2>
                                    <div className="small text-primary mt-2">
                                        <i className="bi bi-calendar-check me-1"></i>Programadas
                                    </div>
                                </div>
                                <div className="bg-primary bg-opacity-10 p-3 rounded-3">
                                    <i className="bi bi-calendar2-event-fill fs-2 text-primary"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CUPOS DISPONIBLES */}
                <div className="col-md-4">
                    <div className="card card-modern border-0 shadow-sm h-100 overflow-hidden" style={{ borderLeft: '5px solid #198754' }}>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 className="label-detail text-uppercase mb-2">Cupos Disponibles</h6>
                                    <h2 className="fw-bold mb-0 text-dark">{stats?.cuposDisponibles || 0}</h2>
                                    <div className="small text-success mt-2">
                                        <i className="bi bi-clock-history me-1"></i>Turnos libres hoy
                                    </div>
                                </div>
                                <div className="bg-success bg-opacity-10 p-3 rounded-3">
                                    <i className="bi bi-plus-circle-fill fs-2 text-success"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TOTAL PACIENTES */}
                <div className="col-md-4">
                    <div className="card card-modern border-0 shadow-sm h-100 overflow-hidden" style={{ borderLeft: '5px solid #0dcaf0' }}>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 className="label-detail text-uppercase mb-2">Base de Pacientes</h6>
                                    <h2 className="fw-bold mb-0 text-dark">{stats?.pacientesTotales || 0}</h2>
                                    <div className="small text-info mt-2">
                                        <i className="bi bi-person-lines-fill me-1"></i>Registros totales
                                    </div>
                                </div>
                                <div className="bg-info bg-opacity-10 p-3 rounded-3">
                                    <i className="bi bi-people-fill fs-2 text-info"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PRÓXIMAS CITAS - MONITOR EN TIEMPO REAL */}
            <div className="card card-modern shadow-sm border-0 mb-5">
                <div className="card-header bg-white py-3 border-bottom-0">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0 fw-bold text-dark">
                            <i className="bi bi-list-stars me-2 text-primary"></i>
                            Próximas Citas del Día
                        </h5>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light text-muted small text-uppercase fw-bold">
                                <tr>
                                    <th className="ps-4 py-3">Paciente</th>
                                    <th className="py-3">Hora</th>
                                    <th className="py-3">Médico / Especialidad</th>
                                    <th className="py-3 text-center">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="border-top-0">
                                {stats?.proximasCitas && stats.proximasCitas.length > 0 ? (
                                    stats.proximasCitas.map((cita, index) => (
                                        <tr key={index} className="small">
                                            <td className="ps-4">
                                                <div className="fw-bold text-dark">{cita.paciente} {cita.apellidos}</div>
                                            </td>
                                            <td>
                                                <span className="badge bg-light text-dark border px-2 py-1">
                                                    <i className="bi bi-alarm me-1"></i>{cita.hora}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="text-dark fw-medium">{cita.medico}</div>
                                            </td>
                                            <td className="text-center">
                                                <span className={`badge rounded-pill px-3 py-2 ${
                                                    cita.estado === 'CONFIRMADO' ? 'bg-success-subtle text-success' : 
                                                    'bg-warning-subtle text-warning'
                                                } border`}>
                                                    {cita.estado}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-muted italic">
                                            No hay citas pendientes o confirmadas para lo que resta del día.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer bg-white text-center py-3 border-top-0">
                    <button 
                        className="btn btn-sm btn-outline-primary rounded-pill px-4 fw-bold" 
                        onClick={() => window.location.href='/recepcionista/cita'}
                    >
                        GESTIONAR AGENDA COMPLETA <i className="bi bi-chevron-right ms-1"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecepcionistaDashboard;