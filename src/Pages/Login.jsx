import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, me } from "../Services/authService";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      const res = await login(username, password);
        const roles = res.data.roles.map(r => r.authority); // O r.toString() dependiendo de cómo venga


      localStorage.setItem("roles", JSON.stringify(roles));
      localStorage.setItem("auth", "true");

      if (roles.includes("ROLE_ADMINISTRADOR")) navigate("/admin", { replace: true });
      else if (roles.includes("ROLE_RECEPCIONISTA")) navigate("/usuarios", { replace: true });
      else if (roles.includes("ROLE_CAJERO")) navigate("/cajero", { replace: true });
      else if (roles.includes("ROLE_MEDICO")) navigate("/medico", { replace: true });
      else navigate("/", { replace: true });

    } catch {
      alert("Credenciales incorrectas");
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
