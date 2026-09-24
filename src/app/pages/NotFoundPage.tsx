import { Link } from "react-router";
import { LuFileQuestion } from "react-icons/lu";
import { Button } from "@quickadui/core";
import { EmptyState } from "@/components/EmptyState";
import { routes } from "@/app/routes/routes";

const NotFoundPage = () => (
  <div className="py-12">
    <EmptyState
      icon={<LuFileQuestion aria-hidden />}
      title="Page introuvable"
      description="Cette page n'existe pas, ou pas encore."
      action={
        <Button asChild>
          <Link to={routes.dashboard}>Retour au tableau de bord</Link>
        </Button>
      }
    />
  </div>
);

export default NotFoundPage;
