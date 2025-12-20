import api from "./axiosConfig";

const BASE_URL = "/api/cajero/citas";

export const listarCitasPendientesPago = () => {
    return api.get(`${BASE_URL}/pendientes`);
};

export const buscarCitasPendientesPago = (filtro) => {
    return api.get(`${BASE_URL}/pendientes/buscar`, {
        params: { filtro }
    });
};
