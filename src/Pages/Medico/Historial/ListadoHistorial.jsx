import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  listarTodosLosHistoriales,
  buscarHistoriales,
} from "../../../Services/HistorialService";
import "../../../Styles/ListadoHistorial.css";

const ListadoHistorialMedico = () => {
  const [historiales, setHistoriales] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. Carga de datos memorizada
  const cargarDatos = useCallback(async (criterio = "") => {
    setLoading(true);
    try {
      const peticion = criterio
        ? await buscarHistoriales(criterio)
        : await listarTodosLosHistoriales();
      setHistoriales(peticion.data || []);
    } catch (err) {
      console.error("Error al cargar historiales:", err);
      setHistoriales([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGenerarPDF = (e) => {
    // Construimos la URL con el filtro actual para que el PDF sea dinámico
    e.currentTarget.blur();
    const baseURL = "http://localhost:8080/api/medico/historiales/reporte/pdf";
    const url = filtro
      ? `${baseURL}?criterio=${encodeURIComponent(filtro)}`
      : baseURL;

    // Abrimos en una nueva pestaña para que el navegador gestione la visualización o descarga
    window.open(url, "_blank");
  };

  // 2. Inicialización asíncrona (Fix ESLint)
  useEffect(() => {
    const inicializar = async () => {
      await cargarDatos();
    };
    inicializar();
  }, [cargarDatos]);

  const handleSearch = (e) => {
    const valor = e.target.value;
    setFiltro(valor);
    cargarDatos(valor);
  };

  return (
    <div className="page-container container-fluid px-4">
      <div className="card card-modern shadow-sm animate__animated animate__fadeIn">
        {/* CABECERA */}
        <div className="card-header-modern d-flex justify-content-between align-items-center">
          <div>
            <h5 className="card-title">
              <i className="bi bi-file-earmark-medical me-2 text-primary"></i>
              Historiales Médicos
            </h5>
            <small className="text-muted">
              Archivo clínico digital de pacientes
            </small>
          </div>
          <button
            onClick={() => navigate("/medico/historial/nuevo")}
            className="btn btn-primary btn-action-modern shadow-sm"
          >
            <i className="bi bi-plus-circle me-1"></i> Registrar Historial
          </button>
        </div>

        {/* BUSCADOR INTEGRADO (Mismo diseño que Citas/Pagos) */}
        <div className="search-container-modern">
          <div className="row">
            <div className="col-md-7">
              <div className="input-group search-group-modern">
                <span className="input-group-text text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por DNI o nombre del paciente..."
                  value={filtro}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="col-md-5 text-md-end mt-3 mt-md-0">
              <button
                onClick={handleGenerarPDF}
                className="btn btn-outline-danger btn-action-modern"
                title="Exportar listado actual a PDF"
              >
                <i className="bi bi-file-earmark-pdf-fill me-1"></i> Generar
                Reporte
              </button>
            </div>
          </div>
        </div>

        {/* CUERPO DE TABLA */}
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-modern mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Paciente</th>
                  <th>DNI Paciente</th>
                  <th>Médico Responsable</th>
                  <th>Especialidad</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                      Cargando archivos clínicos...
                    </td>
                  </tr>
                ) : historiales.length > 0 ? (
                  historiales.map((h) => (
                    <tr key={h.idHistorial}>
                      <td className="text-muted small">#{h.idHistorial}</td>
                      <td>
                        <div className="fw-bold text-dark">
                          <i className="bi bi-calendar-check me-2 text-muted small"></i>
                          {new Date(h.fecha).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="fw-bold text-dark">
                        {h.pacienteNombreCompleto}
                      </td>
                      <td>
                        <code
                          className="text-primary fw-bold"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {h.pacienteDni}
                        </code>
                      </td>
                      <td>
                        <div className="text-secondary small fw-bold">
                          {h.nombreMedicoResponsable}
                        </div>
                      </td>
                      <td>
                        <span className="badge-specialty">
                          {h.especialidadNombre}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-light btn-sm text-primary border shadow-sm"
                          onClick={() =>
                            navigate(
                              `/medico/historial/detalle/${h.idHistorial}`
                            )
                          }
                          title="Ver Detalle Clínico"
                        >
                          <i className="bi bi-eye-fill"></i> Ver Detalle
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      <i className="bi bi-folder-x d-block fs-2 mb-2"></i>
                      No se encontraron historiales médicos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div className="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center p-3">
          <button
            onClick={() => navigate("/medico")}
            className="btn btn-outline-secondary btn-sm px-3 shadow-sm"
          >
            <i className="bi bi-arrow-left-short"></i> Volver al panel
          </button>
          <span className="text-muted small fw-medium">
            Total Registros:{" "}
            <span className="badge bg-primary rounded-pill">
              {historiales.length}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ListadoHistorialMedico;
