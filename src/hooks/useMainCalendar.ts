import { useState, useEffect, useRef, useMemo } from "react";
import { type Application } from "../types/application";

function getEventDate(e: any): Date | null {
  if (!e.start) return null;
  if (e.start.dateTime?.value) return new Date(Number(e.start.dateTime.value));
  if (typeof e.start.dateTime === "string") return new Date(e.start.dateTime);
  if (e.start.date) return new Date(e.start.date);
  return null;
}

export function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export type EventType = "interview" | "deadline" | "apply" | "default";

export type CalendarEvent = {
  date: Date;
  title: string;
  type: EventType;
  companyId: string;
  companyName: string;
};

export type PopupState = {
  date: Date;
  events: CalendarEvent[];
  x: number;
  y: number;
};

export const useMainCalendar = (applications: Application[]) => {
  const [googleEvents, setGoogleEvents] = useState<any[]>([]);
  const [date, setDate] = useState(new Date());
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("all");
  const [popup, setPopup] = useState<PopupState | null>(null);
  
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

  const allEvents: CalendarEvent[] = useMemo(() => {
    return googleEvents
      .map((e) => {
        const title = e.summary || "";
        let type: EventType = "default";

        if (title.includes("면접")) type = "interview";
        else if (title.includes("마감")) type = "deadline";
        else if (title.includes("제출")) type = "apply";

        const eventDate = getEventDate(e);
        if (!eventDate) return null;

        const matchedApp = applications.find((app) => title.includes(app.company));

        return {
          date: eventDate,
          title: title || "일정",
          type,
          companyId: matchedApp ? String(matchedApp.id) : "none",
          companyName: matchedApp ? matchedApp.company : "",
        };
      })
      .filter(Boolean) as CalendarEvent[];
  }, [googleEvents, applications]);

  const filteredEvents = useMemo(() => {
    if (selectedCompanyId === "all") return allEvents;
    return allEvents.filter((ev) => ev.companyId === selectedCompanyId);
  }, [allEvents, selectedCompanyId]);

  const getEventColor = (type: EventType) => {
    if (type === "interview") return "bg-[#C082F6]/10 text-[#C082F6]";
    if (type === "deadline") return "bg-[#E77975]/10 text-[#EF4444]";
    if (type === "apply") return "bg-[#79AF86]/10 text-[#10B981]";
    return "bg-blue-50 text-blue-600";
  };


  const handleCompanyChange = (id: string) => {
    setSelectedCompanyId(id);
    setPopup(null);
  };

  const handleDateChange = (val: Date) => {
    setDate(val);
    setPopup(null);
  };

  return {
    date,
    selectedCompanyId,
    popup,
    popupRef,
    filteredEvents,
    getEventColor,
    handleCompanyChange,
    handleDateChange,
    setPopup,
  };
};