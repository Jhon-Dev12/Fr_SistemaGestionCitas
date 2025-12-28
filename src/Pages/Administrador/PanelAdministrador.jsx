import React from "react";
import AdminDashboard from "./AdminDashboard"; // Importamos el nuevo componente
import "../../Styles/Panel.css"; 

const PanelAdministrador = () => {
  // Recuperar sesión
  const usuarioJson = localStorage.getItem("usuario_sesion");
  const usuario = usuarioJson ? JSON.parse(usuarioJson) : { nombres: "Administrador" };

  return (
<div className="container-fluid py-4" style={{ paddingLeft: '9rem', paddingRight: '9rem' }}>
      {/* HEADER DE BIENVENIDA */}
      <div className="d-flex justify-content-between align-items-center mb-5 animate__animated animate__fadeInDown">
        <div>
          <h2 className="fw-bold text-dark mb-1">¡Bienvenido, {usuario.nombres}!</h2>
          <p className="text-muted mb-0">Este es el estado actual de la Clínica Santa Rosa hoy.</p>
        </div>
        <div className="text-end d-none d-md-block">
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill border border-primary border-opacity-25">
                <i className="bi bi-calendar3 me-2"></i>
                {new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
        </div>
      </div>

      {/* DASHBOARD SUSTITUYENDO A LAS TARJETAS */}
      <AdminDashboard />

    </div>
  );
};

export default PanelAdministrador;