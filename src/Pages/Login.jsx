import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login} from "../Services/authService";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await login(username, password);
        
        // El servidor ahora devuelve: { username, nombres, apellidos, rol, imgPerfil }
        const { rol } = res.data; 

        // 1. Guardamos el objeto completo para el Header (Layout)
        localStorage.setItem("usuario_sesion", JSON.stringify(res.data));
        
        // 2. Guardamos datos de control de acceso
        localStorage.setItem("roles", JSON.stringify([`ROLE_${rol}`]));
        localStorage.setItem("auth", "true");

        // 3. Redirección basada en el nuevo formato de rol
        if (rol === "ADMINISTRADOR") {
            navigate("/administrador", { replace: true });
        } else if (rol === "RECEPCIONISTA") {
            navigate("/recepcionista", { replace: true });
        } else if (rol === "CAJERO") {
            navigate("/cajero", { replace: true });
        } else if (rol === "MEDICO") {
            navigate("/medico", { replace: true });
        } else {
            navigate("/", { replace: true });
        }

    } catch (error) {
        console.error(error);
        alert("Credenciales incorrectas o error de conexión");
    }
};

  return (
    <form onSubmit={handleSubmit}>
      <input value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button>Login</button>
    </form>
  );
};

export default Login;
