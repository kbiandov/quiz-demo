import { useEffect, useState } from "react";
import { fetchCSV } from "./fetchCsv";
import { SHEETS } from "../constants";

export function useSheetsData() {
  const [data, setData] = useState({ classes: [], subjects: [], lessons: [], questions: [], theory: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [classes, subjects, lessons, questions, theory] = await Promise.all([
          fetchCSV(SHEETS.classes),
          fetchCSV(SHEETS.subjects),
          fetchCSV(SHEETS.lessons),
          fetchCSV(SHEETS.questions),
          fetchCSV(SHEETS.theory).catch(e => {
            console.warn('Theory data failed to load:', e);
            return []; // Return empty array for theory if it fails
          }),
        ]);
        if (!cancelled) setData({ classes, subjects, lessons, questions, theory });
      } catch (e) {
        if (!cancelled) {
          console.error('Error loading sheets data:', e);
          setError(e?.message || "Грешка при зареждане на данните");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { ...data, loading, error };
}