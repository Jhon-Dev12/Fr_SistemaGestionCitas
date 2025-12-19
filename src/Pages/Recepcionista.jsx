import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
const PanelRecepcion = () => {
    const navigate = useNavigate()
return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
        <LogoutButton />
      <h1>Bienvenido al Panel de Recepcionista</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", maxWidth: "400px", margin: "0 auto" }}>
        
        <button onClick={() => navigate("/citas")}>📅 Gestionar Citas</button>
        <button onClick={() => navigate("/pacientes")}>👥 Pacientes</button>

      </div>
    </div>
  );


};

export default PanelRecepcion ;
