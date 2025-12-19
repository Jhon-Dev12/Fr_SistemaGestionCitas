import { Outlet, useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

const AdminLayout = () => {
  const navigate = useNavigate();

  return (
    <>
      <LogoutButton />
      <h1>Panel Administrador</h1>

      <button onClick={() => navigate("buscar")}>
        Buscar usuario
      </button>

      <button onClick={() => navigate("usuarios")}>
        Usuarios
      </button>

      <Outlet />
    </>
  );
};

export default AdminLayout;
