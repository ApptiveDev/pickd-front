import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useEffect, useRef, useState } from "react";
import EventPopup from "./EventPopup";
import "./MainCalendar.css";
import { ChevronRightIcon } from "../../../assets/index";

function getEventDate(e: any): Date | null {
  if (!e.start) return null;
  if (e.start.dateTime?.value) return new Date(Number(e.start.dateTime.value));
  if (typeof e.start.dateTime === "string") return new Date(e.start.dateTime);
  if (e.start.date) return new Date(e.start.date);
  return null;
}

function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

type EventType = "interview" | "deadline" | "apply" | "default";

type CalendarEvent = {
  date: Date;
  title: string;
  type: EventType;
};

const MainCalendar = () => {
  const [googleEvents, setGoogleEvents] = useState<any[]>([]);
  const [date, setDate] = useState(new Date());

  const [popup, setPopup] = useState<{
    date: Date;
    events: CalendarEvent[];
    x: number;
    y: number;
  } | null>(null);

  const popupRef = useRef<HTMLDivElement>(null);

  const loadEvents = () => {
    fetch("/api/calendar/events", {
      credentials: "include",
    })
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) throw new Error(text);
        return text ? JSON.parse(text) : [];
      })
      .then((data) => setGoogleEvents(data))
      .catch((err) => console.error("캘린더 가져오기 실패", err));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setPopup(null);
      }
    };

    if (popup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popup]);

  const mergedEvents: CalendarEvent[] = googleEvents
    .map((e) => {
      const title = e.summary || "";
      let type: EventType = "default";

      if (title.includes("면접")) type = "interview";
      else if (title.includes("마감")) type = "deadline";
      else if (title.includes("제출")) type = "apply";

      const eventDate = getEventDate(e);

      if (!eventDate) return null;

      return {
        date: eventDate,
        title: title || "일정",
        type,
      };
    })
    .filter(Boolean) as CalendarEvent[];

  const getEventColor = (type: EventType) => {
    if (type === "interview") {
      return "bg-[#C082F6]/10 text-[#C082F6]";
    }

    if (type === "deadline") {
      return "bg-[#E77975]/10 text-[#EF4444]";
    }

    if (type === "apply") {
      return "bg-[#79AF86]/10 text-[#10B981]";
    }

    return "bg-blue-50 text-blue-600";
  };

  return (
    <div className="main-calendar-container relative">
      <div className="calendar-filter-dropdown">
        <div className="relative inline-block w-40">
          <select className="w-full bg-[#F8FAFC] text-sm text-gray-700 pl-4 pr-8 py-2 rounded-[0.5rem] border border-gray-200/70 appearance-none focus:outline-none cursor-pointer font-medium">
            <option value="all">전체보기</option>
            <option value="interview">면접</option>
            <option value="deadline">마감</option>
            <option value="apply">제출</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <ChevronRightIcon size={12} className="rotate-90" />
          </div>
        </div>
      </div>

      <Calendar
        className="w-full border-none"
        calendarType="gregory"
        prev2Label={null}
        next2Label={null}
        prevLabel={ <ChevronRightIcon size={14} className="rotate-180" />} 
        nextLabel = {<ChevronRightIcon size={14} />} 
        showNeighboringMonth={true}
        formatDay={(_, date) => date.getDate().toString()}
        value={date}
        onChange={(val) => {
          setDate(val as Date);
          setPopup(null);
        }}
        tileContent={({ date, view }) => {
          if (view !== "month") return null;

          const dayEvents = mergedEvents.filter((ev) =>
            isSameDay(ev.date, date),
          );

          const visibleEvents = dayEvents.slice(0, 2);
          const hiddenCount = dayEvents.length - 2;

          return (
            <div className="flex flex-col gap-1 mt-1 w-full overflow-hidden px-1">
              {visibleEvents.map((ev, i) => (
                <div
                  key={i}
                  className={`text-[10px] px-1.5 py-0.5 rounded truncate font-medium ${getEventColor(
                    ev.type,
                  )}`}
                >
                  {ev.title}
                </div>
              ))}

              {hiddenCount > 0 && (
                <button
                  className="text-[10px] text-[#94A3B8] text-center font-medium"
                  onClick={(e) => {
                    e.stopPropagation();

                    const rect = (
                      e.currentTarget as HTMLElement
                    ).getBoundingClientRect();

                    setPopup({
                      date,
                      events: dayEvents,
                      x: rect.left,
                      y: rect.bottom + 8,
                    });
                  }}
                >
                  +{hiddenCount} more
                </button>
              )}
            </div>
          );
        }}
      />

      {popup && <EventPopup popup={popup} popupRef={popupRef} />}
    </div>
  );
};

export default MainCalendar;
