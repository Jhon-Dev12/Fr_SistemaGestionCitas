import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../../../components/LogoutButton";
import {
  listarCitas,
  buscarCitasPorCriterio,
  anularCita,
} from "../../../Services/CitaService";

const ListadoCita = () => {
  const [citas, setCitas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate();

  const cargarDatos = (criterio = "") => {
    const peticion = criterio
      ? buscarCitasPorCriterio(criterio)
      : listarCitas();

    peticion
      .then((res) => setCitas(res.data || []))
      .catch((err) => console.error("Error al cargar citas:", err));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleSearch = (e) => {
    const valor = e.target.value;
    setFiltro(valor);
    cargarDatos(valor);
  };

  const handleAnular = (id) => {
    if (window.confirm("¿Estás seguro de que deseas anular esta cita?")) {
      anularCita(id)
        .then(() => {
          alert("¡Cita anulada correctamente!");
          cargarDatos(filtro);
        })
        .catch((err) => {
          const msg = err.response?.data?.message || "Error al intentar anular la cita";
          alert(msg);
        });
    }
  };

  const getEstadoStyle = (estado) => {
    const colors = {
      PENDIENTE: { bg: "#fff3cd", color: "#856404" },
      CONFIRMADO: { bg: "#d4edda", color: "#155724" },
      PAGADO: { bg: "#cce5ff", color: "#004085" },
      CANCELADO: { bg: "#f8d7da", color: "#721c24" },
      VENCIDO: { bg: "#e2e3e5", color: "#383d41" },
      ATENDIDO: { bg: "#d1ecf1", color: "#0c5460" },
      NO_ATENDIDO: { bg: "#f5c6cb", color: "#721c24" },
    };
    return colors[estado] || { bg: "#eee", color: "#333" };
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Módulo de Gestión de Citas</h1>
      </div>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Buscar por paciente, médico o DNI..."
          value={filtro}
          onChange={handleSearch}
          style={{ padding: "10px", width: "400px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button
          onClick={() => navigate("/recepcionista/cita/nuevo")}
          style={{ cursor: "pointer", padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold" }}
        >
          Registrar Nueva Cita
        </button>
      </div>

      <table border="1" style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
        <thead>
          <tr style={{ backgroundColor: "#333", color: "white", textAlign: "left" }}>
            <th style={{ padding: "12px" }}>ID</th>
            <th style={{ padding: "12px" }}>Fecha / Hora</th>
            <th style={{ padding: "12px" }}>DNI Paciente</th>
            <th style={{ padding: "12px" }}>Paciente</th>
            <th style={{ padding: "12px" }}>Médico</th>
            <th style={{ padding: "12px" }}>Estado</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.length > 0 ? (
            citas.map((c) => (
              <tr key={c.idCita} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "12px" }}>{c.idCita}</td>
                <td style={{ padding: "12px" }}>
                  <strong>{c.fecha}</strong><br /><small>{c.hora}</small>
                </td>
                <td style={{ padding: "12px" }}>{c.dniPaciente}</td>
                <td style={{ padding: "12px" }}>{c.nombreCompletoPaciente}</td>
                <td style={{ padding: "12px" }}>{c.nombreCompletoMedico}</td>
                <td style={{ padding: "12px" }}>
                  <span style={{
                    padding: "4px 10px", borderRadius: "10px", fontSize: "0.8em", fontWeight: "bold",
                    backgroundColor: getEstadoStyle(c.estado).bg, color: getEstadoStyle(c.estado).color,
                  }}>
                    {c.estado}
                  </span>
                </td>
                <td style={{ padding: "12px", display: "flex", gap: "5px", justifyContent: "center" }}>
                  <button
                    onClick={() => navigate(`/recepcionista/cita/detalle/${c.idCita}`)}
                    style={{ padding: "5px 10px", cursor: "pointer", backgroundColor: "#17a2b8", color: "white", border: "none", borderRadius: "4px" }}
                  >
                    Detalle
                  </button>
                  
                  {/* BOTÓN EDITAR: Bloqueado si no es PENDIENTE o CONFIRMADO */}
                  <button
                    onClick={() => navigate(`/recepcionista/cita/editar/${c.idCita}`)}
                    disabled={c.estado !== "PENDIENTE" && c.estado !== "CONFIRMADO"}
                    style={{
                      padding: "5px 10px", borderRadius: "4px", fontWeight: "500",
                      cursor: (c.estado === "PENDIENTE" || c.estado === "CONFIRMADO") ? "pointer" : "not-allowed",
                      backgroundColor: (c.estado === "PENDIENTE" || c.estado === "CONFIRMADO") ? "#fff" : "#f1f1f1",
                      color: (c.estado === "PENDIENTE" || c.estado === "CONFIRMADO") ? "#333" : "#aaa",
                      border: "1px solid #ccc"
                    }}
                  >
                    Editar
                  </button>

                  {/* BOTÓN ANULAR: Bloqueado si no es PENDIENTE */}
                  <button
                    onClick={() => handleAnular(c.idCita)}
                    disabled={c.estado !== "PENDIENTE"}
                    style={{
                      padding: "5px 10px", borderRadius: "4px", fontWeight: "500",
                      cursor: c.estado === "PENDIENTE" ? "pointer" : "not-allowed",
                      backgroundColor: c.estado === "PENDIENTE" ? "#dc3545" : "#e9ecef",
                      color: c.estado === "PENDIENTE" ? "white" : "#adb5bd",
                      border: c.estado === "PENDIENTE" ? "none" : "1px solid #dee2e6",
                    }}
                    title={c.estado !== "PENDIENTE" ? "Solo se pueden anular citas pendientes" : "Anular Cita"}
                  >
                    Anular
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                No se encontraron citas registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListadoCita;