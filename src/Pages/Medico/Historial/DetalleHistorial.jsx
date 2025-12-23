import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerDetalleHistorial } from "../../../Services/HistorialService";

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

    if (loading) return <div className="p-10 text-center text-secondary">Cargando...</div>;
    if (!historial) return <div className="p-10 text-center text-danger fw-bold">Historial no encontrado.</div>;

    // Función para imprimir solo el contenido de la ficha
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="container my-5">
            <div className="max-w-4xl mx-auto p-4 bg-white shadow rounded border border-light">
                
                {/* Cabecera - Oculta en impresión */}
                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4 d-print-none">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="btn btn-outline-primary btn-sm"
                    >
                        <i className="bi bi-arrow-left"></i> Volver
                    </button>
                    <h2 className="h5 mb-0">Ficha Médica Digital</h2>
                    <button onClick={handlePrint} className="btn btn-light btn-sm">
                        <i className="bi bi-printer"></i> Imprimir
                    </button>
                </div>

                {/* Título de la Ficha */}
                <div className="text-center mb-4">
                    <h1 className="h3 fw-bold uppercase">Historial Clínico #{historial.idHistorial}</h1>
                    <p className="text-muted small">ID Cita: {historial.idCita}</p>
                </div>

                <div className="row g-4">
                    {/* Columna Izquierda: Datos Generales */}
                    <div className="col-md-5">
                        <div className="p-3 border rounded bg-light mb-3">
                            <h6 className="fw-bold border-bottom pb-2 mb-3">
                                <i className="bi bi-person-fill"></i> Paciente
                            </h6>
                            <p className="mb-1 small text-muted">Nombre Completo</p>
                            <p className="fw-bold mb-3">{historial.pacienteNombreCompleto}</p>
                            <p className="mb-1 small text-muted">DNI</p>
                            <p className="fw-bold">{historial.pacienteDni}</p>
                        </div>

                        <div className="p-3 border rounded">
                            <h6 className="fw-bold border-bottom pb-2 mb-3">
                                <i className="bi bi-calendar-check"></i> Atención
                            </h6>
                            <div className="row">
                                <div className="col-6">
                                    <p className="mb-0 small text-muted">Fecha</p>
                                    <p className="fw-medium">{historial.fecha}</p>
                                </div>
                                <div className="col-6">
                                    <p className="mb-0 small text-muted">Hora</p>
                                    <p className="fw-medium">{historial.hora}</p>
                                </div>
                            </div>
                            <p className="mt-2 mb-0 small text-muted">Especialidad</p>
                            <p className="fw-medium mb-2">{historial.nombreEspecialidad}</p>
                            <p className="mb-0 small text-muted">Médico</p>
                            <p className="text-primary fw-bold">Dr. {historial.nombreMedicoResponsable}</p>
                        </div>
                    </div>

                    {/* Columna Derecha: Clínica */}
                    <div className="col-md-7">
                        {/* Triaje */}
                        <div className="d-flex gap-2 mb-4">
                            <div className="flex-fill p-2 border rounded text-center bg-white shadow-sm">
                                <small className="d-block text-muted text-uppercase">Presión</small>
                                <span className="h5 fw-bold text-danger">{historial.presionArterial || '--'}</span>
                            </div>
                            <div className="flex-fill p-2 border rounded text-center bg-white shadow-sm">
                                <small className="d-block text-muted text-uppercase">Peso</small>
                                <span className="h5 fw-bold">{historial.peso} <small>kg</small></span>
                            </div>
                        </div>

                        <div className="mb-4 p-3 border-start border-4 border-info bg-light rounded-end">
                            <h6 className="fw-bold text-info">Motivo de Consulta</h6>
                            <p className="fst-italic text-secondary small">"{historial.motivo}"</p>
                        </div>

                        <div className="mb-3">
                            <label className="fw-bold small text-uppercase text-muted">Diagnóstico</label>
                            <div className="p-3 border rounded bg-white mt-1" style={{ whiteSpace: 'pre-wrap', minHeight: '80px' }}>
                                {historial.diagnostico || 'No especificado'}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="fw-bold small text-uppercase text-muted">Tratamiento</label>
                            <div className="p-3 border rounded bg-white mt-1 border-success shadow-sm" style={{ whiteSpace: 'pre-wrap', minHeight: '80px' }}>
                                {historial.tratamiento}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notas Finales */}
                {historial.notasAdicionales && (
                    <div className="mt-4 p-3 bg-warning bg-opacity-10 border border-warning rounded">
                        <h6 className="fw-bold"><i className="bi bi-info-circle"></i> Notas Adicionales</h6>
                        <p className="mb-0 small">{historial.notasAdicionales}</p>
                    </div>
                )}
            </div>
            
            <style>{`
                @media print {
                    body { background: white !important; }
                    .container { width: 100% !important; max-width: none !important; margin: 0 !important; padding: 0 !important; }
                    .shadow, .shadow-sm { shadow: none !important; border: 1px solid #ddd !important; }
                    .d-print-none { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default DetalleHistorial;