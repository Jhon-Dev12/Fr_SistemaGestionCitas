import api from "./axiosConfig";

export const listarUsuarios = () => {
  return api.get("/api/administrador/especialidades");
};
