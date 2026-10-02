import { useEffect, useState } from "react";

/** Valeur mise à jour seulement après `delay` ms sans changement (ex. recherche au clavier). */
export const useDebouncedValue = <T,>(value: T, delay = 350): T => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};
