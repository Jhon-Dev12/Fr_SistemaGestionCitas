import { Outlet, useNavigate, NavLink } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { useState, useEffect, useRef } from "react";
import "../Styles/Navbar.css"; 

const MedicoLayout = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Referencia para detectar clics fuera
  const [showDropdown, setShowDropdown] = useState(false); // Estado para el despliegue
  const IMAGES_URL = "http://localhost:8080/uploads/perfiles/";

  // Inicialización Lazy: Lee el localStorage una sola vez
  const [usuario] = useState(() => {
    const sesion = localStorage.getItem("usuario_sesion");
    return sesion ? JSON.parse(sesion) : null;
  });

  // Efecto para cerrar el menú al hacer clic fuera del área de perfil
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="layout-container">
      {/* HEADER / NAVBAR INSTITUCIONAL */}
      <header className="navbar-custom sticky-top">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          
          <div className="d-flex align-items-center">
            {/* Logo de la Clínica */}
            <div 
              className="navbar-brand me-4" 
              style={{ cursor: 'pointer' }} 
              onClick={() => navigate("/medico")}
            >
              <img src="/images/SantaRosa.png" alt="Logo" className="navbar-logo" />
            </div>

            {/* Navegación Principal del Médico */}
            <nav className="d-none d-lg-flex">
              <NavLink 
                to="/medico" 
                end 
                className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              >
                <i className="bi bi-house-door"></i> Inicio
              </NavLink>

              <NavLink 
                to="/medico/historial" 
                className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              >
                <i className="bi bi-clipboard2-pulse"></i> Historial
              </NavLink>

              <NavLink 
                to="/medico/agenda" 
                className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              >
                <i className="bi bi-calendar3"></i> Agenda
              </NavLink>
            </nav>
          </div>

          {/* Sección de Perfil del Médico */}
          {usuario && (
            <div className="d-flex align-items-center user-profile-section" ref={dropdownRef}>
              <div className="me-3 text-end d-none d-md-block">
                <div className="fw-semibold small" style={{ lineHeight: "1" }}>
                  Dr. {usuario.nombres} {usuario.apellidos}
                </div>
                <span className="role-badge">{usuario.rol}</span>
              </div>

              <div className="dropdown">
                {/* Botón de Perfil */}
                <button 
                  className="btn d-flex align-items-center border-0 p-0" 
                  type="button" 
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <img
                    className="user-avatar-nav"
                    src={usuario.imgPerfil ? `${IMAGES_URL}${encodeURIComponent(usuario.imgPerfil)}` : "/images/img_default.jpg"}
                    alt="Perfil"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/img_default.jpg";
                    }}
                  />
                  <i className="bi bi-chevron-down ms-2 small text-muted"></i>
                </button>
                
                {/* Menú Dropdown de Sesión */}
                <ul className={`dropdown-menu dropdown-menu-end shadow-sm border-0 p-2 mt-2 ${showDropdown ? 'show' : ''}`} 
                    style={{ position: 'absolute', right: 0 }}>
                  <li onClick={() => setShowDropdown(false)}>
                    <div className="dropdown-item rounded text-danger p-0">
                       <LogoutButton />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL DINÁMICO */}
      <main className="main-content">
        <div className="container-fluid px-md-5">
          {/* Animación de entrada para las vistas internas */}
          <div className="animate__animated animate__fadeIn">
            <Outlet />
          </div>
        </div>
      </main>

      {/* FOOTER UNIFICADO */}
      <footer className="footer-custom mt-auto">
        <div className="container text-center">
          <span className="text-muted small">
            © 2025 - <span className="fw-bold text-primary">Clínica Santa Rosa</span> | Panel de Gestión Médica
          </span>
        </div>
      </footer>
    </div>
  );
};

export default MedicoLayout;