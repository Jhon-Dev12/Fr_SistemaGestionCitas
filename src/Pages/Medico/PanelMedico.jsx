import React from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/Panel.css"; 

const PanelMedico = () => {
  const navigate = useNavigate();
  const IMAGES_URL = "http://localhost:8080/uploads/perfiles/";
  
  // Recuperar sesión con fallback para imagen y datos
  const usuarioJson = localStorage.getItem("usuario_sesion");
  const usuario = usuarioJson ? JSON.parse(usuarioJson) : {
    nombres: "Médico",
    rol: "MEDICO",
    imgPerfil: null
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  const fotoPerfil = usuario.imgPerfil 
    ? `${IMAGES_URL}${usuario.imgPerfil}` 
    : "/images/img_default.jpg";

  // Módulos específicos del Médico
  const modulos = [
    {
      title: "Historial Clínico",
      desc: "Consulta el historial de atenciones, diagnósticos y antecedentes de los pacientes.",
      icon: "bi-clipboard2-pulse-fill",
      path: "/medico/historial"
    },
    {
      title: "Agenda Médica",
      desc: "Revisa tus citas programadas, turnos y gestión de pacientes del día.",
      icon: "bi-calendar3",
      path: "/medico/agenda"
    }
  ];

  return (
    <div className="panel-body">
      <div className="main-container">
        
        {/* Logo Superior */}
        <div className="text-center mb-5">
          <img src="/images/SantaRosa.png" alt="Clinica SR" style={{ width: "230px" }} />
        </div>

        {/* Header de Usuario Unificado */}
        <div className="admin-header">
          <div className="user-info">
            <div className="profile-img-wrapper">
              <img 
                src={fotoPerfil} 
                alt="Perfil" 
                onError={(e) => { e.target.src = "/images/img_default.jpg"; }}
              />
            </div>
            <div className="welcome-text">
              <h2>¡Hola, Dr(a). {usuario.nombres}!</h2>
              <span className="role-badge">{usuario.rol}</span>
            </div>
          </div>

          <button onClick={handleLogout} className="logout-btn-combined">
            <span>Cerrar Sesión</span>
            <i className="bi bi-power"></i>
          </button>
        </div>

        {/* Grid de Opciones */}
        <div className="options-grid">
          {modulos.map((modulo, index) => (
            <div 
              className="card-option" 
              key={index} 
              onClick={() => navigate(modulo.path)}
              style={{ cursor: 'pointer' }}
            >
              <i className={`bi ${modulo.icon} icon-display`}></i>
              <h4>{modulo.title}</h4>
              <p>{modulo.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Unificado */}
      <footer className="panel-footer">
        <div className="container">
          <span className="text-muted small">
            © 2025 - <span className="fw-bold text-primary">Clínica Santa Rosa</span> | Panel de Control Médico
          </span>
        </div>
      </footer>
    </div>
  );
};

export default PanelMedico;