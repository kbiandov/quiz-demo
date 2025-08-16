# Math Quiz Application

A comprehensive mathematics quiz application built with React, featuring theory content, interactive quizzes, and progress tracking.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd quiz-demo

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build & Deploy
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Netlify
# The app is configured for automatic deployment
```

## 🏗️ Project Structure

```
src/
├── api/           # Data fetching and CSV parsing
├── components/    # React components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── constants.js   # App constants
└── main.jsx       # App entry point
```

## 🔧 Configuration

### Environment Variables
The app uses Google Sheets as a data source. No environment variables are required for basic functionality.

### Google Sheets Setup
1. Create a Google Sheet with the following tabs:
   - `classes` - Class information
   - `subjects` - Subject information  
   - `lessons` - Lesson information
   - `questions` - Quiz questions
   - `theory` - Theory content

2. Publish each tab as CSV with the format:
   ```
   File → Share → Publish to web → CSV
   ```

3. Update `src/constants.js` with your sheet URLs

## 📱 Features

- **Interactive Quizzes**: Multiple choice questions with explanations
- **Theory Content**: Educational content organized by class and lesson
- **Progress Tracking**: Save and review quiz results
- **Responsive Design**: Works on desktop and mobile devices
- **Offline Support**: Data cached in localStorage

## 🧪 Testing

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests (when implemented)
npm test
```

## 🚨 Troubleshooting

### Common Issues

**"Questions not loading"**
- Check internet connection
- Verify Google Sheets URLs are correct
- Ensure sheets are published as CSV

**"Can't retake test"**
- Clear browser localStorage
- Check if questions data is properly loaded
- Verify lesson IDs match between questions and results

**Build errors**
- Run `npm install` to sync dependencies
- Clear `node_modules` and reinstall
- Check Node.js version (18+ required)

### Debug Mode
Enable debug logging by setting `localStorage.debug = 'true'` in browser console.

## 📚 API Reference

### useSheetsData Hook
```javascript
const { 
  questions, 
  lessons, 
  classes, 
  theory,
  questionsByLessonId,
  loading, 
  error 
} = useSheetsData();
```

### Component Props
See `COMPONENTS.md` for detailed component API documentation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

See `CONTRIBUTING.md` for detailed guidelines.

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review existing issues
3. Create a new issue with detailed information

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
