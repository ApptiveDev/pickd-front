import type { Schedule } from "../../../types/schedule";

const categoryColor = {
  면접: "bg-purple-100 text-purple-600",
  마감: "bg-red-100 text-red-500",
  제출: "bg-blue-100 text-blue-500",
  일반: "bg-gray-100 text-gray-500",
};

interface ScheduleSectionProps {
  events: Schedule[];
  onClick: () => void;
}

export default function ScheduleSection({
  events,
  onClick,
}: ScheduleSectionProps) {
  const getSafeDate = (e: Schedule): Date | null => {
    if (!e.start) return null;

    const dt = e.start.dateTime as any;

    if (typeof dt === "string") return new Date(dt);
    if (dt?.value) return new Date(Number(dt.value));

    return null;
  };

  const getCategory = (e: Schedule) => {
    if (e.category) return e.category;

    const text = e.summary || "";

    if (text.includes("면접")) return "면접";
    if (text.includes("마감")) return "마감";
    if (text.includes("제출")) return "제출";

    return "일반";
  };

  return (
    <div
      onClick={onClick}
      className="mt-4 bg-white rounded-2xl p-4 shadow-sm cursor-pointer max-h-[230px] overflow-y-auto"
    >
      <h4 className="font-semibold mb-3">일정</h4>

      {events.length === 0 && (
        <p className="text-sm text-gray-400">일정 없음</p>
      )}

      {events.map((e, idx) => {
        const d = getSafeDate(e);
        const category = getCategory(e);

        const dateText = d
          ? `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(
              2,
              "0",
            )}:${String(d.getMinutes()).padStart(2, "0")}`
          : "";

        return (
          <div key={idx} className="flex gap-2 mb-3">
            <div className="w-[15px] h-[15px] bg-gray-300 rounded-full mt-1 shrink-0" />

            <div className="flex-1">
              <p className="text-[15px] font-medium break-words">{e.summary}</p>

              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <p className="text-xs text-gray-500">{dateText}</p>

                <span
                  className={`text-xs px-2 py-[2px] rounded ${
                    categoryColor[category] || categoryColor["일반"]
                  }`}
                >
                  {category}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
