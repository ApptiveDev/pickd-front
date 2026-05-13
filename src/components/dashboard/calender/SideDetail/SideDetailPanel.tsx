import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import ProgressCircle from "./ProgressCircle";
import SectionHeader from "./SectionHeader";
import TodoItem from "./TodoItem";
import AnnouncementItem from "./AnnouncementItem";
import type { Application } from "../../../../types/application";

interface Props {
  data: Application[]; 
}

function getEventDate(e: any): Date | null {
  if (!e.start) return null;
  if (e.start.dateTime?.value) return new Date(Number(e.start.dateTime.value));
  if (typeof e.start.dateTime === "string") return new Date(e.start.dateTime);
  if (e.start.date) return new Date(e.start.date);
  return null;
}

const SideDetailPanel = ({ data }: Props) => {
  const [googleEvents, setGoogleEvents] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    fetch("/api/calendar/events", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setGoogleEvents(data))
      .catch((err) => console.error("캘린더 가져오기 실패", err));
  }, []);


  const combinedAnnouncements = [
    ...data.map(app => ({
      id: `db-${app.id}`,
      title: app.jobTitle,
      company: app.company,
      step: app.status,
      date: app.deadlineDate ? new Date(app.deadlineDate) : null,
    })),
    ...googleEvents
      .filter(e => (e.summary || "").includes("마감") || (e.summary || "").includes("면접"))
      .map(e => ({
        id: `google-${e.id}`,
        title: e.summary || "일정",
        company: "구글 캘린더",
        step: e.summary.includes("면접") ? "면접 전형" : "마감 임박",
        date: getEventDate(e),
      }))
  ];

  const sortedList = combinedAnnouncements
    .filter(item => item.date && item.date >= today)
    .sort((a, b) => a.date!.getTime() - b.date!.getTime());

  const calculateDDay = (targetDate: Date) => {
    const diff = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff === 0 ? "D-Day" : `D-${diff}`;
  };

 const displayItems = isExpanded ? sortedList : sortedList.slice(0, 3);
  const extraCount = sortedList.length - 3;

  return (
    <div className="w-[400px] h-full bg-white border-l border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {today.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
          </h2>
          <p className="text-sm text-gray-500 mt-1">오늘의 진행률</p>
        </div>
        <ProgressCircle percentage={13} />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <section className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-1 mb-4">
            <ChevronDown size={18} className="text-gray-400" />
            <span className="font-semibold text-gray-700">다가오는 공고</span>
            <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
              {sortedList.length}
            </span>
          </div>

          <div className="space-y-4">
            {displayItems.map((item) => (
              <AnnouncementItem
                key={item.id}
                title={item.title}
                company={item.company}
                step={item.step}
                dday={calculateDDay(item.date!)}
              />
            ))}
          </div>
          
          {sortedList.length > 3 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-center text-sm text-gray-400 mt-4 hover:text-blue-500 hover:underline transition-colors"
            >
              {isExpanded ? "접기" : `더보기 +${extraCount}`}
            </button>
          )}
        </section>

        {/* ... 나머지 오늘의 일정 & 할 일 섹션 생략 ... */}
      </div>
    </div>
  );
};

export default SideDetailPanel;