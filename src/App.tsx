import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import LoginPage from "./features/auth/pages/LoginPage";
import PublicLayout from "./app/layouts/PublicLayout ";
import RegisterPage from "./features/auth/pages/RegisterPage";
import ProtectedRoute from "./app/routes/ProtectedRoute";
import PrivateLayout from "./app/layouts/PrivateLayout";
import AuthLayout from "./app/layouts/AuthLayout";
import Dashboard from "./features/dashboard/pages/Dashboard";
import TextsPage from "./features/texts/pages/Texts";
import HistoryPage from "./features/history/pages/HistoryPage";
import { routes } from "./app/routes/routes";
import LoadingOverlay from "./components/ui/LoadingOverlay";

function App() {
  return (
    <BrowserRouter>
      <LoadingOverlay />
      <Routes>
        {/* AUTH */}
        <Route
          element={
            <AuthLayout>
              <Outlet />
            </AuthLayout>
          }
        >
          <Route path={routes.login} element={<LoginPage />} />
          <Route path={routes.register} element={<RegisterPage />} />
        </Route>

        {/* PUBLIC */}
        <Route
          element={
            <PublicLayout>
              <Outlet />
            </PublicLayout>
          }
        >
          {/* <Route path="/" element={<LandingPage />} />
    <Route path="/pricing" element={<PricingPage />} /> */}
        </Route>

        {/* PRIVATE */}
        <Route
          element={
            <ProtectedRoute>
              <PrivateLayout>
                <Outlet />
              </PrivateLayout>
            </ProtectedRoute>
          }
        >
          <Route path={routes.dashboard} element={<Dashboard />} />
          <Route path={routes.history} element={<HistoryPage />} />
          <Route path={routes.correction} element={<TextsPage />} />
          <Route path={`${routes.correction}/:id/:userId`} element={<TextsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
