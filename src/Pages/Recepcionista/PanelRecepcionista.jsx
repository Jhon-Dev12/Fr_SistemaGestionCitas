import React from "react";
import RecepcionistaDashboard from "./RecepcionistaDashboard"; // El componente con las tablas y KPIs
import "../../Styles/Panel.css"; 

const PanelRecepcion = () => {
    // Recuperar sesión del localStorage
    const usuarioJson = localStorage.getItem("usuario_sesion");
    const usuario = usuarioJson ? JSON.parse(usuarioJson) : { nombres: "Recepcionista" };

    return (
        /* Aplicamos exactamente el mismo espaciado de 9rem para consistencia */
        <div className="container-fluid py-4" style={{ paddingLeft: '9rem', paddingRight: '9rem' }}>
            
            {/* HEADER DE BIENVENIDA - Estilo idéntico al Administrador */}
            <div className="d-flex justify-content-between align-items-center mb-5 animate__animated animate__fadeInDown">
                <div>
                    <h2 className="fw-bold text-dark mb-1">¡Hola, {usuario.nombres}!</h2>
                    <p className="text-muted mb-0">Monitor de atención y agenda para el día de hoy.</p>
                </div>
                
                <div className="text-end d-none d-md-block">
                    <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill border border-success border-opacity-25">
                        <i className="bi bi-calendar3 me-2"></i>
                        {new Date().toLocaleDateString('es-PE', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </span>
                </div>
            </div>

            {/* DASHBOARD DE RECEPCIÓN - Sustituye a la antigua cuadrícula de opciones */}
            <RecepcionistaDashboard />

        </div>
    );
};

export default PanelRecepcion;