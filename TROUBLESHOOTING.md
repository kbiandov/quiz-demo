# Troubleshooting Guide

## 🚨 Common Issues & Solutions

This guide covers the most common problems encountered when working with the Math Quiz Application and provides step-by-step solutions.

## 📱 Application Issues

### 1. "Questions not loading" Error

**Symptoms:**
- Empty question lists
- "No questions available" messages
- Quiz cannot start

**Causes:**
- Network connectivity issues
- Incorrect Google Sheets URLs
- CSV parsing errors
- Data format mismatches

**Solutions:**

**Check Network Connection:**
```bash
# Test if Google Sheets are accessible
curl "YOUR_GOOGLE_SHEETS_URL"
```

**Verify Google Sheets Setup:**
1. Ensure sheets are published as CSV
2. Check sharing permissions (public access)
3. Verify tab names match expected format

**Check CSV Format:**
```csv
# Expected format for questions.csv
id,lesson_id,text,A,B,C,D,correct,explanation
Q1001,lesson-1,"Question text",Option A,Option B,Option C,Option D,A,"Explanation text"
```

**Debug Data Loading:**
```javascript
// Check browser console for errors
// Look for [useSheetsData] and [fetchCSV] logs
// Verify data structure in console
```

### 2. "Can't retake test" Error

**Symptoms:**
- Retake button doesn't work
- "No questions found" messages
- Quiz restarts without questions

**Causes:**
- Questions not saved in results
- Lesson ID mismatches
- Data corruption in localStorage

**Solutions:**

**Clear and Reset Data:**
```javascript
// In browser console
localStorage.clear();
location.reload();
```

**Check Result Structure:**
```javascript
// Verify results have questions array
const results = JSON.parse(localStorage.getItem('quiz-results'));
console.log('Results structure:', results[0]);
```

**Verify Lesson IDs:**
```javascript
// Check if lesson IDs match between questions and results
const questions = JSON.parse(localStorage.getItem('quiz-questions'));
const results = JSON.parse(localStorage.getItem('quiz-results'));
console.log('Lesson ID comparison:', {
  questions: questions.map(q => q.lesson_id),
  results: results.map(r => r.lesson?.id)
});
```

### 3. Build Errors

**Symptoms:**
- `npm run build` fails
- Deployment errors
- Missing dependencies

**Causes:**
- Outdated package-lock.json
- Missing dependencies
- Node.js version incompatibility

**Solutions:**

**Update Dependencies:**
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use npm ci for clean install
npm ci
```

**Check Node.js Version:**
```bash
# Ensure Node.js 18+ is installed
node --version

# Use nvm to switch versions if needed
nvm use 18
nvm install 18
```

**Verify Package.json:**
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## 🔧 Development Issues

### 1. Temporal Dead Zone (TDZ) Errors

**Symptoms:**
```
ReferenceError: can't access lexical declaration 'hasQuestions' before initialization
```

**Causes:**
- Variables used before declaration
- Complex JavaScript patterns in JSX
- Bundler optimization issues

**Solutions:**

**Move Variable Declarations:**
```javascript
// ❌ Wrong - variable used before declaration
const Component = () => {
  console.log(hasQuestions); // Error!
  const hasQuestions = questions.length > 0;
};

// ✅ Correct - declare before use
const Component = () => {
  const hasQuestions = questions.length > 0;
  console.log(hasQuestions); // Works!
};
```

**Simplify Complex Patterns:**
```javascript
// ❌ Avoid complex inline functions
const Component = () => {
  const data = useMemo(() => {
    return items.map(item => {
      return {
        ...item,
        processed: (() => {
          // Complex logic here
        })()
      };
    });
  }, [items]);
};

// ✅ Use explicit functions
const Component = () => {
  const processItem = useCallback((item) => {
    // Process logic here
    return { ...item, processed: result };
  }, []);

  const data = useMemo(() => {
    return items.map(processItem);
  }, [items, processItem]);
};
```

### 2. Console Errors & Warnings

**Symptoms:**
- Excessive console logging
- Performance warnings
- React warnings

**Solutions:**

**Remove Debug Logs:**
```javascript
// ❌ Remove in production
console.log('Debug info:', data);

// ✅ Use conditional logging
if (process.env.NODE_ENV === 'development') {
  console.log('[Component] Debug info:', data);
}
```

**Fix React Warnings:**
```javascript
// ❌ Missing key prop
{items.map(item => <div>{item.name}</div>)}

// ✅ Add unique key
{items.map(item => <div key={item.id}>{item.name}</div>)}

// ❌ Missing dependency in useEffect
useEffect(() => {
  fetchData();
}, []); // Missing dependency

// ✅ Include all dependencies
useEffect(() => {
  fetchData();
}, [fetchData]); // Include fetchData
```

### 3. Performance Issues

**Symptoms:**
- Slow rendering
- Excessive re-renders
- Memory leaks

**Solutions:**

**Optimize Re-renders:**
```javascript
// ❌ Function recreated on every render
const Component = () => {
  const handleClick = () => {
    // Handler logic
  };
};

// ✅ Memoize functions
const Component = () => {
  const handleClick = useCallback(() => {
    // Handler logic
  }, []);
};

// ✅ Memoize expensive calculations
const Component = () => {
  const expensiveData = useMemo(() => {
    return items.filter(complexFilter);
  }, [items]);
};
```

**Prevent Memory Leaks:**
```javascript
// ✅ Clean up effects
useEffect(() => {
  const timer = setInterval(() => {
    // Timer logic
  }, 1000);

  return () => clearInterval(timer);
}, []);

// ✅ Cancel async operations
useEffect(() => {
  let cancelled = false;
  
  const fetchData = async () => {
    if (cancelled) return;
    // Fetch logic
  };

  fetchData();

  return () => {
    cancelled = true;
  };
}, []);
```

## 🌐 Network & Data Issues

### 1. CSV Fetching Problems

**Symptoms:**
- Data not loading
- CORS errors
- Timeout issues

**Solutions:**

**Check CORS:**
```javascript
// Ensure Google Sheets are publicly accessible
// Check browser console for CORS errors
// Verify URL format: https://docs.google.com/spreadsheets/d/.../pub?output=csv
```

**Handle Network Errors:**
```javascript
// Add timeout and retry logic
const fetchWithRetry = async (url, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, { 
        signal: AbortSignal.timeout(10000) // 10s timeout
      });
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

**Validate CSV Data:**
```javascript
// Check CSV structure before processing
const validateCSV = (data, expectedFields) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('CSV is empty or invalid');
  }
  
  const firstRow = data[0];
  const missingFields = expectedFields.filter(field => !(field in firstRow));
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
  
  return true;
};
```

### 2. Data Synchronization Issues

**Symptoms:**
- Stale data
- Inconsistent state
- Missing updates

**Solutions:**

**Implement Data Versioning:**
```javascript
// Add version to data structure
const dataWithVersion = {
  version: '1.0.0',
  timestamp: Date.now(),
  data: actualData
};

// Check for updates
const checkForUpdates = (currentVersion, newVersion) => {
  if (currentVersion !== newVersion) {
    // Clear cache and reload
    localStorage.clear();
    location.reload();
  }
};
```

**Add Data Validation:**
```javascript
// Validate data integrity
const validateData = (data) => {
  const required = ['questions', 'lessons', 'classes'];
  const missing = required.filter(key => !data[key] || data[key].length === 0);
  
  if (missing.length > 0) {
    console.error('Missing required data:', missing);
    return false;
  }
  
  return true;
};
```

## 🧪 Testing & Debugging

### 1. Debug Mode

**Enable Debug Logging:**
```javascript
// Set debug flag in localStorage
localStorage.setItem('debug', 'true');

// Check debug status
const isDebug = localStorage.getItem('debug') === 'true';
```

**Add Debug Information:**
```javascript
// Component debug info
const Component = () => {
  useEffect(() => {
    if (isDebug) {
      console.log('[Component] Mounted with props:', props);
      console.log('[Component] State:', state);
    }
  }, [props, state]);
};
```

### 2. Data Inspection

**Check localStorage:**
```javascript
// Inspect all stored data
Object.keys(localStorage).forEach(key => {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    console.log(`${key}:`, data);
  } catch (e) {
    console.log(`${key}:`, localStorage.getItem(key));
  }
});
```

**Validate Data Structure:**
```javascript
// Check data integrity
const validateResults = (results) => {
  return results.every(result => {
    const hasRequired = result.lesson && result.questions && result.correct !== undefined;
    const hasValidQuestions = Array.isArray(result.questions) && result.questions.length > 0;
    return hasRequired && hasValidQuestions;
  });
};
```

### 3. Performance Monitoring

**Measure Component Performance:**
```javascript
// Use React DevTools Profiler
// Or add custom timing
const Component = () => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.log(`Component render time: ${endTime - startTime}ms`);
    };
  });
};
```

**Monitor Data Processing:**
```javascript
// Measure data processing time
const processData = (rawData) => {
  const start = performance.now();
  
  // Process data
  const processed = rawData.map(transform);
  
  const end = performance.now();
  console.log(`Data processing: ${end - start}ms`);
  
  return processed;
};
```

## 🚀 Production Issues

### 1. Build Optimization

**Symptoms:**
- Large bundle size
- Slow loading
- Poor performance

**Solutions:**

**Optimize Vite Config:**
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['papaparse']
        }
      }
    },
    minify: 'terser',
    sourcemap: false
  }
};
```

**Remove Development Code:**
```javascript
// Use environment variables
if (process.env.NODE_ENV === 'production') {
  // Production-only code
} else {
  // Development-only code
}
```

### 2. Deployment Issues

**Symptoms:**
- Build failures
- Runtime errors
- Missing assets

**Solutions:**

**Check Build Output:**
```bash
# Verify build completes successfully
npm run build

# Check dist folder contents
ls -la dist/

# Test build locally
npm run preview
```

**Verify Environment:**
```bash
# Check Node.js version
node --version

# Verify npm dependencies
npm list --depth=0

# Clear npm cache if needed
npm cache clean --force
```

## 📞 Getting Help

### 1. Before Asking for Help

**Check these resources:**
- [README.md](./README.md) - Setup and basic usage
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- [DATA-FLOW.md](./DATA-FLOW.md) - Data pipeline
- [COMPONENTS.md](./COMPONENTS.md) - Component API

**Gather information:**
- Error messages and stack traces
- Browser console logs
- Network tab information
- Steps to reproduce

### 2. Reporting Issues

**Include in your report:**
```markdown
## Issue Description
Brief description of the problem

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: Chrome 120.0.6099.109
- OS: Windows 11
- Node.js: 18.17.0

## Error Messages
Copy-paste any error messages

## Console Logs
Relevant console output

## Additional Context
Any other relevant information
```

### 3. Common Solutions Summary

| Issue | Quick Fix | Detailed Solution |
|-------|-----------|-------------------|
| Questions not loading | Check network, verify URLs | [Section 1](#1-questions-not-loading-error) |
| Can't retake test | Clear localStorage | [Section 2](#2-cant-retake-test-error) |
| Build errors | `npm install` | [Section 3](#3-build-errors) |
| TDZ errors | Move variable declarations | [Section 1](#1-temporal-dead-zone-tdz-errors) |
| Performance issues | Use useMemo/useCallback | [Section 3](#3-performance-issues) |
| CSV problems | Check CORS and format | [Section 1](#1-csv-fetching-problems) |

---

This troubleshooting guide should help resolve most common issues. If you continue to experience problems, please report them with the information requested above.

