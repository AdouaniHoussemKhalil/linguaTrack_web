import React from "react";
import { getPasswordStrength, type PasswordRule, type PasswordStrengthLabel } from "@quickadui/forms";
import { CheckIcon, CloseIcon } from "@quickadui/icons";

// PasswordStrengthMeter de QuickadUI affiche ses libellés en anglais sans
// option de traduction : on reprend sa logique (getPasswordStrength) et son
// apparence, en français.
const strengthDisplay: Record<PasswordStrengthLabel, { label: string; bar: string; text: string }> = {
  "Too weak": { label: "Trop faible", bar: "bg-danger-9", text: "text-danger-11" },
  Weak: { label: "Faible", bar: "bg-danger-9", text: "text-danger-11" },
  Fair: { label: "Moyen", bar: "bg-warning-9", text: "text-warning-11" },
  Good: { label: "Bon", bar: "bg-success-9", text: "text-success-11" },
  Strong: { label: "Fort", bar: "bg-success-9", text: "text-success-11" },
};

interface PasswordStrengthProps {
  value: string;
  rules: PasswordRule[];
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ value, rules }) => {
  const strength = getPasswordStrength(value, rules);
  const display = strengthDisplay[strength.label];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1" aria-hidden>
          {strength.rules.map((rule, index) => (
            <div
              key={rule.id}
              className={`h-1.5 flex-1 rounded-full transition-colors ${index < strength.score ? display.bar : "bg-neutral-5"}`}
            />
          ))}
        </div>
        <span className={`text-xs font-medium ${display.text}`} aria-live="polite">
          {display.label}
        </span>
      </div>

      <ul className="grid grid-cols-2 gap-1">
        {strength.rules.map((rule) => (
          <li key={rule.id} className="flex items-center gap-1.5 text-xs">
            {rule.passed ? (
              <CheckIcon size={14} className="text-success-9" aria-hidden />
            ) : (
              <CloseIcon size={14} className="text-neutral-8" aria-hidden />
            )}
            <span className={rule.passed ? "text-neutral-11" : "text-neutral-9"}>
              {rule.label}
              <span className="sr-only">{rule.passed ? " : respectée" : " : non respectée"}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrength;
