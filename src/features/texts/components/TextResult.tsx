import Card from "@/components/ui/Card";
import { style } from "typestyle";
import { colors } from "@/components/common/Colors";
import type { AnalyseTextResult } from "@/features/texts/types/text";
import { useState } from "react";

interface TextResultProps {
  result: AnalyseTextResult;
}

const TextResult: React.FC<TextResultProps> = ({ result }) => {
  const [expandedError, setExpandedError] = useState<number | null>(null);
  const [displayErrors, setDisplayErrors] = useState(false);

  return (
    <Card width="large" header="Résultat de l'analyse">
      <div className={gridStyle}>
        <div>
          <div className={sectionTitle}>Résumé</div>
          <div className={textBlockStyle}>
            <div className={subTitle}>Texte corrigé</div>
            <div className={textStyle}>{result.corrected_text}</div>
          </div>
          <div className={infoRow}>
            <span>Score</span>
            <strong>
              {result.score !== null
                ? `${result.score.toFixed(1)} / 100`
                : "N/A"}
            </strong>
          </div>

          <div className={infoRow}>
            <span>Temps de traitement</span>
            <strong>
              {result.processing_time !== null
                ? `${result.processing_time.toFixed(2)} s`
                : "N/A"}
            </strong>
          </div>

          <div className={infoRow}>
            <span>Mode</span>
            <strong>{result.mode}</strong>
          </div>

          <div className={infoRow}>
            <span>Niveau ciblé</span>
            <strong>{result.target_level ?? "Aucun"}</strong>
          </div>

          <div
            className={clickableRow}
            onClick={() => setDisplayErrors(!displayErrors)}
          >
            <span>Erreurs détectées ({result.errors?.length ?? 0})</span>

            {result.errors && result.errors.length > 0 && (
              <span className={arrowStyle}>{displayErrors ? "▲" : "▼"}</span>
            )}
          </div>

          {displayErrors && result.errors && result.errors.length > 0 && (
            <div className={errorsContainerStyle}>
              {result.errors.map((error, index) => (
                <div key={index} className={accordionItemStyle}>
                  <div
                    className={accordionHeaderStyle}
                    onClick={() =>
                      setExpandedError(expandedError === index ? null : index)
                    }
                  >
                    <span className={accordionIconStyle}>
                      {expandedError === index ? "▼" : "▶"}
                    </span>

                    <span className={errorTypeStyle}>{error.error_type}</span>

                    {error.severity && (
                      <span className={severityStyle}>{error.severity}</span>
                    )}
                  </div>

                  {expandedError === index && (
                    <div className={accordionContentStyle}>
                      <div className={errorDetailStyle}>
                        <div className={errorLabelStyle}>Fragment original</div>

                        <div className={errorFragmentStyle}>
                          {error.original_fragment}
                        </div>
                      </div>

                      <div className={errorDetailStyle}>
                        <div className={errorLabelStyle}>Fragment corrigé</div>

                        <div className={correctedFragmentStyle}>
                          {error.corrected_fragment}
                        </div>
                      </div>

                      <div className={errorDetailStyle}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                          className={errorLabelStyle}
                        >
                          Explication
                          <span className="material-symbols-outlined">
                            {"info"}
                          </span>
                        </div>

                        <div className={explanationStyle}>
                          {error.explanation}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className={infoRow}>
            <span>Date</span>
            <strong>{new Date(result.created_at).toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* <div className={textBlockStyle}>
        <div className={subTitle}>Texte original</div>
        <div className={textStyle}>{result.original_text}</div>
      </div>

      <div className={textBlockStyle}>
        <div className={subTitle}>Texte corrigé</div>
        <div className={textStyle}>{result.corrected_text}</div>
      </div> */}
    </Card>
  );
};

export default TextResult;

/* ===================== STYLES ===================== */

const gridStyle = style({
  display: "grid",
  gap: "18px",
});

const sectionTitle = style({
  fontSize: "16px",
  fontWeight: 700,
  marginBottom: "16px",
  color: colors.primary,
});

const infoRow = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 0",
  borderBottom: `1px solid ${colors.mywhite}`,
  fontSize: "14px",
});

const clickableRow = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 0",
  borderBottom: `1px solid ${colors.mywhite}`,
  cursor: "pointer",
  $nest: {
    "&:hover": {
      color: colors.primary,
    },
  },
});

const arrowStyle = style({
  fontSize: "18px",
});

const textBlockStyle = style({
  marginTop: "24px",
});

const subTitle = style({
  fontWeight: 700,
  marginBottom: "10px",
});

const textStyle = style({
  minHeight: "120px",
  padding: "16px",
  borderRadius: "10px",
  backgroundColor: colors.green,
  border: `1px solid ${colors.mywhite}`,
  whiteSpace: "pre-wrap",
  lineHeight: 1.6,
});

const errorsContainerStyle = style({
  marginTop: "15px",
  marginBottom: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
});

const accordionItemStyle = style({
  border: `1px solid #E5E7EB`,
  borderRadius: "10px",
  overflow: "hidden",
  backgroundColor: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
});

const accordionHeaderStyle = style({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "16px",
  cursor: "pointer",
  backgroundColor: "#F9FAFB",

  $nest: {
    "&:hover": {
      backgroundColor: "#F3F4F6",
    },
  },
});

const accordionIconStyle = style({
  width: "18px",
  color: colors.gray,
});

const errorTypeStyle = style({
  flex: 1,
  fontWeight: 600,
  color: colors.primary,
  textTransform: "capitalize",
});

const severityStyle = style({
  backgroundColor: colors.error,
  color: "#fff",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: 600,
});

const accordionContentStyle = style({
  padding: "18px",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  backgroundColor: "#fff",
});

const errorDetailStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
});

const errorLabelStyle = style({
  fontSize: "12px",
  fontWeight: 700,
  color: colors.gray,
  textTransform: "uppercase",
});

const errorFragmentStyle = style({
  padding: "12px",
  borderRadius: "8px",
  backgroundColor: "#FFF5F5",
  border: "1px solid #FECACA",
  fontFamily: "monospace",
});

const correctedFragmentStyle = style({
  padding: "12px",
  borderRadius: "8px",
  backgroundColor: "#ECFDF5",
  border: "1px solid #A7F3D0",
  fontFamily: "monospace",
});

const explanationStyle = style({
  padding: "12px",
  borderRadius: "8px",
  backgroundColor: "#F9FAFB",
  border: "1px solid #E5E7EB",
  lineHeight: 1.6,
  color: colors.mygray,
});
