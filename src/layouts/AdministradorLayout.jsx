import { Outlet, useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { useState } from "react";

const AdministradorLayout = () => {
  const navigate = useNavigate();
  const IMAGES_URL = "http://localhost:8080/uploads/perfiles/";

  // 1. Iniciamos el estado como null
  const [usuario] = useState(() => {
    const sesion = localStorage.getItem("usuario_sesion");
    return sesion ? JSON.parse(sesion) : null;
  });

  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 25px",
          background: "#0d6efd",
          color: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ margin: 0 }}>Panel Administrador</h3>

        {usuario && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: "bold", fontSize: "0.95rem" }}>
                {usuario.nombres} {usuario.apellidos}
              </div>
              <div style={{ fontSize: "0.75rem", opacity: 0.9 }}>
                {usuario.rol}
              </div>
            </div>

            <div
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid white",
                background: "#e9ecef",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {usuario.imgPerfil ? (
                <img
                  // encodeURIComponent maneja caracteres especiales en el nombre del archivo
                  // t=${new Date().getTime()} rompe el caché del navegador para mostrar la foto nueva
                  src={`${IMAGES_URL}${encodeURIComponent(
                    usuario.imgPerfil
                  )}?t=${new Date().getTime()}`}
                  alt="Perfil"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${usuario.nombres}&background=random&color=fff`;
                  }}
                />
              ) : (
                <i
                  className="bi bi-person-circle"
                  style={{ fontSize: "2rem", color: "#6c757d" }}
                ></i>
              )}
            </div>
            <LogoutButton />
          </div>
        )}
      </header>

      <nav
        style={{
          display: "flex",
          gap: "10px",
          padding: "12px 20px",
          background: "#f8f9fa",
          borderBottom: "1px solid #dee2e6",
        }}
      >
        <button
          className="btn btn-sm btn-outline-primary shadow-sm"
          onClick={() => navigate("/administrador")}
        >
          <i className="bi bi-house-door me-1"></i> Inicio
        </button>
        <button
          className="btn btn-sm btn-outline-primary shadow-sm"
          onClick={() => navigate("/administrador/usuario/nuevo")}
        >
          <i className="bi bi-people me-1"></i> Usuarios
        </button>
        <button
          className="btn btn-sm btn-outline-primary shadow-sm"
          onClick={() => navigate("/administrador/medico")}
        >
          <i className="bi bi-person-md me-1"></i> Médicos
        </button>
        <button
          className="btn btn-sm btn-outline-primary shadow-sm"
          onClick={() => navigate("/administrador/especialidad")}
        >
          <i className="bi bi-mortarboard me-1"></i> Especialidades
        </button>
        <button
          className="btn btn-sm btn-outline-primary shadow-sm"
          onClick={() => navigate("/administrador/horario")}
        >
          <i className="bi bi-mortarboard me-1"></i> Horarios
        </button>
        <button
          className="btn btn-sm btn-outline-primary shadow-sm"
          onClick={() => navigate("/administrador/logcita")}
        >
          <i className="bi bi-journal-text me-1"></i> Log Citas
        </button>
      </nav>

      <main style={{ padding: "25px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdministradorLayout;
