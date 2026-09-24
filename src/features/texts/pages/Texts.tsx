import { colors } from "@/components/common/Colors";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { style } from "typestyle";
import { useTexts } from "@/features/texts/hooks/useTexts";
import { useTextById } from "@/features/texts/hooks/useTextById";
import TextResult from "@/features/texts/components/TextResult";
import type { AnalyseTextResult, TextMode } from "@/features/texts/types/text";

const modes: { value: TextMode; label: string }[] = [
  { value: "correction", label: "Correction" },
  { value: "professional", label: "Professionnel" },
  { value: "simple", label: "Simple" },
  { value: "natural", label: "Naturel" },
  { value: "persuasive", label: "Persuasif" },
];

const TextsPage = () => {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<TextMode>("correction");
  const [formError, setFormError] = useState<string | null>(null);
  const { id, userId } = useParams<{ id?: string; userId?: string }>();
  const { data: loadedResult, error: textError } = useTextById(id, userId);
  const { mutate, isPending: isLoading, data, error } = useTexts();

  useEffect(() => {
    if (error) {
      setFormError(error.message || "Une erreur est survenue");
    }
  }, [error]);

  useEffect(() => {
    if (textError) {
      setFormError(textError.message || "Impossible de récupérer le texte demandé.");
      return;
    }

    if (loadedResult) {
      setText(loadedResult.original_text);
      setMode(loadedResult.mode ?? "correction");
      setFormError(null);
    }

    if (!id) {
      setText("");
      setMode("correction");
      setFormError(null);
    }
  }, [id, loadedResult, textError]);

  const handleSubmit = () => {
    if (!text.trim()) {
      setFormError("Veuillez saisir un texte à analyser.");
      return;
    }

    setFormError(null);
    mutate({ text, mode });
  };

  const result: AnalyseTextResult | undefined = data ?? loadedResult;

  return (
    <div className={pageStyle}>
      <div className={headerStyle}>
        <h1>Analyse de texte</h1>
        <p>Entrez votre texte ci-dessous puis lancez l'analyse pour obtenir la correction.</p>
      </div>

      <div className={layoutStyle}>
        <section className={formCardStyle}>
          <div className={sectionHeaderStyle}>Texte à analyser</div>

          <Field label="Mode de traitement">
            <select className={selectStyle} value={mode} onChange={(e) => setMode(e.target.value as TextMode)}>
              {modes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Texte original">
            <textarea
              className={textareaStyle}
              rows={10}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Collez ici votre texte à corriger..."
            />
          </Field>

          {formError && <div className={errorStyle}>{formError}</div>}

          <Button
            text="Analyser"
            size="large"
            isLoading={isLoading}
            onClick={handleSubmit}
          />
        </section>

        <section className={previewStyle}>
          {result ? (
            <TextResult result={result} />
          ) : (
            <div className={emptyStateStyle}>
              <span className="material-symbols-outlined">description</span>
              <p>Aucun résultat pour le moment. Lancez l'analyse ou chargez un texte existant.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TextsPage;

const pageStyle = style({
  padding: "20px 0",
});

const headerStyle = style({
  marginBottom: "24px",
  $nest: {
    h1: {
      fontSize: "28px",
      margin: 0,
    },
    p: {
      margin: "8px 0 0",
      color: colors.textMuted,
    },
  },
});

const layoutStyle = style({
  display: "grid",
  gridTemplateColumns: "1fr 1.2fr",
  gap: "24px",
  alignItems: "start",
  $nest: {
    "@media (max-width: 900px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

const formCardStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  padding: "24px",
  borderRadius: "16px",
  backgroundColor: colors.white,
  boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
});

const sectionHeaderStyle = style({
  fontSize: "18px",
  fontWeight: 700,
  marginBottom: "4px",
  color: colors.primary,
});

const textareaStyle = style({
  minHeight: "220px",
  width: "100%",
  resize: "vertical",
  padding: "14px",
  borderRadius: "12px",
  border: `1px solid ${colors.borderStrong}`,
  fontSize: "14px",
  fontFamily: "inherit",
  lineHeight: 1.6,
});

const selectStyle = style({
  padding: "10px 12px",
  borderRadius: "8px",
  border: `1px solid ${colors.borderStrong}`,
  fontSize: "14px",
  width: "100%",
});

const previewStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: "18px",
});

const emptyStateStyle = style({
  minHeight: "360px",
  borderRadius: "16px",
  border: `1px dashed ${colors.borderStrong}`,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "12px",
  padding: "40px",
  color: colors.textMuted,
  textAlign: "center",
  $nest: {
    "& .material-symbols-outlined": {
      fontSize: "48px",
    },
  },
});

const errorStyle = style({
  color: colors.dangerText,
  fontWeight: 600,
});
