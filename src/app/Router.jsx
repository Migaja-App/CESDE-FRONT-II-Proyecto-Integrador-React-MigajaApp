import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/appLayout/AppLayout";
import DashboardPage from "../features/dashboard/pages/dashboardPage";
import GastosPage from "../features/gastos/pages/gastosPage";
import CategoriasPage from "../features/categorias/pages/categoriasPage";
import ComerciosPage from "../features/comercios/pages/comerciosPage";
import MediosPagoPage from "../features/mediosPago/pages/mediosPagoPage";
import UsuariosPage from "../features/usuarios/pages/usuariosPage";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/gastos" element={<GastosPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/comercios" element={<ComerciosPage />} />
          <Route path="/medios-pago" element={<MediosPagoPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <section>
      <h1>404</h1>
      <p>La página que buscas no existe.</p>
    </section>
  );
}

export default Router;
