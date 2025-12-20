import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerDatosEditar, actualizarMedico } from "../../../Services/MedicoService";
import { listarEspecialidades } from "../../../Services/EspecialidadService";

const EditarMedico = () => {
    const { id } = useParams(); // Captura el ID de la URL (/editar/:id)
    const navigate = useNavigate();

    // Estado para los datos que se mostrarán y editarán
    const [formData, setFormData] = useState({
        nombreCompletoUsuario: "", // Solo lectura
        nroColegiatura: "",        // Editable
        idEspecialidad: ""         // Editable
    });

    const [especialidades, setEspecialidades] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

useEffect(() => {
    const cargarPagina = async () => {
        try {
            const [resEspecialidades, resMedico] = await Promise.all([
                listarEspecialidades(),
                obtenerDatosEditar(id) 
            ]);

            setEspecialidades(resEspecialidades.data || []);
            
            const data = resMedico.data;
            setFormData({
                nombreCompletoUsuario: data.nombreCompletoUsuario,
                nroColegiatura: data.nroColegiatura,
                // AQUÍ: Seteamos el ID que viene del backend
                idEspecialidad: data.idEspecialidad || "" 
            });
        } catch (err) {
            setError("Error al cargar los datos.");
        } finally {
            setLoading(false);
        }
    };
    cargarPagina();
}, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Construimos el DTO de actualización
            const payload = {
                idMedico: Number(id),
                nroColegiatura: formData.nroColegiatura.trim(),
                idEspecialidad: Number(formData.idEspecialidad)
            };

            await actualizarMedico(id, payload); //
            alert("Información actualizada con éxito");
            navigate("/administrador/medico");
        } catch (err) {
            setError(err.response?.data?.message || "Error al actualizar médico.");
        }
    };

    if (loading) return <div className="container mt-5 text-center"><h5>Cargando datos...</h5></div>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Modificar Médico</h2>

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">
                {/* INFORMACIÓN DE SOLO LECTURA */}
                <div className="mb-3">
                    <label className="form-label fw-bold text-muted">Nombre del Médico:</label>
                    <input 
                        type="text" 
                        className="form-control bg-light" 
                        value={formData.nombreCompletoUsuario} 
                        readOnly 
                    />
                    <div className="form-text">El usuario vinculado no puede ser modificado.</div>
                </div>

                <div className="row">
                    {/* COLEGIATURA EDITABLE */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Nro. Colegiatura:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={formData.nroColegiatura}
                            onChange={(e) => setFormData({...formData, nroColegiatura: e.target.value})}
                            required 
                        />
                    </div>

                    {/* CAMBIO DE ESPECIALIDAD */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Nueva Especialidad:</label>
                        <select 
                            className="form-select border-primary" 
                            value={formData.idEspecialidad}
                            onChange={(e) => setFormData({...formData, idEspecialidad: e.target.value})}
                            required
                        >
                            <option value="">-- Cambiar especialidad --</option>
                            {especialidades.map(e => (
                                <option key={e.idEspecialidad} value={e.idEspecialidad}>
                                    {e.nombreEspecialidad}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {error && <div className="alert alert-danger mt-3">{error}</div>}

                <div className="d-flex gap-2 mt-4">
                    <button type="submit" className="btn btn-primary px-4">Actualizar Médico</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/administrador/medico")}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditarMedico;