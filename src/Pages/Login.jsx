import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../Services/authService";
import Swal from "sweetalert2";
import "../Styles/Login.css"; // Importamos el CSS separado

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showContainer, setShowContainer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShowContainer(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(username, password);
      const { rol } = res.data;

      localStorage.setItem("usuario_sesion", JSON.stringify(res.data));
      localStorage.setItem("roles", JSON.stringify([`ROLE_${rol}`]));
      localStorage.setItem("auth", "true");

      const routes = {
        ADMINISTRADOR: "/administrador",
        RECEPCIONISTA: "/recepcionista",
        CAJERO: "/cajero",
        MEDICO: "/medico",
      };

      navigate(routes[rol] || "/", { replace: true });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Acceso Denegado',
        text: 'Usuario o contraseña incorrectos',
        confirmButtonColor: '#3b82f6',
        customClass: { popup: 'rounded-4' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-body">
      <div 
        className="login-card" 
        style={{
          opacity: showContainer ? 1 : 0,
          transform: showContainer ? "translateY(0)" : "translateY(20px)"
        }}
      >
        {/* Logo */}
        <img src="/images/SantaRosa.png" alt="Logo Clínica" className="logo-main" />

        <h2 className="login-title">Centro de Control</h2>
        <p className="login-subtitle">Ingrese sus credenciales para continuar</p>

        <form onSubmit={handleSubmit} autoComplete="off">
          
          {/* Campo Usuario */}
          <div className="custom-input-group">
            <label htmlFor="username">Usuario</label>
            <div className="input-group">
              <span className="input-group-text input-group-text-custom">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                id="username"
                className="form-control form-control-custom"
                placeholder="ejem: admin_sr"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div className="custom-input-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text input-group-text-custom">
                <i className="bi bi-shield-lock"></i>
              </span>
              <input
                type="password"
                id="password"
                className="form-control form-control-custom"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-login-primary" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span> Cargando...</span>
              </>
            ) : (
              <>
                Ingresar al Sistema <i className="bi bi-chevron-right"></i>
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          &copy; 2025 <span className="brand-accent">Clínica Santa Rosa</span>
        </div>
      </div>
    </div>
  );
};

export default Login;