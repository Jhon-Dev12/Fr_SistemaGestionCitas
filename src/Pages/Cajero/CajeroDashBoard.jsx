import React, { useEffect, useState } from 'react';
import { obtenerStatsCaja } from "../../Services/DashboardService";
import "../../Styles/DetalleCita.css"; 

const CajeroDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const response = await obtenerStatsCaja();
                setStats(response.data);
            } catch (error) {
                console.error("Error al cargar dashboard de caja", error);
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, []);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="spinner-border text-success" role="status"></div>
            <span className="ms-3 fw-bold text-muted">Sincronizando flujo de caja...</span>
        </div>
    );

    return (
        <div className="container-fluid py-4 animate__animated animate__fadeIn">
            
            <header className="mb-4">
                <h3 className="fw-bold text-dark mb-1">Control de Recaudación</h3>
                <p className="text-muted small">Resumen de ingresos y facturación del día actual.</p>
            </header>

            {/* KPI CARDS - RESUMEN FINANCIERO */}
            <div className="row g-4 mb-5">
                {/* TOTAL RECAUDADO HOY */}
                <div className="col-md-4">
                    <div className="card card-modern border-0 shadow-sm h-100 overflow-hidden" style={{ borderLeft: '5px solid #198754' }}>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 className="label-detail text-uppercase mb-2">Recaudación Total</h6>
                                    <h2 className="fw-bold mb-0 text-dark">S/ {stats?.recaudacionTotalDia?.toFixed(2) || "0.00"}</h2>
                                    <div className="small text-success mt-2">
                                        <i className="bi bi-graph-up-arrow me-1"></i>Ingresos del día
                                    </div>
                                </div>
                                <div className="bg-success bg-opacity-10 p-3 rounded-3">
                                    <i className="bi bi-cash-stack fs-2 text-success"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PENDIENTES DE COBRO */}
                <div className="col-md-4">
                    <div className="card card-modern border-0 shadow-sm h-100 overflow-hidden" style={{ borderLeft: '5px solid #ffc107' }}>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 className="label-detail text-uppercase mb-2">Por Cobrar</h6>
                                    <h2 className="fw-bold mb-0 text-dark">{stats?.citasPendientesCobro || 0}</h2>
                                    <div className="small text-warning mt-2 fw-medium">
                                        <i className="bi bi-hourglass-split me-1"></i>Pacientes en espera
                                    </div>
                                </div>
                                <div className="bg-warning bg-opacity-10 p-3 rounded-3">
                                    <i className="bi bi-person-exclamation fs-2 text-warning"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MÉTODOS DIGITALES (TARJETA + TRANSF) */}
                <div className="col-md-4">
                    <div className="card card-modern border-0 shadow-sm h-100 overflow-hidden" style={{ borderLeft: '5px solid #0dcaf0' }}>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 className="label-detail text-uppercase mb-2">Efectivo vs Tarjeta</h6>
                                    <div className="d-flex gap-3 align-items-center">
                                        <div>
                                            <small className="text-muted d-block" style={{fontSize: '0.65rem'}}>EFECTIVO</small>
                                            <span className="fw-bold text-dark">S/ {stats?.recaudacionEfectivo?.toFixed(2) || "0.00"}</span>
                                        </div>
                                        <div className="vr"></div>
                                        <div>
                                            <small className="text-muted d-block" style={{fontSize: '0.65rem'}}>TARJETA</small>
                                            <span className="fw-bold text-dark">S/ {stats?.recaudacionTarjeta?.toFixed(2) || "0.00"}</span>
                                        </div>
                                    </div>
                                    <div className="small text-info mt-2">
                                        <i className="bi bi-shield-check me-1"></i>Cuadre parcial
                                    </div>
                                </div>
                                <div className="bg-info bg-opacity-10 p-3 rounded-3">
                                    <i className="bi bi-credit-card-2-front fs-2 text-info"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ÚLTIMOS PAGOS - TABLA DE COMPROBANTES */}
            <div className="card card-modern shadow-sm border-0 mb-5">
                <div className="card-header bg-white py-3 border-bottom-0">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0 fw-bold text-dark">
                            <i className="bi bi-receipt-cutoff me-2 text-success"></i>
                            Últimos Comprobantes Emitidos
                        </h5>
                        <span className="badge bg-light text-dark border fw-normal">Actividad en tiempo real</span>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light text-muted small text-uppercase fw-bold">
                                <tr>
                                    <th className="ps-4 py-3">ID / Fecha</th>
                                    <th className="py-3">Paciente</th>
                                    <th className="py-3">Monto</th>
                                    <th className="py-3">Método de Pago</th>
                                    <th className="py-3 text-center">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="border-top-0">
                                {stats?.ultimosPagos && stats.ultimosPagos.length > 0 ? (
                                    stats.ultimosPagos.map((pago) => (
                                        <tr key={pago.idComprobante} className="small">
                                            <td className="ps-4 text-secondary">
                                                <div className="fw-bold text-dark">#{pago.idComprobante}</div>
                                                <div style={{fontSize: '0.75rem'}}>
                                                    {new Date(pago.fechaEmision).toLocaleString('es-PE', {
                                                        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="fw-bold text-dark">{pago.pacienteNombre}</div>
                                            </td>
                                            <td>
                                                <span className="fw-bold text-success">S/ {pago.monto.toFixed(2)}</span>
                                            </td>
                                            <td>
                                                <span className={`badge bg-light text-dark border px-2 py-1 fw-normal`}>
                                                    <i className={`bi ${pago.metodoPago === 'EFECTIVO' ? 'bi-cash' : 'bi-credit-card'} me-1`}></i>
                                                    {pago.metodoPago}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <span className="badge bg-success-subtle text-success px-3 py-2 border border-success-subtle rounded-pill">
                                                    {pago.estado}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted italic">
                                            No se han registrado pagos el día de hoy.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer bg-white text-center py-3 border-top-0">
                    <button 
                        className="btn btn-sm btn-outline-success rounded-pill px-4 fw-bold" 
                        onClick={() => window.location.href='/cajero/pago'}
                    >
                        VER TODOS LOS MOVIMIENTOS <i className="bi bi-chevron-right ms-1"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CajeroDashboard;