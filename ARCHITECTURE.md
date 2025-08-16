# Architecture Documentation

## 🏗️ Application Overview

The Math Quiz Application is a React-based single-page application (SPA) that provides an interactive learning experience for mathematics. The application follows a component-based architecture with centralized state management and data fetching.

## 🎯 Core Principles

- **Component-Based Architecture**: Modular, reusable components
- **Data-Driven UI**: UI components driven by normalized data structures
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Accessibility First**: ARIA attributes and keyboard navigation support
- **Performance Optimized**: Memoized calculations and efficient re-renders

## 🏛️ Application Layers

### 1. Data Layer
```
Google Sheets CSV → fetchCsv.js → useSheetsData.js → Components
```

**Responsibilities:**
- Fetch data from external sources (Google Sheets)
- Parse and normalize CSV data
- Create stable indexes for efficient lookups
- Handle loading states and errors
- Provide consistent data shapes

**Key Files:**
- `src/api/fetchCsv.js` - CSV fetching and parsing
- `src/api/useSheetsData.js` - Data management hook
- `src/constants.js` - Data source URLs

### 2. State Management Layer
```
useLocalStorage → App State → Component Props → Local State
```

**Responsibilities:**
- Manage application state (profile, results, settings)
- Handle navigation between screens
- Coordinate data flow between components
- Persist user data in localStorage

**Key Files:**
- `src/App.jsx` - Main application state
- `src/hooks/useLocalStorage.js` - Persistent storage hook
- `src/utils/results.js` - Results management utilities

### 3. Component Layer
```
App → Screen Components → Feature Components → UI Components
```

**Responsibilities:**
- Render user interface
- Handle user interactions
- Manage component-specific state
- Implement business logic

**Key Files:**
- `src/components/` - All React components
- `src/components/Modal.jsx` - Reusable modal component
- `src/components/Quiz.jsx` - Core quiz functionality

### 4. Utility Layer
```
Utils → Helpers → Constants → Validation
```

**Responsibilities:**
- Provide helper functions
- Define constants and configurations
- Implement data validation
- Handle common operations

**Key Files:**
- `src/utils/` - Utility functions
- `src/constants.js` - Application constants

## 🌳 Component Tree

```
App (MathApp)
├── HeaderBar
├── Route Components
│   ├── Onboarding
│   ├── HomeScreen
│   ├── TheoryScreen
│   ├── TestsScreen
│   ├── Quiz
│   ├── ResultsScreen
│   └── StatsScreen
├── Modal Components
│   ├── Modal (Portal)
│   ├── TheoryModal
│   ├── ResultReview
│   └── SettingsModal
└── Shared Components
    ├── SquareButton
    └── ProgressBar
```

## 🔄 Data Flow Architecture

### 1. Data Fetching Flow
```
App Mount → useSheetsData → fetchCSV → Papa.parse → Normalize → Index → Components
```

### 2. Quiz Flow
```
Select Lesson → Load Questions → Start Quiz → Answer Questions → Calculate Score → Save Results → Show Review
```

### 3. Results Flow
```
View Results → Click Result → Open Modal → Display Questions → Retake Test → Restart Quiz
```

### 4. State Update Flow
```
User Action → Component Handler → App State Update → Prop Change → Component Re-render
```

## 📊 Data Models

### Question Model
```typescript
interface Question {
  id: string;
  lesson_id: string;
  text: string;
  A: string;
  B: string;
  C: string;
  D: string;
  correct: string;
  explanation?: string;
  image?: string;
}
```

### Result Model
```typescript
interface Result {
  lesson: Lesson;
  correct: number;
  wrong: number;
  unanswered: number;
  total: number;
  answers: Record<string, string>;
  at: string;
  timeLimitMin?: number;
  questions: Question[];
}
```

### Lesson Model
```typescript
interface Lesson {
  id: string;
  class_id: string;
  title: string;
  name: string;
}
```

### Theory Model
```typescript
interface Theory {
  id: string;
  class_id: string;
  lesson_id: string;
  title: string;
  content: string;
  image?: string;
}
```

## 🔧 Data Indexes

### questionsByLessonId
```javascript
{
  "lesson-1": [Question1, Question2, ...],
  "lesson-2": [Question3, Question4, ...]
}
```

### questionsById
```javascript
{
  "q1": Question1,
  "q2": Question2,
  ...
}
```

### lessonsByClassId
```javascript
{
  "class-1": [Lesson1, Lesson2, ...],
  "class-2": [Lesson3, Lesson4, ...]
}
```

## 🚀 Performance Optimizations

### 1. Memoization
- `useMemo` for expensive calculations
- `useCallback` for stable function references
- Stable indexes to prevent unnecessary re-computations

### 2. Efficient Rendering
- Conditional rendering based on data availability
- Virtual scrolling for large lists (when needed)
- Lazy loading of non-critical components

### 3. Data Management
- Normalized data structures
- Stable indexes for O(1) lookups
- Minimal re-renders through proper prop management

## 🔒 Security Considerations

### 1. Data Validation
- Input sanitization for user data
- CSV data validation before processing
- Safe defaults for missing data

### 2. XSS Prevention
- No direct HTML injection
- Safe string handling
- Content Security Policy compliance

### 3. Privacy
- User data stored locally only
- No external analytics or tracking
- Minimal data collection

## 🧪 Testing Strategy

### 1. Unit Tests
- Data normalization functions
- Utility functions
- Hook logic

### 2. Integration Tests
- Component interactions
- Data flow validation
- User workflow testing

### 3. E2E Tests
- Complete user journeys
- Cross-browser compatibility
- Performance benchmarks

## 📱 Responsive Design

### 1. Mobile-First Approach
- Touch-friendly interactions
- Responsive breakpoints
- Optimized for small screens

### 2. Progressive Enhancement
- Core functionality without JavaScript
- Enhanced experience with modern browsers
- Graceful degradation for older devices

## ♿ Accessibility Features

### 1. ARIA Support
- Proper labeling and descriptions
- Screen reader compatibility
- Keyboard navigation support

### 2. Focus Management
- Focus trapping in modals
- Logical tab order
- Visible focus indicators

### 3. Semantic HTML
- Proper heading hierarchy
- Meaningful button labels
- Descriptive alt text for images

## 🔮 Future Enhancements

### 1. Planned Features
- Offline support with Service Workers
- Advanced analytics and reporting
- Multi-language support
- Advanced question types

### 2. Technical Improvements
- TypeScript migration
- Advanced caching strategies
- Performance monitoring
- Automated testing pipeline

---

This architecture provides a solid foundation for scalability, maintainability, and user experience while maintaining simplicity and performance.

