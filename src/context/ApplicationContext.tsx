import { type Application } from "../types/application";
import { createContext, useContext, useState, useEffect } from "react";
import {
  createApplication,
  updateApplication,
  deleteApplication,
} from "../api/application";

type ContextType = {
  applications: Application[];
  handleSubmit: (data: Partial<Application>) => Promise<void>;
  deleteApplications: (ids: number[]) => Promise<void>;
  loadData: () => Promise<void>;

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

  // 추가, 수정 통합
  const handleSubmit = async (data: Partial<Application>) => {
    if (data.id) {
      await updateApplication(data.id, data);
    } else {
      await createApplication(data);
    }
    await loadData();
  };

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
        handleSubmit,
        deleteApplications: deleteApplicationsHandler,
        getCounts,
        loadData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApplication() {
  return useContext(AppContext)!;
}
