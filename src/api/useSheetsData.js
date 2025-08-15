import { useEffect, useState } from "react";
import { fetchCSV } from "./fetchCsv";
import { SHEETS } from "../constants";

export function useSheetsData() {
  const [data, setData] = useState({ classes: [], subjects: [], lessons: [], questions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [classes, subjects, lessons, questions] = await Promise.all([
          fetchCSV(SHEETS.classes),
          fetchCSV(SHEETS.subjects),
          fetchCSV(SHEETS.lessons),
          fetchCSV(SHEETS.questions),
        ]);
        if (!cancelled) setData({ classes, subjects, lessons, questions });
      } catch (e) {
        if (!cancelled) setError(e?.message || "Грешка при зареждане");
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