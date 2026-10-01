import { Alert, AlertDescription, AlertTitle, Button, Skeleton } from "@quickadui/core";
import { PageHeader } from "@/components/PageHeader";
import { useMe } from "../hooks/useAccount";
import { MfaCard } from "../components/MfaCard";
import { PasswordForm } from "../components/PasswordForm";
import { ProfileForm } from "../components/ProfileForm";

const SettingsPage = () => {
  const { data: user, isLoading, error, refetch } = useMe();

  return (
    <div className="py-6">
      <PageHeader title="Paramètres" description="Gérez votre profil, votre mot de passe et la sécurité de votre compte." />

      {isLoading ? (
        <div className="grid items-start gap-6 lg:grid-cols-2" aria-busy aria-label="Chargement du profil">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      ) : error || !user ? (
        <Alert variant="danger">
          <AlertTitle>Impossible de charger votre profil</AlertTitle>
          <AlertDescription className="flex flex-col items-start gap-3">
            Vérifiez votre connexion puis réessayez.
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <ProfileForm user={user} />
            <MfaCard user={user} />
          </div>
          <PasswordForm />
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
