import api from "./axiosConfig";

export const registrarUsuario = (formData) => {
    return api.post("/api/administrador/usuarios", formData,{
        headers:{
            "Content-Type": "multipart/form-data",
        }
    });
};

export const actualizarUsuario = (id, formData) => {
    return api.put(`/api/administrador/usuarios/${id}`, formData, {
        headers:{
            "Content-Type": "multipart/form-data",
        }
    });
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

export const cambiarEstadoUsuario = (id) => {
    return api.patch(`/api/administrador/usuarios/${id}/estado`);
};
