export function sortByDisplayOrder<T extends { displayOrder: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.displayOrder - b.displayOrder);
}

export function formatMonthYear(dateString: string, locale: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(locale, { year: 'numeric', month: 'long' });
}
