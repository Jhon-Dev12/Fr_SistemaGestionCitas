import api from "./axiosConfig";

export const listarEspecialidades = () => {
  return api.get("/api/administrador/especialidades");
};

export const buscarEspecialidadPorNombre = (nombre) => {
    return api.get(`/api/administrador/especialidades/buscar?nombre=${nombre}`);
};

export const guardarEspecialidad = (nuevoDato) => {
    return api.post("/api/administrador/especialidades", nuevoDato);
};

// Obtener una especialidad por ID para cargar el formulario
export const obtenerEspecialidadPorId = (id) => {
    return api.get(`/api/administrador/especialidades/${id}`);
};

// Actualizar la especialidad (PUT)
export const actualizarEspecialidad = (id, datos) => {
    return api.put(`/api/administrador/especialidades/${id}`, datos);
};

export const eliminarEspecialidad = (id) => {
    return api.delete(`/api/administrador/especialidades/${id}`);
};