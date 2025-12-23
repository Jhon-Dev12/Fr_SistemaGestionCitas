import api from "./axiosConfig";

export const obtenerDisponibilidad = (idMedico, fecha) => {
    return api.get(`/api/recepcionista/slots/disponibilidad?idMedico=${idMedico}&fecha=${fecha}`);
};