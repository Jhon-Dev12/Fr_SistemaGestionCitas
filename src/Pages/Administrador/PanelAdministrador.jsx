import { useNavigate } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton";

const PanelAdministrador = () => {
    const navigate = useNavigate()
return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Bienvenido al Panel de Adminsitrador</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", maxWidth: "400px", margin: "0 auto" }}>
        <button onClick={() => navigate("/administrador/usuario/nuevo")}> Gestionar Usuarios</button>
        <button onClick={() => navigate("/administrador/medico")}> Gestionar Medicos</button>
        <button onClick={() => navigate("/administrador/especialidad")}> Gestionar Especialidades</button>
        <button onClick={() => navigate("/administrador/horario")}> Gestionar Horarios</button>

        <button onClick={() => navigate("/administrador/logcita")}> Consultar logs</button>
      </div>
    </div>
  );
};

export default PanelAdministrador;
