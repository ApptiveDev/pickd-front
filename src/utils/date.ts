export function formatDate(dateInput: string | Date) {
  const d = new Date(dateInput);

  return `${d.getMonth() + 1}/${d.getDate()} ${d
    .getHours()
    .toString()
    .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export function getEventDateInput(e: any): string | Date | null {
  if (!e.start) return null;

  if (e.start.dateTime?.value) {
    return new Date(Number(e.start.dateTime.value));
  }

  if (typeof e.start.dateTime === "string") {
    return e.start.dateTime;
  }

  if (e.start.date) {
    return e.start.date;
  }

  return null;
}
