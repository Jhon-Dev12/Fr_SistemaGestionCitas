import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { registrarComprobantePago, listarMetodosPago } from "../../../Services/ComprobanteService";
import { buscarCitasPendientesPago, listarCitasPendientesPago } from "../../../Services/CitaService";
import "../../../Styles/RegistrarCita.css";

const RegistrarComprobantePago = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [erroresServidor, setErroresServidor] = useState({});
    const [mensajeGlobal, setMensajeGlobal] = useState({ texto: "", tipo: "" });

    const [formData, setFormData] = useState({
        idCita: "",
        metodoPago: "",
        monto: "",
        nombresPagador: "",
        apellidosPagador: "",
        dniPagador: "",
        contactoPagador: "",
        emailPagador: "" // 🔥 Nuevo campo inicializado
    });

    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [citas, setCitas] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [metodosPago, setMetodosPago] = useState([]);

    useEffect(() => {
        listarMetodosPago()
            .then(res => setMetodosPago(res.data || []))
            .catch(() => {
                Swal.fire("Error", "No se pudieron cargar los métodos de pago.", "error");
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        if (erroresServidor[name]) {
            setErroresServidor(prev => {
                const nuevos = { ...prev };
                delete nuevos[name];
                return nuevos;
            });
        }
    };

    const cargarCitas = async (criterio = "") => {
        try {
            const res = criterio.trim()
                ? await buscarCitasPendientesPago(criterio)
                : await listarCitasPendientesPago();
            setCitas(res.data || []);
        } catch (err) { setCitas([]); }
    };

    const seleccionarCita = (c) => {
        setFormData({ 
            ...formData, 
            idCita: c.idCita,
            nombresPagador: c.nombrePaciente || "",
            apellidosPagador: c.apellidoPaciente || "",
            // 🔥 Si la cita ya trae el email del paciente, lo pre-cargamos
            emailPagador: c.emailPaciente || "" 
        });
        setCitaSeleccionada(c);
        setShowModal(false);
        setBusqueda("");
        setErroresServidor({}); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErroresServidor({});
        setMensajeGlobal({ texto: "", tipo: "" });

        if (!formData.idCita) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'Debe seleccionar una cita de la lista antes de registrar el pago.',
                confirmButtonColor: '#3085d6'
            });
            setLoading(false);
            return;
        }

        try {
            await registrarComprobantePago({ ...formData, monto: Number(formData.monto) });
            
            await Swal.fire({
                icon: 'success',
                title: '¡Registro Exitoso!',
                text: 'El comprobante ha sido guardado y se enviará al correo indicado.',
                timer: 2000,
                showConfirmButton: false
            });
            
            navigate("/cajero/pago");
        } catch (err) {
            const data = err.response?.data;
            if (data?.errores) {
                setErroresServidor(data.errores);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Validación',
                    text: 'Por favor, revise los campos marcados en rojo.',
                });
            } else {
                const msg = data?.mensaje || "Ocurrió un error inesperado en el servidor.";
                setMensajeGlobal({ texto: msg, tipo: "danger" });
                Swal.fire("Error", msg, "error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container page-container pb-5">
            <div className="card card-modern shadow">
                <div className="card-header-modern">
                    <div>
                        <h5 className="card-title">
                            <i className="bi bi-cash-stack me-2 text-primary"></i>Registro de Pago
                        </h5>
                        <div className="sub-header">Indique cita a pagar y datos del pagador</div>
                    </div>
                </div>

                <div className="card-body p-4 p-md-5">
                    {mensajeGlobal.texto && (
                        <div className={`alert alert-${mensajeGlobal.tipo} alert-dismissible fade show shadow-sm mb-4`} role="alert">
                            <i className="bi bi-exclamation-octagon-fill me-2"></i>
                            {mensajeGlobal.texto}
                            <button type="button" className="btn-close" onClick={() => setMensajeGlobal({ texto: "", tipo: "" })}></button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-4">
                            <label className="form-label fw-bold">Vincular Cita Pendiente</label>
                            <div className="input-group has-validation">
                                <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
                                <input 
                                    type="text" 
                                    className={`form-control bg-light fw-bold ${erroresServidor.idCita ? "is-invalid" : ""}`} 
                                    readOnly 
                                    value={citaSeleccionada ? `Reserva #${citaSeleccionada.idCita} - ${citaSeleccionada.nombreCompletoPaciente}` : ""} 
                                    placeholder="Haga clic en la lupa para buscar..." 
                                />
                                <button type="button" className="btn btn-primary px-4" onClick={() => { setShowModal(true); cargarCitas(""); }}>
                                    Buscar Cita
                                </button>
                                {erroresServidor.idCita && <div className="invalid-feedback d-block">{erroresServidor.idCita}</div>}
                            </div>
                        </div>

                        {citaSeleccionada && (
                            <div className="info-box-hours mb-4 animate__animated animate__fadeIn">
                                <small className="fw-bold d-block mb-2 text-uppercase text-primary">
                                    <i className="bi bi-info-circle-fill me-1"></i> Detalles del servicio:
                                </small>
                                <div className="row g-2">
                                    <div className="col-md-6"><strong>Paciente:</strong> {citaSeleccionada.nombreCompletoPaciente}</div>
                                    <div className="col-md-6"><strong>DNI Paciente:</strong> {citaSeleccionada.dniPaciente}</div>
                                    <div className="col-md-6"><strong>Médico:</strong> {citaSeleccionada.nombreCompletoMedico}</div>
                                    <div className="col-md-6"><strong>Fecha/Hora:</strong> {citaSeleccionada.fecha} - {citaSeleccionada.hora}</div>
                                </div>
                            </div>
                        )}

                        <div className="row g-4 mb-4">
                            <div className="col-md-6">
                                <label className="form-label">Método de Pago</label>
                                <select 
                                    name="metodoPago" 
                                    className={`form-select ${erroresServidor.metodoPago ? "is-invalid" : ""}`} 
                                    value={formData.metodoPago} 
                                    onChange={handleChange}
                                >
                                    <option value="">-- Seleccione --</option>
                                    {metodosPago.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                </select>
                                {erroresServidor.metodoPago && <div className="invalid-feedback">{erroresServidor.metodoPago}</div>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Monto a Cobrar (S/)</label>
                                <div className="input-group">
                                    <span className="input-group-text">S/</span>
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
                        </div>

                        <h6 className="form-label mt-5 border-bottom pb-2 text-muted">Información del Pagador / Envío de Comprobante</h6>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label small">DNI del Pagador</label>
                                <input 
                                    name="dniPagador" 
                                    className={`form-control ${erroresServidor.dniPagador ? "is-invalid" : ""}`} 
                                    value={formData.dniPagador} 
                                    onChange={handleChange} 
                                    maxLength="8" 
                                />
                                {erroresServidor.dniPagador && <div className="invalid-feedback">{erroresServidor.dniPagador}</div>}
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small">Teléfono / Contacto</label>
                                <input 
                                    name="contactoPagador" 
                                    className={`form-control ${erroresServidor.contactoPagador ? "is-invalid" : ""}`} 
                                    value={formData.contactoPagador} 
                                    onChange={handleChange} 
                                    maxLength="9" 
                                />
                                {erroresServidor.contactoPagador && <div className="invalid-feedback">{erroresServidor.contactoPagador}</div>}
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small text-primary fw-bold">Email para envío</label>
                                <input 
                                    name="emailPagador" 
                                    type="email"
                                    placeholder="ejemplo@correo.com"
                                    className={`form-control ${erroresServidor.emailPagador ? "is-invalid" : ""}`} 
                                    value={formData.emailPagador} 
                                    onChange={handleChange} 
                                />
                                {erroresServidor.emailPagador && <div className="invalid-feedback">{erroresServidor.emailPagador}</div>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small">Nombres</label>
                                <input 
                                    name="nombresPagador" 
                                    className={`form-control ${erroresServidor.nombresPagador ? "is-invalid" : ""}`} 
                                    value={formData.nombresPagador} 
                                    onChange={handleChange} 
                                />
                                {erroresServidor.nombresPagador && <div className="invalid-feedback">{erroresServidor.nombresPagador}</div>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small">Apellidos</label>
                                <input 
                                    name="apellidosPagador" 
                                    className={`form-control ${erroresServidor.apellidosPagador ? "is-invalid" : ""}`} 
                                    value={formData.apellidosPagador} 
                                    onChange={handleChange} 
                                />
                                {erroresServidor.apellidosPagador && <div className="invalid-feedback">{erroresServidor.apellidosPagador}</div>}
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-5 pt-3 border-top">
                            <button type="button" onClick={() => navigate("/cajero/pago")} className="btn btn-light border px-4">Volver</button>
                            <button type="submit" disabled={loading} className="btn btn-primary px-5 shadow-sm">
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>Procesando...</>
                                ) : (
                                    <><i className="bi bi-check-circle me-1"></i>Registrar Pago</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* MODAL CITAS */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content modal-content-modern shadow-lg">
                            <div className="modal-header border-bottom-0 p-4">
                                <h5 className="modal-title fw-bold text-primary">Seleccionar Cita Pendiente</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body p-4 pt-0">
                                <div className="input-group mb-4">
                                    <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
                                    <input type="text" className="form-control" placeholder="Buscar por DNI o Nombre del Paciente..." 
                                        value={busqueda} onChange={(e) => { setBusqueda(e.target.value); cargarCitas(e.target.value); }} />
                                </div>
                                <div className="table-responsive" style={{ maxHeight: '350px' }}>
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light text-muted small">
                                            <tr><th>ID</th><th>Paciente</th><th>DNI</th><th>Fecha / Hora</th><th>Médico</th><th className="text-end">Acción</th></tr>
                                        </thead>
                                        <tbody>
                                            {citas.length > 0 ? citas.map(c => (
                                                <tr key={c.idCita}>
                                                    <td><span className="badge bg-light text-dark">#{c.idCita}</span></td>
                                                    <td className="fw-bold">{c.nombreCompletoPaciente}</td>
                                                    <td><code>{c.dniPaciente}</code></td>
                                                    <td className="small">{c.fecha}<br/>{c.hora}</td>
                                                    <td className="small">{c.nombreCompletoMedico}</td>
                                                    <td className="text-end">
                                                        <button className="btn btn-sm btn-primary rounded-pill px-3 fw-bold" onClick={() => seleccionarCita(c)}>Seleccionar</button>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan="6" className="text-center py-4 text-muted">No se encontraron citas pendientes.</td></tr>
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