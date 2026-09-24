import Card from "@/components/ui/Card";
import CircularProgress from "@/components/ui/CircularProgress";
import { colors } from "@/components/common/Colors";
import { style } from "typestyle";
import type { RecentText } from "../types/Stats";
import { StringHelper } from "@/utils/helper";
import { useNavigate } from "react-router";
import { routes } from "@/app/routes/routes";


interface LastTextProps {
  recentText?: RecentText;
}

const LastTextComponent: React.FC<LastTextProps> = ({recentText}) => {

const navigate = useNavigate();

const userId = localStorage.getItem("userId");

  return (
    <Card
      width="medium"
      header={
        <div
          style={{
            fontWeight: "bold",
            fontSize: "20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>Dernier texte analysé</div>
          <span
            className="material-symbols-outlined"
            style={{ marginRight: "5px", cursor: 'pointer' }}
            onClick={() => {
              if (recentText?.id && userId) {
                navigate(`${routes.correction}/${recentText.id}/${userId}`);
                return;
              }
              navigate(routes.correction);
            }}
          >
            {"arrow_forward"}

          </span>
        </div>
      }
    >
      <div className={containerStyle}>
        {/* Informations */}
        <div className={infoSectionStyle}>
          <h3 className={titleStyle}>
            {StringHelper.getFirstWords(recentText?.original_text ?? "")}
          </h3>

          <div className={detailsContainerStyle}>
            <div className={detailItemStyle}>
              <div className={labelStyle}>Date d'analyse</div>
              <div className={valueStyle}>{StringHelper.formatDate(recentText?.created_at ?? "")}</div>
            </div>

            <div className={detailItemStyle}>
              <div className={labelStyle}>Mode</div>
              <div className={valueStyle}>{recentText?.mode}</div>
            </div>

            <div className={detailItemStyle}>
              <div className={labelStyle}>Erreurs détectées</div>
              <div className={errorValueStyle}>{recentText?.errors?.length ?? 0}</div>
            </div>
          </div>
        </div>

        {/* Score */}
        <div className={scoreSectionStyle}>
          <CircularProgress
            title="Score global"
            score={recentText?.score ?? 0}
          />
        </div>
      </div>
    </Card>
  );
};

export default LastTextComponent;

/* ===================== STYLES ===================== */

const containerStyle = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "40px",

  $nest: {
    "@media (max-width: 900px)": {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
});

const infoSectionStyle = style({
  flex: 1,
});

const titleStyle = style({
  fontSize: "20px",
  fontWeight: 700,
  marginBottom: "20px",
  color: colors.primary,
});

const detailsContainerStyle = style({
  display: "flex",
  gap: "40px",
  flexWrap: "wrap",
});

const detailItemStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

const labelStyle = style({
  fontSize: "13px",
  color: colors.gray,
  textTransform: "uppercase",
  letterSpacing: "1px",
});

const valueStyle = style({
  fontSize: "18px",
  fontWeight: 600,
  color: colors.mygray,
});

const errorValueStyle = style({
  fontSize: "28px",
  fontWeight: 700,
  color: colors.error,
});

const scoreSectionStyle = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});
