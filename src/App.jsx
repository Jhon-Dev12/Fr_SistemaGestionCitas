import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Usuarios from "./Pages/Usuarios";
import Admin from "./Pages/Admin";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔥 REDIRECCIÓN INICIAL */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/usuarios"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_RECEPCIONISTA"]}>
              <Usuarios />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_ADMINISTRADOR"]}>
              <Admin />
            </PrivateRoute>
          }
        />

        <Route path="/no-autorizado" element={<h2>No autorizado</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
