import { Outlet, useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { useState } from "react";

const MedicoLayout = () => {
  const navigate = useNavigate();
  const IMAGES_URL = "http://localhost:8080/uploads/perfiles/";

  // Inicialización optimizada para evitar re-renders y advertencias de ESLint
  const [usuario] = useState(() => {
    const sesion = localStorage.getItem("usuario_sesion");
    return sesion ? JSON.parse(sesion) : null;
  });

  return (
    <div>
      {/* HEADER */}
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
        <h3 style={{ margin: 0 }}>Panel Médico</h3>

        {/* SECCIÓN DE PERFIL CON FALLBACK */}
        {usuario && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: "bold", fontSize: "0.95rem" }}>
                Dr. {usuario.nombres} {usuario.apellidos}
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
                  src={`${IMAGES_URL}${usuario.imgPerfil}`}
                  alt="Perfil"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    // Avatar con iniciales si la imagen no carga desde el servidor
                    e.target.src = `https://ui-avatars.com/api/?name=${usuario.nombres}+${usuario.apellidos}&background=0D6EFD&color=fff`;
                  }}
                />
              ) : (
                // Icono por defecto si no tiene imagen registrada
                <i
                  className="bi bi-person-circle"
                  style={{ fontSize: "1.8rem", color: "#6c757d" }}
                ></i>
              )}
            </div>
            <LogoutButton />
          </div>
        )}
      </header>

      {/* MENÚ */}
      <nav
        style={{
          display: "flex",
          gap: "15px",
          padding: "12px 20px",
          background: "#f8f9fa",
          borderBottom: "1px solid #dee2e6",
        }}
      >
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => navigate("/medico")}
        >
          🏠 Inicio
        </button>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => navigate("/medico/historial")}
        >
          📋 Historial
        </button>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => navigate("/medico/agenda")}
        >
          📅 Agenda
        </button>
      </nav>

      {/* CONTENIDO DINÁMICO */}
      <main style={{ padding: "25px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default MedicoLayout;
