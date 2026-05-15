import { useEffect, useState } from "react";
import type { Application } from "../types/application";
import type { Todo } from "../types/todo";
import { createTodo, toggleTodoApi, getTodos } from "../api/todo";

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

export const useSidePanelData = (data: Application[]) => {
  const [googleEvents, setGoogleEvents] = useState<any[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const calendarRes = await fetch("/api/calendar/events", {
        credentials: "include",
      });

      const calendarData = calendarRes.ok
        ? await calendarRes.json()
        : [];

      setGoogleEvents(calendarData);

      const todoRes = await fetch("/api/todo", {
        credentials: "include",
      });

      const todoData = todoRes.ok
        ? await todoRes.json()
        : [];

      setTodos((prev) => [...prev, ...todoData]);

    } catch (err) {
      console.error("데이터 가져오기 실패", err);
    }
  };

  fetchData();
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
          (e.summary || "").includes("면접") ||
          (e.summary || "").includes("제출"),
      )
      .map((e) => {
        const summary = e.summary || "";

        let step = "일반 일정";

        if (summary.includes("면접")) {
          step = "면접 전형";
        } else if (summary.includes("마감")) {
          step = "지원 마감";
        } else if (summary.includes("제출")) {
          step = "서류 제출";
        }

        const cleanTitle = summary.replace(/면접|마감|제출/g, "").trim();

        const words = cleanTitle.split(" ");

        const company = words[0];
        const jobTitle = words.slice(1).join(" ") || cleanTitle;

        return {
          id: `google-${e.id}`,
          title: jobTitle,
          company,
          step,
          date: getEventDate(e),
        };
      }),
  ];

  const todaySchedules = combinedAnnouncements
    .filter((item) => {
      if (!item.date) return false;

      return (
        item.date.getFullYear() === today.getFullYear() &&
        item.date.getMonth() === today.getMonth() &&
        item.date.getDate() === today.getDate()
      );
    })
    .sort((a, b) => a.date!.getTime() - b.date!.getTime());

  const sortedList = combinedAnnouncements
    .filter((item) => item.date && item.date >= today)
    .sort((a, b) => a.date!.getTime() - b.date!.getTime());

  const handleAddTodo = async (newTodoData: any) => {
  try {
    const selectedApplication = data.find(
      (app) => app.company === newTodoData.relatedJob,
    );

    const createdTodo = await createTodo({
      title: newTodoData.summary,
      dueDate: newTodoData.dueDate,
      dueTime: newTodoData.dueTime,
      memo: newTodoData.memo,
      applicationId: selectedApplication?.id,
    });

    setTodos((prev) => [...prev, createdTodo]);
  } catch (error) {
    console.error("할 일 생성 실패:", error);
  }
};

  const toggleTodo = async (id: number) => {
  try {
    await toggleTodoApi(id);

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo,
      ),
    );
  } catch (error) {
    console.error("할 일 상태 변경 실패:", error);
  }
};

  const calculateDDay = (targetDate: Date) => {
    const diff = Math.ceil(
      (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    return diff === 0 ? "D-Day" : `D-${diff}`;
  };

  return {
    todos,
    today,
    sortedList,
    todaySchedules,
    handleAddTodo,
    toggleTodo,
    calculateDDay,
  };
};
