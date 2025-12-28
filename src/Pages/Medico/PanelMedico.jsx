import React from "react";
import MedicoDashboard from "./MedicoDashboard"; // Componente con KPIs y agenda del día
import "../../Styles/Panel.css"; 

const PanelMedico = () => {
    // Recuperar sesión del localStorage de forma consistente
    const usuarioJson = localStorage.getItem("usuario_sesion");
    const usuario = usuarioJson ? JSON.parse(usuarioJson) : { nombres: "Médico" };

    return (
        /* Aplicamos el espaciado de 9rem para alineación perfecta con el resto del sistema */
        <div className="container-fluid py-4" style={{ paddingLeft: '9rem', paddingRight: '9rem' }}>
            
            {/* HEADER DE BIENVENIDA - Estilo unificado de alta dirección */}
            <div className="d-flex justify-content-between align-items-center mb-5 animate__animated animate__fadeInDown">
                <div>
                    <h2 className="fw-bold text-dark mb-1">¡Hola, Dr(a). {usuario.nombres}!</h2>
                    <p className="text-muted mb-0">Gestión de consultas y seguimiento de pacientes para hoy.</p>
                </div>
                
                <div className="text-end d-none d-md-block">
                    {/* Badge con tono azul médico para representar el área asistencial */}
                    <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill border border-primary border-opacity-25">
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

            {/* DASHBOARD MÉDICO - Reemplaza la antigua cuadrícula estática */}
            <MedicoDashboard />

        </div>
    );
};

export default PanelMedico;