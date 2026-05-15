import type { DocumentItem } from "../types/document";
import { deleteApplication } from "../api/application";
import { type Application } from "../types/application";
import { createTodo, toggleTodoApi, deleteTodoApi } from "../api/todo";
import { createContext, useContext, useState, useEffect } from "react";

type ContextType = {
  applications: Application[];
  deleteApplications: (ids: number[]) => Promise<void>;
  loadData: () => Promise<void>;
  addTodo: (data: {
    title: string;
    dueDate?: string;
    dueTime?: string;
    memo?: string;
    applicationId?: number;
  }) => Promise<void>;

  addDocument: (applicationId: number, title: DocumentItem) => void;

  toggleTodo: (todoId: number) => Promise<void>;
  removeTodo: (todoId: number) => Promise<void>;

  getCounts: () => {
    total: number;
    ongoing: number;
    urgent: number;
    done: number;
    submitted: number;
    checklistInComplete: number;
  };
};

const getDeadlineState = (deadline?: string) => {
  if (!deadline) return null;

  const end = new Date(deadline);
  const today = new Date();

  end.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diff = Math.ceil(
    (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diff < 0) return "마감완료";
  if (diff <= 7) return "마감임박";

  return null;
};

const AppContext = createContext<ContextType | null>(null);

export function ApplicationProvider({ children }: any) {
  const [applications, setApplications] = useState<Application[]>([]);

  const addTodo = async (data: {
    title: string;
    dueDate?: string;
    dueTime?: string;
    memo?: string;
    applicationId?: number;
  }) => {
    await createTodo(data);
    await loadData();
  };

  const toggleTodo = async (todoId: number) => {
    const targetTodo = applications
      .flatMap((app) => app.todos || [])
      .find((todo) => todo.id === todoId);
    if (!targetTodo) return;

    await toggleTodoApi(todoId);

    if (!targetTodo.completed) {
      setTimeout(async () => {
        await deleteTodoApi(todoId);
        await loadData();
      }, 10000);
    }

    await loadData();
  };

  const removeTodo = async (todoId: number) => {
    await deleteTodoApi(todoId);
    await loadData();
  };

  const loadData = async () => {
    const res = await fetch("/api/application", {
      credentials: "include",
    });
    const data = await res.json();
    setApplications(data);
  };
  useEffect(() => {
    loadData();
  }, []);

  const deleteApplicationsHandler = async (ids: number[]) => {
    await Promise.all(ids.map((id) => deleteApplication(id)));
    await loadData();
  };

  const addDocument = (applicationId: number, document: DocumentItem) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== applicationId) return app;
        return {
          ...app,
          documents: [...(app.documents || []), document],
        };
      }),
    );
  };

  const getCounts = () => {
    const total = applications.length;
    const ongoing = applications.filter((a) => a.status === "준비중").length;
    const submitted = applications.filter(
      (a) => a.status === "지원완료",
    ).length;
    const urgent = applications.filter(
      (a) => getDeadlineState(a.deadlineDate) === "마감임박",
    ).length;
    const done = applications.filter(
      (a) => getDeadlineState(a.deadlineDate) === "마감완료",
    ).length;
    const checklistInComplete = applications.filter((a) => {
      const todos = a.todos || [];

      return todos.length > 0 && todos.some((todo) => !todo.completed);
    }).length;

    return {
      total,
      ongoing,
      urgent,
      done,
      submitted,
      checklistInComplete,
    };
  };

  return (
    <AppContext.Provider
      value={{
        applications,
        deleteApplications: deleteApplicationsHandler,
        getCounts,
        loadData,
        addTodo,
        addDocument,
        toggleTodo,
        removeTodo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApplication() {
  return useContext(AppContext)!;
}
