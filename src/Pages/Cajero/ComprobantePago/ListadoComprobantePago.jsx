import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    listarComprobantesPago,
    buscarComprobantesPago,
    anularComprobantePago
} from "../../../Services/ComprobanteService";
import "../../../Styles/ListadoComprobantePago.css";

const ListadoComprobantesPago = () => {
    const [comprobantes, setComprobantes] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const cargarDatos = useCallback(async (criterio = "") => {
        setLoading(true);
        try {
            const peticion = criterio ? await buscarComprobantesPago(criterio) : await listarComprobantesPago();
            setComprobantes(peticion.data || []);
        } catch (err) {
            console.error("Error:", err);
            setComprobantes([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const inicializar = async () => { await cargarDatos(); };
        inicializar();
    }, [cargarDatos]);

    const handleSearch = (e) => {
        const valor = e.target.value;
        setFiltro(valor);
        cargarDatos(valor);
    };

    const handleAnular = (id) => {
        Swal.fire({
            title: "¿Anular comprobante?",
            text: "Esta acción es irreversible.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Sí, anular",
            cancelButtonText: "Regresar",
            customClass: { cancelButton: 'text-dark border' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await anularComprobantePago(id);
                    Swal.fire("¡Anulado!", "Operación exitosa.", "success");
                    cargarDatos(filtro);
                } catch (err) {
                    Swal.fire("Error", "No se pudo anular.", "error");
                }
            }
        });
    };

    return (
        <div className="page-container container-fluid px-4">
            <div className="card card-modern shadow-sm">
                
                {/* CABECERA (Padding 1.25rem 1.5rem) */}
                <div className="card-header-modern d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="card-title">
                            <i className="bi bi-cash-stack me-2 text-primary"></i>Pagos y Facturación
                        </h5>
                        <small className="text-muted">Gestión de comprobantes emitidos</small>
                    </div>
                    <button onClick={() => navigate("/cajero/pago/nuevo")} className="btn btn-primary shadow-sm btn-sm px-3">
                        <i className="bi bi-plus-circle me-1"></i> Registrar Nuevo Pago
                    </button>
                </div>

                {/* BUSCADOR (Franja Gris con Borde Inferior) */}
                <div className="search-container-modern">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="input-group search-group-modern">
                                <span className="input-group-text text-muted">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar por DNI, paciente o ID..."
                                    value={filtro}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* CUERPO DE TABLA (p-0 para que la tabla toque los bordes del buscador) */}
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover table-modern mb-0">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha Emisión</th>
                                    <th>Pagador / DNI</th>
                                    <th>Paciente</th>
                                    <th>Monto</th>
                                    <th>Estado</th>
                                    <th className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="7" className="text-center py-5">Sincronizando...</td></tr>
                                ) : comprobantes.length > 0 ? (
                                    comprobantes.map(c => (
                                        <tr key={c.idComprobante}>
                                            <td className="text-muted small">#{c.idComprobante}</td>
                                            <td>
                                                <div className="fw-bold text-dark">{new Date(c.fechaEmision).toLocaleDateString()}</div>
                                                <small className="text-muted">{new Date(c.fechaEmision).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                                            </td>
                                            <td>
                                                <div className="fw-bold text-dark">{c.nombresPagador} {c.apellidosPagador}</div>
                                                <code className="text-primary fw-bold" style={{fontSize: '0.85rem'}}>{c.dniPagador}</code>
                                            </td>
                                            <td className="text-dark">{c.pacienteNombreCompleto}</td>
                                            <td><span className="fw-bold text-success">S/ {Number(c.monto).toFixed(2)}</span></td>
                                            <td>
                                                <span className={`badge-status ${c.estado === 'ANULADO' ? 'st-anulado' : 'st-pagado'}`}>
                                                    {c.estado}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <div className="btn-group gap-1">
                                                    <button className="btn btn-light btn-sm text-primary border" onClick={() => navigate(`/cajero/pago/detalle/${c.idComprobante}`)} title="Ver Detalle">
                                                        <i className="bi bi-eye"></i>
                                                    </button>
                                                    <button 
                                                        className={`btn btn-sm border ${c.estado !== 'ANULADO' && c.estadoCita === 'CONFIRMADO' ? 'btn-light text-danger' : 'btn-light text-muted'}`}
                                                        onClick={() => handleAnular(c.idComprobante)}
                                                        disabled={!(c.estado !== 'ANULADO' && c.estadoCita === 'CONFIRMADO')}
                                                    >
                                                        <i className="bi bi-x-circle"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="7" className="text-center py-5 text-muted">No se encontraron registros.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center p-3">
                    <button onClick={() => navigate("/cajero")} className="btn btn-outline-secondary btn-sm px-3 shadow-sm">
                        <i className="bi bi-arrow-left-short"></i> Volver
                    </button>
                    <span className="text-muted small fw-medium">
                        Total: <span className="badge bg-primary rounded-pill">{comprobantes.length}</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ListadoComprobantesPago;