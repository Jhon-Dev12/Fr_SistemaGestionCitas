import api from "./axiosConfig"; // 1. Usar tu instancia configurada

const API_URL = "/api/dashboard"; // 2. Usar ruta relativa si axiosConfig tiene el baseURL

export const obtenerStatsAdmin = async () => {
    // 3. Ahora 'api' enviará el token automáticamente
    return await api.get(`${API_URL}/admin`);
};

export const obtenerStatsRecep = async () => {
    // 3. Ahora 'api' enviará el token automáticamente
    return await api.get(`${API_URL}/recepcion`);
};

export const obtenerStatsCaja = async () => {
    // 3. Ahora 'api' enviará el token automáticamente
    return await api.get(`${API_URL}/caja`);
};

export const obtenerStatsMedico = async () => {
    // 3. Ahora 'api' enviará el token automáticamente
    return await api.get(`${API_URL}/medico`);
};