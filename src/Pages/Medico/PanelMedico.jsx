import { useNavigate } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton";
const PanelRecepcion = () => {
    const navigate = useNavigate()
return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>

      <h1>Bienvenido al Panel del Médico</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", maxWidth: "400px", margin: "0 auto" }}>
        
        <button onClick={() => navigate("/medico/historial")}>📅 Historial</button>
        <button onClick={() => navigate("/medico/agenda")}>👥 Agenda</button>

      </div>
    </div>
  );


};

export default PanelRecepcion ;
