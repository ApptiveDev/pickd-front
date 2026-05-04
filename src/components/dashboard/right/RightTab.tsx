import { useState } from "react";
import CalendarBox from "./CalendarBox";
import ScheduleSection from "./ScheduleSection";
import TodoSection from "./TodoSection";
import ModalLayout from "../../modal/ModalLayout";
import ScheduleList from "../../modal/ScheduleList";
import TodoList from "../../modal/TodoList";
import type { Todo } from "../../../types/todo";

export default function RightTab({ googleEvents, setGoogleEvents }: any) {
  const [modalType, setModalType] = useState<"schedule" | "todo" | null>(null);
  const [weeklyEvents, setWeeklyEvents] = useState<any[]>([]);

  const [todoData, setTodoData] = useState<Todo[]>([
    { id: "1", summary: "포트폴리오 수정", isCompleted: false },
  ]);

  const handleToggle = (id: string) => {
    setTodoData((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t,
      ),
    );
  };

  return (
    <div className="w-[95%]">
      <CalendarBox
        defaultEvents={googleEvents}
        setDefaultEvents={setGoogleEvents}
        setWeeklyEvents={setWeeklyEvents}
      />

      <ScheduleSection
        events={weeklyEvents}
        onClick={() => setModalType("schedule")}
      />

      <TodoSection todos={todoData} onClick={() => setModalType("todo")} />

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
