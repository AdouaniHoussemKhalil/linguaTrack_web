import { style } from "typestyle";
import { colors } from "@/components/common/Colors";
import type { HistoryItemDto } from "@/features/history/types/History";
import { useNavigate } from "react-router";
import { routes } from "@/app/routes/routes";
import { StringHelper } from "@/utils/helper";

interface HistoryItemComponentProps {
  item: HistoryItemDto;
}

const HistoryItemComponent: React.FC<HistoryItemComponentProps> = ({ item }) => {
  const navigate = useNavigate();

  const userId = item.user_id ?? localStorage.getItem("userId");

  const handleOpen = () => {
    navigate(`${routes.correction}/${item.id}/${userId}`);
  };

  return (
    <div className={itemContainerStyle}>
      <div className={itemHeaderStyle}>
        <div className={itemTitleStyle}>
          {StringHelper.getFirstWords(item.original_text)}
        </div>
        <span
          className="material-symbols-outlined"
          style={{ cursor: "pointer", fontSize: "20px" }}
          onClick={handleOpen}
          title="Ouvrir pour correction"
        >
          arrow_forward
        </span>
      </div>

      <div className={itemDetailsStyle}>
        <div className={detailCellStyle}>
          <div className={labelStyle}>Date</div>
          <div className={valueStyle}>{StringHelper.formatDate(item.created_at)}</div>
        </div>

        <div className={detailCellStyle}>
          <div className={labelStyle}>Mode</div>
          <div className={valueStyle}>{item.mode}</div>
        </div>

        <div className={detailCellStyle}>
          <div className={labelStyle}>Score</div>
          <div className={scoreValueStyle}>
            {item.score !== null ? `${item.score.toFixed(1)}` : "N/A"}
          </div>
        </div>

        <div className={detailCellStyle}>
          <div className={labelStyle}>Erreurs</div>
          <div className={errorCountStyle}>{item.errors?.length ?? 0}</div>
        </div>

        <div className={detailCellStyle}>
          <div className={labelStyle}>Temps</div>
          <div className={valueStyle}>
            {item.processing_time !== null ? `${item.processing_time.toFixed(2)}s` : "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryItemComponent;

const itemContainerStyle = style({
  padding: "16px",
  borderRadius: "12px",
  border: `1px solid ${colors.mywhite}`,
  backgroundColor: "#fff",
  transition: "all 0.2s ease",
  $nest: {
    "&:hover": {
      borderColor: colors.primary,
      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    },
  },
});

const itemHeaderStyle = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
});

const itemTitleStyle = style({
  fontSize: "15px",
  fontWeight: 600,
  color: colors.primary,
  flex: 1,
});

const itemDetailsStyle = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
  gap: "12px",
  fontSize: "13px",
});

const detailCellStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

const labelStyle = style({
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  color: colors.gray,
});

const valueStyle = style({
  fontSize: "13px",
  fontWeight: 500,
  color: colors.mygray,
});

const scoreValueStyle = style({
  fontSize: "14px",
  fontWeight: 700,
  color: colors.primary,
});

const errorCountStyle = style({
  fontSize: "14px",
  fontWeight: 700,
  color: colors.error,
});
