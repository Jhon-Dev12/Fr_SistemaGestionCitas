import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrarComprobantePago, listarMetodosPago } from "../../../Services/ComprobanteService";
import { buscarCitasPendientesPago, listarCitasPendientesPago } from "../../../Services/CitaService";

const RegistrarComprobantePago = () => {
    const navigate = useNavigate();

    /* ===================== ESTADOS DE ERROR Y CARGA ===================== */
    const [loading, setLoading] = useState(false);
    const [erroresServidor, setErroresServidor] = useState({});
    const [mensajeGlobal, setMensajeGlobal] = useState({ texto: "", tipo: "" });

    /* ===================== FORMULARIO ===================== */
    const [formData, setFormData] = useState({
        idCita: "",
        metodoPago: "",
        monto: "",
        nombresPagador: "",
        apellidosPagador: "",
        dniPagador: "",
        contactoPagador: ""
    });

    /* ===================== MODAL CITAS ===================== */
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [citas, setCitas] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [metodosPago, setMetodosPago] = useState([]);

    /* ===================== CARGA INICIAL ===================== */
    useEffect(() => {
        listarMetodosPago()
            .then(res => setMetodosPago(res.data || []))
            .catch(() => setMensajeGlobal({ texto: "Error al cargar métodos de pago", tipo: "danger" }));
    }, []);

    /* ===================== MANEJADORES ===================== */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Limpiar error específico del campo cuando el usuario vuelve a escribir
        if (erroresServidor[name]) {
            setErroresServidor((prev) => {
                const nuevosErrores = { ...prev };
                delete nuevosErrores[name];
                return nuevosErrores;
            });
        }
    };

    const abrirModal = () => {
        setShowModal(true);
        setMensajeGlobal({ texto: "", tipo: "" });
        cargarCitas("");
    };

    const cargarCitas = async (criterio = "") => {
        try {
            const res = criterio.trim()
                ? await buscarCitasPendientesPago(criterio)
                : await listarCitasPendientesPago();
            setCitas(res.data || []);
        } catch (err) {
            setCitas([]);
        }
    };

    const seleccionarCita = (c) => {
        setFormData({ ...formData, idCita: c.idCita });
        setCitaSeleccionada(c);
        setShowModal(false);
        setBusqueda("");
        // Limpiar error visual de la cita si existía
        if (erroresServidor.idCita) {
            const nuevos = { ...erroresServidor };
            delete nuevos.idCita;
            setErroresServidor(nuevos);
        }
    };

    /* ===================== SUBMIT ===================== */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErroresServidor({});
        setMensajeGlobal({ texto: "", tipo: "" });

        if (!formData.idCita) {
            setMensajeGlobal({ texto: "Debe seleccionar una cita antes de continuar.", tipo: "danger" });
            setLoading(false);
            return;
        }

        try {
            const payload = {
                ...formData,
                monto: Number(formData.monto)
            };

            await registrarComprobantePago(payload);
            alert("Pago registrado correctamente");
            navigate("/cajero/pago");
        } catch (err) {
            if (err.response && err.response.data) {
                const data = err.response.data;
                // Captura mapa de errores por campo (@Valid)
                if (data.errores) {
                    setErroresServidor(data.errores);
                }
                setMensajeGlobal({ texto: data.mensaje || "Error al registrar el pago", tipo: "danger" });
            } else {
                setMensajeGlobal({ texto: "No hay conexión con el servidor", tipo: "danger" });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4 pb-5">
            <h2 className="mb-4 text-primary">Registrar Comprobante de Pago</h2>

            {mensajeGlobal.texto && (
                <div className={`alert alert-${mensajeGlobal.tipo} alert-dismissible fade show`} role="alert">
                    {mensajeGlobal.texto}
                    <button type="button" className="btn-close" onClick={() => setMensajeGlobal({ texto: "", tipo: "" })}></button>
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                {/* CITA SELECCIONADA */}
                <div className="mb-4">
                    <label className="form-label fw-bold text-secondary">Cita seleccionada</label>
                    <div className="input-group has-validation">
                        <input
                            type="text"
                            className={`form-control ${erroresServidor.idCita ? "is-invalid" : "bg-light"}`}
                            readOnly
                            placeholder="Haga clic en 'Buscar Cita'..."
                            value={formData.idCita ? `Reserva #${formData.idCita}` : ""}
                        />
                        <button type="button" className="btn btn-primary" onClick={abrirModal}>
                            <i className="bi bi-search me-1"></i> Buscar Cita
                        </button>
                        {erroresServidor.idCita && <div className="invalid-feedback">{erroresServidor.idCita}</div>}
                    </div>
                </div>

                {citaSeleccionada && (
                    <div className="row mt-3 p-3 bg-light rounded border mb-4 shadow-sm">
                        <div className="col-md-3"><strong>Paciente:</strong><br/>{citaSeleccionada.nombreCompletoPaciente}</div>
                        <div className="col-md-3"><strong>Médico:</strong><br/>{citaSeleccionada.nombreCompletoMedico}</div>
                        <div className="col-md-3"><strong>Fecha:</strong><br/>{citaSeleccionada.fecha}</div>
                        <div className="col-md-3"><strong>Hora:</strong><br/>{citaSeleccionada.hora}</div>
                    </div>
                )}

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Método de Pago</label>
                        <select
                            name="metodoPago"
                            className={`form-select ${erroresServidor.metodoPago ? "is-invalid" : ""}`}
                            value={formData.metodoPago}
                            onChange={handleChange}
                        >
                            <option value="">-- Seleccione --</option>
                            {metodosPago.map((item) => (
                                <option key={item.value} value={item.value}>{item.label}</option>
                            ))}
                        </select>
                        {erroresServidor.metodoPago && <div className="invalid-feedback">{erroresServidor.metodoPago}</div>}
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Monto a Pagar (S/)</label>
                        <input
                            name="monto"
                            type="number"
                            className={`form-control ${erroresServidor.monto ? "is-invalid" : ""}`}
                            value={formData.monto}
                            onChange={handleChange}
                            placeholder="0.00"
                        />
                        {erroresServidor.monto && <div className="invalid-feedback">{erroresServidor.monto}</div>}
                    </div>
                </div>

                <h5 className="mt-4 border-bottom pb-2 text-muted">Información del Pagador</h5>
                
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Nombres</label>
                        <input
                            name="nombresPagador"
                            className={`form-control ${erroresServidor.nombresPagador ? "is-invalid" : ""}`}
                            value={formData.nombresPagador}
                            onChange={handleChange}
                        />
                        {erroresServidor.nombresPagador && <div className="invalid-feedback">{erroresServidor.nombresPagador}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Apellidos</label>
                        <input
                            name="apellidosPagador"
                            className={`form-control ${erroresServidor.apellidosPagador ? "is-invalid" : ""}`}
                            value={formData.apellidosPagador}
                            onChange={handleChange}
                        />
                        {erroresServidor.apellidosPagador && <div className="invalid-feedback">{erroresServidor.apellidosPagador}</div>}
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">DNI</label>
                        <input
                            name="dniPagador"
                            className={`form-control ${erroresServidor.dniPagador ? "is-invalid" : ""}`}
                            value={formData.dniPagador}
                            onChange={handleChange}
                            maxLength="8"
                        />
                        {erroresServidor.dniPagador && <div className="invalid-feedback">{erroresServidor.dniPagador}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Teléfono de Contacto</label>
                        <input
                            name="contactoPagador"
                            className={`form-control ${erroresServidor.contactoPagador ? "is-invalid" : ""}`}
                            value={formData.contactoPagador}
                            onChange={handleChange}
                            maxLength="9"
                        />
                        {erroresServidor.contactoPagador && <div className="invalid-feedback">{erroresServidor.contactoPagador}</div>}
                    </div>
                </div>

                <div className="d-grid gap-2 mt-4">
                    <button type="submit" className="btn btn-success btn-lg shadow-sm" disabled={loading}>
                        {loading ? (
                            <><span className="spinner-border spinner-border-sm me-2"></span>Procesando...</>
                        ) : "REGISTRAR COMPROBANTE"}
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/cajero/pagos")}>
                        VOLVER AL LISTADO
                    </button>
                </div>
            </form>

            {/* MODAL CITAS */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,.7)" }}>
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title">Seleccionar Cita Pendiente</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
                            </div>
                            <div className="modal-body p-4">
                                <input
                                    className="form-control mb-3"
                                    placeholder="🔍 Buscar por DNI o nombre del paciente..."
                                    value={busqueda}
                                    onChange={e => {
                                        setBusqueda(e.target.value);
                                        cargarCitas(e.target.value);
                                    }}
                                />
                                <div className="table-responsive" style={{maxHeight: '400px'}}>
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>ID</th>
                                                <th>Paciente</th>
                                                <th>DNI</th>
                                                <th>Fecha / Hora</th>
                                                <th>Médico</th>
                                                <th className="text-center">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {citas.length > 0 ? citas.map(c => (
                                                <tr key={c.idCita}>
                                                    <td>{c.idCita}</td>
                                                    <td className="fw-bold">{c.nombreCompletoPaciente}</td>
                                                    <td><code>{c.dniPaciente}</code></td>
                                                    <td>{c.fecha} <br/><small className="text-muted">{c.hora}</small></td>
                                                    <td>{c.nombreCompletoMedico}</td>
                                                    <td className="text-center">
                                                        <button className="btn btn-sm btn-success px-3" onClick={() => seleccionarCita(c)}>
                                                            Seleccionar
                                                        </button>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan="6" className="text-center text-muted py-4">No se encontraron citas pendientes de pago.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegistrarComprobantePago;