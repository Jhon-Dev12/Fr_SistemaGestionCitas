import api from "./axiosConfig";

export const obtenerAgendaMedico = (fecha) => {
    // Se envía la fecha como Query Param si existe
    // Ejemplo: /api/medico/1/agenda?fecha=2025-12-21
    return api.get(`/api/medico/agenda`, {
        params: fecha ? { fecha } : {}
    });
};