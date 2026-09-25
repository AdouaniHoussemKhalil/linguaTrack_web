import { Navigate } from "react-router";
import { hasValidSession } from "@/lib/session";
import { routes } from "./routes";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  if (!hasValidSession()) {
    return <Navigate to={routes.login} replace />;
  }

  return children;
}