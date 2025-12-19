import { Outlet, useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

const RecepcionistaLayout = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* HEADER */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 20px",
          background: "#0d6efd",
          color: "white",
        }}
      >
        <h3>Panel Recepcionista</h3>
        <LogoutButton />
      </header>

      {/* MENÚ */}
      <nav
        style={{
          display: "flex",
          gap: "15px",
          padding: "10px 20px",
          background: "#f1f1f1",
        }}
      >
        <button onClick={() => navigate("/recepcionista")}>🏠 Inicio</button>
        <button onClick={() => navigate("/recepcionista/pacientes")}>👥 Pacientes</button>
        <button onClick={() => navigate("/recepcionista/citas")}>📅 Citas</button>
      </nav>

      {/* CONTENIDO DINÁMICO */}
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default RecepcionistaLayout;
