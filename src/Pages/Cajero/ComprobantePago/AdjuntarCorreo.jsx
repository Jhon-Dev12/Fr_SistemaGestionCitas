import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../../Styles/EmailModule.css"; // Importamos los estilos personalizados

const EmailModule = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dataPaciente = location.state || {};

    const [archivo, setArchivo] = useState(null);
    const [cargando, setCargando] = useState(false);

    const [correo, setCorreo] = useState({
        destinatario: dataPaciente.email || "",
        asunto: "",
        mensaje: dataPaciente.nombre ? `Hola ${dataPaciente.nombre},\n\n` : ""
    });

    const handleSend = async (e) => {
        e.preventDefault();
        setCargando(true);

        Swal.fire({
            title: 'Procesando envío...',
            text: 'Por favor espere mientras se entrega el mensaje',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        const formData = new FormData();
        formData.append("destinatario", correo.destinatario);
        formData.append("asunto", correo.asunto);
        formData.append("mensaje", correo.mensaje);
        
        if (archivo) {
            formData.append("archivo", archivo); 
        }

        try {
            const response = await fetch("http://localhost:8080/api/correo/enviar", {
                method: "POST",
                credentials: "include", 
                body: formData
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Correo Enviado!',
                    text: 'El mensaje ha sido entregado exitosamente.',
                    confirmButtonColor: '#0d6efd'
                }).then(() => navigate(-1));
            } else if (response.status === 401) {
                Swal.fire("Acceso Denegado", "Su sesión ha expirado.", "error");
            } else {
                throw new Error("Error en el servidor");
            }
        } catch (error) {
            Swal.fire("Error de Conexión", "No se pudo conectar con el servidor.", "error");
        } finally {
            setCargando(false); // Corregido el nombre de la función
        }
    };

    return (
        <div className="container page-container pb-5">
            <div className="card card-modern shadow-sm animate__animated animate__fadeIn">
                
                <div className="card-header-modern">
                    <h5 className="card-title">
                        <i className="bi bi-envelope-paper-fill me-2 text-primary"></i>Centro de Notificaciones
                    </h5>
                    <div className="sub-header">Redacte y envíe información oficial o documentos adjuntos</div>
                </div>

                <div className="card-body p-4 p-md-5">
                    <form onSubmit={handleSend} className="row g-4">
                        
                        <div className="col-md-6">
                            <label className="form-label-custom">Para (Destinatario)</label>
                            <div className="input-group">
                                <span className="input-group-text-modern"><i className="bi bi-envelope"></i></span>
                                <input
                                    type="email"
                                    className="form-control border-start-0 ps-2"
                                    value={correo.destinatario}
                                    onChange={(e) => setCorreo({...correo, destinatario: e.target.value})}
                                    placeholder="ejemplo@correo.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label-custom">Asunto del Mensaje</label>
                            <div className="input-group">
                                <span className="input-group-text-modern"><i className="bi bi-bookmark-star"></i></span>
                                <input
                                    type="text"
                                    className="form-control border-start-0 ps-2"
                                    value={correo.asunto}
                                    onChange={(e) => setCorreo({...correo, asunto: e.target.value})}
                                    placeholder="Asunto"
                                    required
                                />
                            </div>
                        </div>

                        <hr className="divider-modern" />

                        <div className="col-12">
                            <label className="form-label-custom">Documento Adjunto (Opcional)</label>
                            <div className="input-group">
                                <span className="input-group-text-modern"><i className="bi bi-paperclip"></i></span>
                                <input
                                    type="file"
                                    className="form-control border-start-0 ps-2"
                                    onChange={(e) => setArchivo(e.target.files[0])}
                                />
                            </div>
                        </div>

                        <div className="col-12">
                            <label className="form-label-custom">Contenido del Mensaje</label>
                            <div className="input-group">
                                <span className="input-group-text-modern align-items-start pt-2"><i className="bi bi-chat-left-text"></i></span>
                                <textarea
                                    className="form-control border-start-0 ps-2"
                                    rows="8"
                                    value={correo.mensaje}
                                    onChange={(e) => setCorreo({...correo, mensaje: e.target.value})}
                                    placeholder="Escriba aquí..."
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <div className="col-12 mt-5 d-flex justify-content-between border-top pt-4">
                            <button type="button" onClick={() => navigate(-1)} className="btn btn-light border px-4 shadow-sm">
                                <i className="bi bi-arrow-left me-1"></i> Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary px-5 shadow-sm" disabled={cargando}>
                                {cargando ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-send-fill me-2"></i>}
                                Enviar Notificación
                            </button>
                        </div>
                    </form>
                </div>

                <div className="footer-hospital text-center">
                    <i className="bi bi-info-circle me-1"></i> Envío desde la cuenta oficial: <strong>clinsantar@gmail.com</strong>
                </div>
            </div>
        </div>
    );
};

export default EmailModule;