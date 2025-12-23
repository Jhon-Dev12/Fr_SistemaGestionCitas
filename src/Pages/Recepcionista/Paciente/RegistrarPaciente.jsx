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

  const navigate = useNavigate();

  // ESTADOS DE ERROR Y CARGA (Consistentes con tus otros módulos)
  const [cargando, setCargando] = useState(false);
  const [erroresServidor, setErroresServidor] = useState({});
  const [mensajeGlobal, setMensajeGlobal] = useState({ texto: "", tipo: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaciente({ ...paciente, [name]: value });

    // Limpiar el error del campo específico cuando el usuario vuelve a escribir
    if (erroresServidor[name]) {
      setErroresServidor((prev) => {
        const nuevosErrores = { ...prev };
        delete nuevosErrores[name];
        return nuevosErrores;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCargando(true);
    setErroresServidor({});
    setMensajeGlobal({ texto: "", tipo: "" });

    registrarPaciente(paciente)
      .then((res) => {
        alert("Paciente registrado con éxito");
        navigate("/recepcionista/paciente");
      })
      .catch((err) => {
        console.error("Error al registrar paciente", err);
        if (err.response && err.response.data) {
          const data = err.response.data;

          // 1. Captura mapa de errores (@Valid del Backend)
          if (data.errores) {
            setErroresServidor(data.errores);
          }

          // 2. Captura mensaje global (ej: "DNI ya existe")
          setMensajeGlobal({
            texto: data.mensaje || "Error al registrar el paciente",
            tipo: "danger",
          });
        } else {
          setMensajeGlobal({
            texto: "No hay conexión con el servidor",
            tipo: "danger",
          });
        }
      })
      .finally(() => setCargando(false));
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary">
        <i className="bi bi-person-plus-fill me-2"></i>Registrar Nuevo Paciente
      </h2>

      {/* ALERTA GLOBAL */}
      {mensajeGlobal.texto && (
        <div
          className={`alert alert-${mensajeGlobal.tipo} alert-dismissible fade show shadow-sm`}
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {mensajeGlobal.texto}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMensajeGlobal({ texto: "", tipo: "" })}
          ></button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="card p-4 shadow-sm border-0 bg-white"
      >
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold text-secondary">Nombres</label>
            <input
              type="text"
              className={`form-control ${
                erroresServidor.nombres ? "is-invalid" : ""
              }`}
              name="nombres"
              value={paciente.nombres}
              onChange={handleChange}
              placeholder="Ej: Juan Pedro"
            />
            {erroresServidor.nombres && (
              <div className="invalid-feedback">{erroresServidor.nombres}</div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold text-secondary">
              Apellidos
            </label>
            <input
              type="text"
              className={`form-control ${
                erroresServidor.apellidos ? "is-invalid" : ""
              }`}
              name="apellidos"
              value={paciente.apellidos}
              onChange={handleChange}
              placeholder="Ej: Pérez García"
            />
            {erroresServidor.apellidos && (
              <div className="invalid-feedback">
                {erroresServidor.apellidos}
              </div>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold text-secondary">DNI</label>
            <input
              type="text"
              className={`form-control ${
                erroresServidor.dni ? "is-invalid" : ""
              }`}
              name="dni"
              value={paciente.dni}
              onChange={handleChange}
              maxLength="8"
              placeholder="8 dígitos"
            />
            {erroresServidor.dni && (
              <div className="invalid-feedback">{erroresServidor.dni}</div>
            )}
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold text-secondary">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              className={`form-control ${
                erroresServidor.fechaNacimiento ? "is-invalid" : ""
              }`}
              name="fechaNacimiento"
              value={paciente.fechaNacimiento}
              onChange={handleChange}
            />
            {erroresServidor.fechaNacimiento && (
              <div className="invalid-feedback">
                {erroresServidor.fechaNacimiento}
              </div>
            )}
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold text-secondary">
              Teléfono
            </label>
            <input
              type="text"
              className={`form-control ${
                erroresServidor.telefono ? "is-invalid" : ""
              }`}
              name="telefono"
              value={paciente.telefono}
              onChange={handleChange}
              maxLength="9"
              placeholder="Ej: 987654321"
            />
            {erroresServidor.telefono && (
              <div className="invalid-feedback">{erroresServidor.telefono}</div>
            )}
          </div>
        </div>

        <div className="d-flex gap-2 mt-3">
          <button
            type="submit"
            className="btn btn-primary px-4 fw-bold shadow-sm"
            disabled={cargando}
          >
            {cargando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                REGISTRANDO...
              </>
            ) : (
              "REGISTRAR PACIENTE"
            )}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary px-4"
            onClick={() => navigate("/recepcionista/paciente")}
          >
            CANCELAR
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrarPaciente;
