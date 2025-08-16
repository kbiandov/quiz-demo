import { fetchCSV } from "./fetchCsv";
import { SHEETS } from "../constants";

// Cache for theory data during the session
let theoryCache = null;

export async function loadTheory() {
  // Return cached data if available
  if (theoryCache) {
    return theoryCache;
  }

  try {
    const rawData = await fetchCSV(SHEETS.theory);
    
    // Process and clean the data
    const theoryItems = rawData
      .filter(row => row.id && row.title && row.content) // Skip empty rows
      .map(row => ({
        id: String(row.id).trim(),
        classId: row.class_id ? Number(row.class_id) : undefined,
        lessonId: row.lesson_id ? String(row.lesson_id).trim() : undefined,
        title: String(row.title).trim(),
        content: String(row.content).trim(),
        image: row.image ? String(row.image).trim() : undefined
      }))
      .filter(item => item.classId || item.lessonId); // Must have at least one filter

    // Cache the processed data
    theoryCache = theoryItems;
    return theoryItems;
  } catch (error) {
    console.error('Error loading theory data:', error);
    throw new Error('Грешка при зареждане на теорията');
  }
}

// Function to clear cache (useful for testing or manual refresh)
export function clearTheoryCache() {
  theoryCache = null;
}
