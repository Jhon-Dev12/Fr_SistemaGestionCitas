import api from "./axiosConfig";

// Registrar un nuevo historial médico
// El backend obtiene el nombre del médico mediante el 'Principal' (token)
export const registrarHistorial = (dto) => {
    return api.post("/api/medico/historiales", dto);
};

// Listar todos los historiales médicos registrados
export const listarTodosLosHistoriales = () => {
    return api.get("/api/medico/historiales");
};

// Buscar historiales por criterio (nombre paciente, DNI, etc.)
export const buscarHistoriales = (criterio) => {
    // Se envía como Query Param: /api/medico/historiales/buscar?criterio=...
    return api.get(`/api/medico/historiales/buscar`, {
        params: { criterio: criterio || "" }
    });
};

// Obtener el detalle completo de un historial por su ID
export const obtenerDetalleHistorial = (id) => {
    return api.get(`/api/medico/historiales/${id}`);
};