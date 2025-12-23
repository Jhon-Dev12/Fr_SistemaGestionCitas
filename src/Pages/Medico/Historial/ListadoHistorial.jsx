import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarTodosLosHistoriales, buscarHistoriales } from "../../../Services/HistorialService";

const ListadoHistorialMedico = () => {
    const [historiales, setHistoriales] = useState([]);
    const [filtro, setFiltro] = useState("");
    const navigate = useNavigate();

    /* ===================== CARGA DE DATOS ===================== */

    const cargarDatos = (criterio = "") => {
        const peticion = criterio
            ? buscarHistoriales(criterio)
            : listarTodosLosHistoriales();

        peticion
            .then(res => {
                // El backend retorna 204 No Content si está vacío, axios lo maneja en res.data
                setHistoriales(res.data || []);
            })
            .catch(err => {
                console.error("Error al cargar historiales:", err);
                setHistoriales([]);
            });
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    /* ===================== BUSCADOR ===================== */

    const handleSearch = (e) => {
        const valor = e.target.value;
        setFiltro(valor);
        cargarDatos(valor);
    };

    /* ===================== ACCIONES ===================== */

    const handleVerDetalle = (id) => {
        // Redirige a la vista de detalle del historial
        navigate(`/medico/historial/detalle/${id}`);
    };

    /* ===================== UI ===================== */

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h1>Historiales Médicos</h1>
            </div>

            {/* BUSCADOR */}
            <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <input
                    type="text"
                    placeholder="Buscar por DNI o nombre del paciente..."
                    value={filtro}
                    onChange={handleSearch}
                    style={{
                        padding: "10px",
                        width: "450px",
                        borderRadius: "4px",
                        border: "1px solid #ccc"
                    }}
                />
                <button 
                    onClick={() => navigate("/medico/historial/nuevo")} 
                    style={{ 
                        cursor: "pointer", padding: "10px 20px", backgroundColor: "#28a745", 
                        color: "white", border: "none", borderRadius: "4px", fontWeight: "bold"
                    }}
                >Registrar Historial</button>

            </div>

            {/* TABLA */}
            <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                <thead>
                    <tr style={{ backgroundColor: "#2c3e50", color: "white", textAlign: "left" }}>
                        <th style={{ padding: "12px" }}>ID</th>
                        <th style={{ padding: "12px" }}>Fecha</th>
                        <th style={{ padding: "12px" }}>Paciente</th>
                        <th style={{ padding: "12px" }}>DNI Paciente</th>
                        <th style={{ padding: "12px" }}>Médico Responsable</th>
                        <th style={{ padding: "12px" }}>Especialidad</th>
                        <th style={{ padding: "12px" }}>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {historiales.length > 0 ? (
                        historiales.map(h => (
                            <tr key={h.idHistorial} style={{ borderBottom: "1px solid #ddd" }}>
                                <td style={{ padding: "12px" }}>{h.idHistorial}</td>
                                
                                <td style={{ padding: "12px" }}>
                                    {new Date(h.fecha).toLocaleDateString()}
                                </td>

                                <td style={{ padding: "12px", fontWeight: "bold" }}>
                                    {h.pacienteNombreCompleto}
                                </td>

                                <td style={{ padding: "12px" }}>
                                    {h.pacienteDni}
                                </td>

                                <td style={{ padding: "12px" }}>
                                    {h.nombreMedicoResponsable}
                                </td>

                                <td style={{ padding: "12px" }}>
                                    <span style={{
                                        padding: "4px 8px",
                                        backgroundColor: "#e9ecef",
                                        borderRadius: "4px",
                                        fontSize: "0.9em"
                                    }}>
                                        {h.especialidadNombre}
                                    </span>
                                </td>

                                <td style={{ padding: "12px" }}>
                                    <button
                                        type="button"
                                        onClick={() => handleVerDetalle(h.idHistorial)}
                                        style={{ 
                                            padding: "6px 12px", 
                                            cursor: "pointer",
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px"
                                        }}
                                    >
                                        Ver Detalle
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#666" }}>
                                No se encontraron registros de historiales médicos.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ListadoHistorialMedico;