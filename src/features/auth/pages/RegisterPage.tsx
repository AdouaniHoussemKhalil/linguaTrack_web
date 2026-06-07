import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { style } from "typestyle";
import { Field, inputStyle } from "@/components/ui/Field";
import { colors } from "@/components/common/Colors";
import { useRegister } from "../hooks/UseAuth";
import {
  registerSchema,
  type RegisterFormSchema,
} from "../schemas/registerSchema";
import type { RegisterForm } from "../types/User";
import PasswordChecklist from "react-password-checklist";
import { Link } from "react-router";
import { routes } from "@/app/routes/routes";

export default function RegisterPage() {
  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      level: "A1",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: registerUser, isPending } = useRegister();
  const [error, setError] = useState<string | null>(null);
  const passwordValue = watch("password");

  const [showPasswordChecklist, setShowPasswordChecklist] = useState(false);

  const onSubmit = handleSubmit((data) => {
    setError(null);

    const { confirmPassword, ...payload } = data;

    registerUser(payload as RegisterForm, {
      onSuccess: (result) => {
        if (!result.is_success) {
          setError(result.error || "Une erreur est survenue lors de la création du compte");
        }
      },
      onError: () => {
        setError("Une erreur est survenue lors de la création du compte");
      },
    });
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 className={titleStyle}>Créer un compte</h1>
        <div className={topRightLinkStyle}>
          <Link to={routes.login} className={linkStyle}>
            {"Se connecter"}
          </Link>
        </div>
      </div>
      <p className={paragraphStyle}>
        Rejoignez la communauté Linguatrack dès aujourd'hui!
      </p>

      <div className={formStyle}>
        <div className={rowStyle}>
          <Field label="Nom">
            <input
              {...registerField("firstName")}
              className={inputStyle}
              placeholder="Votre nom"
            />
            {errors.firstName && (
              <div className={errorStyle}>{errors.firstName.message}</div>
            )}
          </Field>

          <Field label="Prénom">
            <input
              {...registerField("lastName")}
              className={inputStyle}
              placeholder="Votre prénom"
            />
            {errors.lastName && (
              <div className={errorStyle}>{errors.lastName.message}</div>
            )}
          </Field>
        </div>

        <Field label="Address email">
          <input
            {...registerField("email")}
            type="email"
            className={inputStyle}
            placeholder="Votre email"
          />
          {errors.email && (
            <div className={errorStyle}>{errors.email.message}</div>
          )}
        </Field>

        <Field label="Niveau de langue française">
          <select {...registerField("level")} className={selectStyle}>
            <option value="A1">A1 - Débutant</option>
            <option value="A2">A2 - Élémentaire</option>
            <option value="B1">B1 - Intermédiaire</option>
            <option value="B2">B2 - Haut Intermédiaire</option>
            <option value="C1">C1 - Advanced</option>
            <option value="C2">C2 - Fluent</option>
          </select>
        </Field>

        <div className={rowStyle}>
          <Field label="Mot de passe">
            <div className={passwordWrapperStyle}>
              <input
                {...registerField("password")}
                type="password"
                className={inputStyle}
                placeholder="Mot de passe"
                onFocus={() => setShowPasswordChecklist(true)}
                onClick={() => setShowPasswordChecklist(true)}
                onBlur={() => {
                  setTimeout(() => setShowPasswordChecklist(false), 200);
                }}
              />

              {showPasswordChecklist && passwordValue && (
                <div className={pwdChecklistContainerStyle}>
                  <PasswordChecklist
                    rules={[
                      "minLength",
                      "specialChar",
                      "number",
                      "capital",
                      "match",
                    ]}
                    minLength={8}
                    value={passwordValue}
                    valueAgain={watch("confirmPassword")}
                    messages={{
                      minLength: "Au moins 8 caractères",
                      specialChar: "Au moins un caractère spécial",
                      number: "Au moins un chiffre",
                      capital: "Au moins une majuscule",
                      match: "Les mots de passe correspondent",
                    }}
                  />
                </div>
              )}
            </div>

            {errors.password && (
              <div className={errorStyle}>{errors.password.message}</div>
            )}
          </Field>

          <Field label="Confirmation du mot de passe">
            <input
              {...registerField("confirmPassword")}
              type="password"
              className={inputStyle}
              placeholder="Confirmer le mot de passe"
              onFocus={() => setShowPasswordChecklist(true)}
              onClick={() => setShowPasswordChecklist(true)}
              onBlur={() => {
                setTimeout(() => setShowPasswordChecklist(false), 200);
              }}
            />
            {errors.confirmPassword && (
              <div className={errorStyle}>{errors.confirmPassword.message}</div>
            )}
          </Field>
        </div>

        {error && <div className={errorStyle}>{error}</div>}

        <Button
          size="large"
          text={"Valider la création"}
          isLoading={isPending}
          onClick={onSubmit}
          marginTop="50px"
          disabled={
            isPending ||
            errors.firstName ||
            errors.lastName ||
            errors.email ||
            errors.password ||
            errors.confirmPassword
              ? true
              : false
          }
        />
        <p className={termsStyle}>
          En cliquant sur <strong>'Valider la création'</strong>, vous acceptez
          nos{" "}
          <a href="/terms" className={linkStyle}>
            Conditions d'utilisation
          </a>{" "}
          et{" "}
          <a href="/privacy" className={linkStyle}>
            Politique de confidentialité
          </a>
          .
        </p>
      </div>
    </div>
  );
}

const titleStyle = style({
  fontWeight: 700,
  fontSize: "24px",
  marginBottom: "6px",
});

const paragraphStyle = style({
  fontSize: "14px",
  color: colors.gray,
});

const formStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: "18px",
});

const rowStyle = style({
  display: "flex",
  gap: "15px",
});

const topRightLinkStyle = style({
  fontSize: "14px",
  marginTop: "15px",
});

const selectStyle = style({
  padding: "10px 12px",
  borderRadius: "8px",
  backgroundColor: colors.mywhite,
  border: "1px solid transparent",
  fontSize: "14px",
  cursor: "pointer",
  appearance: "none",

  $nest: {
    "&:focus": {
      outline: "none",
      border: `1px solid ${colors.primary}`,
      backgroundColor: colors.white,
    },
  },
});

const errorStyle = style({
  color: colors.error,
  fontSize: "13px",
});

const termsStyle = style({
  fontSize: "12px",
  color: colors.gray,
  textAlign: "center",
  marginTop: "10px",
  lineHeight: "1.4",
});

const linkStyle = style({
  color: colors.primary,
  textDecoration: "none",
  fontWeight: 600,

  $nest: {
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

const passwordWrapperStyle = style({
  position: "relative",
});

const pwdChecklistContainerStyle = style({
  position: "absolute",

  bottom: "calc(100% + 23px)",
  left: 80,

  width: "320px",

  padding: "12px",

  backgroundColor: colors.white,

  borderRadius: "12px",

  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",

  border: `1px solid #e5e7eb`,

  zIndex: 1000,

  $nest: {
    "&::after": {
      content: '""',

      position: "absolute",

      bottom: "-12px",

      left: "10px",

      width: 0,
      height: 0,

      borderLeft: "10px solid transparent",
      borderRight: "10px solid transparent",
      borderTop: `10px solid ${colors.primary}`,
    },
  },
});
