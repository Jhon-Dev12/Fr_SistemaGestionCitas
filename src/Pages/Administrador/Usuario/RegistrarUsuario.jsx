import React, { useState, useEffect } from 'react';
import LogoutButton from "../../../components/LogoutButton";
import { registrarUsuario, listarRoles } from '../../../Services/UsuarioService';
import { useNavigate } from "react-router-dom";

const RegistroUsuario = () => {
    // Estado inicial basado en tu UsuarioRegistroDTO
    const [formData, setFormData] = useState({
        username: '',
        contrasenia: '',
        nombres: '',
        apellidos: '',
        dni: '',
        telefono: '',
        correo: '',
        rol: '' // Valor por defecto del enum TipoRol
    });

    const [roles, setRoles] = useState([]);
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
    const navigate = useNavigate()

useEffect(() => {
        const cargarRoles = async () => {
            try {
                const response = await listarRoles();
                // GUARDAMOS LOS OBJETOS COMPLETOS, no los transformamos a strings
                setRoles(response.data);
                
                // Establecemos el valor del primer rol como predeterminado en el formData
                if (response.data.length > 0) {
                    setFormData(prev => ({ 
                        ...prev, 
                        rol: response.data[0].value // Guardamos el .value en el estado del form
                    }));
                }
            } catch (error) {
                console.error("Error al cargar roles:", error);
                setMensaje({ texto: 'Error al cargar roles', tipo: 'danger' });
            }
        };
        cargarRoles();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registrarUsuario(formData);
            setMensaje({ texto: 'Usuario registrado exitosamente', tipo: 'success' });
            // Limpiar formulario si es necesario
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error al registrar';
            setMensaje({ texto: errorMsg, tipo: 'danger' });
        }
    };

    return (
        
        <div className="container mt-5">
            <LogoutButton />
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h3>Registro de Usuario</h3>
                </div>
                <div className="card-body">
                    {mensaje.texto && (
                        <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Username y Contraseña */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Username</label>
                                <input type="text" name="username" className="form-control" 
                                    onChange={handleChange} required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Contraseña</label>
                                <input type="password" name="contrasenia" className="form-control" 
                                    onChange={handleChange} required />
                            </div>

                            {/* Nombres y Apellidos */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Nombres</label>
                                <input type="text" name="nombres" className="form-control" 
                                    onChange={handleChange} required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Apellidos</label>
                                <input type="text" name="apellidos" className="form-control" 
                                    onChange={handleChange} required />
                            </div>

                            {/* DNI y Teléfono */}
                            <div className="col-md-4 mb-3">
                                <label className="form-label">DNI (8 dígitos)</label>
                                <input type="text" name="dni" className="form-control" 
                                    maxLength="8" onChange={handleChange} required />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Teléfono (9 dígitos)</label>
                                <input type="text" name="telefono" className="form-control" 
                                    maxLength="9" onChange={handleChange} />
                            </div>
                            {/* SELECT DINÁMICO DE ROLES */}
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Rol</label>
                                <select 
                                    name="rol" 
                                    className="form-select" 
                                    value={formData.rol} 
                                    onChange={handleChange}
                                    required
                                >
                                    {roles.length === 0 && <option value="">Cargando...</option>}
                                    {roles.map((rol, index) => (
                                        <option key={index} value={rol.value}> 
                                            {rol.label} {/* Esto mostrará el texto amigable */}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Correo */}
                            <div className="col-12 mb-3">
                                <label className="form-label">Correo Electrónico</label>
                                <input type="email" name="correo" className="form-control" 
                                    onChange={handleChange} />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-success w-100 mt-3">
                            Guardar Usuario
                        </button>

                    </form>
                    <button onClick={() => navigate("/administrador/usuario/editar")}> Editar Usuario</button>
                </div>
            </div>
        </div>
    );
};

export default RegistroUsuario;