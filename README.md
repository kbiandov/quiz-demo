
# Math App — текущо състояние

Образователно приложение за тестове по математика. Данните (класове, уроци, въпроси) се четат от публични **Google Sheets (CSV)**. UI компонентите са минимални „стъбове“, за да може проектът да се билдва без shadcn/ui.

## Технологии
- React 18 + Vite
- lucide-react (икони)
- PapaParse (CSV парсване)
- Минимални UI компоненти (местни, в `src/components/ui/`)

## Стартиране локално
```bash
npm install
npm run dev
```
Приложението ще е достъпно на `http://localhost:5173/` (по подразбиране).

## Билд
```bash
npm run build
npm run preview
```

## Деплой в Netlify
1. Създай нов сайт в Netlify, свържи GitHub репото.
2. **Build command:** `npm run build`
3. **Publish directory:** `dist`
4. Node версията може да остане по подразбиране.

## Структура
```
.
├─ index.html
├─ vite.config.js
├─ package.json
├─ src/
│  ├─ main.jsx
│  ├─ App.jsx
│  └─ components/ui/
│     ├─ button.jsx
│     ├─ card.jsx
│     ├─ dialog.jsx
│     ├─ input.jsx
│     ├─ progress.jsx
│     ├─ select.jsx
│     └─ tabs.jsx
└─ README.md
```

## Забележки
- Този пакет съдържа текущо работещ вариант без Firestore/Authentication.
- В `App.jsx` има линкове към публичните CSV-и от Google Sheets. Увери се, че са публични.
- UI стъбовете са базови и не покриват всички възможности; достатъчни са за MVP и могат да се заменят по-късно със shadcn/ui.

## Лиценз
MIT
