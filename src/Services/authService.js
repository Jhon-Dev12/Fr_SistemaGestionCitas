import api from "./axiosConfig";

export const login = (username, password) => {
  return api.post("/api/test/login", { username, password });
};



export const me = () => {
  return api.get("/api/test/me");
};

export const logout = () => {
  return api.post("/api/logout");
};
