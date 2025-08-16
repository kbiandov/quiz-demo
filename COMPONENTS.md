# Components Documentation

## 🧩 Overview

This document provides detailed API documentation for the key components in the Math Quiz Application, including props, expected formats, and usage examples.

## 🏗️ Core Components

### App (MathApp)

The main application component that manages global state and routing.

**Props:** None (root component)

**State Management:**
```javascript
const [profile, setProfile] = useState(null);
const [results, setResults] = useState([]);
const [activeQuiz, setActiveQuiz] = useState(null);
const [route, setRoute] = useState("home");
```

**Key Functions:**
- `handleFinishQuiz(summary)` - Processes quiz completion
- `handleRetakeTest(lesson, questions)` - Handles test retaking
- `handleResultsRestart()` - Restarts the last quiz

### HeaderBar

Navigation header component with user profile information.

**Props:**
```typescript
interface HeaderBarProps {
  title: string;
  profile: Profile;
  onHome: () => void;
  onLogout: () => void;
  onOpenSettings: () => void;
}
```

**Usage:**
```jsx
<HeaderBar
  title="Тест"
  profile={profile}
  onHome={handleQuizHome}
  onLogout={resetProfile}
  onOpenSettings={handleOpenSettings}
/>
```

## 📚 Screen Components

### HomeScreen

Main navigation screen with feature tiles.

**Props:**
```typescript
interface HomeScreenProps {
  onGo: (route: string) => void;
  profile: Profile;
}
```

**Features:**
- Navigation tiles for different app sections
- User profile display
- Points and level information

### TheoryScreen

Displays theory content organized by class and lesson.

**Props:**
```typescript
interface TheoryScreenProps {
  profile: Profile;
  theory: Theory[];
  classes: Class[];
  lessons: Lesson[];
  questions: Question[];
  onStartQuiz: (lesson: Lesson, questions: Question[]) => void;
}
```

**State:**
```javascript
const [activeClassId, setActiveClassId] = useState(null);
const [activeLessonId, setActiveLessonId] = useState('');
const [searchQuery, setSearchQuery] = useState('');
```

**Features:**
- Class and lesson filtering
- Search functionality
- Theory content display
- Direct quiz start from theory

### TestsScreen

Lists available tests/lessons with question count selection.

**Props:**
```typescript
interface TestsScreenProps {
  profile: Profile;
  lessons: Lesson[];
  classes: Class[];
  questions: Question[];
  onStartQuiz: (lesson: Lesson, questions: Question[]) => void;
}
```

**Features:**
- Lesson organization by class
- Question count selection
- Question shuffling
- Direct test start

### Quiz

Core quiz component for taking tests.

**Props:**
```typescript
interface QuizProps {
  lesson: Lesson;
  questions: Question[];
  onFinish: (summary: QuizSummary) => void;
  settings: QuizSettings;
}
```

**State:**
```javascript
const [index, setIndex] = useState(0);
const [answers, setAnswers] = useState({});
const [timeLeft, setTimeLeft] = useState(settings?.timeLimitMin * 60 || 0);
```

**Features:**
- Question navigation
- Answer selection
- Timer support
- Progress tracking
- Score calculation

### ResultsScreen

Displays list of completed quiz results.

**Props:**
```typescript
interface ResultsScreenProps {
  results: Result[];
  classes: Class[];
  lessons: Lesson[];
  questions: Question[];
  questionsByLessonId: Record<string, Question[]>;
  canRestart: boolean;
  onRestart: () => void;
}
```

**Features:**
- Results list with scores
- Result detail modal
- Retake functionality
- Progress visualization

### StatsScreen

Shows user statistics and progress.

**Props:**
```typescript
interface StatsScreenProps {
  results: Result[];
}
```

**Features:**
- Overall performance metrics
- Progress charts
- Achievement tracking
- Points and level system

## 🎭 Modal Components

### Modal

Reusable portal-based modal component.

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}
```

**Features:**
- Portal rendering
- Focus management
- ESC key handling
- Overlay click to close
- Responsive sizing

**Usage:**
```jsx
<Modal
  isOpen={isModalOpen}
  onClose={handleCloseModal}
  title="Преглед на резултата"
  size="xl"
>
  <ResultReview result={activeResult} onRetakeTest={handleRetakeTest} />
</Modal>
```

### ResultReview

Displays detailed quiz results with question review.

**Props:**
```typescript
interface ResultReviewProps {
  result: Result;
  onRetakeTest?: () => void;
  onRetry?: () => void;
}
```

**Expected Result Format:**
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

**Features:**
- Score display
- Question-by-question review
- Correct/incorrect indicators
- Explanations display
- Retake button

### TheoryModal

Shows theory content with option to start quiz.

**Props:**
```typescript
interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  theoryItem: Theory;
  lesson: Lesson;
  onStartTest: (lesson: Lesson) => void;
}
```

**Features:**
- Theory content display
- Lesson information
- Direct quiz start
- Responsive layout

### SettingsModal

User settings and profile management.

**Props:**
```typescript
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}
```

**Features:**
- Quiz settings configuration
- Profile management
- Data reset options
- Settings persistence

## 🔧 Utility Components

### SquareButton

Reusable square navigation button.

**Props:**
```typescript
interface SquareButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}
```

**Usage:**
```jsx
<SquareButton
  icon="📚"
  label="Теория"
  onClick={() => onGo("theory")}
  className="bg-blue-500 hover:bg-blue-600"
/>
```

### ProgressBar

Visual progress indicator.

**Props:**
```typescript
interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
  showLabel?: boolean;
}
```

**Features:**
- Visual progress representation
- Optional percentage label
- Customizable styling
- Responsive design

## 📊 Data Models

### Profile
```typescript
interface Profile {
  name: string;
  classId: string;
  className: string;
}
```

### Question
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

### Lesson
```typescript
interface Lesson {
  id: string;
  class_id: string;
  title: string;
  name: string;
}
```

### Class
```typescript
interface Class {
  id: string;
  name: string;
}
```

### Theory
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

### Result
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

### QuizSettings
```typescript
interface QuizSettings {
  showExplanation: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  timeLimitMin: number;
  instantNext: boolean;
  instantDelaySec: number;
}
```

## 🎯 Event Handlers

### Common Event Patterns

**Quiz Start:**
```typescript
const handleStartQuiz = (lesson: Lesson, questions: Question[]) => {
  // Start quiz logic
};
```

**Quiz Finish:**
```typescript
const handleFinishQuiz = (summary: QuizSummary) => {
  // Process quiz results
};
```

**Modal Close:**
```typescript
const handleCloseModal = () => {
  setIsModalOpen(false);
  setActiveResult(null);
};
```

**Retake Test:**
```typescript
const handleRetakeTest = () => {
  // Retake logic
};
```

## 🎨 Styling & CSS Classes

### Common CSS Classes

**Layout:**
- `min-h-screen` - Full viewport height
- `max-w-{size}` - Maximum width constraints
- `p-{size}` - Padding utilities
- `m-{size}` - Margin utilities

**Colors:**
- `bg-slate-50` - Light background
- `text-slate-800` - Dark text
- `border-slate-200` - Light borders

**Components:**
- `btn` - Base button styles
- `card` - Card container styles
- `modal` - Modal-specific styles

**Responsive:**
- `sm:grid-cols-2` - Small screen grid
- `md:flex-row` - Medium screen flex direction
- `lg:text-2xl` - Large screen text size

## ♿ Accessibility Features

### ARIA Attributes

**Modal:**
```jsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
```

**Button:**
```jsx
<button
  aria-label="Затвори модал"
  onClick={onClose}
>
```

**Form:**
```jsx
<label htmlFor="name-input">Име</label>
<input id="name-input" type="text" />
```

### Keyboard Navigation

- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons and links
- **Escape**: Close modals
- **Arrow Keys**: Navigate quiz questions

### Focus Management

- Focus trapping in modals
- Focus restoration after modal close
- Logical tab order
- Visible focus indicators

## 🧪 Testing Components

### Component Testing Examples

**Basic Component Test:**
```javascript
import { render, screen } from '@testing-library/react';
import ResultReview from './ResultReview';

test('renders result review with questions', () => {
  const mockResult = {
    lesson: { title: 'Test Lesson' },
    correct: 5,
    total: 10,
    questions: [{ id: 'q1', text: 'Test Question' }]
  };
  
  render(<ResultReview result={mockResult} />);
  
  expect(screen.getByText('Test Lesson')).toBeInTheDocument();
  expect(screen.getByText('5/10 правилни отговора')).toBeInTheDocument();
});
```

**Event Handler Test:**
```javascript
test('calls onRetakeTest when retake button clicked', () => {
  const mockOnRetakeTest = jest.fn();
  const mockResult = { /* ... */ };
  
  render(<ResultReview result={mockResult} onRetakeTest={mockOnRetakeTest} />);
  
  fireEvent.click(screen.getByText('Направи теста отново'));
  
  expect(mockOnRetakeTest).toHaveBeenCalledTimes(1);
});
```

## 🔮 Future Enhancements

### Planned Component Features

1. **Advanced Quiz Types**
   - Multiple choice with multiple answers
   - Fill-in-the-blank questions
   - Drag-and-drop interactions

2. **Enhanced Modals**
   - Animation support
   - Custom positioning
   - Nested modal support

3. **Data Visualization**
   - Progress charts
   - Performance graphs
   - Achievement badges

4. **Accessibility Improvements**
   - Screen reader optimizations
   - High contrast mode
   - Voice navigation support

---

This component documentation provides a comprehensive guide for developers working with the Math Quiz Application components, ensuring consistent usage and proper integration.

