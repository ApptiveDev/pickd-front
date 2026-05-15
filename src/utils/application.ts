const badgeColors = [
  "px-3 py-1 bg-[#FFF1F0] text-[#E77975]",
  "px-3 py-1 bg-[#FFF8ED] text-[#E9A13B]",
  "px-3 py-1 bg-[#F0E4DD] text-[#A28267]",
  "px-3 py-1 bg-[#E2F4E7] text-[#79AF86]",
  "px-3 py-1 bg-[#EBEFFF] text-[#3657C5]",
  "px-3 py-1 bg-[#E1DCFD] text-[#C082F6]",
  "px-3 py-1 bg-pink-100 text-pink-500",
  "px-3 py-1 bg-indigo-100 text-indigo-500",
  "px-3 py-1 bg-teal-100 text-teal-500",
  "px-3 py-1 bg-cyan-100 text-cyan-500",
];

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

export const formatDate = (date?: string) => {
  if (!date) return "-";
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const getPositionColor = (position: string) => {
  let hash = 0;

  for (let i = 0; i < position.length; i++) {
    hash = position.charCodeAt(i) + ((hash << 5) - hash);
  }
  return badgeColors[Math.abs(hash) % badgeColors.length];
};
