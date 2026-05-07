import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useEffect, useState } from "react";

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

const MainCalendar = () => {
  const [googleEvents, setGoogleEvents] = useState<any[]>([]);
  const [date, setDate] = useState(new Date());

  const loadEvents = () => {
    fetch("/api/calendar/events", { credentials: "include" })
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) throw new Error(text);
        return text ? JSON.parse(text) : [];
      })
      .then((data) => setGoogleEvents(data))
      .catch((err) => console.error("캘린더 가져오기 실패", err));
  };

  useEffect(() => { loadEvents(); }, []);

  const mergedEvents = [
    ...googleEvents.map((e) => ({
      date: getEventDate(e),
      title: e.summary || "일정",
      type: (e.summary || "").includes("면접") ? "interview" : (e.summary || "").includes("마감") ? "deadline" : "default"
    })),
  ].filter((e): e is { date: Date; title: string; type: string } => e !== null && e.date !== null);

  return (
    <div className="w-full h-full main-calendar-container">
      <Calendar
        className="w-full border-none"
        calendarType="gregory"
        prev2Label={null}
        next2Label={null}
        showNeighboringMonth={true}
        formatDay={(_, date) => date.getDate().toString()}
        value={date}
        onChange={(val) => setDate(val as Date)}
        tileContent={({ date, view }) => {
          if (view !== 'month') return null;
          
          const dayEvents = mergedEvents.filter(ev => isSameDay(ev.date, date));

          return (
            <div className="flex flex-col gap-1 mt-1 w-full overflow-hidden px-1">
              {dayEvents.map((ev, i) => {
                let colorClass = "bg-blue-50 text-blue-600 border-blue-100";
                if (ev.type === "interview") colorClass = "bg-purple-50 text-purple-600 border-purple-100";
                if (ev.type === "deadline") colorClass = "bg-red-50 text-red-600 border-red-100";
                if (ev.type === "apply") colorClass = "bg-green-50 text-green-600 border-green-100";

                return (
                  <div 
                    key={i} 
                    className={`text-[10px] px-1.5 py-0.5 rounded border truncate shadow-sm font-medium ${colorClass}`}
                  >
                    {ev.title}
                  </div>
                );
              })}
            </div>
          );
        }}
      />

      {/* 3. 캘린더 높이를 키우기 위한 스타일 주입 */}
      <style>{`
        .main-calendar-container .react-calendar {
          width: 100%;
          border: none;
          font-family: inherit;
        }
        .main-calendar-container .react-calendar__tile {
          min-height: 120px; /* 칸 높이 고정 */
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          padding: 8px !important;
          border-right: 1px solid #f3f4f6;
          border-bottom: 1px solid #f3f4f6;
        }
        .main-calendar-container .react-calendar__tile--now {
          background: #f8faff !important;
        }
        .main-calendar-container .react-calendar__tile--now abbr {
          background: #3b82f6;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .main-calendar-container .react-calendar__month-view__weekdays__weekday {
          padding: 12px 0;
          font-size: 0.75rem;
          color: #9ca3af;
          text-decoration: none;
          border-right: 1px solid #f3f4f6;
        }
      `}</style>
    </div>
  );
};

export default MainCalendar;