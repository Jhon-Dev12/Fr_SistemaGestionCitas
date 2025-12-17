import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, rolesPermitidos }) => {
  const isAuth = localStorage.getItem("auth") === "true";
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");

  console.log("PrivateRoute -> isAuth:", isAuth);
  console.log("PrivateRoute -> roles:", roles, "permitidos:", rolesPermitidos);

  if (!isAuth) {
    console.log("Usuario no autenticado, redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }

  if (rolesPermitidos && !rolesPermitidos.some(r => roles.includes(r))) {
    console.log("Usuario no tiene rol permitido, redirigiendo a /no-autorizado");
    return <Navigate to="/no-autorizado" replace />;
  }

  console.log("Acceso permitido a la ruta");
  return children;
};

export default PrivateRoute;
