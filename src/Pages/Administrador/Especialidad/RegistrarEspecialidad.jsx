import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { guardarEspecialidad } from "../../../Services/EspecialidadService";

const RegistrarEspecialidad = () => {
    const [nombre, setNombre] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validación básica coincidente con @NotBlank y @Pattern
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(\s?[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;
        
        if (!nombre.trim()) {
            setError("El nombre de la especialidad es obligatorio.");
            return;
        }
        
        if (!regex.test(nombre)) {
            setError("El nombre solo puede contener letras y espacios.");
            return;
        }

        try {
            // Enviamos el objeto con la llave exacta del DTO
            await guardarEspecialidad({ nombreEspecialidad: nombre });
            alert("Especialidad registrada con éxito");
            navigate("/administrador/especialidad");
        } catch (err) {
            const mensajeServer = err.response?.data?.message || "Error al registrar la especialidad.";
            setError(mensajeServer);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Registrar Nueva Especialidad</h2>
            <form onSubmit={handleSubmit} style={{ maxWidth: "450px", border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Nombre de la Especialidad:</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => {
                            setNombre(e.target.value);
                            setError(null);
                        }}
                        placeholder="Ej: Pediatría"
                        style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
                    />
                    <small style={{ color: "#666" }}>Solo se permiten letras y espacios.</small>
                </div>

                {error && (
                    <div style={{ color: "white", backgroundColor: "#ff4d4d", padding: "10px", borderRadius: "4px", marginBottom: "15px" }}>
                        {error}
                    </div>
                )}

                <div style={{ display: "flex", gap: "10px" }}>
                    <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                        Guardar Especialidad
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate("/administrador/especialidad")}
                        style={{ padding: "10px 20px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegistrarEspecialidad;