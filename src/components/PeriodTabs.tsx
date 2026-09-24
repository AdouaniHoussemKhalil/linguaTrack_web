import { Tabs, TabsList, TabsTrigger } from "@quickadui/core";
import { periods, type Period } from "@/utils/period";

interface PeriodTabsProps {
  value: Period;
  onChange: (period: Period) => void;
}

/** Sélecteur de période (onglets QuickadUI utilisés comme contrôle segmenté). */
export const PeriodTabs = ({ value, onChange }: PeriodTabsProps) => (
  // Défilement horizontal plutôt que débordement sur les petits écrans
  <Tabs value={value} onValueChange={(next) => onChange(next as Period)} className="max-w-full overflow-x-auto">
    <TabsList aria-label="Période">
      {periods.map((period) => (
        <TabsTrigger key={period.value} value={period.value}>
          {period.label}
        </TabsTrigger>
      ))}
    </TabsList>
  </Tabs>
);
