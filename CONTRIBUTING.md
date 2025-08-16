# Contributing Guide

## 🤝 Welcome Contributors!

Thank you for your interest in contributing to the Math Quiz Application! This guide will help you get started with development, understand our coding standards, and contribute effectively.

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm or yarn** - Package manager
- **Git** - Version control
- **Code editor** - VS Code recommended with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/quiz-demo.git
cd quiz-demo

# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Build for production
npm run build
```

## 📋 Development Workflow

### 1. Issue Creation

Before starting work, create or claim an issue:

1. **Check existing issues** - Avoid duplicates
2. **Use issue templates** - Provide clear information
3. **Label appropriately** - Bug, feature, enhancement, etc.
4. **Set milestone** - Target version for the fix

### 2. Branch Strategy

```bash
# Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description
```

**Branch Naming Convention:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions

### 3. Development Process

1. **Code your changes** following the style guide
2. **Test thoroughly** - Unit tests, integration tests, manual testing
3. **Commit frequently** with clear messages
4. **Push and create PR** when ready

### 4. Pull Request Process

1. **Create PR** with clear description
2. **Link issues** using keywords (fixes #123, closes #456)
3. **Request review** from maintainers
4. **Address feedback** and iterate
5. **Merge** after approval

## 🎨 Code Style Guide

### JavaScript/React Standards

**Component Structure:**
```jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';

// PropTypes or TypeScript interfaces
interface ComponentProps {
  title: string;
  onAction: () => void;
}

// Component definition
export default function Component({ title, onAction }: ComponentProps) {
  // Hooks at the top
  const [state, setState] = useState('');
  
  // Memoized values
  const memoizedValue = useMemo(() => {
    return expensiveCalculation();
  }, [dependencies]);
  
  // Event handlers
  const handleClick = useCallback(() => {
    onAction();
  }, [onAction]);
  
  // Effects
  useEffect(() => {
    // Effect logic
    return () => {
      // Cleanup
    };
  }, [dependencies]);
  
  // Early returns
  if (!title) return null;
  
  // Render
  return (
    <div className="component">
      <h1>{title}</h1>
      <button onClick={handleClick}>Action</button>
    </div>
  );
}
```

**Variable Naming:**
```javascript
// ✅ Good - descriptive and clear
const userProfile = getUserProfile();
const isQuizComplete = checkQuizStatus();
const handleQuestionSubmit = () => {};

// ❌ Bad - unclear or abbreviated
const up = getUserProfile();
const qc = checkQuizStatus();
const hqs = () => {};
```

**Function Naming:**
```javascript
// ✅ Good - verb-based, descriptive
const fetchUserData = () => {};
const validateQuizAnswers = () => {};
const calculateFinalScore = () => {};

// ❌ Bad - unclear or noun-based
const userData = () => {};
const validation = () => {};
const score = () => {};
```

### CSS/Tailwind Standards

**Class Organization:**
```jsx
// ✅ Good - logical grouping
<div className="
  // Layout
  flex items-center justify-between
  // Spacing
  p-4 mb-6
  // Colors
  bg-white text-slate-800
  // Borders
  border border-slate-200 rounded-lg
  // Hover states
  hover:bg-slate-50 hover:shadow-md
  // Transitions
  transition-all duration-200
">
```

**Responsive Design:**
```jsx
// ✅ Good - mobile-first approach
<div className="
  // Base (mobile)
  p-4 text-sm
  // Small screens and up
  sm:p-6 sm:text-base
  // Medium screens and up
  md:p-8 md:text-lg
  // Large screens and up
  lg:p-12 lg:text-xl
">
```

### File Organization

**Component Files:**
```
src/components/
├── ComponentName/
│   ├── index.js          # Main export
│   ├── ComponentName.jsx # Main component
│   ├── ComponentName.test.js # Tests
│   └── ComponentName.module.css # Styles (if needed)
```

**Import/Export Pattern:**
```javascript
// ✅ Good - named exports
export { ComponentName } from './ComponentName';
export { default as ComponentName } from './ComponentName';

// ❌ Bad - default exports in index
export { default } from './ComponentName';
```

## 🧪 Testing Standards

### Test File Structure

```javascript
// ComponentName.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  const defaultProps = {
    // Default props for testing
  };

  it('renders without crashing', () => {
    render(<ComponentName {...defaultProps} />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('handles user interactions correctly', () => {
    const mockHandler = jest.fn();
    render(<ComponentName {...defaultProps} onAction={mockHandler} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it('displays correct data', () => {
    const testData = { title: 'Test Title' };
    render(<ComponentName {...defaultProps} data={testData} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

### Testing Best Practices

1. **Test behavior, not implementation**
2. **Use meaningful test descriptions**
3. **Test edge cases and error states**
4. **Mock external dependencies**
5. **Keep tests focused and isolated**

## 📝 Documentation Standards

### Code Comments

**Good Comments:**
```javascript
// ✅ Explain WHY, not WHAT
// Use exponential backoff to avoid overwhelming the server
const delay = Math.min(1000 * Math.pow(2, attempt), 10000);

// ✅ Document complex business logic
// Calculate score based on correct answers and time bonus
const score = correctAnswers * 10 + Math.max(0, timeBonus);

// ✅ Explain non-obvious code
// Normalize ID to handle both string and number inputs
const normalizedId = String(id).trim();
```

**Bad Comments:**
```javascript
// ❌ Don't state the obvious
const score = correctAnswers * 10; // Multiply by 10

// ❌ Don't comment out code
// const oldCode = 'this was removed';

// ❌ Don't use TODO without context
// TODO: Fix this
```

### README Updates

When adding new features:
1. **Update feature list** in README
2. **Add usage examples** if applicable
3. **Update configuration** section if needed
4. **Add troubleshooting** notes for common issues

## 🔍 Code Review Guidelines

### What to Look For

**Functionality:**
- Does the code work as intended?
- Are edge cases handled?
- Is error handling appropriate?

**Code Quality:**
- Is the code readable and maintainable?
- Are there any code smells or anti-patterns?
- Is the code properly tested?

**Performance:**
- Are there unnecessary re-renders?
- Is data processing efficient?
- Are there memory leaks?

**Security:**
- Is user input properly validated?
- Are there XSS vulnerabilities?
- Is sensitive data handled securely?

### Review Process

1. **Read the code** thoroughly
2. **Test the functionality** if possible
3. **Provide constructive feedback**
4. **Suggest improvements** when appropriate
5. **Approve** when satisfied

## 🚀 Performance Guidelines

### React Optimization

**Use Memoization:**
```javascript
// ✅ Memoize expensive calculations
const expensiveData = useMemo(() => {
  return items.filter(complexFilter);
}, [items]);

// ✅ Memoize event handlers
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

**Avoid Anti-patterns:**
```javascript
// ❌ Don't create objects in render
const Component = () => {
  const style = { color: 'red' }; // Created every render
  
  return <div style={style}>Content</div>;
};

// ✅ Use useMemo or move outside component
const Component = () => {
  const style = useMemo(() => ({ color: 'red' }), []);
  
  return <div style={style}>Content</div>;
};
```

### Bundle Optimization

**Code Splitting:**
```javascript
// ✅ Lazy load components
const LazyComponent = lazy(() => import('./LazyComponent'));

// ✅ Dynamic imports for heavy features
const loadFeature = () => import('./HeavyFeature');
```

## 🐛 Bug Reporting

### Before Reporting

1. **Check existing issues** - Avoid duplicates
2. **Reproduce the bug** - Ensure it's reproducible
3. **Check documentation** - Look for known solutions
4. **Test in different browsers** - Check if it's browser-specific

### Bug Report Template

```markdown
## Bug Description
Clear description of the problem

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: [e.g., Chrome 120.0.6099.109]
- OS: [e.g., Windows 11, macOS 14.0]
- Node.js: [e.g., 18.17.0]

## Additional Context
Screenshots, console logs, error messages
```

## 🎯 Feature Requests

### Feature Request Template

```markdown
## Feature Description
Clear description of the requested feature

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
What other approaches were considered?

## Additional Context
Screenshots, mockups, use cases
```

## 📋 Pull Request Checklist

### Before Submitting

- [ ] **Code follows style guide** - ESLint passes, Prettier applied
- [ ] **Tests pass** - All tests green, new tests added if needed
- [ ] **Documentation updated** - README, components, etc.
- [ ] **Self-review completed** - Code reviewed by yourself
- [ ] **No console errors** - Clean browser console
- [ ] **Responsive design** - Works on mobile and desktop
- [ ] **Accessibility** - ARIA labels, keyboard navigation

### PR Description Template

```markdown
## Changes Made
- [Feature] Added new quiz type
- [Fix] Resolved retake functionality issue
- [Refactor] Improved data normalization

## Testing
- [x] Unit tests pass
- [x] Manual testing completed
- [x] Cross-browser testing done

## Screenshots
[If UI changes, include before/after screenshots]

## Related Issues
Closes #123, Fixes #456

## Additional Notes
Any other information reviewers should know
```

## 🏆 Recognition

### Contributor Levels

- **First Contribution** - Welcome badge
- **Regular Contributor** - Contributor role
- **Core Contributor** - Maintainer role

### Recognition Methods

- **Contributor list** in README
- **Release notes** mentions
- **Special thanks** in documentation
- **Contributor spotlight** in blog posts

## 📞 Getting Help

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Pull Request Reviews** - Code review feedback
- **Documentation** - Self-service help

### Mentorship

New contributors can:
1. **Ask for help** in issues or discussions
2. **Request code review** from experienced contributors
3. **Start with good first issues** labeled for beginners
4. **Join community discussions** to learn from others

## 📚 Learning Resources

### Recommended Reading

- [React Documentation](https://react.dev/)
- [Tailwind CSS Guide](https://tailwindcss.com/docs)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

### Development Tools

- **React DevTools** - Component inspection
- **Redux DevTools** - State management (if using Redux)
- **Lighthouse** - Performance auditing
- **Accessibility Insights** - Accessibility testing

---

Thank you for contributing to the Math Quiz Application! Your contributions help make the app better for everyone. If you have any questions, don't hesitate to ask in issues or discussions.

