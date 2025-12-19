import { useState } from "react";
import { registrarPaciente } from "../../../Services/PacienteService";
import { useNavigate } from "react-router-dom";

const RegistrarPaciente = () => {
  const [paciente, setPaciente] = useState({
    nombres: "",
    apellidos: "",
    dni: "",
    fechaNacimiento: "",
    telefono: "",
  });
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaciente({ ...paciente, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCargando(true);

    registrarPaciente(paciente)
      .then((res) => {
        alert("Paciente registrado con éxito");
        navigate("/recepcionista/pacientes"); // redirige al listado
      })
      .catch((err) => {
        console.error("Error al registrar paciente", err);
        alert("Error al registrar paciente");
      })
      .finally(() => setCargando(false));
  };

  return (
    <div className="container mt-4">
      <h2>Registrar Nuevo Paciente</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nombres</label>
          <input
            type="text"
            className="form-control"
            name="nombres"
            value={paciente.nombres}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Apellidos</label>
          <input
            type="text"
            className="form-control"
            name="apellidos"
            value={paciente.apellidos}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>DNI</label>
          <input
            type="text"
            className="form-control"
            name="dni"
            value={paciente.dni}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Fecha de Nacimiento</label>
          <input
            type="date"
            className="form-control"
            name="fechaNacimiento"
            value={paciente.fechaNacimiento}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Teléfono</label>
          <input
            type="text"
            className="form-control"
            name="telefono"
            value={paciente.telefono}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={cargando}>
          {cargando ? "Guardando..." : "Registrar Paciente"}
        </button>
      </form>
    </div>
  );
};

export default RegistrarPaciente;
