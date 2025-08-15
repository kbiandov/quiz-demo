# Math App — Full Working (React + Tailwind, Netlify-ready)

- Онбординг (име + клас с native <select>)
- Начален екран с плочки
- „Тестове“ с локални Tabs (без зависимости), списъци по уроци/класове
- Квиз с обяснения, авто-преминаване (по избор), модален „Предай“ + рекламна пауза
- „Резултати“ и „Статистика“ — запис/четене от localStorage
- Настройки (модал) — showExplanation, shuffle, timeLimit, instantNext + delay
- Debug widget долу вдясно
- Google Sheets CSV (classes, subjects, lessons, questions)
- Netlify SPA redirects (`public/_redirects`)

## Start
```bash
npm install
npm run dev
```
## Build / Preview
```bash
npm run build
npm run preview
```
## Netlify
- Build: `npm run build`
- Publish: `dist`
