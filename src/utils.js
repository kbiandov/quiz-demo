export const normalizeId = (v) => (v == null ? null : String(v).trim());

export function groupBy(arr, keyFn) {
  return arr.reduce((acc, x) => {
    const k = keyFn(x);
    (acc[k] = acc[k] || []).push(x);
    return acc;
  }, {});
}

export function routeTitle(route) {
  switch (route) {
    case "home":
      return "Начало";
    case "theory":
      return "Теория";
    case "tests":
      return "Тестове";
    case "results":
      return "Резултати";
    case "stats":
      return "Статистика";
    default:
      return "Math App";
  }
}