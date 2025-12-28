import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { obtenerDetalleComprobante } from "../../../Services/ComprobanteService";
import "../../../Styles/DetalleCita.css";

const DetalleComprobantePago = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [detalle, setDetalle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        obtenerDetalleComprobante(id)
            .then(res => {
                setDetalle(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                Swal.fire("Error", "No se pudo cargar el detalle del comprobante.", "error");
                navigate("/cajero/pago");
            });
    }, [id, navigate]);

    const handlePrint = () => {
        window.print();
    };

    const getEstadoClass = (estado) => {
        const classes = {
            'EMITIDO': 'st-confirmado',
            'ANULADO': 'st-cancelado',
            'PENDIENTE': 'st-pendiente',
            'PAGADO': 'st-confirmado'
        };
        return classes[estado] || 'bg-secondary text-white';
    };

    if (loading) return (
        <div className="container mt-5 text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3 fw-bold text-muted">Recuperando comprobante fiscal...</p>
        </div>
    );

    if (!detalle) return (
        <div className="container mt-5 text-center">
            <div className="alert alert-danger shadow-sm">Comprobante no encontrado.</div>
            <button onClick={() => navigate(-1)} className="btn btn-primary mt-3">Volver</button>
        </div>
    );

    return (
        <div className="container page-container pb-5">
            {/* ACCIONES SUPERIORES (Se ocultan al imprimir) */}
            <div className="d-flex justify-content-between align-items-center mb-4 d-print-none">
                <button onClick={() => navigate("/cajero/pago")} className="btn btn-light border px-4 shadow-sm">
                    <i className="bi bi-arrow-left me-2"></i>Volver al listado
                </button>
                <button onClick={handlePrint} className="btn btn-primary px-4 shadow-sm">
                    <i className="bi bi-printer-fill me-2"></i>Imprimir comprobante
                </button>
            </div>

            <div className="card card-modern shadow-sm animate__animated animate__fadeIn">
                
                {/* CABECERA */}
                <div className="card-header-modern d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="card-title">
                            <i className="bi bi-receipt me-2 text-primary"></i>
                            Comprobante de Pago N° {detalle.idComprobante}
                        </h5>
                        <div className="sub-header">Documento oficial de recaudación - Clínica Santa Rosa</div>
                    </div>
                    <span className={`badge-status ${getEstadoClass(detalle.estado)} shadow-sm`}>
                        {detalle.estado}
                    </span>
                </div>

                <div className="card-body p-4 p-md-5">
                    <div className="row g-5">
                        
                        {/* COLUMNA IZQUIERDA: DATOS DEL PAGADOR */}
                        <div className="col-md-5 border-end-md">
                            <div className="mb-4">
                                <h6 className="label-detail"><i className="bi bi-person-check me-1"></i> Información del Pagador</h6>
                                <div className="value-box flex-column align-items-start mb-3 shadow-sm p-3">
                                    <span className="text-dark fw-bold mb-1">{detalle.nombresPagador} {detalle.apellidosPagador}</span>
                                    <div className="d-flex flex-column gap-1">
                                        <code className="text-primary small"><i className="bi bi-card-text me-1"></i>DNI: {detalle.dniPagador}</code>
                                        {/* NUEVO CAMPO: EMAIL DEL PAGADOR */}
                                        <small className="text-muted">
                                            <i className="bi bi-envelope-at me-1"></i>
                                            {detalle.emailPagador || 'Sin correo registrado'}
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h6 className="label-detail"><i className="bi bi-info-circle me-1"></i> Resumen de Transacción</h6>
                                <div className="p-3 border rounded bg-light">
                                    <div className="row g-2 small">
                                        <div className="col-6 text-muted">Fecha Emisión:</div>
                                        <div className="col-6 fw-bold text-end">{detalle.fechaEmision}</div>
                                        
                                        <div className="col-6 text-muted">Cajero Responsable:</div>
                                        <div className="col-6 fw-bold text-end text-truncate">{detalle.cajeroNombreCompleto}</div>
                                        
                                        <div className="col-12"><hr className="my-2 opacity-50" /></div>
                                        
                                        <div className="col-6 text-muted">ID de Cita:</div>
                                        <div className="col-6 fw-bold text-end">#{detalle.idCita}</div>
                                        
                                        <div className="col-6 text-muted">Método:</div>
                                        <div className="col-6 fw-bold text-end text-primary">{detalle.metodoPago}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COLUMNA DERECHA: IMPORTES Y DETALLE MÉDICO */}
                        <div className="col-md-7">
                            <div className="row g-3 mb-4">
                                <div className="col-6">
                                    <h6 className="label-detail text-center">Importe Total</h6>
                                    <div className="value-box justify-content-center border-success border-opacity-25 bg-success bg-opacity-10">
                                        <span className="h4 mb-0 fw-bold text-success">S/ {parseFloat(detalle.monto).toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <h6 className="label-detail text-center">Telf. Contacto</h6>
                                    <div className="value-box justify-content-center border-primary border-opacity-25 bg-primary bg-opacity-10">
                                        <span className="h4 mb-0 fw-bold text-primary" style={{fontSize: '1.2rem'}}>{detalle.contactoPagador || '--'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h6 className="label-detail"><i className="bi bi-heart-pulse-fill me-1"></i> Paciente Atendido</h6>
                                <div className="motivo-container py-2 shadow-sm">
                                    <span className="fw-bold text-dark">{detalle.pacienteNombreCompleto}</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h6 className="label-detail"><i className="bi bi-person-badge me-1"></i> Médico Especialista</h6>
                                <div className="p-3 border rounded bg-white" style={{ borderLeft: '4px solid #3182ce' }}>
                                    <div className="fw-bold text-dark">Dr. {detalle.medicoNombreCompleto}</div>
                                    <small className="text-muted text-uppercase">Cita programada el {detalle.fechaCita} a las {detalle.horaCita}</small>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h6 className="label-detail"><i className="bi bi-chat-left-text me-1"></i> Motivo del Servicio</h6>
                                <div className="p-3 border rounded bg-white shadow-sm" style={{ whiteSpace: 'pre-wrap', minHeight: '60px', fontSize: '0.9rem' }}>
                                    {detalle.motivoCita || 'Consulta médica general.'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-none d-print-block mt-5 pt-5">
                    <div className="row text-center mt-5">
                        <div className="col-6">
                            <div className="border-top mx-4 pt-2 small">Sello Tesorería</div>
                        </div>
                        <div className="col-6">
                            <div className="border-top mx-4 pt-2 small">Recibí Conforme (Firma)</div>
                        </div>
                    </div>
                </div>

                <div className="footer-hospital text-center p-3 text-muted small border-top bg-light rounded-bottom">
                    <i className="bi bi-shield-check me-1"></i> Este comprobante es un documento digital válido únicamente para trámites internos en Clínica Santa Rosa.
                </div>
            </div>

            <style>{`
                @media print {
                    @page { margin: 0.8cm; }
                    body { background: white !important; font-size: 10pt !important; line-height: 1.2 !important; }
                    .page-container { margin: 0 !important; padding: 0 !important; max-width: 100% !important; width: 100% !important; }
                    .card-modern { box-shadow: none !important; border: 1px solid #eee !important; border-radius: 0 !important; }
                    .card-header-modern { background-color: #fff !important; border-bottom: 2px solid #000 !important; padding: 0.5rem 1rem !important; }
                    .card-body { padding: 0.8rem !important; }
                    .mb-4, .mb-5, .mt-5, .my-5 { margin-bottom: 0.5rem !important; margin-top: 0.5rem !important; }
                    .row { --bs-gutter-y: 0.3rem; --bs-gutter-x: 1rem; }
                    .value-box { border: 1px solid #ccc !important; background-color: #fff !important; min-height: 32px !important; padding: 0.2rem 0.5rem !important; font-size: 9pt !important; }
                    .motivo-container, .p-3, .p-4 { padding: 0.4rem 0.6rem !important; border: 1px solid #ccc !important; background-color: #fff !important; min-height: auto !important; }
                    .text-primary, .text-success, .text-danger, .text-info, .text-secondary { color: #000 !important; font-weight: bold; }
                    .d-print-none, .btn, .footer-hospital { display: none !important; }
                    .border-end-md { border-right: none !important; }
                }
                @media (min-width: 768px) {
                    .border-end-md { border-right: 1px solid #e2e8f0; }
                }
            `}</style>
        </div>
    );
};

export default DetalleComprobantePago;