import CalendarBox from "./CalendarBox";
import TodoSection from "./TodoSection";
import { useState, useRef } from "react";
import TodoList from "../../modal/TodoList";
import type { Todo } from "../../../types/todo";
import ScheduleSection from "./ScheduleSection";
import ModalLayout from "../../modal/ModalLayout";
import ScheduleList from "../../modal/ScheduleList";

export default function RightTab({ googleEvents, setGoogleEvents }: any) {
  const [modalType, setModalType] = useState<"schedule" | "todo" | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [weeklyEvents, setWeeklyEvents] = useState<any[]>([]);
  const timeouts = useRef<{ [key: string]: ReturnType<typeof setTimeout> }>({});

  const [todoData, setTodoData] = useState<Todo[]>([
    { id: "1", summary: "포트폴리오 수정", isCompleted: false },
  ]);

  const handleToggle = (id: string) => {
    const target = todoData.find((t) => t.id === id);

    setTodoData((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t,
      ),
    );

    if (target && !target.isCompleted) {
      const timeout = setTimeout(() => {
        setTodoData((prev) => prev.filter((t) => t.id !== id));
        delete timeouts.current[id];
      }, 10000); // 일단 임시로 10초 뒤에 삭제되도록 이후 86400000 로 변경

      timeouts.current[id] = timeout;
    } else {
      if (timeouts.current[id]) {
        clearTimeout(timeouts.current[id]);
        delete timeouts.current[id];
      }
    }
  };

  const handleAddTodo = () => {
    const newTodo = {
      id: Date.now().toString(),
      summary: "새 할 일",
      isCompleted: false,
    };

    setTodoData((prev) => [...prev, newTodo]);
  };

  return (
    <div className="w-[95%] bg-[F8FAFC]">
      <CalendarBox
        defaultEvents={googleEvents}
        setDefaultEvents={setGoogleEvents}
        setWeeklyEvents={setWeeklyEvents}
        setSelectedDate={setSelectedDate}
        setSelectedEvents={setSelectedEvents}
      />

      <ScheduleSection
        events={[...weeklyEvents, ...selectedEvents]}
        selectedDate={selectedDate}
        onClick={() => setModalType("schedule")}
      />

      <TodoSection
        todos={todoData}
        onAdd={handleAddTodo}
        onToggle={handleToggle}
        onClick={() => setModalType("todo")}
      />

      {modalType && (
        <ModalLayout
          isOpen={modalType !== null}
          onClose={() => setModalType(null)}
          title={modalType === "schedule" ? "이번주 일정" : "할 일"}
        >
          {modalType === "schedule" && (
            <ScheduleList
              schedules={weeklyEvents}
              onClose={() => setModalType(null)}
            />
          )}

          {modalType === "todo" && (
            <TodoList
              todos={todoData}
              onToggle={handleToggle}
              onClose={() => setModalType(null)}
            />
          )}
        </ModalLayout>
      )}
    </div>
  );
}
