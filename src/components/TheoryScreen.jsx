import React, { useEffect, useState, useMemo, useCallback } from "react";
import { normalizeId } from "../utils";
import TheoryModal from "./TheoryModal";

// Simple hook to get URL parameters
function useURLParams() {
  const [params, setParams] = useState(new URLSearchParams(window.location.search));
  
  const updateParams = useCallback((newParams) => {
    const search = newParams.toString();
    const newURL = search ? `${window.location.pathname}?${search}` : window.location.pathname;
    window.history.pushState({}, '', newURL);
    setParams(newParams);
  }, []);
  
  return [params, updateParams];
}

export default function TheoryScreen(props) {
  const { 
    profile, 
    theory = [], 
    classes = [], 
    lessons = [], 
    questions = [], 
    onStartQuiz 
  } = props;
  console.log('TheoryScreen render - theory data:', theory);
  console.log('TheoryScreen render - theory length:', theory?.length);
  console.log('TheoryScreen render - profile:', profile);
  
  const [searchParams, setSearchParams] = useURLParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get URL parameters
  const urlClassId = searchParams.get('class');
  const urlLessonId = searchParams.get('lesson');
  
  // Local state
  const [activeClassId, setActiveClassId] = useState(() => {
    // If URL has class, use it
    if (urlClassId) return Number(urlClassId);
    
    // If profile has classId, check if theory exists for that class
    if (profile?.classId) {
      const profileClassId = Number(profile.classId);
      // Check if there's theory data for the user's class
      const hasTheoryForProfileClass = theory.some(item => item.classId === profileClassId);
      if (hasTheoryForProfileClass) {
        return profileClassId;
      }
    }
    
    // Default to null (show all classes)
    return null;
  });
  const [activeLessonId, setActiveLessonId] = useState(urlLessonId || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTheoryItem, setSelectedTheoryItem] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeClassId) params.set('class', activeClassId.toString());
    if (activeLessonId) params.set('lesson', activeLessonId);
    setSearchParams(params);
  }, [activeClassId, activeLessonId, setSearchParams]);

  // Filter theory items based on current filters
  const filteredTheory = useMemo(() => {
    let filtered = theory;
    
    console.log('Filtering theory data:', {
      totalTheory: theory.length,
      activeClassId,
      activeLessonId,
      searchQuery: debouncedSearchQuery
    });

    // Filter by class
    if (activeClassId) {
      const beforeClassFilter = filtered.length;
      filtered = filtered.filter(item => item.classId === activeClassId);
      console.log(`Class filter: ${beforeClassFilter} -> ${filtered.length} items`);
    }

    // Filter by lesson (if specified)
    if (activeLessonId && activeLessonId !== 'all') {
      const beforeLessonFilter = filtered.length;
      filtered = filtered.filter(item => item.lessonId === activeLessonId);
      console.log(`Lesson filter: ${beforeLessonFilter} -> ${filtered.length} items`);
    }

    // Filter by search query
    if (debouncedSearchQuery.trim()) {
      const beforeSearchFilter = filtered.length;
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.content.toLowerCase().includes(query)
      );
      console.log(`Search filter: ${beforeSearchFilter} -> ${filtered.length} items`);
    }

    console.log('Final filtered theory:', filtered);
    return filtered;
  }, [theory, activeClassId, activeLessonId, debouncedSearchQuery]);

  // Get available classes and lessons for filters
  const availableClasses = useMemo(() => {
    const classIds = [...new Set(theory.map(item => item.classId).filter(Boolean))];
    return classIds.map(classId => {
      const classInfo = classes.find(c => normalizeId(c.id) === classId.toString() || c.id === classId);
      const name = classInfo?.name || classInfo?.title || `Клас ${classId}`;
      return { id: classId, name };
    }).sort((a, b) => a.id - b.id);
  }, [theory, classes]);

  const availableLessons = useMemo(() => {
    if (!activeClassId) return [];
    
    const lessonIds = [...new Set(
      theory
        .filter(item => item.classId === activeClassId && item.lessonId)
        .map(item => item.lessonId)
    )];
    
    return lessonIds.map(lessonId => {
      const lessonInfo = lessons.find(l => normalizeId(l.id) === lessonId);
      const name = lessonInfo?.title || lessonInfo?.name || `Урок ${lessonId}`;
      return { id: lessonId, name };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [theory, lessons, activeClassId]);

  const handleClassChange = (classId) => {
    setActiveClassId(classId);
    setActiveLessonId(null);
    setSelectedTheoryItem(null);
  };
  
  const handleLessonChange = (lessonId) => {
    setActiveLessonId(lessonId);
    setSelectedTheoryItem(null);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle theory item click
  const handleTheoryClick = useCallback((theoryItem) => {
    // Find the corresponding lesson for this theory item
    const lesson = lessons.find(l => normalizeId(l.id) === theoryItem.lessonId);
    setSelectedTheoryItem(theoryItem);
    setSelectedLesson(lesson);
    setModalOpen(true);
  }, [lessons]);

  // Handle start test
  const handleStartTest = useCallback((lesson) => {
    if (lesson && onStartQuiz) {
      // Find questions for this lesson
      const lessonQuestions = questions.filter(q => {
        const questionLessonId = q.lesson_id || q.lessonId;
        const lessonId = lesson.id || lesson.lesson_id;
        return normalizeId(questionLessonId) === normalizeId(lessonId);
      });
      
      if (lessonQuestions.length > 0) {
        console.log('Starting test for lesson:', lesson, 'with', lessonQuestions.length, 'questions');
        onStartQuiz(lesson, lessonQuestions);
      } else {
        console.warn('No questions found for lesson:', lesson);
        // You could show a toast or alert here
      }
    }
  }, [onStartQuiz, questions]);

  const handleGoToOnboarding = () => window.location.href = '/onboarding';
  const handleReload = () => window.location.reload();
  const handleClearClassFilter = () => setActiveClassId(null);
  const handleTheoryItemClick = (item) => handleTheoryClick(item);
  const handleClassSelectChange = (e) => handleClassChange(e.target.value);
  const handleLessonSelectChange = (e) => handleLessonChange(e.target.value);
  const handleCloseModal = () => setModalOpen(false);

  // If no profile, show prompt
  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-2xl font-semibold mb-4 text-slate-800">Профилът е задължителен</h2>
            <p className="text-slate-600 mb-6 text-lg">
              Моля, въведете профил/клас в настройките за да видите теорията
            </p>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              onClick={handleGoToOnboarding}
            >
              Въведи профил
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If theory data is not loaded yet, show loading
  if (!theory || theory.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-semibold mb-4 text-slate-800">Зареждаме теорията</h2>
            <div className="animate-pulse text-lg text-slate-600 mb-4">Моля, изчакайте...</div>
            <p className="text-sm text-slate-500">
              Ако зареждането продължава дълго, може да има проблем с достъпа до данните.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-semibold mb-4 text-slate-800">Възникна грешка</h2>
            <div className="text-red-600 mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              onClick={handleReload}
            >
              Опитай отново
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6 bg-white rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">Теория</h1>
          
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Class Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Клас</label>
              <select
                value={activeClassId || ''}
                onChange={handleClassSelectChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Всички класове</option>
                {availableClasses.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Lesson Selector */}
            {activeClassId && availableLessons.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Урок</label>
                <select
                  value={activeLessonId}
                  onChange={handleLessonSelectChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="all">Всички уроци</option>
                  {availableLessons.map(lesson => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Search Input */}
            <div className={(() => {
              const baseClasses = "space-y-2";
              const spanClass = activeClassId && availableLessons.length > 0 ? 'sm:col-span-2' : 'sm:col-span-3';
              return `${baseClasses} ${spanClass}`;
            })()}>
              <label className="text-sm font-medium text-slate-700">Търсене</label>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Търси в заглавие и съдържание..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredTheory.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Няма налична теория</h3>
            <p className="text-slate-600 mb-4">
              {activeClassId ? (
                (() => {
                  const message = `Няма налична теория за клас ${activeClassId}. Опитайте да промените филтъра за клас или да използвате търсенето.`;
                  return message;
                })()
              ) : (
                "Няма налична теория за избрания филтър."
              )}
            </p>
            {activeClassId && (
              <div className="mt-4">
                <button
                  onClick={handleClearClassFilter}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Покажи всички класове
                </button>
              </div>
            )}
            {theory.length > 0 && (
              <div className="mt-4 text-sm text-slate-500">
                <p>Налична теория за класове: {[...new Set(theory.map(item => item.classId))].sort().join(', ')}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <span>📖</span>
                Уроци с теория ({filteredTheory.length})
              </h2>
            </div>
            
            <div className="divide-y divide-slate-200">
              {filteredTheory.map(item => {
                const handleClick = () => handleTheoryItemClick(item);
                return (
                  <div
                    key={item.id}
                    className="p-6 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={handleClick}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-800 mb-3">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {item.classId && (
                            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium">
                              Клас {item.classId}
                            </span>
                          )}
                          {item.lessonId && (
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                              Урок {item.lessonId}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Theory Modal */}
      <TheoryModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        theoryItem={selectedTheoryItem}
        lesson={selectedLesson}
        onStartTest={handleStartTest}
      />
    </div>
  );
}