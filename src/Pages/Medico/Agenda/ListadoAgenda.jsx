import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerAgendaMedico } from "../../../Services/AgendaService";
import "../../../Styles/ListadoAgenda.css";

const ListadoAgenda = () => {
    const [agenda, setAgenda] = useState([]);
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 1. Carga de datos memorizada
    const cargarDatos = useCallback(async (fechaSeleccionada) => {
        setLoading(true);
        try {
            const response = await obtenerAgendaMedico(fechaSeleccionada);
            setAgenda(response.data || []);
        } catch (error) {
            console.error("Error al cargar la agenda:", error);
            setAgenda([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // 2. Inicialización asíncrona (Fix ESLint)
    useEffect(() => {
        const inicializar = async () => {
            await cargarDatos(fecha);
        };
        inicializar();
    }, [fecha, cargarDatos]);

    const getBadgeClass = (estado) => {
        switch (estado) {
            case 'DISPONIBLE': return 'st-disponible';
            case 'RESERVADO': return 'st-reservado';
            case 'OCUPADO': return 'st-ocupado';
            case 'BLOQUEADO': return 'st-bloqueado';
            default: return 'bg-secondary text-white';
        }
    };

    return (
        <div className="page-container container-fluid px-4">
            <div className="card card-modern shadow-sm animate__animated animate__fadeIn">
                
                {/* CABECERA */}
                <div className="card-header-modern d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="card-title">
                            <i className="bi bi-calendar-check me-2 text-primary"></i>Agenda de Consultas
                        </h5>
                        <small className="text-muted">Gestión de citas programadas y disponibilidad</small>
                    </div>
                </div>

                {/* FILTRO DE FECHA INTEGRADO */}
                <div className="search-container-modern">
                    <div className="row">
                        <div className="col-md-4 col-lg-3">
                            <label className="form-label small fw-bold text-muted text-uppercase mb-1">Consultar Fecha:</label>
                            <div className="input-group search-group-modern shadow-sm">
                                <span className="input-group-text text-muted">
                                    <i className="bi bi-calendar-event"></i>
                                </span>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* CUERPO DE AGENDA */}
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p className="mt-2 text-muted small fw-bold uppercase">Actualizando agenda...</p>
                        </div>
                    ) : agenda.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <i className="bi bi-calendar-x d-block fs-1 mb-2 opacity-50"></i>
                            No hay horarios configurados para la fecha seleccionada.
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover table-modern mb-0">
                                <thead>
                                    <tr>
                                        <th style={{width: '150px'}}>Hora</th>
                                        <th>Paciente / Motivo de Consulta</th>
                                        <th className="text-center">Estado del Horario</th>
                                        <th className="text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {agenda.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="fw-bold text-dark fs-5">
                                                    <i className="bi bi-clock me-2 text-muted small"></i>
                                                    {item.hora.substring(0, 5)}
                                                </div>
                                            </td>
                                            <td>
                                                {item.idCita ? (
                                                    <div>
                                                        <div className="fw-bold text-primary">{item.pacienteNombreCompleto}</div>
                                                        <div className="text-muted small italic">
                                                            <i className="bi bi-chat-square-text me-1"></i>
                                                            {item.motivo || 'Sin motivo especificado'}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted small fst-italic">Cupo libre / Sin cita asignada</span>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                <span className={`badge-status ${getBadgeClass(item.estadoSlot)}`}>
                                                    {item.estadoSlot}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                {item.idCita && item.estadoSlot === 'RESERVADO' && (
                                                    <div className="d-flex flex-column align-items-end">
                                                        {/* CASO 1: CITA YA ATENDIDA */}
                                                        {item.estadoCita === 'ATENDIDO' ? (
                                                            <span className="badge rounded-pill bg-success-subtle text-success border border-success px-3 py-2 small fw-bold">
                                                                <i className="bi bi-check-all me-1"></i> ATENDIDO
                                                            </span>
                                                        ) : 
                                                        /* CASO 2: CITA CONFIRMADA (PAGADA) - LISTA PARA ATENDER */
                                                        item.estadoCita === 'CONFIRMADO' ? (
                                                            <button 
                                                                className="btn btn-primary btn-atender shadow-sm"
                                                                onClick={() => navigate(`/medico/historial/nuevo?citaId=${item.idCita}`)}
                                                            >
                                                                <i className="bi bi-person-video me-1"></i> Atender Cita
                                                            </button>
                                                        ) : 
                                                        /* CASO 3: CITA EN OTRO ESTADO (PENDIENTE DE PAGO) */
                                                        (
                                                            <span className="badge rounded-pill bg-light text-warning border border-warning px-3 py-2 small fw-bold">
                                                                <i className="bi bi-hourglass-split me-1"></i> PAGO PENDIENTE
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center p-3">
                    <button onClick={() => navigate("/medico")} className="btn btn-outline-secondary btn-sm px-3 shadow-sm">
                        <i className="bi bi-arrow-left-short"></i> Volver al Panel
                    </button>
                    <span className="text-muted small fw-medium">
                        Horarios en agenda: <span className="badge bg-primary rounded-pill">{agenda.length}</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ListadoAgenda;