import { useEffect, useState } from "react";
import LogoutButton from "../../../components/LogoutButton";
import { listarLogs, buscarLogsPorFecha } from "../../../Services/LogService"; 

const ListadoLogs = () => {
    const [logs, setLogs] = useState([]);
    const [fechaFiltro, setFechaFiltro] = useState(""); // Estado para el input de fecha
    
    // Función para cargar los logs
    const cargarDatos = (fecha = "") => {
        const peticion = fecha 
            ? buscarLogsPorFecha(fecha) 
            : listarLogs();

        peticion
            .then((res) => {
                // Manejo de 204 No Content o array vacío
                setLogs(res.data || []);
            })
            .catch((err) => {
                console.error("Error al cargar logs:", err);
                setLogs([]);
            });
    };

    // Carga inicial al montar el componente
    useEffect(() => {
        cargarDatos();
    }, []);

    // Manejador del cambio en el input de fecha
    const handleSearch = (e) => {
        const valor = e.target.value; // Formato YYYY-MM-DD
        setFechaFiltro(valor);
        cargarDatos(valor); // Filtra inmediatamente al cambiar la fecha
    };

    // Formateador de fecha para la tabla (opcional)
    const formatearFecha = (fechaStr) => {
        const fecha = new Date(fechaStr);
        return fecha.toLocaleString(); // Retorna fecha y hora legible
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Historial de Acciones (Logs de Citas)</h1>
                <LogoutButton />
            </div>

            {/* 🔍 BUSCADOR POR FECHA */}
            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <label style={{ fontWeight: "bold" }}>Filtrar por día:</label>
                <input
                    type="date"
                    value={fechaFiltro}
                    onChange={handleSearch}
                    style={{ 
                        padding: "8px", 
                        borderRadius: "4px", 
                        border: "1px solid #ccc",
                        fontFamily: "inherit"
                    }}
                />
                <button 
                    onClick={() => { setFechaFiltro(""); cargarDatos(""); }}
                    style={{ cursor: "pointer", padding: "8px 15px" }}
                >
                    Limpiar Filtro
                </button>
            </div>
            
            <table border="1" style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                <thead>
                    <tr style={{ backgroundColor: "#333", color: "white", textAlign: "left" }}>
                        <th style={{ padding: "12px" }}>ID Log</th>
                        <th style={{ padding: "12px" }}>Fecha y Hora</th>
                        <th style={{ padding: "12px" }}>Acción</th>
                        <th style={{ padding: "12px" }}>ID Cita</th>
                        <th style={{ padding: "12px" }}>Usuario Actor</th>
                        <th style={{ padding: "12px" }}>Rol</th>
                        <th style={{ padding: "12px" }}>Detalle</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.length > 0 ? (
                        logs.map((log) => (
                            <tr key={log.idLog} style={{ borderBottom: "1px solid #ddd" }}>
                                <td style={{ padding: "12px" }}>{log.idLog}</td>
                                <td style={{ padding: "12px" }}>{formatearFecha(log.fechaAccion)}</td>
                                <td style={{ padding: "12px" }}>
                                    <span style={{ 
                                        fontWeight: "bold",
                                        color: log.accion === "ELIMINAR" ? "#dc3545" : "#28a745"
                                    }}>
                                        {log.accion}
                                    </span>
                                </td>
                                <td style={{ padding: "12px" }}>{log.idCita}</td>
                                <td style={{ padding: "12px" }}>{log.usuarioActorNombreCompleto}</td>
                                <td style={{ padding: "12px" }}>{log.rolUsuarioActor}</td>
                                <td style={{ padding: "12px", fontSize: "0.9em", fontStyle: "italic" }}>
                                    {log.detalle}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#666" }}>
                                No se encontraron registros de auditoría para esta fecha.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ListadoLogs;