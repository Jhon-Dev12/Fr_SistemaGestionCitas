import { useEffect } from "react";
import { listarUsuarios } from "../Services/UsuarioService";

const Usuarios = () => {

  useEffect(() => {
    listarUsuarios()
      .then(res => console.log(res.data))
      .catch(err => console.error("Error:", err));
  }, []);
  
  return <div>Usuarios </div>;
};

export default Usuarios;
