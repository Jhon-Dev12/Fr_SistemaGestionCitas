import api from "./axiosConfig";

export const listarPacientes = () => {
  return api.get("/api/recepcionista/pacientes");
};

export const buscarPacientePorCriterio = (criterio) => {
  return api.get(`/api/recepcionista/pacientes/buscar?criterio=${criterio}`);
};


// PacienteService.js
export const registrarPaciente = (nuevoPaciente) => {
  return api.post("/api/recepcionista/pacientes", nuevoPaciente);
};


export const obtenerPacientePorId = (id) => {
  return api.get(`/api/recepcionista/pacientes/${id}`);
};

export const actualizarPaciente = (id, datos) => {
  return api.put(`/api/recepcionista/pacientes/${id}`, datos);
};

export const eliminarPaciente = (id) => {
  return api.delete(`/api/recepcionista/pacientes/${id}`);
};
