import { useState } from "react";
import CalendarBox from "./CalendarBox";
import TodoSection from "./TodoSection";
import PostTodo from "../../modal/PostTodo";
import TodoList from "../../modal/TodoList";
import ScheduleSection from "./ScheduleSection";
import ModalLayout from "../../modal/ModalLayout";
import ScheduleList from "../../modal/ScheduleList";
import { useApplication } from "../../../context/ApplicationContext";

export default function RightTab({
  todoData,
  googleEvents,
  setGoogleEvents,
  focusedApplication,
}: any) {
  const [modalType, setModalType] = useState<
    "schedule" | "todo" | "postTodo" | null
  >(null);
  const [selectedEvents, setSelectedEvents] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [weeklyEvents, setWeeklyEvents] = useState<any[]>([]);

  const { applications, addTodo } = useApplication();

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
        weeklyEvents={weeklyEvents}
        selectedEvents={selectedEvents}
        selectedDate={selectedDate}
        onClick={() => setModalType("schedule")}
      />

      <TodoSection
        todos={todoData}
        focusedApplication={focusedApplication}
        onAdd={() => setModalType("postTodo")}
        onClick={() => setModalType("todo")}
      />

      {(modalType === "schedule" || modalType === "todo") && (
        <ModalLayout
          isOpen={true}
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
              onClose={() => setModalType(null)}
            />
          )}
        </ModalLayout>
      )}

      {modalType === "postTodo" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <PostTodo
            onClose={() => setModalType(null)}
            applications={applications}
            onConfirm={(newData: any) => {
              if (!newData.applicationId || !newData.title) {
                return;
              }

              addTodo(newData);
              setModalType(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
