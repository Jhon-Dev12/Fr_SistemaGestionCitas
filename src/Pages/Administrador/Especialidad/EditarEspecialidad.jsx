import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { obtenerEspecialidadPorId, actualizarEspecialidad } from "../../../Services/EspecialidadService";

const EditarEspecialidad = () => {
    const { id } = useParams(); // Captura el ID de la URL
    const [nombre, setNombre] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 1. Cargar el nombre actual al entrar
    useEffect(() => {
        obtenerEspecialidadPorId(id)
            .then(res => {
                // "Tipea" el nombre actual cargado desde la base de datos
                setNombre(res.data.nombreEspecialidad); 
            })
            .catch(err => {
                // Ahora 'err' está siendo usado para depuración en consola
                console.error("Detalle del error:", err); 
                setError("No se pudo cargar la especialidad.");
            }); 
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Enviamos al @PutMapping("/{id}")
            await actualizarEspecialidad(id, { idEspecialidad: id, nombreEspecialidad: nombre });
            alert("Especialidad actualizada!");
            navigate("/administrador/especialidad");
        } catch (err) {
            setError(err.response?.data?.message || "Error al actualizar");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Editar Especialidad #{id}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={nombre} // Aquí aparece el nombre actual cargado
                    onChange={(e) => setNombre(e.target.value)}
                    style={{ padding: "8px", width: "300px" }}
                />
                <div style={{ marginTop: "10px" }}>
                    <button type="submit">Actualizar</button>
                    <button type="button" onClick={() => navigate("/administrador/especialidad")}>
                        Cancelar
                    </button>
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
    );
};

export default EditarEspecialidad;