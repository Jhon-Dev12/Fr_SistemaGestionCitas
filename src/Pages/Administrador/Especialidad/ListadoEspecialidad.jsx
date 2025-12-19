import { useEffect, useState } from "react";
import LogoutButton from "../../../components/LogoutButton";
import { useNavigate } from "react-router-dom";
import { listarEspecialidades, buscarEspecialidadPorNombre, eliminarEspecialidad } from "../../../Services/EspecialidadService";

const ListadoEspecialidad = () => {
    const [especialidades, setEspecialidades] = useState([]);
    const [filtro, setFiltro] = useState(""); // Estado para el texto del buscador
    const navigate = useNavigate()

    // Función para cargar datos (se usa para carga inicial y para el buscador)
    const cargarDatos = (nombre = "") => {
        const peticion = nombre 
            ? buscarEspecialidadPorNombre(nombre) 
            : listarEspecialidades();

        peticion
            .then((res) => {
                setEspecialidades(res.data || []);
            })
            .catch((err) => console.error("Error al filtrar:", err));
    };

    const handleEliminar = (id) => {
    // 🛡️ Ventana de confirmación para evitar borrados accidentales
    if (window.confirm("¿Estás seguro de que deseas eliminar esta especialidad?")) {
        eliminarEspecialidad(id)
            .then(() => {
                alert("Especialidad eliminada correctamente.");
                cargarDatos(); // 🔥 Recargamos la lista sin refrescar la página
            })
            .catch((err) => {
                console.error("Error al eliminar:", err);
                // Si la especialidad tiene médicos o citas asociadas, Spring podría dar error de integridad
                alert("No se pudo eliminar: la especialidad podría estar en uso.");
            });
    }
};

    // Carga inicial
    useEffect(() => {
        cargarDatos();
    }, []);

    // Manejador del cambio en el input
    const handleSearch = (e) => {
        const valor = e.target.value;
        setFiltro(valor);
        cargarDatos(valor); // Llama a la API con cada tecla presionada
    };

    // 🔥 Función para redirigir al formulario de creación
    const handleNuevo = () => {
        navigate("/administrador/especialidad/nuevo");
    };

    // 🔥 Función para redirigir al formulario de edición pasando el ID
    const handleEditar = (id) => {
        navigate(`/administrador/especialidad/editar/${id}`);
    };

    return (
        <div style={{ padding: "20px" }}>
            <LogoutButton />
            <h1>Módulo de Especialidades</h1>

            {/* 🔍 BUSCADOR */}
            <div style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Buscar especialidad por nombre..."
                    value={filtro}
                    onChange={handleSearch}
                    style={{ padding: "8px", width: "300px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
                <button onClick={handleNuevo} style={{ cursor: "pointer" }}>
                    Nueva Especialidad
                </button>
            </div>
            
            <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ backgroundColor: "#333", color: "white" }}>
                        <th>ID</th>
                        <th>Nombre de Especialidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {especialidades.length > 0 ? (
                        especialidades.map((item) => (
                            <tr key={item.idEspecialidad}>
                                <td>{item.idEspecialidad}</td>
                                <td>{item.nombreEspecialidad}</td>
                                <td><button onClick={() => handleEditar(item.idEspecialidad)}>
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
                                    </button></td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" style={{ textAlign: "center", padding: "10px" }}>
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