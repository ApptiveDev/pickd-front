import type { Schedule } from "../../../types/schedule";

const categoryColor = {
  면접: "bg-[#F9F2FF] text-[#C082F6] text-[12px] font-semibold",
  마감: "bg-[#F9F2FF] text-[#EF4444] text-[12px] font-semibold",
  제출: "bg-blue-100 text-blue-500 text-[12px] font-semibold",
  일반: "bg-gray-100 text-gray-500 text-[12px] font-semibold",
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
      className="mt-4 bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-[0px_1px_3px_0px_#00000040] cursor-pointer"
    >
      <h4 className="text-[15px] text-[#0F172A] font-bold mb-3">이번주 일정</h4>
      <div className="max-h-[180px] overflow-y-auto pr-1">
        {events.length === 0 && (
          <p className="text-sm text-gray-400">일정 없음</p>
        )}

        {events.map((e, idx) => {
          const d = getSafeDate(e);
          const category = getCategory(e);

          const dateText = d
            ? `${d.getMonth() + 1}/${d.getDate()} ${String(
                d.getHours(),
              ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
            : "";

          return (
            <div key={idx} className="flex gap-2 mb-3">
              <div className="w-[15px] h-[15px] bg-gray-300 rounded-full mt-1 shrink-0" />

              <div className="flex-1">
                <p className="text-[13px] font-semibold break-words">
                  {e.summary}
                </p>

                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <p className="text-[11px] text-[#64748B] font-regular">
                    {dateText}
                  </p>

                  <span
                    className={`text-[12px] font-semibold px-2 py-[2px] rounded ${
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
    </div>
  );
}
