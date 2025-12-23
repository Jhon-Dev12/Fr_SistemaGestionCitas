import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerDetalleComprobante } from "../../../Services/ComprobanteService";

const DetalleComprobantePago = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [detalle, setDetalle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerDetalleComprobante(id)
      .then(res => setDetalle(res.data))
      .catch(() => setError("No se pudo cargar el comprobante"));
  }, [id]);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!detalle) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary">
        Detalle del Comprobante #{detalle.idComprobante}
      </h2>

      {/* ===== COMPROBANTE ===== */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header fw-bold">Información del Comprobante</div>
        <div className="card-body row">
          <div className="col-md-4">
            <strong>Fecha Emisión:</strong><br />
            {detalle.fechaEmision}
          </div>
          <div className="col-md-4">
            <strong>Método de Pago:</strong><br />
            {detalle.metodoPago}
          </div>
          <div className="col-md-4">
            <strong>Estado:</strong><br />
            {detalle.estado}
          </div>
          <div className="col-md-4 mt-3">
            <strong>Monto:</strong><br />
            S/ {detalle.monto}
          </div>
          <div className="col-md-4 mt-3">
            <strong>Cajero:</strong><br />
            {detalle.cajeroNombreCompleto}
          </div>
        </div>
      </div>

      {/* ===== PAGADOR ===== */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header fw-bold">Datos del Pagador</div>
        <div className="card-body row">
          <div className="col-md-6">
            <strong>Nombre:</strong><br />
            {detalle.nombresPagador} {detalle.apellidosPagador}
          </div>
          <div className="col-md-3">
            <strong>DNI:</strong><br />
            {detalle.dniPagador}
          </div>
          <div className="col-md-3">
            <strong>Contacto:</strong><br />
            {detalle.contactoPagador}
          </div>
        </div>
      </div>

      {/* ===== CITA ===== */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header fw-bold">Información de la Cita</div>
        <div className="card-body row">
          <div className="col-md-4">
            <strong>Paciente:</strong><br />
            {detalle.pacienteNombreCompleto}
          </div>
          <div className="col-md-4">
            <strong>Médico:</strong><br />
            {detalle.medicoNombreCompleto}
          </div>
          <div className="col-md-4">
            <strong>Motivo:</strong><br />
            {detalle.motivoCita}
          </div>
          <div className="col-md-4 mt-3">
            <strong>Fecha:</strong><br />
            {detalle.fechaCita}
          </div>
          <div className="col-md-4 mt-3">
            <strong>Hora:</strong><br />
            {detalle.horaCita}
          </div>
        </div>
      </div>

      <button
        className="btn btn-secondary"
        onClick={() => navigate("/cajero/pago")}
      >
        ⬅ Volver
      </button>
    </div>
  );
};

export default DetalleComprobantePago;
