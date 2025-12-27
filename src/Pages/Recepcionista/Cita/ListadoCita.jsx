import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  listarCitas,
  buscarCitasPorCriterio,
  anularCita,
} from "../../../Services/CitaService";
import "../../../Styles/ListadoCita.css";

const ListadoCita = () => {
  const [citas, setCitas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. Carga de datos memorizada para evitar renders en cascada
  const cargarDatos = useCallback(async (criterio = "") => {
    setLoading(true);
    try {
      const peticion = criterio
        ? await buscarCitasPorCriterio(criterio)
        : await listarCitas();
      setCitas(peticion.data || []);
    } catch (err) {
      console.error("Error al cargar citas:", err);
      setCitas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Inicialización asíncrona (ESLint friendly)
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

  const handleAnular = (id) => {
    Swal.fire({
      title: "¿Anular cita?",
      text: "La cita pasará a estado CANCELADO permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#f8f9fa",
      confirmButtonText: "Sí, anular",
      cancelButtonText: "Regresar",
      customClass: { cancelButton: 'text-dark border' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await anularCita(id);
          Swal.fire("¡Anulada!", "La cita ha sido cancelada correctamente.", "success");
          cargarDatos(filtro);
        } catch (err) {
          const msg = err.response?.data?.message || "No se pudo anular la cita.";
          Swal.fire("Error", msg, "error");
        }
      }
    });
  };

  const getBadgeClass = (estado) => {
    const classes = {
      PENDIENTE: "st-pendiente",
      CONFIRMADO: "st-confirmado",
      PAGADO: "st-pagado",
      CANCELADO: "st-cancelado",
      VENCIDO: "st-vencido",
      ATENDIDO: "st-atendido",
    };
    return classes[estado] || "bg-light text-muted";
  };

  return (
    <div className="page-container container-fluid px-4">
      <div className="card card-modern shadow-sm animate__animated animate__fadeIn">
        
        {/* CABECERA */}
        <div className="card-header-modern d-flex justify-content-between align-items-center">
          <h5 className="card-title">
            <i className="bi bi-calendar3 me-2 text-primary"></i>Gestión de Citas Médicas
          </h5>
          <button
            onClick={() => navigate("/recepcionista/cita/nuevo")}
            className="btn btn-primary btn-action-modern shadow-sm"
          >
            <i className="bi bi-plus-lg me-1"></i> Registrar Cita
          </button>
        </div>

        <div className="card-body">
          {/* BUSCADOR Y REPORTE */}
          <div className="row mb-4 align-items-center">
            <div className="col-md-7">
              <div className="input-group search-group-modern">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0 shadow-none"
                  placeholder="Buscar por paciente, médico o DNI..."
                  value={filtro}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="col-md-5 text-md-end mt-3 mt-md-0">
              <a 
                href="http://localhost:8080/api/recepcionista/citas/reporte" 
                className="btn btn-outline-secondary btn-action-modern" 
                target="_blank" 
                rel="noreferrer"
              >
                <i className="bi bi-file-earmark-text me-1"></i> Generar Reporte
              </a>
            </div>
          </div>

          {/* TABLA */}
          <div className="table-responsive">
            <table className="table table-hover table-modern mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha / Hora</th>
                  <th>DNI Paciente</th>
                  <th>Paciente</th>
                  <th>Médico</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                      Sincronizando agenda...
                    </td>
                  </tr>
                ) : citas.length > 0 ? (
                  citas.map((c) => (
                    <tr key={c.idCita}>
                      <td className="text-muted small">#{c.idCita}</td>
                      <td>
                        <div className="fw-bold text-dark">{c.fecha}</div>
                        <small className="text-muted"><i className="bi bi-clock me-1"></i>{c.hora}</small>
                      </td>
                      <td className="fw-medium text-primary">{c.dniPaciente}</td>
                      <td className="text-dark">{c.nombreCompletoPaciente}</td>
                      <td><span className="small fw-bold text-secondary">{c.nombreCompletoMedico}</span></td>
                      <td>
                        <span className={`badge-status ${getBadgeClass(c.estado)}`}>
                          {c.estado}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="btn-group gap-1">
                          <button
                            className="btn btn-light btn-sm text-primary border shadow-sm"
                            onClick={() => navigate(`/recepcionista/cita/detalle/${c.idCita}`)}
                            title="Ver Detalle"
                          >
                            <i className="bi bi-eye"></i>
                          </button>

                          {(c.estado === "PENDIENTE" || c.estado === "CONFIRMADO") ? (
                            <>
                              <button
                                className="btn btn-light btn-sm text-warning border shadow-sm"
                                onClick={() => navigate(`/recepcionista/cita/editar/${c.idCita}`)}
                                title="Editar"
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>
                              
                              {c.estado === "PENDIENTE" && (
                                <button
                                  className="btn btn-light btn-sm text-danger border shadow-sm"
                                  onClick={() => handleAnular(c.idCita)}
                                  title="Anular"
                                >
                                  <i className="bi bi-x-circle"></i>
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              <button className="btn btn-light btn-sm text-muted border" disabled><i className="bi bi-pencil-square"></i></button>
                              <button className="btn btn-light btn-sm text-muted border" disabled><i className="bi bi-x-circle"></i></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      <i className="bi bi-calendar-x d-block fs-2 mb-2"></i>
                      No se encontraron citas para los criterios seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div className="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center p-3">
          <button onClick={() => navigate("/recepcionista")} className="btn btn-outline-secondary btn-sm px-3">
            <i className="bi bi-arrow-left-short"></i> Volver
          </button>
          <span className="text-muted small fw-medium">
            Total Citas: <span className="badge bg-primary rounded-pill">{citas.length}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ListadoCita;