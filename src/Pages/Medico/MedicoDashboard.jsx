import React, { useEffect, useState } from "react";
import { obtenerStatsMedico } from "../../Services/DashboardService";
import "../../Styles/DetalleCita.css";

const MedicoDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const response = await obtenerStatsMedico();
        setStats(response.data);
      } catch (error) {
        console.error("Error al cargar dashboard médico", error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="spinner-border text-primary" role="status"></div>
        <span className="ms-3 fw-bold text-muted">
          Sincronizando agenda médica...
        </span>
      </div>
    );

  return (
    <div className="container-fluid py-4 animate__animated animate__fadeIn">
      <header className="mb-4">
        <h3 className="fw-bold text-dark mb-1">Mi Consultorio</h3>
        <p className="text-muted small">
          Seguimiento de citas y atenciones para el turno de hoy.
        </p>
      </header>

      {/* KPI CARDS - RESUMEN DE LA JORNADA */}
      <div className="row g-4 mb-5">
        {/* TOTAL CITAS HOY */}
        <div className="col-md-4">
          <div
            className="card card-modern border-0 shadow-sm h-100 overflow-hidden"
            style={{ borderLeft: "5px solid #0d6efd" }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="label-detail text-uppercase mb-2">
                    Citas Programadas
                  </h6>
                  <h2 className="fw-bold mb-0 text-dark">
                    {stats?.totalCitasHoy || 0}
                  </h2>
                  <div className="small text-primary mt-2">
                    <i className="bi bi-calendar-check me-1"></i>Agenda total
                  </div>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-3">
                  <i className="bi bi-calendar2-week-fill fs-2 text-primary"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ATENCIONES FINALIZADAS */}
        <div className="col-md-4">
          <div
            className="card card-modern border-0 shadow-sm h-100 overflow-hidden"
            style={{ borderLeft: "5px solid #198754" }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="label-detail text-uppercase mb-2">
                    Atenciones Listas
                  </h6>
                  <h2 className="fw-bold mb-0 text-dark">
                    {stats?.atencionesFinalizadas || 0}
                  </h2>
                  <div className="small text-success mt-2">
                    <i className="bi bi-check-all me-1"></i>Pacientes atendidos
                  </div>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-3">
                  <i className="bi bi-person-check-fill fs-2 text-success"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PACIENTES EN ESPERA */}
        <div className="col-md-4">
          <div
            className="card card-modern border-0 shadow-sm h-100 overflow-hidden"
            style={{ borderLeft: "5px solid #ffc107" }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="label-detail text-uppercase mb-2">
                    Por Atender
                  </h6>
                  <h2 className="fw-bold mb-0 text-dark">
                    {stats?.pacientesPendientes || 0}
                  </h2>
                  <div className="small text-warning mt-2 fw-medium">
                    <i className="bi bi-clock-history me-1"></i>Pacientes en
                    espera
                  </div>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded-3">
                  <i className="bi bi-people-fill fs-2 text-warning"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN DESTACADA: SIGUIENTE PACIENTE */}
      {stats?.siguientePaciente && (
        <div className="card card-modern border-0 shadow-sm mb-5 bg-primary text-white overflow-hidden animate__animated animate__pulse">
          <div className="card-body p-4 p-md-5 d-flex justify-content-between align-items-center">
            <div>
              <span className="badge bg-white text-primary mb-3 px-3 py-2 rounded-pill fw-bold">
                <i className="bi bi-play-fill me-1"></i> SIGUIENTE EN LISTA
              </span>
              <h2 className="fw-bold mb-1">
                {stats.siguientePaciente.nombreCompletoPaciente}
              </h2>
              <p className="mb-0 opacity-75 fs-5">
                <i className="bi bi-alarm me-2"></i>{" "}
                {stats.siguientePaciente.hora.substring(0, 5)} —{" "}
                {stats.siguientePaciente.motivo}
              </p>
              <div className="mt-3 small">
                <span className="me-3">
                  <i className="bi bi-fingerprint me-1"></i>{" "}
                  {stats.siguientePaciente.dniPaciente}
                </span>
                <span>
                  <i className="bi bi-person-heart me-1"></i>{" "}
                  {stats.siguientePaciente.edadPaciente} años
                </span>
              </div>
            </div>
            <button
              className="btn btn-light btn-lg rounded-pill px-5 fw-bold text-primary shadow"
              onClick={() =>
                (window.location.href = `/medico/historial/nuevo?citaId=${stats.siguientePaciente.idCita}`)
              }
            >
              ATENDER <i className="bi bi-chevron-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* AGENDA COMPLETA DEL DÍA */}
      <div className="card card-modern shadow-sm border-0">
        <div className="card-header bg-white py-3 border-bottom-0">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0 fw-bold text-dark">
              <i className="bi bi-list-task me-2 text-primary"></i>
              Mi Agenda del Día
            </h5>
            <span className="badge bg-light text-dark border fw-normal">
              Actualizado hoy
            </span>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light text-muted small text-uppercase fw-bold">
                <tr>
                  <th className="ps-4 py-3">Hora</th>
                  <th className="py-3">Paciente</th>
                  <th className="py-3">Motivo / Edad</th>
                  <th className="py-3">Estado</th>
                  <th className="py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                {stats?.agendaDelDia && stats.agendaDelDia.length > 0 ? (
                  stats.agendaDelDia.map((cita) => (
                    <tr key={cita.idCita} className="small">
                      <td className="ps-4">
                        <div className="fw-bold text-primary fs-6">
                          {cita.hora.substring(0, 5)}
                        </div>
                      </td>
                      <td>
                        <div className="fw-bold text-dark">
                          {cita.nombreCompletoPaciente}
                        </div>
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.75rem" }}
                        >
                          DNI: {cita.dniPaciente}
                        </div>
                      </td>
                      <td>
                        <div className="text-dark">{cita.motivo}</div>
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {cita.edadPaciente} años
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge rounded-pill px-3 py-2 border ${
                            cita.estado === "ATENDIDO"
                              ? "bg-success-subtle text-success"
                              : cita.estado === "CONFIRMADO"
                              ? "bg-primary-subtle text-primary"
                              : "bg-light text-muted"
                          }`}
                        >
                          {cita.estado}
                        </span>
                      </td>
                      {/* Columna de Acciones dentro del .map de la tabla */}
                      <td className="text-center">
                        {cita.estado === "CONFIRMADO" ? (
                          <button
                            className="btn btn-sm btn-primary rounded-pill px-3 fw-bold shadow-sm"
                            onClick={() =>
                              (window.location.href = `/medico/historial/nuevo?citaId=${cita.idCita}`)
                            }
                          >
                            <i className="bi bi-play-fill me-1"></i> INICIAR
                          </button>
                        ) : (
                          <button
                            className={`btn btn-sm rounded-pill px-3 fw-bold ${
                              cita.estado === "ATENDIDO"
                                ? "btn-outline-info border-2"
                                : "btn-outline-secondary opacity-50"
                            }`}
                            // El botón solo es clicable si ya existe un historial clínico generado
                            disabled={cita.estado !== "ATENDIDO"}
                            onClick={() => {
                              if (
                                cita.estado === "ATENDIDO" &&
                                cita.idHistorial
                              ) {
                                window.location.href = `/medico/historial/detalle/${cita.idHistorial}`;
                              }
                            }}
                          >
                            {cita.estado === "ATENDIDO" ? (
                              <span>
                                <i className="bi bi-eye-fill me-1"></i> VER
                                DETALLES
                              </span>
                            ) : (
                              <span>
                                <i className="bi bi-lock-fill me-1"></i>{" "}
                                BLOQUEADO
                              </span>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-5 text-muted italic"
                    >
                      No hay citas programadas para hoy.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicoDashboard;
