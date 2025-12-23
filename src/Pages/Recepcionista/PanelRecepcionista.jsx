import { Link } from "react-router-dom";

const PanelRecepcion = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Bienvenido al Panel de Recepcionista</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        <Link
          to="/recepcionista/paciente"
          className="btn btn-primary"
        >
          📋 Gestionar Pacientes
        </Link>

        <Link
          to="/recepcionista/cita"
          className="btn btn-success"
        >
          ➕ Gestionar Citas
        </Link>
      </div>
    </div>
  );
};

export default PanelRecepcion;
