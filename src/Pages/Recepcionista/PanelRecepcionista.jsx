import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Styles/Panel.css";

const PanelRecepcion = () => {
  const navigate = useNavigate();
  const IMAGES_URL = "http://localhost:8080/uploads/perfiles/";
  
  // Obtenemos los datos del usuario logueado
  const usuarioJson = localStorage.getItem("usuario_sesion");
  const usuario = usuarioJson ? JSON.parse(usuarioJson) : { nombres: "Usuario", rol: "RECEPCIONISTA", imgPerfil: "/images/img_default.jpg" };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  const fotoPerfil = usuario.imgPerfil 
    ? `${IMAGES_URL}${usuario.imgPerfil}` 
    : "/images/img_default.jpg";

  return (
    <div className="panel-body">
      <div className="main-container">
        
        {/* Logo Superior */}
        <div className="text-center mb-5">
          <img src="/images/SantaRosa.png" alt="Clinica SR" style={{ width: "230px" }} />
        </div>

        {/* Header de Usuario */}
        <div className="admin-header">
          <div className="user-info">
            <div className="profile-img-wrapper">
              {/* Usamos la imagen del modelo o una por defecto */}
              <img 
                src={fotoPerfil} 
                alt="Perfil" 
                // Si la URL del backend falla (404), carga la local por defecto
                onError={(e) => { e.target.src = "/images/img_default.jpg"; }} 
              />
            </div>
            <div className="welcome-text">
              <h2>¡Hola, {usuario.nombres}!</h2>
              <span className="role-badge">{usuario.rol}</span>
            </div>
          </div>

          <button onClick={handleLogout} className="logout-btn-combined">
            <span>Cerrar Sesión</span>
            <i className="bi bi-power"></i>
          </button>
        </div>

        {/* Cuadros de Opciones */}
        <div className="options-grid">
          
          <Link to="/recepcionista/paciente" className="card-option">
            <i className="bi bi-person-vcard-fill icon-display"></i>
            <h4>Gestionar Pacientes</h4>
            <p>Registrar, editar y consultar la información de los pacientes.</p>
          </Link>

          <Link to="/recepcionista/cita" className="card-option">
            <i className="bi bi-calendar-check-fill icon-display"></i>
            <h4>Gestionar Citas</h4>
            <p>Revisa, programa o cancela las citas médicas de los pacientes.</p>
          </Link>

        </div>
      </div>

      {/* Footer */}
      <footer className="panel-footer">
        <div className="container">
          <span className="text-muted small">
            © 2025 - <span className="fw-bold text-primary">Clínica Santa Rosa</span> | Panel de Control Administrativo
          </span>
        </div>
      </footer>
    </div>
  );
};

export default PanelRecepcion;