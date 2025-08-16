import { useEffect, useState, useMemo } from "react";
import { fetchCSV } from "./fetchCsv";
import { SHEETS } from "../constants";

// Normalize ID to string and trim whitespace
const normalizeId = (id) => id ? String(id).trim() : '';

// Transform and normalize CSV data
const transformData = (rawData, type) => {
  if (!Array.isArray(rawData)) return [];
  
  switch (type) {
    case 'classes':
      return rawData.map(item => ({
        id: normalizeId(item.id),
        name: item.name?.trim() || item.title?.trim() || `Клас ${item.id}`,
        title: item.title?.trim() || item.name?.trim() || `Клас ${item.id}`
      }));
    
    case 'subjects':
      return rawData.map(item => ({
        id: normalizeId(item.id),
        name: item.name?.trim() || item.title?.trim() || `Предмет ${item.id}`,
        title: item.title?.trim() || item.name?.trim() || `Предмет ${item.id}`
      }));
    
    case 'lessons':
      return rawData.map(item => ({
        id: normalizeId(item.id),
        lesson_id: normalizeId(item.lesson_id),
        class_id: normalizeId(item.class_id),
        classId: normalizeId(item.class_id), // Backward compatibility
        subject_id: normalizeId(item.subject_id),
        title: item.title?.trim() || item.name?.trim() || `Урок ${item.id}`,
        name: item.name?.trim() || item.title?.trim() || `Урок ${item.id}`
      }));
    
    case 'questions':
      return rawData.map(item => ({
        id: normalizeId(item.id),
        lesson_id: normalizeId(item.lesson_id),
        lessonId: normalizeId(item.lesson_id), // Backward compatibility
        text: item.text?.trim() || item.question?.trim() || item.title?.trim() || '',
        question: item.question?.trim() || item.text?.trim() || item.title?.trim() || '',
        title: item.title?.trim() || item.text?.trim() || item.question?.trim() || '',
        A: item.A?.trim() || item.a?.trim() || '',
        B: item.B?.trim() || item.b?.trim() || '',
        C: item.C?.trim() || item.c?.trim() || '',
        D: item.D?.trim() || item.d?.trim() || '',
        correct: normalizeId(item.correct || item.correct_option || item.answer || ''),
        correct_option: normalizeId(item.correct || item.correct_option || item.answer || ''),
        answer: normalizeId(item.correct || item.correct_option || item.answer || ''),
        explanation: item.explanation?.trim() || '',
        image: item.image?.trim() || ''
      }));
    
    case 'theory':
      return rawData.map(item => ({
        id: normalizeId(item.id),
        class_id: normalizeId(item.class_id),
        classId: normalizeId(item.class_id), // Backward compatibility
        lesson_id: normalizeId(item.lesson_id),
        lessonId: normalizeId(item.lesson_id), // Backward compatibility
        title: item.title?.trim() || '',
        content: item.content?.trim() || '',
        image: item.image?.trim() || ''
      }));
    
    default:
      return rawData;
  }
};

export function useSheetsData() {
  const [rawData, setRawData] = useState({
    classes: [],
    subjects: [],
    lessons: [],
    questions: [],
    theory: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all CSV data
  useEffect(() => {
    let cancelled = false;
    
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [classes, subjects, lessons, questions, theory] = await Promise.all([
          fetchCSV(SHEETS.classes),
          fetchCSV(SHEETS.subjects),
          fetchCSV(SHEETS.lessons),
          fetchCSV(SHEETS.questions),
          fetchCSV(SHEETS.theory),
        ]);
        
        if (!cancelled) {
          setRawData({ classes, subjects, lessons, questions, theory });
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[useSheetsData] Error loading data:', err);
          setError(err?.message || "Грешка при зареждане на данните");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchAllData();
    
    return () => {
      cancelled = true;
    };
  }, []);

  // Transform and normalize data
  const normalizedData = useMemo(() => ({
    classes: transformData(rawData.classes, 'classes'),
    subjects: transformData(rawData.subjects, 'subjects'),
    lessons: transformData(rawData.lessons, 'lessons'),
    questions: transformData(rawData.questions, 'questions'),
    theory: transformData(rawData.theory, 'theory')
  }), [rawData]);

  // Create stable indexes
  const indexes = useMemo(() => {
    const { questions, lessons, classes } = normalizedData;
    
    // Questions by ID
    const questionsById = questions.reduce((acc, question) => {
      if (question.id) {
        acc[question.id] = question;
      }
      return acc;
    }, {});
    
    // Questions by lesson ID
    const questionsByLessonId = questions.reduce((acc, question) => {
      const lessonId = question.lesson_id || question.lessonId;
      if (lessonId) {
        if (!acc[lessonId]) acc[lessonId] = [];
        acc[lessonId].push(question);
      }
      return acc;
    }, {});
    
    // Lessons by class ID
    const lessonsByClassId = lessons.reduce((acc, lesson) => {
      const classId = lesson.class_id || lesson.classId;
      if (classId) {
        if (!acc[classId]) acc[classId] = [];
        acc[classId].push(lesson);
      }
      return acc;
    }, {});
    
    // Classes by ID
    const classesById = classes.reduce((acc, cls) => {
      if (cls.id) {
        acc[cls.id] = cls;
      }
      return acc;
    }, {});
    
    return {
      questionsById,
      questionsByLessonId,
      lessonsByClassId,
      classesById
    };
  }, [normalizedData]);

  // Data validation
  const validation = useMemo(() => {
    const { questions, lessons, classes, theory } = normalizedData;
    
    return {
      hasQuestions: questions.length > 0,
      hasLessons: lessons.length > 0,
      hasClasses: classes.length > 0,
      hasTheory: theory.length > 0,
      totalQuestions: questions.length,
      totalLessons: lessons.length,
      totalClasses: classes.length,
      totalTheory: theory.length
    };
  }, [normalizedData]);

  return {
    // Raw normalized data
    ...normalizedData,
    
    // Stable indexes
    ...indexes,
    
    // Validation flags
    ...validation,
    
    // State
    loading,
    error,
    
    // Helper functions
    getQuestionsForLesson: (lessonId) => {
      const normalizedLessonId = normalizeId(lessonId);
      return indexes.questionsByLessonId[normalizedLessonId] || [];
    },
    
    getLessonById: (lessonId) => {
      const normalizedLessonId = normalizeId(lessonId);
      return lessons.find(l => 
        normalizeId(l.id) === normalizedLessonId || 
        normalizeId(l.lesson_id) === normalizedLessonId
      );
    },
    
    getClassById: (classId) => {
      const normalizedClassId = normalizeId(classId);
      return classes.find(c => normalizeId(c.id) === normalizedClassId);
    }
  };
}