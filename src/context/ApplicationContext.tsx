import { deleteApplication } from "../api/application";
import { type Application } from "../types/application";
import { createContext, useContext, useState, useEffect } from "react";
import { createTodo, toggleTodoApi, deleteTodoApi } from "../api/todo";

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

  const getCounts = () => {
    const total = applications.length;
    const ongoing = applications.filter((a) => a.status === "진행중").length;
    const urgent = applications.filter((a) => a.status === "마감임박").length;
    const done = applications.filter((a) => a.status === "마감완료").length;
    const submitted = applications.filter((a) => a.submitted).length;
    const checklistInComplete = applications.filter(
      (a) => a.checklistInComplete,
    ).length;

    return { total, ongoing, urgent, done, submitted, checklistInComplete };
  };

  return (
    <AppContext.Provider
      value={{
        applications,
        deleteApplications: deleteApplicationsHandler,
        getCounts,
        loadData,
        addTodo,
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
