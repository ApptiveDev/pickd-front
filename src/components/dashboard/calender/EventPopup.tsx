import type { RefObject } from "react";

type EventType = "interview" | "deadline" | "apply" | "default";

type CalendarEvent = {
  date: Date;
  title: string;
  type: EventType;
};

interface EventPopupProps {
  popup: {
    date: Date;
    events: CalendarEvent[];
    x: number;
    y: number;
  };
  popupRef: RefObject<HTMLDivElement | null>;
}

const EventPopup = ({
  popup,
  popupRef,
}: EventPopupProps) => {
  const getEventColor = (type: EventType) => {
    if (type === "interview") {
      return "bg-purple-50 text-purple-600 border-purple-100";
    }

    if (type === "deadline") {
      return "bg-red-50 text-red-600 border-red-100";
    }

    if (type === "apply") {
      return "bg-green-50 text-green-600 border-green-100";
    }

    return "bg-blue-50 text-blue-600 border-blue-100";
  };

  const getLabel = (type: EventType) => {
    if (type === "interview") return "면접";
    if (type === "deadline") return "마감";
    if (type === "apply") return "지원";

    return "일정";
  };

  return (
    <div
      ref={popupRef}
      className="fixed z-50 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 min-w-[220px]"
      style={{
        left: popup.x,
        top: popup.y,
      }}
    >
      <div className="font-semibold text-sm mb-3">
        {popup.date.getMonth() + 1}월 {popup.date.getDate()}일 일정
      </div>

      <div className="flex flex-col gap-2">
        {popup.events.map((ev, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-sm"
          >
            <div
              className={`px-2 py-1 rounded-md text-xs border ${getEventColor(
                ev.type,
              )}`}
            >
              {getLabel(ev.type)}
            </div>

            <span>{ev.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventPopup;