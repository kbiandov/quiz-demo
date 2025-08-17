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
  console.log('TheoryScreen render - classes:', classes);
  console.log('TheoryScreen render - lessons:', lessons);
  
  const [searchParams, setSearchParams] = useURLParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get URL parameters
  const urlClassId = searchParams.get('class');
  const urlLessonId = searchParams.get('lesson');
  
  // Local state - fix the class ID handling
  const [activeClassId, setActiveClassId] = useState(() => {
    // Try to get class ID from profile, URL, or first available class
    if (urlClassId) return urlClassId;
    if (profile?.classId) return profile.classId.toString();
    if (theory.length > 0) {
      const firstClassId = theory[0]?.class_id || theory[0]?.classId;
      return firstClassId ? firstClassId.toString() : null;
    }
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
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeClassId) params.set('class', activeClassId.toString());
    if (activeLessonId) params.set('lesson', activeLessonId);
    setSearchParams(params);
  }, [activeClassId, activeLessonId, setSearchParams]);

  // Filter theory items based on current filters - fix the filtering logic
  const filteredTheory = useMemo(() => {
    let filtered = theory;
    
    if (activeClassId) {
      filtered = filtered.filter(item => {
        const itemClassId = item.class_id || item.classId;
        return itemClassId && itemClassId.toString() === activeClassId.toString();
      });
    }
    
    if (activeLessonId && activeLessonId !== 'all') {
      filtered = filtered.filter(item => {
        const itemLessonId = item.lesson_id || item.lessonId;
        return itemLessonId && itemLessonId.toString() === activeLessonId.toString();
      });
    }
    
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        (item.title && item.title.toLowerCase().includes(query)) || 
        (item.content && item.content.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [theory, activeClassId, activeLessonId, debouncedSearchQuery]);
  
  // Fix the available classes logic
  const availableClasses = useMemo(() => {
    const classIds = [...new Set(
      theory
        .map(item => item.class_id || item.classId)
        .filter(Boolean)
        .map(id => id.toString())
    )];
    
    return classIds.map(classId => {
      const classInfo = classes.find(c => 
        normalizeId(c.id) === classId || 
        c.id.toString() === classId ||
        c.name === classId
      );
      const name = classInfo?.name || classInfo?.title || `Клас ${classId}`;
      return { id: classId, name };
    }).sort((a, b) => {
      // Sort numerically if possible, otherwise alphabetically
      const aNum = parseInt(a.id);
      const bNum = parseInt(b.id);
      if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
      return a.name.localeCompare(b.name);
    });
  }, [theory, classes]);
  
  // Fix the available lessons logic
  const availableLessons = useMemo(() => {
    if (!activeClassId) return [];
    
    const lessonIds = [...new Set(
      theory
        .filter(item => {
          const itemClassId = item.class_id || item.classId;
          return itemClassId && itemClassId.toString() === activeClassId.toString();
        })
        .map(item => item.lesson_id || item.lessonId)
        .filter(Boolean)
    )];
    
    return lessonIds.map(lessonId => {
      const lessonInfo = lessons.find(l => 
        normalizeId(l.id) === lessonId.toString() ||
        l.id.toString() === lessonId.toString() ||
        l.lesson_id === lessonId.toString()
      );
      const name = lessonInfo?.title || lessonInfo?.name || `Урок ${lessonId}`;
      return { id: lessonId.toString(), name };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [theory, lessons, activeClassId]);

  const handleClassChange = (classId) => {
    console.log('Class changed to:', classId);
    setActiveClassId(classId);
    setActiveLessonId(''); // Reset lesson selection
    setSelectedTheoryItem(null);
  };
  
  const handleLessonChange = (lessonId) => {
    console.log('Lesson changed to:', lessonId);
    setActiveLessonId(lessonId);
    setSelectedTheoryItem(null);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle theory item click - fix the lesson finding logic
  const handleTheoryClick = useCallback((theoryItem) => {
    console.log('Theory item clicked:', theoryItem);
    
    // Find the corresponding lesson for this theory item
    const lesson = lessons.find(l => {
      const lessonId = l.id || l.lesson_id;
      const theoryLessonId = theoryItem.lesson_id || theoryItem.lessonId;
      return lessonId && theoryLessonId && lessonId.toString() === theoryLessonId.toString();
    });
    
    console.log('Found lesson:', lesson);
    setSelectedTheoryItem(theoryItem);
    setSelectedLesson(lesson);
    setModalOpen(true);
  }, [lessons]);

  // Handle start test - fix the question filtering logic
  const handleStartTest = useCallback((lesson, quizSettings) => {
    if (lesson && onStartQuiz) {
      console.log('Starting test for lesson:', lesson, 'with settings:', quizSettings);
      
      // Find questions for this lesson
      const lessonQuestions = questions.filter(q => {
        const questionLessonId = q.lesson_id || q.lessonId;
        const lessonId = lesson.id || lesson.lesson_id;
        return questionLessonId && lessonId && 
               normalizeId(questionLessonId) === normalizeId(lessonId);
      });
      
      console.log('Found questions:', lessonQuestions.length);
      
      if (lessonQuestions.length > 0) {
        console.log('Starting test for lesson:', lesson, 'with', lessonQuestions.length, 'questions');
        // Pass the quiz settings along with the lesson and questions
        onStartQuiz(lesson, lessonQuestions, quizSettings);
      } else {
        console.warn('No questions found for lesson:', lesson);
        // Show user-friendly message
        alert('Няма налични въпроси за този урок. Моля, опитайте с друг урок.');
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
                  value={activeLessonId || 'all'}
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
            <div className={`space-y-2 ${activeClassId && availableLessons.length > 0 ? 'sm:col-span-2' : 'sm:col-span-3'}`}>
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
              {activeClassId ? 
                `Няма налична теория за клас ${activeClassId}. Опитайте да промените филтъра за клас или да използвате търсенето.`
                : 'Няма налична теория за избрания филтър.'
              }
            </p>
            
            {/* Debug information */}
            <div className="mt-4 p-4 bg-slate-50 rounded-lg text-left text-sm">
              <p className="font-medium mb-2">Debug информация:</p>
              <p>• Активен клас: {activeClassId || 'Не е избран'}</p>
              <p>• Активен урок: {activeLessonId || 'Не е избран'}</p>
              <p>• Търсене: "{searchQuery}"</p>
              <p>• Общо теория: {theory.length}</p>
              <p>• Накрани класове: {[...new Set(theory.map(item => item.class_id || item.classId))].filter(Boolean).sort().join(', ')}</p>
              {activeClassId && (
                <p>• Уроци за клас {activeClassId}: {availableLessons.map(l => l.name).join(', ')}</p>
              )}
            </div>
            
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
                <p>Налична теория за класове: {[...new Set(theory.map(item => item.class_id || item.classId))].filter(Boolean).sort().join(', ')}</p>
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
                          {item.class_id || item.classId ? (
                            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium">
                              {(() => {
                                const classInfo = availableClasses.find(c => c.id === (item.class_id || item.classId)?.toString());
                                return classInfo ? classInfo.name : `Клас ${item.class_id || item.classId}`;
                              })()}
                            </span>
                          ) : null}
                          {item.lesson_id || item.lessonId ? (
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                              {(() => {
                                const lessonInfo = availableLessons.find(l => l.id === (item.lesson_id || item.lessonId)?.toString());
                                return lessonInfo ? lessonInfo.name : `Урок ${item.lesson_id || item.lessonId}`;
                              })()}
                            </span>
                          ) : null}
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