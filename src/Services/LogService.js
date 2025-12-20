import api from "./axiosConfig";

/**
 * Obtiene el listado completo de logs de auditoría de citas.
 */
export const listarLogs = () => {
    return api.get("/api/administrador/logs");
};

/**
 * Filtra los logs de citas por una fecha específica (YYYY-MM-DD).
 */
export const buscarLogsPorFecha = (fecha) => {
    return api.get(`/api/administrador/logs/buscar?fecha=${fecha}`);
};