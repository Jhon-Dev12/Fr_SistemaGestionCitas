import React from "react";
import CajeroDashboard from "./CajeroDashBoard"; // El componente con KPIs de recaudación y tabla de pagos
import "../../Styles/Panel.css"; 

const PanelCajero = () => {
    // Recuperar sesión del localStorage (consistente con los otros paneles)
    const usuarioJson = localStorage.getItem("usuario_sesion");
    const usuario = usuarioJson ? JSON.parse(usuarioJson) : { nombres: "Cajero" };

    return (
        /* Mantener el espaciado de 9rem para una alineación perfecta en todo el sistema */
        <div className="container-fluid py-4" style={{ paddingLeft: '9rem', paddingRight: '9rem' }}>
            
            {/* HEADER DE BIENVENIDA - Estilo unificado */}
            <div className="d-flex justify-content-between align-items-center mb-5 animate__animated animate__fadeInDown">
                <div>
                    <h2 className="fw-bold text-dark mb-1">¡Bienvenido, {usuario.nombres}!</h2>
                    <p className="text-muted mb-0">Resumen financiero y flujo de caja para el turno de hoy.</p>
                </div>
                
                <div className="text-end d-none d-md-block">
                    {/* Badge verde esmeralda para representar el área de tesorería/caja */}
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

            {/* DASHBOARD DE CAJA - Sustituye a la antigua cuadrícula de opciones */}
            <CajeroDashboard />

        </div>
    );
};

export default PanelCajero;