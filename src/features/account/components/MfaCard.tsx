import { useState } from "react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Spinner } from "@quickadui/core";
import { toast } from "@quickadui/overlays";
import { CodeForm } from "@/features/auth";
import { getErrorMessage } from "@/lib/errors";
import { useConfirmMfa, useRequestMfa } from "../hooks/useAccount";
import type { MfaAction, UserProfile } from "../types/Account";

/** Vérification en deux étapes : un code par email confirme l'activation ou la désactivation. */
export const MfaCard = ({ user }: { user: UserProfile }) => {
  const [pending, setPending] = useState<MfaAction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const { mutate: requestMfa, isPending: isRequesting } = useRequestMfa();
  const { mutate: confirmMfa, isPending: isConfirming } = useConfirmMfa();
  const action: MfaAction = user.mfa_enabled ? "deactivate" : "activate";

  const sendCode = (requested: MfaAction, notice?: string) => {
    setError(null);
    setResendNotice(null);
    requestMfa(requested, {
      onSuccess: () => {
        setPending(requested);
        if (notice) setResendNotice(notice);
      },
      onError: (err) => toast({ variant: "danger", title: "Envoi du code impossible", description: getErrorMessage(err) }),
    });
  };

  const cancel = () => {
    setPending(null);
    setError(null);
    setResendNotice(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Vérification en deux étapes</CardTitle>
          <Badge variant={user.mfa_enabled ? "success" : "outline"}>{user.mfa_enabled ? "Activée" : "Désactivée"}</Badge>
        </div>
        <CardDescription>
          À chaque connexion par mot de passe ou Google, un code envoyé à {user.email} vous sera demandé.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pending ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-neutral-11">
              Saisissez le code envoyé à {user.email} pour {pending === "activate" ? "activer" : "désactiver"} la
              vérification en deux étapes.
            </p>
            <CodeForm
              submitLabel={pending === "activate" ? "Activer" : "Désactiver"}
              pendingLabel="Vérification…"
              isPending={isConfirming}
              error={error}
              resendNotice={resendNotice}
              onSubmit={(code) => {
                setError(null);
                confirmMfa(
                  { action: pending, code },
                  {
                    onSuccess: () => {
                      toast({
                        variant: "success",
                        title: pending === "activate" ? "Vérification en deux étapes activée" : "Vérification en deux étapes désactivée",
                      });
                      cancel();
                    },
                    onError: (err) => setError(getErrorMessage(err)),
                  },
                );
              }}
              onResend={() => sendCode(pending, "Un nouveau code vous a été envoyé.")}
              isResending={isRequesting}
            />
            <Button variant="ghost" onClick={cancel}>
              Annuler
            </Button>
          </div>
        ) : (
          <Button
            variant={user.mfa_enabled ? "outline" : "solid"}
            disabled={isRequesting}
            onClick={() => sendCode(action)}
          >
            {isRequesting && <Spinner size="sm" label="Envoi du code" />}
            {user.mfa_enabled ? "Désactiver" : "Activer"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
