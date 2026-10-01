import { isAxiosError } from "axios";
import { Navigate, useLocation } from "react-router";
import { Alert, AlertDescription, AlertTitle, Button, Spinner } from "@quickadui/core";
import { useMe } from "@/features/account";
import { useSignOut } from "@/features/auth";
import { getErrorMessage } from "@/lib/errors";
import { routes } from "./routes";

interface Props {
  children: React.ReactNode;
}

/** Session vérifiée par l'API (cookies httpOnly) : GET /users/me, 401 → page de connexion. */
export default function ProtectedRoute({ children }: Props) {
  const location = useLocation();
  const { isPending, error, refetch } = useMe();
  const signOut = useSignOut();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-2 text-neutral-11">
        <Spinner label="Chargement de votre session" />
      </div>
    );
  }

  if (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return <Navigate to={routes.login} replace state={{ from: location.pathname + location.search }} />;
    }
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-2 p-4">
        <Alert variant="danger" className="max-w-md">
          <AlertTitle>Impossible de vérifier votre session</AlertTitle>
          <AlertDescription className="flex flex-col items-start gap-3">
            {getErrorMessage(error)}
            {/* 403 : compte bloqué ou adresse à vérifier ; sinon service momentanément indisponible */}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                Réessayer
              </Button>
              <Button size="sm" variant="ghost" onClick={signOut}>
                Se déconnecter
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return children;
}
