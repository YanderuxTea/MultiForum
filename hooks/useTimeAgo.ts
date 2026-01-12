function declinationWord(count: number, [one, few, many]: string[]) {
  const abs = Math.abs(count);
  if (abs % 100 >= 11 && abs % 100 <= 14) {
    return many;
  }
  switch (abs % 10) {
    case 1:
      return one;
    case 2:
    case 3:
    case 4:
      return few;
    default:
      return many;
  }
}
const minute = 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const month = day * 30;
const year = day * 365;

export default function useTimeAgo(date: Date) {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = Math.floor((now - then) / 1000);
  const intervals = [
    { limit: year, name: ["год", "года", "лет"] },
    { limit: month, name: ["месяц", "месяца", "месяцев"] },
    { limit: week, name: ["неделя", "недели", "недель"] },
    { limit: day, name: ["день", "дня", "дней"] },
    { limit: hour, name: ["час", "часа", "часов"] },
    { limit: minute, name: ["минута", "минуты", "минут"] },
    { limit: 1, name: ["секунда", "секунды", "секунд"] },
  ];
  if (diff < 10) return "только что";
  for (const interval of intervals) {
    if (diff >= interval.limit) {
      const value = Math.floor(diff / interval.limit);
      return `${value} ${declinationWord(value, interval.name)} назад`;
    }
  }
  return "только что";
}
