import { Outlet, useNavigate, NavLink } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { useState, useEffect, useRef } from "react";
import "../Styles/Navbar.css"; 

const AdministradorLayout = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const IMAGES_URL = "http://localhost:8080/uploads/perfiles/";

  const [usuario] = useState(() => {
    const sesion = localStorage.getItem("usuario_sesion");
    return sesion ? JSON.parse(sesion) : null;
  });

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
      <header className="navbar-custom sticky-top">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          
          <div className="d-flex align-items-center">
            <div className="navbar-brand me-4" style={{ cursor: 'pointer' }} onClick={() => navigate("/administrador")}>
              <img src="/images/SantaRosa.png" alt="Logo" className="navbar-logo" />
            </div>

            <nav className="d-none d-lg-flex">
              {/* BOTÓN INICIO AGREGADO */}
              <NavLink 
                to="/administrador" 
                end 
                className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              >
                <i className="bi bi-house-door"></i> Inicio
              </NavLink>

              <NavLink to="/administrador/usuario/nuevo" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                <i className="bi bi-person-gear"></i> Usuarios
              </NavLink>
              <NavLink to="/administrador/medico" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                <i className="bi bi-person-vcard"></i> Médicos
              </NavLink>
              <NavLink to="/administrador/horario" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                <i className="bi bi-clock-history"></i> Horarios
              </NavLink>
              <NavLink to="/administrador/especialidad" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                <i className="bi bi-shield-plus"></i> Especialidades
              </NavLink>
              <NavLink to="/administrador/logcita" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                <i className="bi bi-journal-text"></i> Log Citas
              </NavLink>
            </nav>
          </div>

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
                    src={usuario.imgPerfil ? `${IMAGES_URL}${encodeURIComponent(usuario.imgPerfil)}` : "/images/default-user.jpg"}
                    alt="Perfil"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/default-user.jpg";
                    }}
                  />
                  <i className="bi bi-chevron-down ms-2 small text-muted"></i>
                </button>
                
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

      <main className="main-content">
        <div className="container-fluid px-md-5">
          <Outlet />
        </div>
      </main>

      <footer className="footer-custom mt-auto">
        <div className="container text-center">
          <span className="text-muted small">
            © 2025 - <span className="fw-bold text-primary">Clínica Santa Rosa</span> | Panel de Control Administrativo
          </span>
        </div>
      </footer>
    </div>
  );
};

export default AdministradorLayout;