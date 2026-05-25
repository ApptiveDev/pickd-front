import { useState } from "react";
import type { Schedule } from "../../../types/schedule";
import { formatDate } from "../../../utils/date";
import { categoryColor, getScheduleCategory } from "../../../utils/schedule";

interface ScheduleSectionProps {
  weeklyEvents: Schedule[];
  selectedEvents: Schedule[];
  onClick: () => void;
  selectedDate: Date | null;
}

export default function ScheduleSection({
  weeklyEvents,
  selectedEvents,
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

  const filteredEvents = mode === "week" ? weeklyEvents : selectedEvents;

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
            const category = getScheduleCategory(e);

            const dateText = d ? formatDate(d.toISOString()) : "";

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
