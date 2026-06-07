import { Navigate } from "react-router";
import { routes } from "./routes";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const isAuthenticated = !!localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to={routes.login} replace />;
  }

  return children;
}