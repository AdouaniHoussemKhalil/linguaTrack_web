import { Link } from "react-router";
import { Button } from "@quickadui/core";
import { routes } from "@/app/routes/routes";

/**
 * Page « adresse confirmée » : le lien reçu par e-mail passe par le service d'authentification, qui
 * vérifie l'adresse puis redirige ici (`emailVerifiedUrl` de l'application). Aucun appel API.
 */
export default function EmailVerifiedPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-neutral-12">Adresse confirmée</h1>
        <p className="text-sm text-neutral-11">
          Merci ! Votre adresse email est vérifiée : vous pouvez maintenant vous connecter à LinguaTrack.
        </p>
      </div>
      <Button asChild size="lg" className="w-full">
        <Link to={routes.login} state={{ message: "Adresse vérifiée. Vous pouvez vous connecter." }}>
          Se connecter
        </Link>
      </Button>
    </div>
  );
}
