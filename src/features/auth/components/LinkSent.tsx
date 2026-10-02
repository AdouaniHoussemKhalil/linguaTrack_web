import { Alert, AlertDescription, Button, Spinner } from "@quickadui/core";

interface LinkSentProps {
  /** Phrase principale : où le lien a été envoyé et quoi en faire. */
  children: React.ReactNode;
  onResend: () => void;
  isResending: boolean;
  resendNotice: string | null;
  error: string | null;
}

/** Mode lien : « vérifiez votre boîte de réception », avec renvoi du lien. */
export const LinkSent = ({ children, onResend, isResending, resendNotice, error }: LinkSentProps) => (
  <div className="flex flex-col gap-4">
    <div className="rounded-lg border border-neutral-6 bg-neutral-2 p-4 text-sm text-neutral-12">{children}</div>
    <p className="text-sm text-neutral-11">
      Rien reçu ? Vérifiez vos courriers indésirables, ou demandez un nouveau lien : seul le dernier envoyé est valable.
    </p>
    {resendNotice && (
      <Alert variant="success">
        <AlertDescription>{resendNotice}</AlertDescription>
      </Alert>
    )}
    {error && (
      <Alert variant="danger">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )}
    <Button type="button" variant="outline" size="lg" disabled={isResending} onClick={onResend} className="w-full">
      {isResending && <Spinner size="sm" label="Envoi du lien" />}
      Renvoyer le lien
    </Button>
  </div>
);
