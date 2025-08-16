import { STORAGE_KEYS } from '../constants';

/**
 * Get all quiz results from localStorage
 * @returns {Array} Array of quiz results
 */
export function getQuizResults() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.results);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading quiz results:', error);
    return [];
  }
}

/**
 * Save quiz results to localStorage
 * @param {Array} results - Array of quiz results
 */
export function saveQuizResults(results) {
  try {
    localStorage.setItem(STORAGE_KEYS.results, JSON.stringify(results));
  } catch (error) {
    console.error('Error saving quiz results:', error);
  }
}

/**
 * Add a new quiz result
 * @param {Object} result - Quiz result object
 */
export function addQuizResult(result) {
  try {
    const results = getQuizResults();
    const newResults = [result, ...results]; // Add new result at the beginning
    saveQuizResults(newResults);
    return newResults;
  } catch (error) {
    console.error('Error adding quiz result:', error);
    return [];
  }
}

/**
 * Get results for a specific lesson
 * @param {string} lessonId - Lesson ID
 * @returns {Array} Array of results for the lesson
 */
export function getResultsForLesson(lessonId) {
  const results = getQuizResults();
  return results.filter(result => 
    result.lesson?.id === lessonId || 
    result.lesson?.lesson_id === lessonId
  );
}

/**
 * Get the latest result for a specific lesson
 * @param {string} lessonId - Lesson ID
 * @returns {Object|null} Latest result or null
 */
export function getLatestResultForLesson(lessonId) {
  const lessonResults = getResultsForLesson(lessonId);
  return lessonResults.length > 0 ? lessonResults[0] : null;
}

/**
 * Clear all quiz results
 */
export function clearQuizResults() {
  try {
    localStorage.removeItem(STORAGE_KEYS.results);
  } catch (error) {
    console.error('Error clearing quiz results:', error);
  }
}

/**
 * Get result statistics
 * @returns {Object} Statistics object
 */
export function getResultStatistics() {
  const results = getQuizResults();
  
  if (results.length === 0) {
    return {
      totalTests: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      averageScore: 0,
      bestScore: 0,
      worstScore: 0
    };
  }

  const totalTests = results.length;
  const totalQuestions = results.reduce((sum, r) => sum + (r.total || 0), 0);
  const totalCorrect = results.reduce((sum, r) => sum + (r.correct || 0), 0);
  const averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  
  const scores = results.map(r => {
    const score = r.total > 0 ? Math.round((r.correct / r.total) * 100) : 0;
    return score;
  });
  const bestScore = Math.max(...scores);
  const worstScore = Math.min(...scores);

  return {
    totalTests,
    totalQuestions,
    totalCorrect,
    averageScore,
    bestScore,
    worstScore
  };
}
