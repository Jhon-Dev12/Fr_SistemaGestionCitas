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
import EditarMedico from "./Pages/Administrador/Medico/EditarMedico";

import MantenerHorario from "./Pages/Administrador/Horario/MantenerHorario";

import ListadoLogCita from "./Pages/Administrador/LogCita/ListadoLogCita";

import Medico from "./Pages/Medico/Medico";
import Cajero from "./Pages/Cajero/Cajero";
import ListadoComprobantePago from "./Pages/Cajero/ComprobantePago/ListadoComprobantePago";


import PrivateRoute from "./components/PrivateRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* 🔐 RUTAS PROTEGIDAS DE ADMINISTRADOR */}
        <Route
          path="/administrador"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_ADMINISTRADOR"]}>
              <Administrador /> 
            </PrivateRoute>
          }
        />

        {/* 🔐 RUTAS PROTEGIDAS DE CAJERO */}
        <Route
          path="/cajero"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_CAJERO"]}>
              <Cajero /> 
            </PrivateRoute>
          }
        />
        
        {/* Agrupación de sub-rutas de administrador */}
        <Route path="/administrador">
          {/* Usuarios */}
          <Route path="usuario/registrar" element={<PrivateRoute rolesPermitidos={["ROLE_ADMINISTRADOR"]}><RegistrarUsuario /></PrivateRoute>} />
          <Route path="usuario/editar" element={<PrivateRoute rolesPermitidos={["ROLE_ADMINISTRADOR"]}><EditarUsuario /></PrivateRoute>} />
          
          {/* Especialidades */}
          <Route path="especialidad" element={<PrivateRoute rolesPermitidos={["ROLE_ADMINISTRADOR"]}><ListadoEspecialidad /></PrivateRoute>} />
          <Route path="especialidad/nuevo" element={<PrivateRoute rolesPermitidos={["ROLE_ADMINISTRADOR"]}><RegistrarEspecialidad /></PrivateRoute>} />
          <Route path="especialidad/editar/:id" element={<PrivateRoute rolesPermitidos={["ROLE_ADMINISTRADOR"]}><EditarEspecialidad /></PrivateRoute>} />
          
          {/* Médicos */}
          <Route path="medico" element={<PrivateRoute rolesPermitidos={["ROLE_ADMINISTRADOR"]}><ListadoMedico /></PrivateRoute>} />
          <Route path="medico/nuevo" element={<PrivateRoute rolesPermitidos={["ROLE_ADMINISTRADOR"]}><RegistrarMedico /></PrivateRoute>} />
          <Route path="medico/editar/:id" element={<PrivateRoute rolesPermitidos={["ROLE_ADMINISTRADOR"]}><EditarMedico /></PrivateRoute>} />
          
          {/* Horarios */}
          <Route path="horario" element={<PrivateRoute rolesPermitidos={["ROLE_ADMINISTRADOR"]}><MantenerHorario /></PrivateRoute>} />


          <Route path="logcita" element={<PrivateRoute rolesPermitidos={["ROLE_ADMINISTRADOR"]}><ListadoLogCita /></PrivateRoute>} />
        </Route>

        <Route path="/cajero">
          {/* Comprobantes de Pago */}
            <Route path="pago" element={<PrivateRoute rolesPermitidos={["ROLE_CAJERO"]}><ListadoComprobantePago /></PrivateRoute>} />
        </Route>

        {/* 🏥 OTRAS RUTAS DE ROLES */}
        <Route path="/recepcionista" element={<PrivateRoute rolesPermitidos={["ROLE_RECEPCIONISTA"]}><Recepcionista /></PrivateRoute>} />
        <Route path="/medico" element={<PrivateRoute rolesPermitidos={["ROLE_MEDICO"]}><Medico /></PrivateRoute>} />
        <Route path="/cajero" element={<PrivateRoute rolesPermitidos={["ROLE_CAJERO"]}><Cajero /></PrivateRoute>} />

        <Route path="/no-autorizado" element={<h2>No autorizado</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
