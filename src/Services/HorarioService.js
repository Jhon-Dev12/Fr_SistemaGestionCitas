import api from "./axiosConfig";

// Servicios específicos de Horarios
export const registrarHorario = (dto) => {
    return api.post("/api/administrador/horarios", dto);
};

export const listarHorariosPorMedico = (idMedico) => {
    return api.get(`/api/administrador/horarios/medico/${idMedico}`);
};

// Servicio de búsqueda (Usa el endpoint de médicos para el modal)
export const buscarMedicosParaHorario = (criterio) => {
    // Si criterio es vacío, el backend debería retornar la lista completa por defecto
    return api.get(`/api/administrador/medicos/buscar?criterio=${criterio || ""}`);
};

export const eliminarHorario = (id) => {
    // Llama al endpoint DELETE /{id}
    return api.delete(`/api/administrador/horarios/${id}`);
};

export const proyeccionPorMedico = (idMedico) => {
    return api.get(`/api/administrador/horarios/${idMedico}`);
};