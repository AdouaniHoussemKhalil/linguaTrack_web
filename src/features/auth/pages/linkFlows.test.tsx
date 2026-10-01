import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError, AxiosHeaders } from "axios";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { routes } from "@/app/routes/routes";
import { AuthService } from "../services/AuthService";
import EmailVerificationFailedPage from "./EmailVerificationFailedPage";
import EmailVerifiedPage from "./EmailVerifiedPage";
import ForgotPasswordPage from "./ForgotPasswordPage";
import ResetPasswordPage from "./ResetPasswordPage";
import VerifyEmailPage from "./VerifyEmailPage";

vi.mock("../services/AuthService", () => ({
  AuthService: {
    resendVerification: vi.fn(),
    forgotPassword: vi.fn(),
    verifyResetCode: vi.fn(),
    resetPassword: vi.fn(),
    verifyEmail: vi.fn(),
  },
}));

const service = vi.mocked(AuthService);

/** Erreur telle que renvoyée par l'API (relais du service d'auth) : `{ error: { code } }`. */
const apiError = (status: number, code: string) =>
  new AxiosError("Request failed", String(status), undefined, undefined, {
    status,
    statusText: "",
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: { error: { code, message: code } },
  });

/** Page de connexion factice : affiche le message transmis par la navigation. */
const LoginProbe = () => {
  const state = useLocation().state as { message?: string } | null;
  return <p>Connexion : {state?.message}</p>;
};

const renderAt = (entry: string | { pathname: string; state: unknown }, element: React.ReactNode, path: string) =>
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}>
      <MemoryRouter initialEntries={[entry]}>
        <Routes>
          <Route path={path} element={element} />
          <Route path={routes.login} element={<LoginProbe />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );

beforeEach(() => vi.clearAllMocks());

describe("Vérification d'e-mail", () => {
  it("demande de cliquer sur le lien en mode lien, avec renvoi", async () => {
    service.resendVerification.mockResolvedValue("link");
    renderAt(
      { pathname: routes.verifyEmail, state: { email: "bob@test.com", mode: "link" } },
      <VerifyEmailPage />,
      routes.verifyEmail,
    );

    expect(screen.getByText(/Nous avons envoyé un lien de confirmation à/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Code/)).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Renvoyer le lien" }));

    expect(await screen.findByText("Un nouveau lien vous a été envoyé.")).toBeInTheDocument();
    expect(service.resendVerification.mock.calls[0][0]).toBe("bob@test.com");
  });

  it("garde la saisie du code en mode code", () => {
    renderAt(
      { pathname: routes.verifyEmail, state: { email: "bob@test.com", mode: "code" } },
      <VerifyEmailPage />,
      routes.verifyEmail,
    );

    expect(screen.getByText(/Saisissez le code envoyé à/)).toBeInTheDocument();
  });

  it("passe en mode lien quand le renvoi depuis la connexion envoie un lien", async () => {
    service.resendVerification.mockResolvedValue("link");
    renderAt(
      { pathname: routes.verifyEmail, state: { email: "bob@test.com", resend: true } },
      <VerifyEmailPage />,
      routes.verifyEmail,
    );

    expect(await screen.findByText(/Nous avons envoyé un lien de confirmation/)).toBeInTheDocument();
  });
});

describe("Pages ouvertes par le lien de vérification", () => {
  it("confirme l'adresse et propose la connexion", async () => {
    renderAt(routes.emailVerified, <EmailVerifiedPage />, routes.emailVerified);

    expect(screen.getByRole("heading", { name: "Adresse confirmée" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("link", { name: "Se connecter" }));
    expect(await screen.findByText("Connexion : Adresse vérifiée. Vous pouvez vous connecter.")).toBeInTheDocument();
  });

  it("explique un lien expiré et renvoie un lien", async () => {
    service.resendVerification.mockResolvedValue("link");
    renderAt(`${routes.emailVerificationFailed}?reason=expired`, <EmailVerificationFailedPage />, routes.emailVerificationFailed);

    expect(screen.getByRole("heading", { name: "Ce lien a expiré" })).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Adresse email"), "bob@test.com");
    await userEvent.click(screen.getByRole("button", { name: "Recevoir un nouveau lien" }));

    expect(await screen.findByText(/un nouveau lien vient de lui être envoyé/)).toBeInTheDocument();
  });

  it("traite une raison inconnue comme un lien invalide", () => {
    renderAt(`${routes.emailVerificationFailed}?reason=autre`, <EmailVerificationFailedPage />, routes.emailVerificationFailed);

    expect(screen.getByRole("heading", { name: "Ce lien n'est pas valide" })).toBeInTheDocument();
  });
});

describe("Mot de passe oublié", () => {
  it("annonce un lien en mode lien", async () => {
    service.forgotPassword.mockResolvedValue("link");
    renderAt(routes.forgotPassword, <ForgotPasswordPage />, routes.forgotPassword);

    await userEvent.type(screen.getByLabelText("Adresse email"), "bob@test.com");
    await userEvent.click(screen.getByRole("button", { name: "Continuer" }));

    expect(await screen.findByText(/un lien pour choisir un nouveau mot de passe/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Code/)).not.toBeInTheDocument();
  });

  it("demande le code en mode code", async () => {
    service.forgotPassword.mockResolvedValue("code");
    renderAt(routes.forgotPassword, <ForgotPasswordPage />, routes.forgotPassword);

    await userEvent.type(screen.getByLabelText("Adresse email"), "bob@test.com");
    await userEvent.click(screen.getByRole("button", { name: "Continuer" }));

    expect(await screen.findByText("Si un compte existe pour cette adresse, un code vient de lui être envoyé.")).toBeInTheDocument();
  });
});

describe("Page de réinitialisation ouverte par le lien", () => {
  const link = `${routes.resetPassword}?token=abc123&email=bob%40test.com`;
  const fill = async () => {
    await userEvent.type(screen.getByLabelText("Nouveau mot de passe"), "NewPassword1!");
    await userEvent.type(screen.getByLabelText("Confirmation du mot de passe"), "NewPassword1!");
    await userEvent.click(screen.getByRole("button", { name: "Changer le mot de passe" }));
  };

  it("envoie le jeton du lien avec le nouveau mot de passe, puis mène à la connexion", async () => {
    service.resetPassword.mockResolvedValue(undefined);
    renderAt(link, <ResetPasswordPage />, routes.resetPassword);

    expect(screen.getByText("bob@test.com")).toBeInTheDocument();
    await fill();

    await waitFor(() =>
      expect(service.resetPassword.mock.calls[0][0]).toEqual({
        email: "bob@test.com",
        resetToken: "abc123",
        password: "NewPassword1!",
        confirmPassword: "NewPassword1!",
      }),
    );
    expect(await screen.findByText("Connexion : Mot de passe modifié. Connectez-vous avec le nouveau.")).toBeInTheDocument();
  });

  it("propose un nouveau lien quand celui-ci est expiré ou déjà utilisé", async () => {
    service.resetPassword.mockRejectedValue(apiError(400, "invalidCode"));
    renderAt(link, <ResetPasswordPage />, routes.resetPassword);

    await fill();

    expect(await screen.findByText("Ce lien a expiré ou a déjà été utilisé. Demandez-en un nouveau.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Demander un nouveau lien" })).toHaveAttribute("href", routes.forgotPassword);
    expect(screen.queryByLabelText("Nouveau mot de passe")).not.toBeInTheDocument();
  });

  it("refuse un lien incomplet", () => {
    renderAt(`${routes.resetPassword}?email=bob%40test.com`, <ResetPasswordPage />, routes.resetPassword);

    expect(screen.getByText("Ce lien de réinitialisation est incomplet. Demandez-en un nouveau.")).toBeInTheDocument();
    expect(service.resetPassword).not.toHaveBeenCalled();
  });
});
