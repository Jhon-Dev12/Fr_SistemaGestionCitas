import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { buscarCitaPorId } from "../../../Services/CitaService";

const DetalleCita = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cita, setCita] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        buscarCitaPorId(id)
            .then(res => {
                setCita(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al cargar detalle:", err);
                alert("No se pudo cargar el detalle de la cita.");
                navigate("/recepcionista/cita");
            });
    }, [id, navigate]);

    const getEstadoColor = (estado) => {
        const colors = {
            'PENDIENTE': '#f39c12',
            'CONFIRMADO': '#27ae60',
            'CANCELADO': '#e74c3c',
            'ATENDIDO': '#2980b9',
            'VENCIDO': '#7f8c8d'
        };
        return colors[estado] || '#333';
    };

    if (loading) return <div style={{ padding: "30px", textAlign: "center" }}>⏳ Cargando información detallada...</div>;

    return (
        <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #3498db", paddingBottom: "15px", marginBottom: "25px" }}>
                <h1 style={{ margin: 0, color: "#2c3e50" }}>📄 Detalle de Cita Médica N° {cita.idCita}</h1>
                <span style={{ 
                    padding: "8px 20px", borderRadius: "20px", color: "white", fontWeight: "bold",
                    backgroundColor: getEstadoColor(cita.estado)
                }}>
                    {cita.estado}
                </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
                
                {/* COLUMNA IZQUIERDA: PACIENTE Y MÉDICO */}
                <div>
                    {/* CARD PACIENTE */}
                    <div style={cardStyle}>
                        <h3 style={cardTitle}>👤 Información del Paciente</h3>
                        <div style={infoRow}>
                            <label style={labelStyle}>DNI:</label>
                            <span style={valueStyle}>{cita.pacienteDni}</span>
                        </div>
                        <div style={infoRow}>
                            <label style={labelStyle}>Nombre:</label>
                            <span style={valueStyle}>{cita.pacienteNombreCompleto}</span>
                        </div>
                    </div>

                    {/* CARD MÉDICO */}
                    <div style={{ ...cardStyle, marginTop: "20px" }}>
                        <h3 style={cardTitle}>🩺 Personal Médico</h3>
                        <div style={infoRow}>
                            <label style={labelStyle}>DNI:</label>
                            <span style={valueStyle}>{cita.medicoDni}</span>
                        </div>
                        <div style={infoRow}>
                            <label style={labelStyle}>Médico:</label>
                            <span style={valueStyle}>{cita.medicoNombreCompleto}</span>
                        </div>
                        <div style={infoRow}>
                            <label style={labelStyle}>Especialidad:</label>
                            <span style={valueStyle}>{cita.especialidadNombre}</span>
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: CITA Y REGISTRO */}
                <div>
                    {/* CARD HORARIO */}
                    <div style={cardStyle}>
                        <h3 style={cardTitle}>📅 Fecha y Hora</h3>
                        <div style={infoRow}>
                            <label style={labelStyle}>Día Programado:</label>
                            <span style={{ ...valueStyle, color: "#2c3e50", fontSize: "1.1rem" }}>{cita.fecha}</span>
                        </div>
                        <div style={infoRow}>
                            <label style={labelStyle}>Hora:</label>
                            <span style={{ ...valueStyle, color: "#2c3e50", fontSize: "1.1rem" }}>{cita.hora} hs</span>
                        </div>
                    </div>

                    {/* CARD REGISTRO */}
                    <div style={{ ...cardStyle, marginTop: "20px", backgroundColor: "#f8f9fa" }}>
                        <h3 style={{ ...cardTitle, color: "#666" }}>🛠️ Auditoría de Registro</h3>
                        <div style={infoRow}>
                            <label style={labelStyle}>Registrado por:</label>
                            <span style={valueStyle}>{cita.registradorNombreCompleto}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN INFERIOR: MOTIVO */}
            <div style={{ ...cardStyle, marginTop: "25px", borderLeft: "5px solid #3498db" }}>
                <h3 style={cardTitle}>📝 Motivo de la Cita</h3>
                <p style={{ 
                    padding: "15px", backgroundColor: "#fff", border: "1px solid #ddd", 
                    borderRadius: "4px", color: "#000", lineHeight: "1.6", margin: 0,
                    minHeight: "80px", fontSize: "15px"
                }}>
                    {cita.motivo || "No se especificó un motivo para esta cita."}
                </p>
            </div>

            {/* ACCIONES */}
            <div style={{ marginTop: "30px", display: "flex", gap: "15px" }}>
                <button 
                    onClick={() => navigate("/recepcionista/cita")}
                    style={btnBack}
                >
                    ⬅️ Volver al Listado
                </button>
                {(cita.estado === 'PENDIENTE' || cita.estado === 'CONFIRMADO') && (
                    <button 
                        onClick={() => navigate(`/recepcionista/cita/editar/${cita.idCita}`)}
                        style={btnEdit}
                    >
                        ✏️ Editar Cita
                    </button>
                )}
            </div>
        </div>
    );
};

// --- ESTILOS ---
const cardStyle = { 
    padding: "20px", border: "1px solid #ccc", borderRadius: "8px", 
    backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" 
};
const cardTitle = { marginTop: 0, marginBottom: "15px", fontSize: "1rem", color: "#34495e", borderBottom: "1px solid #eee", paddingBottom: "8px" };
const infoRow = { marginBottom: "10px", display: "flex", flexDirection: "column" };
const labelStyle = { fontSize: "11px", fontWeight: "bold", color: "#7f8c8d", textTransform: "uppercase" };
const valueStyle = { fontSize: "15px", color: "#000", fontWeight: "500", marginTop: "2px" };

const btnBack = { 
    padding: "12px 25px", backgroundColor: "#6c757d", color: "white", 
    border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" 
};
const btnEdit = { 
    padding: "12px 25px", backgroundColor: "#2980b9", color: "white", 
    border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" 
};

export default DetalleCita;