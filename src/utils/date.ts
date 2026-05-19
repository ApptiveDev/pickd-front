export function formatDate(dateInput: string | Date) {
  const d = new Date(dateInput);

  return `${d.getMonth() + 1}/${d.getDate()} ${d
    .getHours()
    .toString()
    .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export const getDDay = (deadline?: string) => {
  if (!deadline) return "-";
  const end = new Date(deadline.replace("T", " "));
  if (isNaN(end.getTime())) return "-";

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diff = Math.ceil(
    (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diff < 0) return `D+${Math.abs(diff)}`;
  if (diff === 0) return "D-Day";
  return `D-${diff}`;
};

export const formatApplicationDate = (date?: string) => {
  if (!date) return "-";
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

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
