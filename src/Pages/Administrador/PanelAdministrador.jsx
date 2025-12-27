import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton";
import "../../Styles/Panel.css"; 

const PanelAdministrador = () => {
  const navigate = useNavigate();
    const IMAGES_URL = "http://localhost:8080/uploads/perfiles/";
  
  // Recuperar sesión con fallback para imagen y datos
  const usuarioJson = localStorage.getItem("usuario_sesion");
  const usuario = usuarioJson ? JSON.parse(usuarioJson) : {
    nombres: "Administrador",
    rol: "ADMINISTRADOR",
    imgPerfil: "/images/img_default.jpg"
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

    const fotoPerfil = usuario.imgPerfil 
    ? `${IMAGES_URL}${usuario.imgPerfil}` 
    : "/images/img_default.jpg";

  const modulos = [
    {
      title: "Gestionar Usuarios",
      desc: "Administra las cuentas y permisos de los usuarios del sistema.",
      icon: "bi-person-lines-fill",
      path: "/administrador/usuario/nuevo"
    },
    {
      title: "Gestionar Médicos",
      desc: "Registra, edita y administra la información de los médicos.",
      icon: "bi-person-badge-fill",
      path: "/administrador/medico"
    },
    {
      title: "Gestionar Especialidades",
      desc: "Administra las áreas médicas y especialidades de la clínica.",
      icon: "bi-hospital-fill",
      path: "/administrador/especialidad"
    },
    {
      title: "Gestionar Horarios",
      desc: "Configura los horarios de atención médica y disponibilidad.",
      icon: "bi-clock-history",
      path: "/administrador/horario"
    },
    {
      title: "Consultar Logs",
      desc: "Revisa el historial de cambios y movimientos de las citas.",
      icon: "bi-journal-text",
      path: "/administrador/logcita"
    }
  ];

  return (
    <div className="panel-body">
      <div className="main-container">
        
        {/* Logo Superior - Igual al Recepcionista */}
        <div className="text-center mb-5">
          <img src="/images/SantaRosa.png" alt="Clinica SR" style={{ width: "230px" }} />
        </div>

        {/* Header de Usuario - Estructura exacta del ejemplo anterior */}
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
              <h2>¡Hola, {usuario.nombres}!</h2>
              <span className="role-badge">{usuario.rol}</span>
            </div>
          </div>

          {/* Usamos el LogoutButton que ya tienes */}
          <button onClick={handleLogout} className="logout-btn-combined">
            <span>Cerrar Sesión</span>
            <i className="bi bi-power"></i>
          </button>
        </div>

        {/* Grid de Opciones - El CSS con 'auto-fit' hará que se alineen solos */}
        <div className="options-grid">
          {modulos.map((modulo, index) => (
            <div 
              className="card-option" 
              key={index} 
              onClick={() => navigate(modulo.path)}
              style={{ cursor: 'pointer' }} // Asegura que el usuario sepa que es cliqueable
            >
              <i className={`bi ${modulo.icon} icon-display`}></i>
              <h4>{modulo.title}</h4>
              <p>{modulo.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer - Idéntico al Recepcionista */}
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

export default PanelAdministrador;