import { useNavigate } from "react-router-dom";
import { logout } from "../Services/authService";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      localStorage.clear();
      navigate("/login", { replace: true });
    }
  };

  return (
    <button onClick={handleLogout}>
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
