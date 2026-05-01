import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useApplication } from "../../../context/ApplicationContext";
import CalendarModal from "../../modal/CalendarModal";
import { createEvent, deleteEvent } from "../../../api/calendar";

function getEventDate(e: any): Date | null {
  if (!e.start) return null;

  if (e.start.dateTime?.value) {
    return new Date(Number(e.start.dateTime.value));
  }

  if (typeof e.start.dateTime === "string") {
    return new Date(e.start.dateTime);
  }

  if (e.start.date) {
    return new Date(e.start.date);
  }
  return null;
}

type EventType = "interview" | "apply" | "deadline" | "default";
function getType(summary: string): EventType {
  if (summary.includes("면접")) return "interview";
  if (summary.includes("제출")) return "apply";
  if (summary.includes("마감")) return "deadline";
  return "default";
}

function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function getThisWeekEvents(events: any[]) {
  const now = new Date();

  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return events.filter((e) => {
    const d = getEventDate(e);
    return d && d >= start && d < end;
  });
}

export default function CalendarBox({
  defaultEvents,
  setDefaultEvents,
}: {
  defaultEvents: any[];
  setDefaultEvents: (events: any[]) => void;
}) {
  const { applications } = useApplication();
  const [date, setDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const weeklyEvents = getThisWeekEvents(defaultEvents).sort((a, b) => {
    const da = getEventDate(a);
    const db = getEventDate(b);

    if (!da || !db) return 0;
    return da.getTime() - db.getTime();
  });

  const mergedEvents = [
    ...defaultEvents
      .map((e) => {
        const d = getEventDate(e);
        if (!d) return null;

        return {
          date: d,
          type: getType(e.summary || ""),
        };
      })
      .filter((e): e is { date: Date; type: EventType } => e !== null),

    ...applications
      .flatMap((a) => [
        a.interviewDate
          ? { date: new Date(a.interviewDate), type: "interview" }
          : null,

        a.applyDate ? { date: new Date(a.applyDate), type: "apply" } : null,

        a.deadlineDate
          ? { date: new Date(a.deadlineDate), type: "deadline" }
          : null,
      ])
      .filter((e): e is { date: Date; type: EventType } => e !== null),
  ];

  const loadEvents = () => {
    fetch("/api/calendar/events", {
      credentials: "include",
    })
      .then(async (res) => {
        console.log("calendar status:", res.status);

        const text = await res.text();
        console.log("calendar raw response:", text);

        if (!res.ok) throw new Error(text);

        return text ? JSON.parse(text) : [];
      })
      .then((data) => {
        console.log("calendar parsed data:", data);
        setDefaultEvents(data);
      })
      .catch((err) => console.error("캘린더 가져오기 실패", err));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="bg-[#F8FAFC] rounded-xl p-4">
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-[#2563EB] text-white px-3 py-1 rounded mb-3"
      >
        일정 추가
      </button>

      {isModalOpen && (
        <CalendarModal
          selectedDate={date}
          onClose={() => setIsModalOpen(false)}
          onCreate={async (data) => {
            await createEvent(data);
            loadEvents();
          }}
        />
      )}

      <Calendar
        className="!w-full rounded-xl"
        prev2Label={null}
        next2Label={null}
        calendarType="gregory"
        showNeighboringMonth={false}
        formatDay={(_, date) => date.getDate().toString()}
        onChange={(value) => setDate(value as Date)}
        value={date}
        tileContent={({ date }) => {
          const hasInterview = mergedEvents.some(
            (e) => e.type === "interview" && isSameDay(e.date, date),
          );

          const hasApply = mergedEvents.some(
            (e) => e.type === "apply" && isSameDay(e.date, date),
          );

          const hasDeadline = mergedEvents.some(
            (e) => e.type === "deadline" && isSameDay(e.date, date),
          );

          const hasDefault = mergedEvents.some(
            (e) => e.type === "default" && isSameDay(e.date, date),
          );

          return (
            <div className="flex justify-center gap-0 mt-[0px]">
              {hasInterview && (
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
              )}
              {hasApply && (
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
              )}
              {hasDeadline && (
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
              )}
              {hasDefault && (
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
