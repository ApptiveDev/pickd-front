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

  const weeklyEvents = googleEvents; // 일단 그대로 사용

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
          title={modalType === "schedule" ? "일정" : "할일"}
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
