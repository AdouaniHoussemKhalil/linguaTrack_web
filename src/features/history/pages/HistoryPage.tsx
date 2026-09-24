import { useEffect, useState } from "react";
import { style } from "typestyle";
import { useHistory } from "@/features/history/hooks/useHistory";
import HistoryItemComponent from "@/features/history/components/HistoryItemComponent";
import { colors } from "@/components/common/Colors";

type Period = "all" | "day" | "week" | "month" | "year";

const periods: { value: Period; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "day", label: "Aujourd'hui" },
  { value: "week", label: "Cette semaine" },
  { value: "month", label: "Ce mois" },
  { value: "year", label: "Cette année" },
];

const HistoryPage = () => {
  const [period, setPeriod] = useState<Period>("all");
  const { data, isFetching: isLoading, error } = useHistory({period});




  return (
    <div className={pageStyle}>
      <div className={headerStyle}>
        <h1>Historique d'analyse</h1>
        <p>Consultez tous vos textes analysés et leurs corrections.</p>
      </div>

      <div className={filtersStyle}>
        <label className={labelStyle}>Filtrer par période</label>
        <div className={filterButtonsStyle}>
          {periods.map((p) => (
            <button
              key={p.value}
              className={`${filterButtonStyle} ${period === p.value ? selectedButtonStyle : ""}`}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className={loadingStyle}>
          <span className="material-symbols-outlined">hourglass_empty</span>
          <p>Chargement de l'historique...</p>
        </div>
      )}

      {error && (
        <div className={errorStyle}>
          <span className="material-symbols-outlined">error</span>
          <p>Erreur lors du chargement de l'historique.</p>
        </div>
      )}

      {!isLoading && !error && data && data?.length === 0 && (
        <div className={emptyStyle}>
          <span className="material-symbols-outlined">folder_open</span>
          <p>Aucun texte analysé pour cette période.</p>
        </div>
      )}

      {!isLoading && data && (
        <div className={listStyle}>
           <div className={countStyle}>
            {data?.length} texte{data?.length > 1 ? "s" : ""} trouvé{data?.length > 1 ? "s" : ""}
          </div>
          <div className={itemsContainerStyle}>
            {data?.map((item) => (
                <HistoryItemComponent key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;

const pageStyle = style({
  padding: "20px 0",
});

const headerStyle = style({
  marginBottom: "28px",
  $nest: {
    h1: {
      fontSize: "28px",
      margin: 0,
      marginBottom: "8px",
    },
    p: {
      margin: 0,
      color: colors.gray,
      fontSize: "14px",
    },
  },
});

const filtersStyle = style({
  marginBottom: "28px",
  padding: "16px",
  borderRadius: "12px",
  backgroundColor: colors.surfaceMuted,
  border: `1px solid ${colors.mywhite}`,
});

const labelStyle = style({
  display: "block",
  fontSize: "14px",
  fontWeight: 600,
  marginBottom: "12px",
  color: colors.primary,
});

const filterButtonsStyle = style({
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
});

const filterButtonStyle = style({
  padding: "8px 16px",
  borderRadius: "8px",
  border: `1px solid ${colors.mywhite}`,
  backgroundColor: colors.white,
  fontSize: "13px",
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.2s ease",
  color: colors.mygray,
  $nest: {
    "&:hover": {
      backgroundColor: colors.primary,
      color: colors.white
    },
  },
});

const selectedButtonStyle = style({
  backgroundColor: colors.primary,
  color: colors.white,
  borderColor: colors.primary,
  fontWeight: 600,
});

const loadingStyle = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  padding: "60px 20px",
  color: colors.gray,
  textAlign: "center",
  $nest: {
    "& .material-symbols-outlined": {
      fontSize: "48px",
    },
  },
});

const errorStyle = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  padding: "60px 20px",
  color: colors.error,
  textAlign: "center",
  $nest: {
    "& .material-symbols-outlined": {
      fontSize: "48px",
    },
  },
});

const emptyStyle = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  padding: "60px 20px",
  color: colors.gray,
  textAlign: "center",
  $nest: {
    "& .material-symbols-outlined": {
      fontSize: "48px",
    },
  },
});

const listStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

const countStyle = style({
  fontSize: "14px",
  fontWeight: 600,
  color: colors.gray,
  paddingBottom: "8px",
});

const itemsContainerStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});
