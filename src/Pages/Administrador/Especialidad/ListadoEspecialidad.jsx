import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarEspecialidades, buscarEspecialidadPorNombre, eliminarEspecialidad } from "../../../Services/EspecialidadService";

const ListadoEspecialidad = () => {
    const [especialidades, setEspecialidades] = useState([]);
    const [filtro, setFiltro] = useState("");
    const navigate = useNavigate();

    // NUEVO: Estado para manejar mensajes de error específicos
    const [mensajeError, setMensajeError] = useState(null);

    const cargarDatos = (nombre = "") => {
        const peticion = nombre 
            ? buscarEspecialidadPorNombre(nombre) 
            : listarEspecialidades();

        peticion
            .then((res) => {
                setEspecialidades(res.data || []);
                setMensajeError(null); // Limpiamos errores al cargar con éxito
            })
            .catch((err) => console.error("Error al filtrar:", err));
    };

    const handleEliminar = (id) => {
        setMensajeError(null); // Resetear error previo

        if (window.confirm("¿Estás seguro de que deseas eliminar esta especialidad?")) {
            eliminarEspecialidad(id)
                .then(() => {
                    alert("Especialidad eliminada correctamente.");
                    cargarDatos(filtro); // Recargar manteniendo el filtro actual
                })
                .catch((err) => {
                    console.error("Error al eliminar:", err);
                    
                    // CAPTURA DETALLADA DEL ERROR
                    if (err.response) {
                        // El servidor respondió con un código de estado fuera del rango 2xx
                        const status = err.response.status;
                        const data = err.response.data;

                        if (status === 409 || status === 500) {
                            // 409 Conflict suele ser el error de integridad referencial
                            setMensajeError("No se puede eliminar: existen médicos o citas asociados a esta especialidad.");
                        } else {
                            setMensajeError(data.mensaje || "Ocurrió un error inesperado al eliminar.");
                        }
                    } else {
                        setMensajeError("Error de conexión con el servidor.");
                    }
                });
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleSearch = (e) => {
        const valor = e.target.value;
        setFiltro(valor);
        cargarDatos(valor);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Módulo de Especialidades</h1>

            {/* MOSTRAR MENSAJE DE ERROR SI EXISTE */}
            {mensajeError && (
                <div style={{ 
                    backgroundColor: "#f8d7da", 
                    color: "#721c24", 
                    padding: "10px", 
                    borderRadius: "4px", 
                    marginBottom: "20px",
                    border: "1px solid #f5c6cb"
                }}>
                    <i className="bi bi-exclamation-octagon-fill me-2"></i>
                    {mensajeError}
                </div>
            )}

            <div style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Buscar especialidad por nombre..."
                    value={filtro}
                    onChange={handleSearch}
                    style={{ padding: "8px", width: "300px", borderRadius: "4px", border: "1px solid #ccc", marginRight: "10px" }}
                />
                <button 
                    onClick={() => navigate("/administrador/especialidad/nuevo")} 
                    className="btn btn-primary"
                >
                    Nueva Especialidad
                </button>
            </div>
            
            <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ backgroundColor: "#333", color: "white" }}>
                        <th style={{ padding: "10px" }}>ID</th>
                        <th>Nombre de Especialidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {especialidades.length > 0 ? (
                        especialidades.map((item) => (
                            <tr key={item.idEspecialidad} style={{ borderBottom: "1px solid #ddd" }}>
                                <td style={{ textAlign: "center", padding: "10px" }}>{item.idEspecialidad}</td>
                                <td>{item.nombreEspecialidad}</td>
                                <td style={{ textAlign: "center" }}>
                                    <button 
                                        onClick={() => navigate(`/administrador/especialidad/editar/${item.idEspecialidad}`)}
                                        style={{ marginRight: "5px" }}
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => handleEliminar(item.idEspecialidad)} 
                                        style={{ 
                                            backgroundColor: "#dc3545", 
                                            color: "white", 
                                            border: "none", 
                                            padding: "5px 10px", 
                                            borderRadius: "4px", 
                                            cursor: "pointer" 
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                                No se encontraron resultados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ListadoEspecialidad;