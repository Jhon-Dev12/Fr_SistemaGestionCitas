import api from "./axiosConfig";

export const listarMedicos = () => {
  return api.get("/api/administrador/medicos");
};

export const buscarMedicoPorNombre = (criterio) => {
    return api.get(`/api/administrador/medicos/buscar?criterio=${criterio}`);
};

export const guardarMedico = (nuevoDato) => {
    return api.post("/api/administrador/medicos", nuevoDato);
};

export const obtenerMedicoPorId = (id) => {
    return api.get(`/api/administrador/medicos/${id}`);
};

export const actualizarMedico = (id, datos) => {
    return api.put(`/api/administrador/medicos/${id}`, datos);
};

export const obtenerDatosEditar = (id) => {
    return api.get(`/api/administrador/medicos/vistaEditar/${id}`);
};
