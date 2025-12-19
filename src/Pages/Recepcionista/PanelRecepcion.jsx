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
          to="/recepcionista/pacientes"
          className="btn btn-primary"
        >
          📋 Listado de Pacientes
        </Link>

        <Link
          to="/recepcionista/registro"
          className="btn btn-success"
        >
          ➕ Registrar Nuevo Paciente
        </Link>
      </div>
    </div>
  );
};

export default PanelRecepcion;
