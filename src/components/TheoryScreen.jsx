import React, { useEffect, useState, useMemo, useCallback } from "react";
import { normalizeId } from "../utils";

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

export default function TheoryScreen({ profile, theory = [], classes = [], lessons = [] }) {
  const [searchParams, setSearchParams] = useURLParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get URL parameters
  const urlClassId = searchParams.get('class');
  const urlLessonId = searchParams.get('lesson');
  const urlTheoryId = searchParams.get('id');
  
  // Local state
  const [activeClassId, setActiveClassId] = useState(urlClassId ? Number(urlClassId) : (profile?.classId ? Number(profile.classId) : null));
  const [activeLessonId, setActiveLessonId] = useState(urlLessonId || '');
  const [selectedId, setSelectedId] = useState(urlTheoryId || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

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
    if (selectedId) params.set('id', selectedId);
    setSearchParams(params);
  }, [activeClassId, activeLessonId, selectedId, setSearchParams]);

  // Filter theory items based on current filters
  const filteredTheory = useMemo(() => {
    let filtered = theory;

    // Filter by class
    if (activeClassId) {
      filtered = filtered.filter(item => item.classId === activeClassId);
    }

    // Filter by lesson (if specified)
    if (activeLessonId && activeLessonId !== 'all') {
      filtered = filtered.filter(item => item.lessonId === activeLessonId);
    }

    // Filter by search query
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.content.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [theory, activeClassId, activeLessonId, debouncedSearchQuery]);

  // Get available classes and lessons for filters
  const availableClasses = useMemo(() => {
    const classIds = [...new Set(theory.map(item => item.classId).filter(Boolean))];
    return classIds.map(classId => {
      const classInfo = classes.find(c => normalizeId(c.id) === classId.toString() || c.id === classId);
      return {
        id: classId,
        name: classInfo?.name || classInfo?.title || `Клас ${classId}`
      };
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
      return {
        id: lessonId,
        name: lessonInfo?.title || lessonInfo?.name || `Урок ${lessonId}`
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [theory, lessons, activeClassId]);

  // Auto-select first item if none selected
  useEffect(() => {
    if (!selectedId && filteredTheory.length > 0) {
      setSelectedId(filteredTheory[0].id);
    }
  }, [filteredTheory, selectedId]);

  // Get selected theory item
  const selectedTheory = useMemo(() => {
    return theory.find(item => item.id === selectedId);
  }, [theory, selectedId]);

  // Handle class change
  const handleClassChange = useCallback((classId) => {
    setActiveClassId(classId ? Number(classId) : null);
    setActiveLessonId(''); // Reset lesson filter
    setSelectedId(''); // Reset selection
  }, []);

  // Handle lesson change
  const handleLessonChange = useCallback((lessonId) => {
    setActiveLessonId(lessonId);
    setSelectedId(''); // Reset selection
  }, []);

  // Handle theory item selection
  const handleTheorySelect = useCallback((theoryId) => {
    setSelectedId(theoryId);
  }, []);

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
              onClick={() => window.location.href = '/onboarding'}
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
    // Development fallback - show sample data for testing
    const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
    
    if (isDevelopment) {
      const sampleTheory = [
        {
          id: 'sample1',
          classId: profile?.classId ? Number(profile.classId) : 5,
          lessonId: 'sample-lesson-1',
          title: 'Примерна теория - Математически основи',
          content: 'Това е примерна теория за демонстриране на функционалността. В реалната употреба, данните ще се зареждат от Google Sheets CSV файл.\n\nОсновните математически концепции включват:\n• Събиране и изваждане\n• Умножение и деление\n• Дроби и проценти\n• Геометрични форми',
          image: undefined
        },
        {
          id: 'sample2',
          classId: profile?.classId ? Number(profile.classId) : 5,
          lessonId: 'sample-lesson-2',
          title: 'Примерна теория - Алгебра',
          content: 'Алгебрата е клон на математиката, който работи с променливи и символи вместо конкретни числа.\n\nОсновни концепции:\n• Променливи (x, y, z)\n• Уравнения\n• Функции\n• Графики',
          image: undefined
        }
      ];
      
      return (
        <div className="min-h-screen bg-slate-50">
          <div className="max-w-7xl mx-auto p-4 sm:p-6">
            {/* Header */}
            <div className="mb-6 bg-white rounded-xl p-6 shadow-sm">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">Теория (Демо режим)</h1>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                  <strong>Забележка:</strong> Показваме примерни данни за демонстриране. 
                  За да заредите реална теория, обновете CSV URL в constants.js
                </p>
              </div>
              
              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Клас</label>
                  <select
                    value={profile?.classId || ''}
                    onChange={(e) => setActiveClassId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Всички класове</option>
                    <option value={profile?.classId}>{profile?.classId ? `Клас ${profile.classId}` : 'Избран клас'}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Content with sample data */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Left Column - Theory List */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <span>📖</span>
                    Списък ({sampleTheory.length})
                  </h2>
                  <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                    {sampleTheory.map(item => (
                      <div
                        key={item.id}
                        className={`bg-white border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md hover:border-blue-300 ${
                          selectedId === item.id 
                            ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50' 
                            : 'border-slate-200 hover:border-blue-300'
                        }`}
                        onClick={() => setSelectedId(item.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2 text-base">
                              {item.title}
                            </h3>
                            <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                              {item.content}
                            </p>
                            <div className="flex items-center gap-2 mt-3 text-xs">
                              {item.classId && (
                                <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full font-medium">
                                  Клас {item.classId}
                                </span>
                              )}
                              {item.lessonId && (
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                  Урок {item.lessonId}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Theory Detail */}
              <div className="xl:sticky xl:top-4">
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="p-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                      <span>📋</span>
                      Детайли
                    </h2>
                  </div>
                  
                  {selectedId ? (
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-4 leading-tight">
                        {sampleTheory.find(item => item.id === selectedId)?.title}
                      </h3>
                      
                      <div className="prose prose-slate max-w-none">
                        <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-base">
                          {sampleTheory.find(item => item.id === selectedId)?.content}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200">
                        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                          Клас {profile?.classId || 'Демо'}
                        </span>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                          Демо урок
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <div className="text-4xl mb-4">🔍</div>
                      <p className="text-slate-500 text-lg">
                        Изберете теория от списъка за да видите детайлите
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
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
              onClick={() => window.location.reload()}
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
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
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
                onChange={(e) => handleClassChange(e.target.value)}
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
                  onChange={(e) => handleLessonChange(e.target.value)}
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
                onChange={(e) => setSearchQuery(e.target.value)}
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
            <p className="text-slate-600">
              Няма налична теория за избрания филтър. Опитайте да промените критериите за търсене.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Left Column - Theory List */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <span>📖</span>
                  Списък ({filteredTheory.length})
                </h2>
                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                  {filteredTheory.map(item => (
                    <div
                      key={item.id}
                      className={`bg-white border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md hover:border-blue-300 ${
                        selectedId === item.id 
                          ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50' 
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                      onClick={() => handleTheorySelect(item.id)}
                    >
                      <div className="flex items-start gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded-lg border flex-shrink-0"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2 text-base">
                            {item.title}
                          </h3>
                          <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                            {item.content}
                          </p>
                          <div className="flex items-center gap-2 mt-3 text-xs">
                            {item.classId && (
                              <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full font-medium">
                                Клас {item.classId}
                              </span>
                            )}
                            {item.lessonId && (
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                Урок {item.lessonId}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Theory Detail */}
            <div className="xl:sticky xl:top-4">
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-4 border-b border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <span>📋</span>
                    Детайли
                  </h2>
                </div>
                
                {selectedTheory ? (
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 leading-tight">
                      {selectedTheory.title}
                    </h3>
                    
                    {selectedTheory.image && (
                      <div className="mb-6">
                        <img
                          src={selectedTheory.image}
                          alt={selectedTheory.title}
                          className="w-full max-w-md mx-auto rounded-lg border shadow-sm"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="prose prose-slate max-w-none">
                      <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-base">
                        {selectedTheory.content}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200">
                      {selectedTheory.classId && (
                        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                          Клас {selectedTheory.classId}
                        </span>
                      )}
                      {selectedTheory.lessonId && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                          Урок {selectedTheory.lessonId}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-slate-500 text-lg">
                      Изберете теория от списъка за да видите детайлите
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}