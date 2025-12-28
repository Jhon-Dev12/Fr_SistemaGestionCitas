import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { buscarCitaPorId } from "../../../Services/CitaService";
import "../../../Styles/DetalleCita.css"; 

const DetalleCita = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cita, setCita] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        buscarCitaPorId(id)
            .then(res => {
                setCita(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                Swal.fire("Error", "No se pudo obtener la información de la cita.", "error");
                navigate("/recepcionista/cita");
            });
    }, [id, navigate]);

    const handlePrint = () => {
        window.print();
    };

    const getEstadoClass = (estado) => {
        const classes = {
            'PENDIENTE': 'st-pendiente',
            'CONFIRMADO': 'st-confirmado',
            'CANCELADO': 'st-cancelado',
            'ATENDIDO': 'st-atendido',
            'VENCIDO': 'st-vencido'
        };
        return classes[estado] || 'bg-secondary text-white';
    };

    if (loading) return (
        <div className="container mt-5 text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3 fw-bold text-muted">Sincronizando información de la cita...</p>
        </div>
    );

    return (
        <div className="container page-container pb-5">
            {/* ACCIONES SUPERIORES (Se ocultan al imprimir) */}
            <div className="d-flex justify-content-between align-items-center mb-4 d-print-none">
                <button onClick={() => navigate("/recepcionista/cita")} className="btn btn-light border px-4 shadow-sm">
                    <i className="bi bi-arrow-left me-2"></i>Volver al listado
                </button>
                <button onClick={handlePrint} className="btn btn-primary px-4 shadow-sm">
                    <i className="bi bi-printer-fill me-2"></i>Imprimir ticket
                </button>
            </div>

            <div className="card card-modern shadow-sm animate__animated animate__fadeIn">
                
                {/* CABECERA */}
                <div className="card-header-modern d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="card-title">
                            <i className="bi bi-calendar-check-fill me-2 text-primary"></i>
                            Hoja de Reserva N° {cita.idCita}
                        </h5>
                        <div className="sub-header">Información detallada de la programación médica</div>
                    </div>
                    <span className={`badge-status ${getEstadoClass(cita.estado)} shadow-sm`}>
                        {cita.estado}
                    </span>
                </div>

                <div className="card-body p-4 p-md-5">
                    <div className="row g-5">
                        
                        {/* COLUMNA IZQUIERDA: PACIENTE Y MÉDICO */}
                        <div className="col-md-5 border-end-md">
                            <div className="mb-4">
                                <h6 className="label-detail"><i className="bi bi-person-fill me-1"></i> Datos del Paciente</h6>
                                <div className="value-box flex-column align-items-start mb-3 shadow-sm bg-white">
                                    <span className="text-dark fw-bold" style={{fontSize: '1.1rem'}}>{cita.pacienteNombreCompleto}</span>
                                    <code className="text-primary fw-bold">DNI: {cita.pacienteDni}</code>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h6 className="label-detail"><i className="bi bi-person-badge-fill me-1"></i> Staff Médico</h6>
                                <div className="p-3 border rounded bg-white shadow-sm" style={{ borderLeft: '4px solid #3182ce' }}>
                                    <div className="fw-bold text-dark">Dr(a). {cita.medicoNombreCompleto}</div>
                                    <span className="badge bg-info-subtle text-info border border-info-subtle mt-1 text-uppercase" style={{fontSize: '0.65rem'}}>
                                        {cita.especialidadNombre}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-light rounded border">
                                <small className="text-muted d-block mb-1 small fw-bold">REGISTRADO POR:</small>
                                <div className="small text-secondary"><i className="bi bi-shield-lock me-1"></i>{cita.registradorNombreCompleto}</div>
                            </div>
                        </div>

                        {/* COLUMNA DERECHA: TIEMPO Y MOTIVO */}
                        <div className="col-md-7">
                            
                            {/* Bloque de Tiempo (Fecha y Hora) estilo "Triaje" */}
                            <div className="row g-3 mb-4">
                                <div className="col-6">
                                    <h6 className="label-detail text-center">Fecha Programada</h6>
                                    <div className="value-box justify-content-center border-primary border-opacity-25 bg-primary bg-opacity-10">
                                        <span className="h5 mb-0 fw-bold text-primary">{cita.fecha}</span>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <h6 className="label-detail text-center">Hora de Atención</h6>
                                    <div className="value-box justify-content-center border-info border-opacity-25 bg-info bg-opacity-10">
                                        <span className="h4 mb-0 fw-bold text-info">{cita.hora} <small className="fs-6">hs</small></span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h6 className="label-detail"><i className="bi bi-chat-left-text-fill me-1"></i> Motivo de la Consulta</h6>
                                <div className="motivo-container py-3 shadow-sm bg-white border">
                                    <span className="text-secondary" style={{lineHeight: '1.6'}}>
                                        {cita.motivo || "No se especificó un motivo para esta cita médica."}
                                    </span>
                                </div>
                            </div>

                            {/* Acciones de edición */}
                            <div className="d-print-none mt-5 pt-3 border-top d-flex justify-content-end">
                                {(cita.estado === 'PENDIENTE' || cita.estado === 'CONFIRMADO') && (
                                    <button 
                                        onClick={() => navigate(`/recepcionista/cita/editar/${cita.idCita}`)} 
                                        className="btn btn-primary px-5 shadow-sm"
                                        style={{backgroundColor: '#0d6efd', border: 'none'}}
                                    >
                                        <i className="bi bi-pencil-square me-2"></i>Reprogramar cita
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* PIE DE PÁGINA (Visible en impresión) */}
                <div className="d-none d-print-block mt-5 pt-4 text-center border-top mx-5">
                    <p className="small text-muted mb-0">Presentar este ticket en el módulo de recepción 15 minutos antes de su cita.</p>
                    <p className="fw-bold small">Clínica Santa Rosa - Comprometidos con su salud</p>
                </div>

                <div className="footer-hospital text-center p-3 text-muted small border-top bg-light rounded-bottom">
                    <i className="bi bi-info-circle me-1"></i> Visualización del registro digital de citas. No válido para trámites legales externos.
                </div>
            </div>

            <style>{`
                @media print {
                    @page { 
                        margin: 0.5cm; /* Reducción de margen de hoja */
                    }
                    
                    body { 
                        background: white !important; 
                        font-size: 10pt; /* Reducción global de fuente para impresión */
                    }

                    /* Contenedor principal sin márgenes superiores */
                    .page-container { 
                        margin: 0 !important; 
                        padding: 0 !important; 
                        max-width: 100% !important; 
                        width: 100% !important; 
                    }

                    /* Ajuste de la tarjeta */
                    .card-modern { 
                        box-shadow: none !important; 
                        border: 1px solid #eee !important; 
                        border-radius: 0 !important;
                    }

                    /* Cabecera más compacta */
                    .card-header-modern { 
                        background-color: #fff !important; 
                        border-bottom: 2px solid #000 !important; 
                        padding: 0.5rem 1rem !important; 
                    }

                    .card-body {
                        padding: 1rem !important; /* Reduce el espacio interno del contenido */
                    }

                    /* Reducción de espacios entre filas (Bootstrap mb-4, mb-5, g-4, etc) */
                    .mb-4, .mb-5, .mt-5, .my-5 { 
                        margin-bottom: 0.8rem !important; 
                        margin-top: 0.8rem !important; 
                    }
                    
                    .row {
                        --bs-gutter-y: 0.5rem; /* Reduce espacio vertical entre columnas */
                    }

                    /* Compactar cajas de valor (Triaje, Datos) */
                    .value-box { 
                        border: 1px solid #ccc !important; 
                        background-color: #fff !important; 
                        min-height: 35px !important; /* Altura mucho menor */
                        padding: 0.3rem 0.6rem !important;
                        font-size: 9pt !important;
                    }

                    .info-box-hours {
                        padding: 0.5rem !important;
                        margin-bottom: 1rem !important;
                    }

                    /* Motivo, Diagnóstico y Tratamiento */
                    .motivo-container, .p-3, .p-4 { 
                        padding: 0.5rem !important; 
                        border: 1px solid #ccc !important; 
                        background-color: #fff !important; 
                        min-height: auto !important; /* Quita el min-height de 80px */
                    }

                    /* Ocultar elementos innecesarios */
                    .d-print-none, .btn, .footer-hospital { 
                        display: none !important; 
                    }

                    /* Forzar texto negro para ahorro y legibilidad */
                    .text-primary, .text-info, .text-danger, .text-success, .text-secondary { 
                        color: #000 !important; 
                    }

                    .border-end-md { 
                        border-right: none !important; 
                    }

                    /* Pie de firma más pegado al contenido */
                    .mt-5.pt-5 {
                        margin-top: 1.5rem !important;
                        padding-top: 1rem !important;
                    }
                    
                    hr.divider-modern {
                        margin: 1rem 0 !important;
                    }
                }

                @media (min-width: 768px) {
                    .border-end-md { border-right: 1px solid #e2e8f0; }
                }
            `}</style>
        </div>
    );
};

export default DetalleCita;