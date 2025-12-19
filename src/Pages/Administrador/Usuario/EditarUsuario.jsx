import React, { useState } from 'react';
import { buscarUsuariosPorUserName, actualizarUsuario } from '../../../Services/UsuarioService';
import LogoutButton from "../../../components/LogoutButton";

const ActualizarUsuario = () => {
    const [busqueda, setBusqueda] = useState('');
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
    
    // Estado inicial sincronizado con UsuarioActualizacionDTO
    const [formData, setFormData] = useState({
        idUsuario: '', 
        rol: '', // Solo para vista
        username: '',
        nombres: '',
        apellidos: '',
        dni: '',
        telefono: '',
        correo: '',
        contrasenia: '' 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const manejarBusqueda = async (e) => {
        e.preventDefault();
        setMensaje({ texto: '', tipo: '' });

        try {
            const response = await buscarUsuariosPorUserName(busqueda);
            // Manejo de array o registro único según la respuesta de tu API
            const u = Array.isArray(response.data) ? response.data[0] : response.data;

            if (u && u.idUsuario) {
                setFormData({
                    idUsuario: u.idUsuario,
                    rol: u.rol || '',
                    username: u.username || '',
                    nombres: u.nombres || '',
                    apellidos: u.apellidos || '',
                    dni: u.dni || '',
                    telefono: u.telefono || '',
                    correo: u.correo || '',
                    contrasenia: '' // Reset de contraseña para edición
                });
                setMensaje({ texto: 'Usuario cargado', tipo: 'info' });
            } else {
                setMensaje({ texto: 'No se encontró el usuario', tipo: 'danger' });
                setFormData(prev => ({ ...prev, idUsuario: '' }));
            }
        } catch (error) {
            setMensaje({ texto: 'Error en la búsqueda', tipo: 'danger' });
            setFormData(prev => ({ ...prev, idUsuario: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Se envía el ID para la URL y el objeto completo para el @RequestBody
            await actualizarUsuario(formData.idUsuario, formData);
            setMensaje({ texto: '¡Usuario actualizado con éxito!', tipo: 'success' });
        } catch (error) {
            // Muestra mensajes de error de validación del Backend (ej: DNI inválido)
            const errorMsg = error.response?.data?.message || 'Error al actualizar';
            setMensaje({ texto: errorMsg, tipo: 'danger' });
        }
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary">Actualización de Usuarios</h2>
                <LogoutButton />
            </div>

            {/* SECCIÓN BUSCADOR */}
            <div className="card mb-4 border-primary shadow-sm">
                <div className="card-body">
                    <form onSubmit={manejarBusqueda} className="row g-2 align-items-center">
                        <div className="col-auto">
                            <label className="fw-bold">Username del usuario:</label>
                        </div>
                        <div className="col-md-4">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Escriba el username exacto..." 
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-auto">
                            <button type="submit" className="btn btn-primary px-4">
                                Buscar Registro
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* FORMULARIO DE EDICIÓN */}
            {formData.idUsuario && (
                <div className="card shadow border-0">
                    <div className="card-header bg-success text-white py-3">
                        <h4 className="mb-0">Editando Usuario: {formData.username} (ID: {formData.idUsuario})</h4>
                    </div>
                    <div className="card-body p-4">
                        {mensaje.texto && (
                            <div className={`alert alert-${mensaje.tipo} alert-dismissible fade show`}>
                                {mensaje.texto}
                                <button type="button" className="btn-close" onClick={() => setMensaje({texto:'', tipo:''})}></button>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                {/* Rol informativo (deshabilitado) */}
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Rol Actual</label>
                                    <input type="text" className="form-control bg-light" value={formData.rol} disabled />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Username</label>
                                    <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Nombres</label>
                                    <input type="text" className="form-control" name="nombres" value={formData.nombres} onChange={handleChange} required />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Apellidos</label>
                                    <input type="text" className="form-control" name="apellidos" value={formData.apellidos} onChange={handleChange} required />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-bold">DNI</label>
                                    <input type="text" className="form-control" name="dni" value={formData.dni} onChange={handleChange} maxLength="8" required />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-bold">Teléfono</label>
                                    <input type="text" className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} maxLength="9" />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-bold">Correo</label>
                                    <input type="email" className="form-control" name="correo" value={formData.correo} onChange={handleChange} />
                                </div>

                                {/* Campo de Contraseña sincronizado con el DTO */}
                                <div className="col-12 bg-light p-3 rounded border">
                                    <label className="form-label fw-bold text-dark">Nueva Contraseña</label>
                                    <input 
                                        type="password" 
                                        className="form-control border-success" 
                                        name="contrasenia" 
                                        placeholder="Deje en blanco si no desea cambiar la clave"
                                        value={formData.contrasenia} 
                                        onChange={handleChange} 
                                    />
                                    <div className="form-text text-muted">Mínimo 4 caracteres para actualizar la seguridad.</div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <button type="submit" className="btn btn-warning btn-lg w-100 fw-bold">
                                    Confirmar y Actualizar Datos
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActualizarUsuario;