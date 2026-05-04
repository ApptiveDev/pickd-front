import { useState } from "react";
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
  selectedDate: Date | null;
}

export default function ScheduleSection({
  events,
  onClick,
  selectedDate,
}: ScheduleSectionProps) {
  const [mode, setMode] = useState<"week" | "day">("week");

  const getSafeDate = (e: Schedule): Date | null => {
    if (!e.start) return null;

    const dt = e.start.dateTime as any;

    if (typeof dt === "string") return new Date(dt);
    if (dt?.value) return new Date(Number(dt.value));

    return null;
  };

  const filteredEvents =
    mode === "week"
      ? events.filter((e) => {
          const d = getSafeDate(e);
          if (!d) return false;

          const now = new Date();

          const start = new Date(now);
          start.setDate(now.getDate() - now.getDay());
          start.setHours(0, 0, 0, 0);

          const end = new Date(start);
          end.setDate(start.getDate() + 7);

          return d >= start && d < end;
        })
      : events.filter((e) => {
          const d = getSafeDate(e);
          return (
            selectedDate &&
            d &&
            d.toDateString() === selectedDate.toDateString()
          );
        });

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
      <div className="flex items-center justify-between">
        <h4 className="text-lg text-[#0F172A] font-bold mb-[15px] mt-2">
          {mode === "week"
            ? "이번 주 일정"
            : selectedDate
              ? `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 일정`
              : ""}
        </h4>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMode(mode === "week" ? "day" : "week");
          }}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          {mode === "week" ? "선택한 날짜 일정" : "이번주 일정"}
        </button>
      </div>
      <div
        className={`h-[230px] overflow-y-auto pr-1 ${
          filteredEvents.length === 0 ? "flex items-center justify-center" : ""
        }`}
      >
        {filteredEvents.length === 0 ? (
          <p className="text-sm font-semibold text-gray-400">일정 없음</p>
        ) : (
          filteredEvents.map((e, index) => {
            const d = getSafeDate(e);
            const category = getCategory(e);

            const dateText = d
              ? `${d.getMonth() + 1}/${d.getDate()} ${String(
                  d.getHours(),
                ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
              : "";

            return (
              <div
                key={e.id ?? `${e.start?.dateTime}-${index}`}
                className="flex gap-4 mb-3"
              >
                <div className="w-[15px] h-[15px] bg-[#D9D9D9] rounded-full mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="text-[15px] font-semibold break-words">
                    {e.summary}
                  </p>

                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <p className="text-xs text-[#64748B] font-regular">
                      {dateText}
                    </p>

                    <span
                      className={`text-xs font-semibold px-2 py-[2px] rounded ${
                        categoryColor[category] || categoryColor["일반"]
                      }`}
                    >
                      {category}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
