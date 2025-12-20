import api from "./axiosConfig";

export const registrarUsuario = (nuevoDato) => {
    return api.post("/api/administrador/usuarios", nuevoDato);
};

export const actualizarUsuario = (id, datos) => {
    return api.put(`/api/administrador/usuarios/${id}`, datos);
};

export const buscarUsuariosPorUserName = (username) => {
    return api.get(`/api/administrador/usuarios/username/${username}`);
};

export const listarRoles = () => {
  return api.get("/api/administrador/usuarios/roles");
};

export const buscarDisponiblesParaMedico = (criterio) => {
    return api.get(`/api/administrador/usuarios/buscar?criterio=${criterio}`);
};


