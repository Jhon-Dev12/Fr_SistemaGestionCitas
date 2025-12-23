import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerAgendaMedico } from "../../../Services/AgendaService";

const ListadoAgenda = () => {
    const [agenda, setAgenda] = useState([]);
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            try {
                const response = await obtenerAgendaMedico(fecha);
                setAgenda(response.data);
            } catch (error) {
                console.error("Error al cargar la agenda:", error);
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, [fecha]);

    // Función para dar color a los estados del Enum EstadoSlotHorario
    const getBadgeStyle = (estado) => {
        switch (estado) {
            case 'DISPONIBLE': return 'bg-light text-dark border';
            case 'RESERVADO': return 'bg-info text-white';
            case 'OCUPADO': return 'bg-success text-white';
            case 'BLOQUEADO': return 'bg-danger text-white';
            default: return 'bg-secondary text-white';
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
                    <div>
                        <h4 className="mb-0 fw-bold text-dark">
                            <i className="bi bi-calendar-day me-2 text-primary"></i>Agenda de Consultas
                        </h4>
                        <small className="text-muted">Gestiona tus citas programadas para hoy</small>
                    </div>
                    <div className="d-flex align-items-center shadow-sm p-2 rounded bg-light">
                        <i className="bi bi-filter me-2"></i>
                        <input 
                            type="date" 
                            className="form-control form-control-sm border-0 bg-transparent fw-bold" 
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                        />
                    </div>
                </div>

                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-grow text-primary" role="status"></div>
                            <p className="mt-2 text-muted fw-medium">Sincronizando agenda...</p>
                        </div>
                    ) : agenda.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-cloud-slash fs-1 text-light"></i>
                            <p className="text-muted mt-3">No hay horarios configurados para esta fecha.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light text-muted">
                                    <tr>
                                        <th className="ps-4 py-3" style={{width: '120px'}}>HORA</th>
                                        <th>PACIENTE / MOTIVO</th>
                                        <th className="text-center">ESTADO SLOT</th>
                                        <th className="text-end pe-4">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {agenda.map((item, index) => (
                                        <tr key={index}>
                                            <td className="ps-4">
                                                <span className="fw-bold text-dark">{item.hora.substring(0, 5)}</span>
                                            </td>
                                            <td>
                                                {item.idCita ? (
                                                    <div>
                                                        <div className="fw-bold text-primary">{item.pacienteNombreCompleto}</div>
                                                        <div className="text-muted small">
                                                            <i className="bi bi-chat-left-text me-1"></i>
                                                            {item.motivo || 'Sin motivo especificado'}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted fst-italic">Sin cita asignada</span>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                <span className={`badge ${getBadgeStyle(item.estadoSlot)} px-3 py-2 uppercase`} style={{fontSize: '0.7rem'}}>
                                                    {item.estadoSlot}
                                                </span>
                                            </td>
                                            <td className="text-end pe-4">
                                                {item.idCita && item.estadoSlot === 'RESERVADO' && (
                                                    <>
                                                        {/* Solo mostramos el botón si la cita está confirmada (pagada) */}
                                                        {item.estadoCita === 'CONFIRMADO' ? (
                                                            <button 
                                                                className="btn btn-primary btn-sm rounded-pill px-3 shadow-sm"
                                                                onClick={() => navigate(`/medico/historial/nuevo?citaId=${item.idCita}`)}
                                                            >
                                                                <i className="bi bi-person-check-fill me-1"></i> Atender
                                                            </button>
                                                        ) : (
                                                            /* Si está reservado pero no confirmado (ej. falta pagar) */
                                                            <span className="badge bg-light text-warning border border-warning small">
                                                                Esperando Pago
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListadoAgenda;