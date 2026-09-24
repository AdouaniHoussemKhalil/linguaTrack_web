import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import { Spinner } from "@quickadui/core";
import { Toaster } from "@quickadui/overlays";
import AuthLayout from "./app/layouts/AuthLayout";
import PrivateLayout from "./app/layouts/PrivateLayout";
import PublicLayout from "./app/layouts/PublicLayout";
import ProtectedRoute from "./app/routes/ProtectedRoute";
import { routes } from "./app/routes/routes";

// Une page = un chunk : le code du tableau de bord (graphiques) n'est chargé qu'à la demande.
const LoginPage = lazy(() => import("./features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("./features/auth/pages/RegisterPage"));
const Dashboard = lazy(() => import("./features/dashboard/pages/Dashboard"));
const HistoryPage = lazy(() => import("./features/history/pages/HistoryPage"));
const TextsPage = lazy(() => import("./features/texts/pages/Texts"));
const NotFoundPage = lazy(() => import("./app/pages/NotFoundPage"));

const PageFallback = () => (
  <div className="flex min-h-64 items-center justify-center text-neutral-11">
    <Spinner label="Chargement de la page" />
  </div>
);

const withSuspense = (element: React.ReactNode) => <Suspense fallback={<PageFallback />}>{element}</Suspense>;

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* AUTH */}
        <Route element={<AuthLayout>{withSuspense(<Outlet />)}</AuthLayout>}>
          <Route path={routes.login} element={<LoginPage />} />
          <Route path={routes.register} element={<RegisterPage />} />
        </Route>

        {/* PUBLIC : réservé aux futures pages sans connexion (landing, tarifs…) */}
        <Route element={<PublicLayout>{withSuspense(<Outlet />)}</PublicLayout>} />

        {/* PRIVATE */}
        <Route
          element={
            <ProtectedRoute>
              <PrivateLayout>{withSuspense(<Outlet />)}</PrivateLayout>
            </ProtectedRoute>
          }
        >
          <Route path={routes.home} element={<Navigate to={routes.dashboard} replace />} />
          <Route path={routes.dashboard} element={<Dashboard />} />
          <Route path={routes.history} element={<HistoryPage />} />
          <Route path={routes.correction} element={<TextsPage />} />
          <Route path={`${routes.correction}/:id/:userId`} element={<TextsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
