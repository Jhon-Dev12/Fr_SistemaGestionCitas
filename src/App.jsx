import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";


import PanelAdministrador from "./Pages/Administrador/PanelAdministrador";
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
import AdministradorLayout from "./layouts/AdministradorLayout";

import PanelRecepcionista from "./Pages/Recepcionista/PanelRecepcionista";
import RegistrarPaciente from "./Pages/Recepcionista/Paciente/RegistrarPaciente";
import PacienteLista from "./Pages/Recepcionista/Paciente/ListadoPaciente";
import ListarCita from "./Pages/Recepcionista/Cita/ListadoCita";
import DetalleCita from "./Pages/Recepcionista/Cita/DetalleCita";
import RegistrarCita from "./Pages/Recepcionista/Cita/RegistrarCita";
import EditarCita from "./Pages/Recepcionista/Cita/EditarCita";
import RecepcionistaLayout from "./layouts/RecepcionistaLayout";

import PanelMedico from "./Pages/Medico/PanelMedico";
import ListadoHistorial from "./Pages/Medico/Historial/ListadoHistorial";
import RegistrarHistorial from "./Pages/Medico/Historial/RegistrarHistorial";
import DetalleHistorial from "./Pages/Medico/Historial/DetalleHistorial";
import ListadoAgenda from "./Pages/Medico/Agenda/ListadoAgenda";
import MedicoLayout from "./layouts/MedicoLayout";

import PanelCajero from "./Pages/Cajero/PanelCajero";
import ListadoComprobantePago from "./Pages/Cajero/ComprobantePago/ListadoComprobantePago";
import RegistrarComprobantePago from "./Pages/Cajero/ComprobantePago/RegistrarComprobantePago";
import DetalleComprobantePago from "./Pages/Cajero/ComprobantePago/DetalleComprobantePago";
import CajeroLayout from "./layouts/CajeroLayout";


import PrivateRoute from "./components/PrivateRoute";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔥 REDIRECCIÓN INICIAL */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />


        {/* RUTA PANEL ADMINISTRADOR (SIN LAYOUT) */}
        <Route
          path="/recepcionista"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_RECEPCIONISTA"]}>
              <PanelRecepcionista />
            </PrivateRoute>
          }
        />
        {/* RUTA RECEPCIONISTA */}
        <Route
          path="/recepcionista"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_RECEPCIONISTA"]}>
              <RecepcionistaLayout />
            </PrivateRoute>
          }
        >
          {/* PACIENTES */}
          <Route path="paciente" element={<PacienteLista />} />
          <Route path="paciente/nuevo" element={<RegistrarPaciente />} />
          {/* CITAS */}
          <Route path="cita" element={<ListarCita />} />
          <Route path="cita/nuevo" element={<RegistrarCita />} />
          <Route path="cita/editar/:id" element={<EditarCita />} />
          <Route path="cita/detalle/:id" element={<DetalleCita />} />
        </Route>

        {/* RUTA PANEL ADMINISTRADOR (SIN LAYOUT) */}
        <Route
          path="/administrador"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_ADMINISTRADOR"]}>
              <PanelAdministrador />
            </PrivateRoute>
          }
        />
        {/* RUTA ADMINISTRADOR */}
        <Route
          path="/administrador"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_ADMINISTRADOR"]}>
              <AdministradorLayout />
            </PrivateRoute>
          }
        >
          {/* USUARIOS */}
          <Route path="usuario/nuevo" element={<RegistrarUsuario />} />
          <Route path="usuario/editar" element={<EditarUsuario />} />
          {/* ESPECIALIDAD */}
          <Route path="especialidad" element={<ListadoEspecialidad />} />
          <Route path="especialidad/nuevo" element={<RegistrarEspecialidad />} />
          <Route path="especialidad/editar/:id" element={<EditarEspecialidad />} />
          {/* MEDICOS */}
          <Route path="medico" element={<ListadoMedico />} />
          <Route path="medico/nuevo" element={<RegistrarMedico />} />
          <Route path="medico/editar/:id" element={<EditarMedico />} />
          {/* HORARIOS */}
          <Route path="horario" element={<MantenerHorario />} />
          {/* LOGCITA */}
          <Route path="logcita" element={<ListadoLogCita />} />
        </Route>
        
        {/* RUTA PANEL CAJERO (SIN LAYOUT) */}
        <Route
          path="/cajero"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_CAJERO"]}>
              <PanelCajero />
            </PrivateRoute>
          }
        />
        {/* RUTA CAJERO */}
        <Route
          path="/cajero"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_CAJERO"]}>
              <CajeroLayout />
            </PrivateRoute>
          }
        >
          {/* LOGCITA */}
          <Route path="pago" element={<ListadoComprobantePago />} />
          <Route path="pago/nuevo" element={<RegistrarComprobantePago />} />
          <Route path="pago/detalle/:id" element={<DetalleComprobantePago/>} />
        </Route>

        {/* RUTA PANEL MEDICO (SIN LAYOUT) */}
        <Route
          path="/medico"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_MEDICO"]}>
              <PanelMedico />
            </PrivateRoute>
          }
        />
        {/* RUTA MEDICO */}
        <Route
          path="/medico"
          element={
            <PrivateRoute rolesPermitidos={["ROLE_MEDICO"]}>
              <MedicoLayout />
            </PrivateRoute>
          }
        >
          {/* HISTORIAL */}
          <Route path="historial" element={<ListadoHistorial />} />
          <Route path="historial/nuevo" element={<RegistrarHistorial />} />
          <Route path="historial/detalle/:id" element={<DetalleHistorial />} />
          <Route path="agenda" element={<ListadoAgenda />} />
        </Route>

        <Route path="/no-autorizado" element={<h2>No autorizado</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
