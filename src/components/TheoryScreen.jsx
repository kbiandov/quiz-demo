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
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Теория</h2>
          <p className="text-slate-600 mb-4">
            Моля, въведете профил/клас в настройките за да видите теорията
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/onboarding'}
          >
            Въведи профил
          </button>
        </div>
      </div>
    );
  }

  // If theory data is not loaded yet, show loading
  if (!theory || theory.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Теория</h2>
          <div className="animate-pulse text-lg text-slate-600">Зареждаме теорията…</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Теория</h2>
          <div className="text-red-600 mb-4">{error}</div>
          <button 
            className="btn"
            onClick={() => window.location.reload()}
          >
            Опитай отново
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Теория</h1>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Class Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Клас:</label>
            <select
              value={activeClassId || ''}
              onChange={(e) => handleClassChange(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 bg-white text-sm"
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
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700">Урок:</label>
              <select
                value={activeLessonId}
                onChange={(e) => handleLessonChange(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 bg-white text-sm"
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
          <div className="flex items-center gap-2 flex-1 min-w-64">
            <label className="text-sm font-medium text-slate-700">Търсене:</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Търси в заглавие и съдържание..."
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredTheory.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg">
            Няма налична теория за избрания филтър.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Theory List */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Списък ({filteredTheory.length})
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredTheory.map(item => (
                <div
                  key={item.id}
                  className={`card cursor-pointer transition-all hover:shadow-md ${
                    selectedId === item.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleTheorySelect(item.id)}
                >
                  <div className="card-content">
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
                        <h3 className="font-medium text-slate-800 mb-2 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-3">
                          {item.content}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                          {item.classId && (
                            <span className="bg-slate-100 px-2 py-1 rounded">
                              Клас {item.classId}
                            </span>
                          )}
                          {item.lessonId && (
                            <span className="bg-blue-100 px-2 py-1 rounded">
                              Урок {item.lessonId}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Theory Detail */}
          <div className="lg:sticky lg:top-4">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Детайли</h2>
            {selectedTheory ? (
              <div className="card">
                <div className="card-content">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">
                    {selectedTheory.title}
                  </h3>
                  
                  {selectedTheory.image && (
                    <div className="mb-4">
                      <img
                        src={selectedTheory.image}
                        alt={selectedTheory.title}
                        className="w-full max-w-md mx-auto rounded-lg border"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="prose prose-slate max-w-none">
                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                      {selectedTheory.content}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200 text-sm text-slate-500">
                    {selectedTheory.classId && (
                      <span className="bg-slate-100 px-2 py-1 rounded">
                        Клас {selectedTheory.classId}
                      </span>
                    )}
                    {selectedTheory.lessonId && (
                      <span className="bg-blue-100 px-2 py-1 rounded">
                        Урок {selectedTheory.lessonId}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="card-content text-center text-slate-500 py-12">
                  Изберете теория от списъка
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}