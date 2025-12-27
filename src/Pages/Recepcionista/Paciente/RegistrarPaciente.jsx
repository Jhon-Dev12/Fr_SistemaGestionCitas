import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { registrarPaciente } from "../../../Services/PacienteService";
import "../../../Styles/RegistrarPaciente.css"; 

const RegistrarPaciente = () => {
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState({
        nombres: "",
        apellidos: "",
        dni: "",
        fechaNacimiento: "",
        telefono: "",
    });

    const [cargando, setCargando] = useState(false);
    const [erroresServidor, setErroresServidor] = useState({});
    const [mensajeGlobal, setMensajeGlobal] = useState({ texto: "", tipo: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaciente({ ...paciente, [name]: value });

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
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Paciente Registrado!',
                    text: 'El nuevo paciente ha sido ingresado al sistema con éxito.',
                    confirmButtonColor: '#0d6efd'
                }).then(() => navigate("/recepcionista/paciente"));
            })
            .catch((err) => {
                if (err.response && err.response.data) {
                    const data = err.response.data;
                    if (data.errores) setErroresServidor(data.errores);
                    setMensajeGlobal({
                        texto: data.mensaje || "Error al procesar el registro",
                        tipo: "danger",
                    });
                    Swal.fire("Atención", "Por favor, revise los datos ingresados.", "error");
                } else {
                    setMensajeGlobal({ texto: "No hay conexión con el servidor", tipo: "danger" });
                }
            })
            .finally(() => setCargando(false));
    };

    return (
        <div className="container page-container pb-5">
            <div className="card card-modern shadow-sm animate__animated animate__fadeIn">
                
                {/* CABECERA (Consistente con Médicos/Usuarios) */}
                <div className="card-header-modern">
                    <h5 className="card-title">
                        <i className="bi bi-person-plus-fill me-2 text-primary"></i>Registrar Paciente
                    </h5>
                    <div className="sub-header">Ingrese la información personal del paciente para habilitar la programación de citas</div>
                </div>

                <div className="card-body p-4 p-md-5">
                    {mensajeGlobal.texto && (
                        <div className={`alert alert-${mensajeGlobal.tipo} alert-dismissible fade show mb-4 shadow-sm`} role="alert">
                            <i className="bi bi-exclamation-circle-fill me-2"></i>{mensajeGlobal.texto}
                            <button type="button" className="btn-close" onClick={() => setMensajeGlobal({ texto: "", tipo: "" })}></button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="row g-4">
                        
                        {/* SECCIÓN 1: Identidad */}
                        <div className="col-md-6">
                            <label className="form-label-custom">Nombres</label>
                            <div className="input-group has-validation">
                                <span className="input-group-text input-group-text-modern"><i className="bi bi-person"></i></span>
                                <input
                                    type="text"
                                    className={`form-control border-start-0 ps-0 ${erroresServidor.nombres ? "is-invalid" : ""}`}
                                    name="nombres"
                                    value={paciente.nombres}
                                    onChange={handleChange}
                                    placeholder=" Ingrese nombres"
                                    required
                                />
                                {erroresServidor.nombres && <div className="invalid-feedback">{erroresServidor.nombres}</div>}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label-custom">Apellidos</label>
                            <div className="input-group has-validation">
                                <span className="input-group-text input-group-text-modern"><i className="bi bi-person-fill"></i></span>
                                <input
                                    type="text"
                                    className={`form-control border-start-0 ps-0 ${erroresServidor.apellidos ? "is-invalid" : ""}`}
                                    name="apellidos"
                                    value={paciente.apellidos}
                                    onChange={handleChange}
                                    placeholder=" Ingrese apellidos"
                                    required
                                />
                                {erroresServidor.apellidos && <div className="invalid-feedback">{erroresServidor.apellidos}</div>}
                            </div>
                        </div>

                        <hr className="divider-modern" />

                        {/* SECCIÓN 2: Documentación y Contacto */}
                        <div className="col-md-4">
                            <label className="form-label-custom">Número de DNI</label>
                            <div className="input-group has-validation">
                                <span className="input-group-text input-group-text-modern"><i className="bi bi-card-text"></i></span>
                                <input
                                    type="text"
                                    className={`form-control border-start-0 ps-0 ${erroresServidor.dni ? "is-invalid" : ""}`}
                                    name="dni"
                                    value={paciente.dni}
                                    onChange={handleChange}
                                    maxLength="8"
                                    placeholder=" 8 dígitos"
                                    required
                                />
                                {erroresServidor.dni && <div className="invalid-feedback">{erroresServidor.dni}</div>}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label-custom">Fecha de Nacimiento</label>
                            <div className="input-group has-validation">
                                <span className="input-group-text input-group-text-modern"><i className="bi bi-calendar-event"></i></span>
                                <input
                                    type="date"
                                    className={`form-control border-start-0 ps-0 ${erroresServidor.fechaNacimiento ? "is-invalid" : ""}`}
                                    name="fechaNacimiento"
                                    value={paciente.fechaNacimiento}
                                    onChange={handleChange}
                                    required
                                />
                                {erroresServidor.fechaNacimiento && <div className="invalid-feedback">{erroresServidor.fechaNacimiento}</div>}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label-custom">Teléfono Móvil</label>
                            <div className="input-group has-validation">
                                <span className="input-group-text input-group-text-modern"><i className="bi bi-telephone"></i></span>
                                <input
                                    type="text"
                                    className={`form-control border-start-0 ps-0 ${erroresServidor.telefono ? "is-invalid" : ""}`}
                                    name="telefono"
                                    value={paciente.telefono}
                                    onChange={handleChange}
                                    maxLength="9"
                                    placeholder=" Ej: 987654321"
                                />
                                {erroresServidor.telefono && <div className="invalid-feedback">{erroresServidor.telefono}</div>}
                            </div>
                        </div>

                        {/* ACCIONES (Botonera consistente) */}
                        <div className="col-12 mt-5 d-flex justify-content-between border-top pt-4">
                            <button type="button" onClick={() => navigate("/recepcionista/paciente")} className="btn btn-light border px-4 shadow-sm">
                                <i className="bi bi-arrow-left me-1"></i> Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary px-5 shadow-sm" disabled={cargando} style={{backgroundColor: '#0d6efd', border: 'none'}}>
                                {cargando ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-check-circle me-1"></i>}
                                Registrar Paciente
                            </button>
                        </div>
                    </form>
                </div>

                <div className="footer-hospital text-center">
                    <i className="bi bi-shield-lock me-1"></i> Los datos del paciente están protegidos por la ley de protección de datos personales.
                </div>
            </div>
        </div>
    );
};

export default RegistrarPaciente;