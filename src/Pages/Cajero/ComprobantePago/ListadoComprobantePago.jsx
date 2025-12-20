import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../../../components/LogoutButton";

import {
    listarComprobantesPago,
    buscarComprobantesPago,
    anularComprobantePago
} from "../../../Services/ComprobanteService";

const ListadoComprobantesPago = () => {
    const [comprobantes, setComprobantes] = useState([]);
    const [filtro, setFiltro] = useState("");
    const navigate = useNavigate();

    /* ===================== CARGA DE DATOS ===================== */

    const cargarDatos = (criterio = "") => {
        const peticion = criterio
            ? buscarComprobantesPago(criterio)
            : listarComprobantesPago();

        peticion
            .then(res => setComprobantes(res.data || []))
            .catch(err => {
                console.error("Error al cargar comprobantes:", err);
                setComprobantes([]);
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

    const handleNuevo = () => {
        navigate("/cajero/pagos/nuevo");
    };

    const handleDetalle = (id) => {
        navigate(`/cajero/pagos/detalle/${id}`);
    };

    const handleAnular = async (id) => {
        if (!window.confirm("¿Está seguro de anular este comprobante?")) return;

        try {
            await anularComprobantePago(id);
            cargarDatos(filtro);
        } catch (err) {
            alert("No se pudo anular el comprobante");
        }
    };

    /* ===================== UI ===================== */

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Módulo de Pagos</h1>
                <LogoutButton />
            </div>

            {/* BUSCADOR Y NUEVO */}
            <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <input
                    type="text"
                    placeholder="Buscar por DNI del pagador, paciente o comprobante..."
                    value={filtro}
                    onChange={handleSearch}
                    style={{
                        padding: "10px",
                        width: "380px",
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
                    Registrar Pago
                </button>
            </div>

            {/* TABLA */}
            <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                <thead>
                    <tr style={{ backgroundColor: "#333", color: "white", textAlign: "left" }}>
                        <th style={{ padding: "12px" }}>ID</th>
                        <th style={{ padding: "12px" }}>Fecha</th>
                        <th style={{ padding: "12px" }}>Pagador</th>
                        <th style={{ padding: "12px" }}>DNI Pagador</th>
                        <th style={{ padding: "12px" }}>Paciente</th>
                        <th style={{ padding: "12px" }}>Monto</th>
                        <th style={{ padding: "12px" }}>Estado</th>
                        <th style={{ padding: "12px" }}>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {comprobantes.length > 0 ? (
                        comprobantes.map(c => (
                            <tr key={c.idComprobante} style={{ borderBottom: "1px solid #ddd" }}>
                                <td style={{ padding: "12px" }}>{c.idComprobante}</td>

                                <td style={{ padding: "12px" }}>
                                    {new Date(c.fechaEmision).toLocaleString()}
                                </td>

                                <td style={{ padding: "12px" }}>
                                    {c.nombresPagador} {c.apellidosPagador}
                                </td>

                                <td style={{ padding: "12px" }}>
                                    {c.dniPagador}
                                </td>

                                <td style={{ padding: "12px" }}>
                                    {c.pacienteNombreCompleto}
                                </td>

                                <td style={{ padding: "12px" }}>
                                    S/ {Number(c.monto).toFixed(2)}
                                </td>

                                <td style={{ padding: "12px" }}>
                                    <span
                                        style={{
                                            padding: "4px 10px",
                                            borderRadius: "10px",
                                            fontSize: "0.85em",
                                            backgroundColor:
                                                c.estado === "ANULADO" ? "#dc3545" : "#28a745",
                                            color: "white"
                                        }}
                                    >
                                        {c.estado}
                                    </span>
                                </td>

                                <td style={{ padding: "12px", display: "flex", gap: "5px" }}>
                                    <button
                                        type="button"
                                        onClick={() => handleDetalle(c.idComprobante)}
                                        style={{ padding: "5px 10px", cursor: "pointer" }}
                                    >
                                        Ver
                                    </button>


                                    {c.estado !== "ANULADO" && (
                                    <button
                                        type="button"
                                        onClick={() => handleAnular(c.idComprobante)}
                                        style={{
                                            padding: "5px 10px",
                                            cursor: "pointer",
                                            backgroundColor: "#dc3545",
                                            color: "white",
                                            border: "none"
                                        }}
                                    >
                                        Anular
                                    </button>

                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                                No se encontraron comprobantes registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ListadoComprobantesPago;
