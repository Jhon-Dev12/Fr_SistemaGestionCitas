import { Outlet, useNavigate, NavLink } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { useState, useEffect, useRef } from "react";
import "../Styles/Navbar.css"; 

const RecepcionistaLayout = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Referencia para detectar clics fuera
  const [showDropdown, setShowDropdown] = useState(false); // Estado para el despliegue
  const IMAGES_URL = "http://localhost:8080/uploads/perfiles/";

  // Inicialización Lazy de la sesión
  const [usuario] = useState(() => {
    const sesion = localStorage.getItem("usuario_sesion");
    return sesion ? JSON.parse(sesion) : null;
  });

  // Efecto para cerrar el menú al hacer clic fuera
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
      {/* HEADER / NAVBAR */}
      <header className="navbar-custom sticky-top">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          
          <div className="d-flex align-items-center">
            {/* Logo */}
            <div 
              className="navbar-brand me-4" 
              style={{ cursor: 'pointer' }} 
              onClick={() => navigate("/recepcionista")}
            >
              <img src="/images/SantaRosa.png" alt="Logo" className="navbar-logo" />
            </div>

            {/* Navegación Principal del Recepcionista */}
            <nav className="d-none d-lg-flex">
              <NavLink 
                to="/recepcionista" 
                end 
                className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              >
                <i className="bi bi-house-door"></i> Inicio
              </NavLink>

              <NavLink 
                to="/recepcionista/paciente" 
                className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              >
                <i className="bi bi-people"></i> Pacientes
              </NavLink>

              <NavLink 
                to="/recepcionista/cita" 
                className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              >
                <i className="bi bi-calendar-event"></i> Citas
              </NavLink>
            </nav>
          </div>

          {/* Perfil de Usuario con Dropdown */}
          {usuario && (
            <div className="d-flex align-items-center user-profile-section" ref={dropdownRef}>
              <div className="me-3 text-end d-none d-md-block">
                <div className="fw-semibold small" style={{ lineHeight: "1" }}>
                  {usuario.nombres} {usuario.apellidos}
                </div>
                <span className="role-badge">{usuario.rol}</span>
              </div>

              <div className="dropdown">
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
                
                {/* Menú Desplegable */}
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

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        <div className="container-fluid px-md-5">
          <div className="animate__animated animate__fadeIn">
            <Outlet />
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer-custom mt-auto">
        <div className="container text-center">
          <span className="text-muted small">
            © 2025 - <span className="fw-bold text-primary">Clínica Santa Rosa</span> | Panel de Control Recepcionista
          </span>
        </div>
      </footer>
    </div>
  );
};

export default RecepcionistaLayout;