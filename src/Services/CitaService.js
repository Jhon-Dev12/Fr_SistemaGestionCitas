import api from "./axiosConfig";

const BASE_URL = "/api/recepcionista/citas";

// Operaciones generales
export const listarCitas = () => 
    api.get(`${BASE_URL}`);

export const buscarCitaPorId = (id) => 
    api.get(`${BASE_URL}/${id}`);

export const buscarCitasPorCriterio = (filtro) => 
    api.get(`${BASE_URL}/buscar`, { params: { filtro } });

// Operaciones por estado (Pendientes de Pago)
export const listarCitasPendientesPago = () => 
    api.get(`${BASE_URL}/pendientes`);

export const buscarCitasPendientesPago = (filtro) => 
    api.get(`${BASE_URL}/pendientes/buscar`, { params: { filtro } });

// Operaciones por estado (Confirmadas)
export const buscarCitasConfirmadas = (filtro) => 
    api.get(`${BASE_URL}/confirmadas/buscar`, { params: { filtro } });

// Acciones de escritura
export const registrarCita = (dto) => 
    api.post(`${BASE_URL}`, dto);

export const actualizarCita = (id, dto) => 
    api.put(`${BASE_URL}/${id}`, dto);

export const anularCita = (id) => 
    api.patch(`${BASE_URL}/${id}/anular`);