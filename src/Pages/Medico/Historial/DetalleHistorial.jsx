import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerDetalleHistorial } from "../../../Services/HistorialService";
import "../../../Styles/DetalleCita.css"; // Reutilizamos el CSS del detalle

const DetalleHistorial = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [historial, setHistorial] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetalle = async () => {
            try {
                const response = await obtenerDetalleHistorial(id);
                setHistorial(response.data);
            } catch (error) {
                console.error("Error al obtener el historial:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetalle();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return (
        <div className="container mt-5 text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3 fw-bold text-muted">Cargando expediente médico...</p>
        </div>
    );

    if (!historial) return (
        <div className="container mt-5 text-center">
            <div className="alert alert-danger shadow-sm">Historial no encontrado.</div>
            <button onClick={() => navigate(-1)} className="btn btn-primary mt-3">Volver</button>
        </div>
    );

    return (
        <div className="container page-container pb-5">
            {/* ACCIONES SUPERIORES (Se ocultan al imprimir) */}
            <div className="d-flex justify-content-between align-items-center mb-4 d-print-none">
                <button onClick={() => navigate(-1)} className="btn btn-light border px-4 shadow-sm">
                    <i className="bi bi-arrow-left me-2"></i>Volver
                </button>
                <button onClick={handlePrint} className="btn btn-primary px-4 shadow-sm">
                    <i className="bi bi-printer-fill me-2"></i>Imprimir Ficha
                </button>
            </div>

            <div className="card card-modern shadow-sm animate__animated animate__fadeIn">
                
                {/* CABECERA */}
                <div className="card-header-modern d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="card-title">
                            <i className="bi bi-file-earmark-medical me-2 text-primary"></i>
                            Historial Clínico N° {historial.idHistorial}
                        </h5>
                        <div className="sub-header">Registro oficial de atención médica - ID Cita: {historial.idCita}</div>
                    </div>
                    <span className="badge bg-primary px-3 py-2 rounded-pill shadow-sm">EXPEDIENTE DIGITAL</span>
                </div>

                <div className="card-body p-4 p-md-5">
                    <div className="row g-5">
                        
                        {/* COLUMNA IZQUIERDA: DATOS GENERALES */}
                        <div className="col-md-5 border-end-md">
                            <div className="mb-4">
                                <h6 className="label-detail"><i className="bi bi-person-fill me-1"></i> Información del Paciente</h6>
                                <div className="value-box flex-column align-items-start mb-3">
                                    <span className="text-dark fw-bold">{historial.pacienteNombreCompleto}</span>
                                    <code className="text-primary small">DNI: {historial.pacienteDni}</code>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h6 className="label-detail"><i className="bi bi-calendar-check me-1"></i> Detalles de la Atención</h6>
                                <div className="p-3 border rounded bg-light">
                                    <div className="row g-2 small">
                                        <div className="col-6 text-muted">Fecha:</div>
                                        <div className="col-6 fw-bold text-end">{historial.fecha}</div>
                                        
                                        <div className="col-6 text-muted">Hora:</div>
                                        <div className="col-6 fw-bold text-end">{historial.hora}</div>
                                        
                                        <div className="col-12"><hr className="my-2 opacity-50" /></div>
                                        
                                        <div className="col-12 text-muted mb-1">Especialidad:</div>
                                        <div className="col-12 fw-bold text-primary mb-2">{historial.nombreEspecialidad}</div>
                                        
                                        <div className="col-12 text-muted mb-1">Médico Responsable:</div>
                                        <div className="col-12 fw-bold italic text-dark">Dr. {historial.nombreMedicoResponsable}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COLUMNA DERECHA: PARTE CLÍNICA */}
                        <div className="col-md-7">
                            
                            {/* Bloque de Triaje (Presión y Peso) */}
                            <div className="row g-3 mb-4">
                                <div className="col-6">
                                    <h6 className="label-detail text-center">Presión Arterial</h6>
                                    <div className="value-box justify-content-center border-danger border-opacity-25 bg-danger bg-opacity-10">
                                        <span className="h4 mb-0 fw-bold text-danger">{historial.presionArterial || '--'}</span>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <h6 className="label-detail text-center">Peso Corporal</h6>
                                    <div className="value-box justify-content-center border-primary border-opacity-25 bg-primary bg-opacity-10">
                                        <span className="h4 mb-0 fw-bold text-primary">{historial.peso} <small className="fs-6">kg</small></span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h6 className="label-detail"><i className="bi bi-chat-left-dots-fill me-1"></i> Motivo de Consulta</h6>
                                <div className="motivo-container py-2">
                                    <span className="fst-italic">"{historial.motivo}"</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h6 className="label-detail"><i className="bi bi-activity me-1"></i> Diagnóstico</h6>
                                <div className="p-3 border rounded bg-white shadow-sm" style={{ whiteSpace: 'pre-wrap', minHeight: '80px' }}>
                                    {historial.diagnostico || 'No especificado'}
                                </div>
                            </div>

                            <div className="mb-4">
                                <h6 className="label-detail text-success"><i className="bi bi-prescription2 me-1"></i> Tratamiento</h6>
                                <div className="p-3 border border-success border-opacity-25 rounded bg-success bg-opacity-10 shadow-sm" style={{ whiteSpace: 'pre-wrap', minHeight: '80px' }}>
                                    {historial.tratamiento}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* NOTAS ADICIONALES (Ancho completo abajo) */}
                    {historial.notasAdicionales && (
                        <div className="mt-4 p-3 bg-warning bg-opacity-10 border border-warning border-opacity-25 rounded">
                            <h6 className="fw-bold small text-uppercase mb-1"><i className="bi bi-info-circle"></i> Notas del Especialista</h6>
                            <p className="mb-0 small text-dark">{historial.notasAdicionales}</p>
                        </div>
                    )}
                </div>

                {/* PIE DE PÁGINA PARA IMPRESIÓN (Firma) */}
                <div className="d-none d-print-block mt-5 pt-5">
                    <div className="row text-center mt-5">
                        <div className="col-6">
                            <div className="border-top mx-4 pt-2 small">Firma del Médico Responsable</div>
                        </div>
                        <div className="col-6">
                            <div className="border-top mx-4 pt-2 small">Firma del Paciente</div>
                        </div>
                    </div>
                </div>

                <div className="footer-hospital text-center p-3 text-muted small border-top bg-light rounded-bottom">
                    <i className="bi bi-shield-lock me-1"></i> Documento confidencial generado por el Sistema de Gestión Clínica - Clínica Santa Rosa.
                </div>
            </div>

            <style>{`
                @media print {
                    @page { 
                        margin: 0.5cm; /* Margen mínimo para aprovechar la hoja */
                    }
                    
                    body { 
                        background: white !important; 
                        font-size: 9.5pt !important; /* Texto ligeramente más pequeño */
                        line-height: 1.1 !important; /* Interlineado compacto */
                    }

                    .page-container { 
                        margin: 0 !important; 
                        padding: 0 !important; 
                        max-width: 100% !important; 
                        width: 100% !important; 
                    }

                    .card-modern { 
                        box-shadow: none !important; 
                        border: 1px solid #eee !important; 
                        border-radius: 0 !important;
                    }

                    /* Cabecera ultra-compacta */
                    .card-header-modern { 
                        background-color: #fff !important; 
                        border-bottom: 1px solid #000 !important; 
                        padding: 0.3rem 0.8rem !important; 
                    }

                    .card-body {
                        padding: 0.5rem 1rem !important; /* Menos espacio interno */
                    }

                    /* Anulamos los márgenes de Bootstrap (mb-4, mt-5, etc.) para que todo suba */
                    .mb-3, .mb-4, .mb-5, .mt-4, .mt-5, .my-4, .my-5, .g-4, .g-5 { 
                        margin-bottom: 0.4rem !important; 
                        margin-top: 0.4rem !important; 
                    }

                    /* Forzamos que las filas de la rejilla no tengan tanto aire vertical */
                    .row {
                        --bs-gutter-y: 0.3rem !important;
                    }

                    /* Cajas de datos (Peso, Presión, etc.) */
                    .value-box { 
                        border: 1px solid #ccc !important; 
                        background-color: #fff !important; 
                        min-height: 30px !important; /* Altura mínima muy reducida */
                        padding: 0.2rem 0.5rem !important;
                    }

                    /* Contenedores de texto (Motivo, Diagnóstico, Tratamiento) */
                    .p-3, .p-4, .motivo-container { 
                        padding: 0.4rem !important; 
                        border: 1px solid #ccc !important; 
                        min-height: auto !important; /* Eliminamos el alto fijo */
                        margin-bottom: 0.3rem !important;
                    }

                    /* Etiquetas de detalle (Labels) */
                    .label-detail {
                        margin-bottom: 0.1rem !important;
                        font-size: 8pt !important;
                    }

                    /* Ocultar elementos que no van en papel */
                    .d-print-none, .btn, .footer-hospital { 
                        display: none !important; 
                    }

                    /* Forzar texto negro para que se lea bien en cualquier impresora */
                    .text-primary, .text-danger, .text-success, .text-info, .text-secondary { 
                        color: #000 !important; 
                        font-weight: bold;
                    }

                    /* Líneas divisorias más finas */
                    hr.divider-modern {
                        margin: 0.6rem 0 !important;
                        opacity: 0.5;
                    }

                    /* Espacio de firmas más pegado al final */
                    .mt-5.pt-5 {
                        margin-top: 1rem !important;
                        padding-top: 0.5rem !important;
                    }
                    
                    .border-end-md { 
                        border-right: none !important; 
                    }
                }

                @media (min-width: 768px) {
                    .border-end-md { border-right: 1px solid #e2e8f0; }
                }
            `}</style>
        </div>
    );
};

export default DetalleHistorial;