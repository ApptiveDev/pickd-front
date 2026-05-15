import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import ProgressCircle from "./ProgressCircle";
import SectionHeader from "./SectionHeader";
import TodoItem from "./TodoItem";
import AnnouncementItem from "./AnnouncementItem";
import type { Application } from "../../../../types/application";
import type { Todo } from "../../../../types/todo";

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
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      title: "자기소개서 수정하기",
      completed: false,
      dueDateTime: "2025-03-20T10:00:00",
      memo: "긴급! 1번 문항 위주로 수정",
      application: {
        id: 101,
        company: "구글코리아",
        jobTitle: "프론트엔드 개발자",
      },
    },
    {
      id: 2,
      title: "포트폴리오 업데이트",
      completed: false,
      dueDateTime: "2027-03-19T14:00:00",
      application: {
        id: 102,
        company: "네이버",
        jobTitle: "웹 서비스 개발",
      },
    },
  ]);

  useEffect(() => {
    fetch("/api/calendar/events", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setGoogleEvents(data))
      .catch((err) => console.error("캘린더 가져오기 실패", err));
  }, []);

  const combinedAnnouncements = [
    ...data.map((app) => ({
      id: `db-${app.id}`,
      title: app.jobTitle,
      company: app.company,
      step: app.status,
      date: app.deadlineDate ? new Date(app.deadlineDate) : null,
    })),
    ...googleEvents
      .filter(
        (e) =>
          (e.summary || "").includes("마감") ||
          (e.summary || "").includes("면접"),
      )
      .map((e) => {
        const summary = e.summary || "";
        const match = summary.match(/^\[(.*?)\]\s*(\S+)\s*(.*)$/);

        let finalTitle = summary;
        let finalCompany = "";

        if (match) {
          const tag = match[1];
          const company = match[2];
          const jobTitle = match[3];

          finalTitle = `[${tag}] ${jobTitle}`;
          finalCompany = company;
        } else {
          finalCompany = summary.split(" ").pop() || "";
        }

        return {
          id: `google-${e.id}`,
          title: finalTitle,
          company: finalCompany,
          step: summary.includes("면접") ? "면접 전형" : "마감 임박",
          date: getEventDate(e),
        };
      }),
  ];

  const handleAddTodo = (newTodoData: any) => {
    const newTodo: Todo = {
      id: Date.now(), 
      title: newTodoData.title,
      completed: false,
      dueDateTime: newTodoData.dueDateTime,
      application: newTodoData.application, 
      memo: newTodoData.memo,
    };

    setTodos((prev) => [...prev, newTodo]); 
  };

  const todaySchedules = combinedAnnouncements
    .filter((item) => {
      if (!item.date) return false;
      const itemDate = new Date(item.date);
      return (
        itemDate.getFullYear() === today.getFullYear() &&
        itemDate.getMonth() === today.getMonth() &&
        itemDate.getDate() === today.getDate()
      );
    })
    .sort((a, b) => a.date!.getTime() - b.date!.getTime());

  const sortedList = combinedAnnouncements
    .filter((item) => item.date && item.date >= today)
    .sort((a, b) => a.date!.getTime() - b.date!.getTime());

  const calculateDDay = (targetDate: Date) => {
    const diff = Math.ceil(
      (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff === 0 ? "D-Day" : `D-${diff}`;
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const displayItems = isExpanded ? sortedList : sortedList.slice(0, 3);
  const extraCount = sortedList.length - 3;

  return (
    <div className="w-[400px] h-full bg-white border-l border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {today.toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h2>
          <p className="text-sm text-gray-500 mt-1">오늘의 진행률</p>
        </div>
        <ProgressCircle percentage={13} />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <section className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-1 mb-4">
            <ChevronDown size={18} className="text-gray-400" />
            <h3 className="font-bold text-gray-800 text-base">다가오는 공고</h3>
            <span className="flex items-center justify-center w-5 h-5 bg-gray-200 text-gray-500 text-[11px] font-bold rounded-full">
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

        <section className="p-6 border-b border-gray-100">
          <SectionHeader title="오늘의 일정" count={todaySchedules.length} />
          <div className="mt-3 space-y-3">
            {todaySchedules.length > 0 ? (
              todaySchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="p-4 bg-gray-50 rounded-xl flex justify-between items-center group hover:bg-blue-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-[15px]">
                      {schedule.title}
                      <span className="text-gray-400 ml-2 text-sm font-normal">
                        {schedule.company}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">
                오늘 예정된 일정이 없습니다.
              </p>
            )}
          </div>
        </section>

        <section className="p-6">
          <SectionHeader
            title="오늘의 할 일"
            count={todos.filter((t) => !t.completed).length}
            applications={data} 
            onConfirm={handleAddTodo} 
          />
          <div className="mt-4 space-y-2">
            {todos.length > 0 ? (
              todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={(id) => {
                    setTodos((prev) =>
                      prev.map((t) =>
                        t.id === id ? { ...t, completed: !t.completed } : t,
                      ),
                    );
                  }}
                />
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">
                할 일이 없습니다. 새로운 할 일을 추가해보세요!
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SideDetailPanel;
