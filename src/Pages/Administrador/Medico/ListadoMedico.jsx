import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../../../components/LogoutButton";
// Importamos los servicios de médicos
import { listarMedicos, buscarMedicoPorNombre } from "../../../Services/MedicoService"; 

const ListadoMedico = () => {
    const [medicos, setMedicos] = useState([]);
    const [filtro, setFiltro] = useState(""); 
    const navigate = useNavigate();

    // Función para cargar datos (lista completa o filtrada)
    const cargarDatos = (criterio = "") => {
        const peticion = criterio 
            ? buscarMedicoPorNombre(criterio) 
            : listarMedicos();

        peticion
            .then((res) => {
                setMedicos(res.data || []);
            })
            .catch((err) => console.error("Error al cargar médicos:", err));
    };

    // Carga inicial al montar el componente
    useEffect(() => {
        cargarDatos();
    }, []);

    // Manejador del buscador
    const handleSearch = (e) => {
        const valor = e.target.value;
        setFiltro(valor);
        cargarDatos(valor); 
    };

    const handleNuevo = () => {
        navigate("/administrador/medico/nuevo");
    };

    const handleEditar = (id) => {
        navigate(`/administrador/medico/editar/${id}`);
    };


    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Módulo de Médicos</h1>
                <LogoutButton />
            </div>

            {/* 🔍 BUSCADOR Y BOTÓN NUEVO */}
            <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <input
                    type="text"
                    placeholder="Filtrar médico por nombre o DNI..."
                    value={filtro}
                    onChange={handleSearch}
                    style={{ 
                        padding: "10px", 
                        width: "350px", 
                        borderRadius: "4px", 
                        border: "1px solid #ccc" 
                    }}
                />
                <button 
                    onClick={handleNuevo} 
                    style={{ 
                        cursor: "pointer", 
                        padding: "10px 20px", 
                        backgroundColor: "#28a745", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "4px" 
                    }}
                >
                    Registrar Nuevo Médico
                </button>
            </div>
            
            <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                <thead>
                    <tr style={{ backgroundColor: "#333", color: "white", textAlign: "left" }}>
                        <th style={{ padding: "12px" }}>ID</th>
                        <th style={{ padding: "12px" }}>Médico (Nombres y Apellidos)</th>
                        <th style={{ padding: "12px" }}>DNI</th>
                        <th style={{ padding: "12px" }}>Colegiatura</th>
                        <th style={{ padding: "12px" }}>Especialidad</th>
                        <th style={{ padding: "12px" }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {medicos.length > 0 ? (
                        medicos.map((m) => (
                            <tr key={m.idMedico} style={{ borderBottom: "1px solid #ddd" }}>
                                <td style={{ padding: "12px" }}>{m.idMedico}</td>
                                <td style={{ padding: "12px" }}>{`${m.nombres} ${m.apellidos}`}</td>
                                <td style={{ padding: "12px" }}>{m.dni}</td>
                                <td style={{ padding: "12px" }}>{m.nroColegiatura}</td>
                                <td style={{ padding: "12px" }}>
                                    <span style={{ 
                                        padding: "3px 8px", 
                                        borderRadius: "10px", 
                                        fontSize: "0.9em" 
                                    }}>
                                        {m.nombreEspecialidad}
                                    </span>
                                </td>
                                <td style={{ padding: "12px", display: "flex", gap: "5px" }}>
                                    <button 
                                        onClick={() => handleEditar(m.idMedico)}
                                        style={{ padding: "5px 10px", cursor: "pointer" }}
                                    >
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                                No se encontraron médicos registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ListadoMedico;