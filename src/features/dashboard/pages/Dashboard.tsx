import { style } from "typestyle";
import { colors } from "@/components/common/Colors";
import TotalTextsComponent from "../components/TotalTextsComponent";
import ScoreComponent from "../components/SocreComponent";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import TotalErrorsComponent from "../components/TotalErrorsComponent";
import ProcessingTimeComponent from "../components/ProcessingTimeComponent";
import ModeDistributionComponent from "../components/ModeDistrubtionComponent";
import ErrorTypeBreakDownComponent from "../components/ErrorTypeBreakDownComponent";
import LastTextComponent from "../components/LastTextComponent";
import { useGetStats } from "../hooks/UseStats";

export default function Dashboard() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState([
    { label: "Cette semaine", value: "last_week" },
    { label: "Ce mois-ci", value: "last_month" },
  ]);

  const localStorageSelectedDate = localStorage.getItem("dashboardDateFilter");
  if (localStorageSelectedDate && !selectedDate) {
    setSelectedDate(localStorageSelectedDate);
  }

  const {data: stats} = useGetStats();


  return (
    <div className={`${containerStyle} {ScrollBar}`}>
      <div className={headerStyle}>
        <h1 className={titleStyle}>Tableau de bord</h1>
        <div className={actionsStyle}>
          <div className={filterStyle}>
            <Button
              noBorder
              noUppercase
              variant="outlined"
              text={
                selectedDate
                  ? filterOptions.find((opt) => opt.value === selectedDate)
                      ?.label || "Filtrer par date"
                  : "Filtrer par date"
              }
              icon="calendar_today"
              onClick={() => setIsFilterOpen((prev) => !prev)}
            />
            {isFilterOpen && (
              <div className={selectDateContainerStyle}>
                {filterOptions.map((option) => (
                  <div key={option.value}>
                    <input
                      type="radio"
                      id={option.value}
                      name="dateFilter"
                      value={option.value}
                      checked={selectedDate === option.value}
                      onChange={() => {
                        (setSelectedDate(option.value as string | null),
                          localStorage.setItem(
                            "dashboardDateFilter",
                            option.value,
                          ));
                      }}
                    />
                    <label htmlFor={option.value}>{option.label}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button text="Exporter" noUppercase />
        </div>
      </div>

      <div className={firstBlocStyle}>
        <TotalTextsComponent totalTexts={stats?.total_texts ?? 0} />
        <ScoreComponent score={stats?.average_score ?? 0} />
        <TotalErrorsComponent number={stats?.total_errors ?? 0} average={stats?.average_errors_per_text ?? 0} />
        <ProcessingTimeComponent time={stats?.average_processing_time ?? 0} />
      </div>
      <div className={secondBlocStyle}>
        <div style={{ flex: 7, display: "block" }}>
          <ErrorTypeBreakDownComponent errorTypePercentages={stats?.error_type_percentages} errorTypeNumbers={stats?.error_type_counts} />
          <br />
          <LastTextComponent recentText={stats?.recent_texts[0]}  />
        </div>
        <div style={{ flex: 3}}>
          <ModeDistributionComponent modePercentages={stats?.mode_percentages} modes={stats?.mode_counts} />
        </div>
      </div>
    </div>
  );
}

const containerStyle = style({
  padding: "5px",
  $nest: {
    "@media (max-width: 600px)": {
      padding: "12px",
    },
  },
});

const headerStyle = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  $nest: {
    "@media (max-width: 600px)": {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "12px",
    },
  },
});

const selectDateContainerStyle = style({
  position: "absolute",
  backgroundColor: colors.white,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  padding: "10px",
  $nest: {
    "@media (max-width: 400px)": {
      position: "relative",
    },
  },
});

const titleStyle = style({
  fontSize: "28px",
  fontWeight: "bold",
  marginBottom: "10px",
  color: colors.primary,
  $nest: {
    "@media (max-width: 600px)": {
      fontSize: "24px",
    },
  },
});

const filterStyle = style({
  borderRadius: "20px",
});

const firstBlocStyle = style({
  display: "flex",
  gap: "20px",
  alignItems: "stretch",
  marginTop: "20px",
  flexWrap: "wrap",
  $nest: {
    "@media (max-width: 768px)": {
      flexDirection: "column",
      gap: "12px",
    },
  },
});

const secondBlocStyle = style({
  display: "flex",
  gap: "20px",
  marginTop: "20px",
  $nest: {
    "@media (max-width: 900px)": {
      flexDirection: "column",
    },
  },
});

const actionsStyle = style({
  display: "flex",
  gap: "5px",
});
