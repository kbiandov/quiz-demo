# Math App (Plain React + Tailwind) — фиксове за Results/Stats

- Няма shadcn/ui — само нативни елементи
- Работещи екрани „Резултати“ и „Статистика“
- След „Предай“ се навигира автоматично към „Резултати“
- Debug widget (долу вдясно) с текущ route и брой резултати
- SPA redirects за Netlify (`public/_redirects`)

## Стартиране
```bash
npm install
npm run dev
```

## Билд
```bash
npm run build
npm run preview
```

## Netlify
- Build command: `npm run build`
- Publish directory: `dist`
