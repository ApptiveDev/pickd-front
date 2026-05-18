import { useEffect, useState } from "react";
import type { Todo } from "../types/todo";
import { createTodo, toggleTodoApi, getTodos, deleteTodoApi,} from "../api/todo";

import { useApplication } from "../context/ApplicationContext";

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

export const useSidePanelData = () => {
  const [googleEvents, setGoogleEvents] = useState<any[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const { applications, loadData } = useApplication();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todoData = await getTodos();
        setTodos(todoData);
      } catch (error) {
        console.error("할 일 조회 실패:", error);
      }

      try {
        const calendarRes = await fetch("/api/calendar/events", {
          credentials: "include",
        });

        const calendarData = calendarRes.ok ? await calendarRes.json() : [];

        setGoogleEvents(calendarData);
      } catch (error) {
        console.error("캘린더 가져오기 실패:", error);
      }
    };

    fetchData();
  }, []);

  const combinedAnnouncements = [
    ...applications.map((app) => ({
      id: `db-${app.id}`,
      title: app.jobTitle,
      company: app.company,
      step: app.status,
      date: app.deadlineDate ? new Date(app.deadlineDate) : null,
    })),

    ...googleEvents.map((e) => {
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
    .filter((item) => {
      const isValidStep =
        item.step?.includes("면접") || item.step?.includes("마감");

      return isValidStep && item.date && item.date >= today;
    })
    .sort((a, b) => a.date!.getTime() - b.date!.getTime());

  const todayTodos = todos.filter((todo) => {
    if (!todo.dueDateTime) return false;
    const todoDate = new Date(todo.dueDateTime);
    return (
      todoDate.getFullYear() === today.getFullYear() &&
      todoDate.getMonth() === today.getMonth() &&
      todoDate.getDate() === today.getDate()
    );
  });

  const handleAddTodo = async (newTodoData: any) => {
    try {
      const selectedApplication = applications.find(
        (app) => String(app.id) === String(newTodoData.applicationId),
      );

      const createdTodo = await createTodo({
        title: newTodoData.title,
        dueDate: newTodoData.dueDate,
        dueTime: newTodoData.dueTime,
        memo: newTodoData.memo,
        applicationId: selectedApplication?.id,
      });

      const todoWithApplication = {
        ...createdTodo,
        application: selectedApplication,
      };

      setTodos((prev) => [...prev, todoWithApplication]);
    } catch (error) {
      console.error("할 일 생성 실패:", error);
    }
  };

  const toggleTodo = async (id: number) => {
    try {
      const targetTodo = todos.find((t) => t.id === id);
      if (!targetTodo) return;
      await toggleTodoApi(id);

      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      );

      if (!targetTodo.completed) {
        setTimeout(async () => {
          try {
            await deleteTodoApi(id);
            setTodos((prev) => prev.filter((todo) => todo.id !== id));
            await loadData();
          } catch (error) {
            console.error("10초 뒤 자동 삭제 실패:", error);
          }
        }, 10000);
      }
    } catch (error) {
      console.error("할 일 상태 변경 실패:", error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await deleteTodoApi(id);
      await fetchTodos();
      await loadData();
    } catch (error) {
      console.error("할 일 삭제 실패:", error);
    }
  };

  const fetchTodos = async () => {
    try {
      const todoData = await getTodos();
      setTodos(todoData);
    } catch (error) {
      console.error("할 일 조회 실패:", error);
    }
  };

  const calculateDDay = (targetDate: Date) => {
    const diff = Math.ceil(
      (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    return diff === 0 ? "D-Day" : `D-${diff}`;
  };

  return {
    todayTodos,
    today,
    sortedList,
    todaySchedules,
    handleAddTodo,
    toggleTodo,
    deleteTodo,
    calculateDDay,
  };
};
