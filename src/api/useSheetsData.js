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
        console.log('Starting to fetch theory data from:', SHEETS.theory);
        
        const [classes, subjects, lessons, questions, theory] = await Promise.all([
          fetchCSV(SHEETS.classes),
          fetchCSV(SHEETS.subjects),
          fetchCSV(SHEETS.lessons),
          fetchCSV(SHEETS.questions),
          fetchCSV(SHEETS.theory),
        ]);
        
        // Transform theory data to match expected property names
        const transformedTheory = theory.map(item => ({
          id: item.id,
          classId: item.class_id ? Number(item.class_id) : undefined,
          lessonId: item.lesson_id ? String(item.lesson_id) : undefined,
          title: item.title,
          content: item.content,
          image: item.image
        }));
        
        console.log('Theory data loaded:', theory);
        console.log('Transformed theory data:', transformedTheory);
        console.log('Theory data length:', theory?.length);
        console.log('Theory data type:', typeof theory);
        console.log('Theory data structure:', theory?.[0]);
        console.log('All data keys:', Object.keys({ classes, subjects, lessons, questions, theory }));
        
        if (!cancelled) setData({ classes, subjects, lessons, questions, theory: transformedTheory });
      } catch (e) {
        if (!cancelled) {
          console.error('Error loading sheets data:', e);
          console.error('Full error object:', e);
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