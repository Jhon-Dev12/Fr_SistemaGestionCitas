import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    listarComprobantesPago,
    buscarComprobantesPago,
    anularComprobantePago
} from "../../../Services/ComprobanteService";

const ListadoComprobantesPago = () => {
    const [comprobantes, setComprobantes] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [mensajeError, setMensajeError] = useState(null);
    const navigate = useNavigate();

    /* ===================== CARGA DE DATOS ===================== */
    const cargarDatos = (criterio = "") => {
        const peticion = criterio
            ? buscarComprobantesPago(criterio)
            : listarComprobantesPago();

        peticion
            .then(res => {
                setComprobantes(res.data || []);
                setMensajeError(null);
            })
            .catch(err => {
                console.error("Error al cargar comprobantes:", err);
                setComprobantes([]);
            });
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    /* ===================== BUSCADOR ===================== */
    const handleSearch = (e) => {
        const valor = e.target.value;
        setFiltro(valor);
        cargarDatos(valor);
    };

    /* ===================== ACCIONES ===================== */
    const handleAnular = async (id) => {
        setMensajeError(null);
        if (!window.confirm("¿Está seguro de anular este comprobante? Esta acción es irreversible.")) return;

        try {
            await anularComprobantePago(id);
            alert("Comprobante anulado exitosamente");
            cargarDatos(filtro);
        } catch (err) {
            const msg = err.response?.data?.mensaje || "No se pudo anular el comprobante. Es posible que la cita ya haya cambiado de estado.";
            setMensajeError(msg);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 className="text-primary">Módulo de Pagos y Facturación</h2>
                <button
                    onClick={() => navigate("/cajero/pago/nuevo")}
                    className="btn btn-success fw-bold shadow-sm"
                >
                    <i className="bi bi-plus-circle me-2"></i>Registrar Nuevo Pago
                </button>
            </div>

            {/* ALERTA DE ERROR */}
            {mensajeError && (
                <div className="alert alert-danger alert-dismissible fade show shadow-sm" role="alert">
                    <i className="bi bi-exclamation-octagon-fill me-2"></i>
                    {mensajeError}
                    <button type="button" className="btn-close" onClick={() => setMensajeError(null)}></button>
                </div>
            )}

            {/* BUSCADOR */}
            <div className="card mb-4 border-0 shadow-sm bg-light">
                <div className="card-body">
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                            <i className="bi bi-search text-muted"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Buscar por DNI del pagador, paciente o ID comprobante..."
                            value={filtro}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
            </div>

            {/* TABLA */}
            <div className="table-responsive shadow-sm rounded border bg-white">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th style={{ padding: "12px" }}>ID</th>
                            <th style={{ padding: "12px" }}>Fecha Emisión</th>
                            <th style={{ padding: "12px" }}>Pagador / DNI</th>
                            <th style={{ padding: "12px" }}>Paciente</th>
                            <th style={{ padding: "12px" }}>Monto</th>
                            <th style={{ padding: "12px" }}>Estado</th>
                            <th style={{ padding: "12px", textAlign: "center" }}>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {comprobantes.length > 0 ? (
                            comprobantes.map(c => {
                                const esAnulable = c.estado !== "ANULADO" && c.estadoCita === "CONFIRMADO";
                                return (
                                    <tr key={c.idComprobante} style={{ borderBottom: "1px solid #ddd" }}>
                                        <td className="fw-bold">{c.idComprobante}</td>
                                        <td>
                                            <small>{new Date(c.fechaEmision).toLocaleDateString()}</small><br/>
                                            <small className="text-muted">{new Date(c.fechaEmision).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                                        </td>
                                        <td>
                                            <div className="fw-bold">{c.nombresPagador} {c.apellidosPagador}</div>
                                            <small className="text-muted">DNI: {c.dniPagador}</small>
                                        </td>
                                        <td>{c.pacienteNombreCompleto}</td>
                                        <td className="fw-bold text-success">S/ {Number(c.monto).toFixed(2)}</td>
                                        <td>
                                            <span className={`badge ${esAnulable ? 'bg-success' : 'bg-danger'}`}>
                                                {c.estado}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <div className="btn-group shadow-sm">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => navigate(`/cajero/pago/detalle/${c.idComprobante}`)}
                                                    title="Ver Detalle"
                                                >
                                                    <i className="bi bi-eye"></i>
                                                </button>

                                                <button
                                                    className={`btn btn-sm ${esAnulable ? 'btn-outline-danger' : 'btn-light'}`}
                                                    onClick={() => handleAnular(c.idComprobante)}
                                                    disabled={!esAnulable}
                                                    title={esAnulable ? "Anular Comprobante" : "Este comprobante ya está anulado"}
                                                    style={{ 
                                                        cursor: esAnulable ? "pointer" : "not-allowed",
                                                        color: esAnulable ? "" : "#adb5bd"
                                                    }}
                                                >
                                                    <i className="bi bi-x-circle"></i> Anular
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center text-muted py-5">
                                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                    No se encontraron comprobantes registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListadoComprobantesPago;