import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Recepcionista from "./Pages/Recepcionista";

import Administrador from "./Pages/Administrador/Administrador";
import ListadoEspecialidad from "./Pages/Administrador/Especialidad/ListadoEspecialidad";
import RegistrarEspecialidad from "./Pages/Administrador/Especialidad/RegistrarEspecialidad";
import EditarEspecialidad from "./Pages/Administrador/Especialidad/EditarEspecialidad";

import RegistrarUsuario from "./Pages/Administrador/Usuario/RegistrarUsuario";
import EditarUsuario from "./Pages/Administrador/Usuario/EditarUsuario";

import ListadoMedico from "./Pages/Administrador/Medico/ListadoMedico";
import RegistrarMedico from "./Pages/Administrador/Medico/RegistrarMedico";

import MantenerHorario from "./Pages/Administrador/Horario/MantenerHorario";

import ListadoLogCita from "./Pages/Administrador/LogCita/ListadoLogCita";

import Medico from "./Pages/Medico";
import Cajero from "./Pages/Cajero";
import PrivateRoute from "./components/PrivateRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔥 REDIRECCIÓN INICIAL */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/recepcionista"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_RECEPCIONISTA"]}>
              <Recepcionista />
            </PrivateRoute>
          }
        />

        <Route
          path="/administrador/usuario/registrar"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_ADMINISTRADOR"]}>
              <RegistrarUsuario />
            </PrivateRoute>
          }
        />
        <Route
          path="/administrador/usuario/editar"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_ADMINISTRADOR"]}>
              <EditarUsuario />
            </PrivateRoute>
          }
        />

        <Route
          path="/administrador/especialidad"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_ADMINISTRADOR"]}>
              <ListadoEspecialidad />
            </PrivateRoute>
          }
        />

        <Route
          path="/administrador/especialidad/nuevo"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_ADMINISTRADOR"]}>
              <RegistrarEspecialidad />
            </PrivateRoute>
          }
        />

        <Route
          path="/administrador/especialidad/editar/:id"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_ADMINISTRADOR"]}>
              <EditarEspecialidad />
            </PrivateRoute>
          }
        />

        <Route
          path="/administrador/medico"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_ADMINISTRADOR"]}>
              <ListadoMedico />
            </PrivateRoute>
          }
        />

        <Route
          path="/administrador/medico/nuevo"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_ADMINISTRADOR"]}>
              <RegistrarMedico />
            </PrivateRoute>
          }
        />

        <Route
          path="/administrador/horario"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_ADMINISTRADOR"]}>
              <MantenerHorario />
            </PrivateRoute>
          }
        />

        <Route
          path="/administrador/logcita"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_ADMINISTRADOR"]}>
              <ListadoLogCita />
            </PrivateRoute>
          }
        />

        <Route
          path="/administrador"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_ADMINISTRADOR"]}>
              <Administrador />
            </PrivateRoute>
          }
        />

        <Route
          path="/medico"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_MEDICO"]}>
              <Medico />
            </PrivateRoute>
          }
        />

        <Route
          path="/cajero"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_CAJERO"]}>
              <Cajero />
            </PrivateRoute>
          }
        />

        <Route path="/no-autorizado" element={<h2>No autorizado</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
