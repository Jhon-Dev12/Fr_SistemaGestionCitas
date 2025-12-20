import api from "./axiosConfig"; 

const BASE_URL = "/api/cajero/pagos";

export const registrarComprobantePago = (data) => {
    return api.post(BASE_URL, data);
};

export const listarComprobantesPago = () => {
    return api.get(BASE_URL);
};

export const obtenerDetalleComprobante = (id) => {
    return api.get(`${BASE_URL}/${id}`);
};

export const buscarComprobantesPago = (filtro) => {
    return api.get(`${BASE_URL}/buscar`, {
        params: { filtro }
    });
};

export const anularComprobantePago = (id) => {
    return api.patch(`${BASE_URL}/${id}/anular`);
};

export const listarMetodosPago = () => {
    return api.get(`${BASE_URL}/metodos`);
};
