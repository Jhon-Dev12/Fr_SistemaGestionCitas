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
            <p className="mt-3 fw-bold text-muted">Sincronizando expediente...</p>
        </div>
    );

    return (
        <div className="container page-container pb-5">
            <div className="card card-modern shadow-sm animate__animated animate__fadeIn">
                
                {/* CABECERA CON ESTADO PROMINENTE */}
                <div className="card-header-modern d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="card-title">
                            <i className="bi bi-file-earmark-medical-fill me-2 text-primary"></i>
                            Resumen de Cita Médica N° {cita.idCita}
                        </h5>
                    </div>
                    <span className={`badge-status ${getEstadoClass(cita.estado)} shadow-sm`}>
                        {cita.estado}
                    </span>
                </div>

                <div className="card-body p-4 p-md-5">
                    
                    {/* FILA 1: PACIENTE Y MÉDICO */}
                    <div className="row g-4">
                        <div className="col-md-6">
                            <h6 className="label-detail"><i className="bi bi-person-circle me-1"></i> Información del Paciente</h6>
                            <div className="value-box flex-column align-items-start">
                                <span className="text-dark">{cita.pacienteNombreCompleto}</span>
                                <code className="text-primary small" style={{fontWeight: 600}}>DNI: {cita.pacienteDni}</code>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h6 className="label-detail"><i className="bi bi-person-badge-fill me-1"></i> Staff Médico Responsable</h6>
                            <div className="value-box flex-column align-items-start">
                                <span className="text-dark">Dr(a). {cita.medicoNombreCompleto}</span>
                                <span className="badge bg-info-subtle text-info border border-info-subtle mt-1" style={{fontSize: '0.7rem'}}>
                                    {cita.especialidadNombre}
                                </span>
                            </div>
                        </div>
                    </div>

                    <hr className="divider-modern" />

                    {/* FILA 2: FECHA, HORA Y AUDITORÍA */}
                    <div className="row g-4">
                        <div className="col-md-4">
                            <h6 className="label-detail"><i className="bi bi-calendar-check me-1"></i> Fecha Programada</h6>
                            <div className="value-box">
                                <i className="bi bi-calendar3 me-2 text-muted"></i>
                                {cita.fecha}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <h6 className="label-detail"><i className="bi bi-clock me-1"></i> Hora de Atención</h6>
                            <div className="value-box">
                                <i className="bi bi-alarm me-2 text-muted"></i>
                                {cita.hora} hs
                            </div>
                        </div>
                        <div className="col-md-4">
                            <h6 className="label-detail"><i className="bi bi-shield-lock me-1"></i> Registrado Por</h6>
                            <div className="value-box" style={{fontSize: '0.9rem', color: '#718096'}}>
                                {cita.registradorNombreCompleto}
                            </div>
                        </div>
                    </div>

                    <div className="mt-5">
                        <h6 className="label-detail"><i className="bi bi-chat-right-text me-1"></i> Motivo de la Consulta</h6>
                        <div className="motivo-container border">
                            {cita.motivo || "No se especificó un motivo para esta cita médica."}
                        </div>
                    </div>

                    {/* BOTONERA DE ACCIONES */}
                    <div className="d-flex justify-content-between mt-5 pt-4 border-top">
                        <button 
                            onClick={() => navigate("/recepcionista/cita")} 
                            className="btn btn-light border px-4 shadow-sm"
                        >
                            <i className="bi bi-arrow-left me-1"></i> Volver al listado
                        </button>
                        
                        {(cita.estado === 'PENDIENTE' || cita.estado === 'CONFIRMADO') && (
                            <button 
                                onClick={() => navigate(`/recepcionista/cita/editar/${cita.idCita}`)} 
                                className="btn btn-primary px-5 shadow-sm"
                                style={{backgroundColor: '#0d6efd', border: 'none'}}
                            >
                                <i className="bi bi-pencil-square me-1"></i> Reprogramar Cita
                            </button>
                        )}
                    </div>
                </div>

                <div className="footer-hospital text-center p-3 text-muted small border-top bg-light rounded-bottom">
                    <i className="bi bi-info-circle me-1"></i> Este documento es una visualización del registro digital de citas de la Clínica Santa Rosa.
                </div>
            </div>
        </div>
    );
};

export default DetalleCita;