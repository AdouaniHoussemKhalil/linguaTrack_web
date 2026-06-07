import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { style } from "typestyle";
import { Field, inputStyle } from "@/components/ui/Field";
import { Link } from "react-router";
import { colors } from "@/components/common/Colors";
import { useSignIn } from "@/features/auth/hooks/UseAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutate: signIn, isPending } = useSignIn();

  const handleSubmit = () => {
    if (!email || !password) {
      setError("Tous les champs sont requis");
      return;
    }

    setError(null);

    signIn(
      {
        username: email,
        password,
      },
      {
        onSuccess: (result) => {
          if (!result.is_success) {
            setError(result.error || "Email ou mot de passe non valide");
          }
        },
        onError: () => {
          setError("Une erreur est survenue lors de la connexion");
        },
      },
    );
  };

  return (
    <div>
      <h1 className={titleStyle}>Se connecter</h1>
      <div className={formStyle}>
        <Field label="Address email">
          <input
            className={inputStyle}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse email"
          />
        </Field>

        <Field label="Password">
          <input
            className={inputStyle}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
          />
        </Field>

        {error && <div className={errorStyle}>{error}</div>}

        <Button
          size="large"
          text={"Se connecter"}
          isLoading={isPending}
          disabled={isPending}
          onClick={handleSubmit}
        />

        <p className={linkTextStyle}>
          Vous n'avez pas de compte?{" "}
          <Link to="/register" className={linkStyle}>
            S'inscrire ici
          </Link>
        </p>
      </div>
    </div>
  );
}

const titleStyle = style({
  fontSize: "24px",
  fontWeight: 700,
  marginBottom: "20px",
});

const formStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: "15px",
});

const errorStyle = style({
  color: colors.error,
  fontSize: "13px",
});

const linkTextStyle = style({
  fontSize: "12px",
  color: colors.gray,
  marginTop: "10px",
  textAlign: "center",
});

const linkStyle = style({
  color: colors.primary,
  textDecoration: "none",
  fontWeight: 500,
  $nest: {
    "&:hover": {
      textDecoration: "underline",
    },
  },
});
