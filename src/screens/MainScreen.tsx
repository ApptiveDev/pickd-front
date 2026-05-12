import type { Todo } from "../types/todo";
import { useEffect, useRef, useState } from "react";
import type { Application } from "../types/application";
import Header from "../components/dashboard/main/Header";
import CompanyInfo from "../components/modal/CompanyInfo";
import RightTab from "../components/dashboard/right/RightTab";
import { useApplication } from "../context/ApplicationContext";
import ApplyInput from "../components/dashboard/main/ApplyInput";
import PostRegistration from "../components/modal/PostRegistration";
import ApplicationTable from "../components/dashboard/main/ApplicationTable";

export default function MainScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [focusedApplication, setFocusedApplication] = useState<any>(null);
  const [editData, setEditData] = useState<any>(null);
  const timeouts = useRef<{ [key: string]: ReturnType<typeof setTimeout> }>({});

  const [googleEvents, setGoogleEvents] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  const { loadData } = useApplication();
  const { applications } = useApplication();

  const allTodos = applications.flatMap((app) =>
    (app.todos || []).map((todo) => ({
      ...todo,
      application: {
        id: app.id,
        company: app.company,
        jobTitle: app.jobTitle,
      },
    })),
  );

  useEffect(() => {
    fetch("/api/user", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const loadCalendarEvents = async () => {
    try {
      const res = await fetch("/api/calendar/events", {
        credentials: "include",
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setGoogleEvents(data);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    loadCalendarEvents();
  }, []);

  const handleAfterChange = async () => {
    await loadData();

    setTimeout(loadCalendarEvents, 300);
  };

  const handleCompanyClick = (application: any) => {
    setSelectedApplication(application);
    setIsCompanyModalOpen(true);
  };

  return (
    <div className="flex w-full min-h-full overflow-hidden">
      <div className="flex-1 min-w-0 p-6">
        {user && (
          <>
            <Header user={user} />

            <div className="mt-6 space-y-4">
              <ApplyInput onAdd={() => setIsModalOpen(true)} />

              <ApplicationTable
                onAdd={() => {
                  setSelectedApplication(null);
                  setIsModalOpen(true);
                }}
                onEdit={(row: Application) => {
                  setEditData(row);
                  setIsModalOpen(true);
                }}
                onDelete={() => {}}
                onChange={handleAfterChange}
                onCompanyClick={handleCompanyClick}
                focusedApplication={focusedApplication}
                setFocusedApplication={setFocusedApplication}
              />
            </div>
          </>
        )}
      </div>

      {user && (
        <div className="w-[18.05%] min-w-[280px] border-l border-gray-200 p-6 bg-white/50">
          <RightTab
            todoData={allTodos}
            googleEvents={googleEvents}
            setGoogleEvents={setGoogleEvents}
            focusedApplication={focusedApplication}
          />
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div>
            <PostRegistration
              initialData={selectedApplication}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedApplication(null);
                setEditData(null);
              }}
              onSuccess={async () => {
                await loadData();
                
                setTimeout(async () => {
                  await loadCalendarEvents();
                }, 500);
                setIsModalOpen(false);
                setSelectedApplication(null);
                setEditData(null);
              }}
              editData={editData}
            />
          </div>
        </div>
      )}

      {isCompanyModalOpen && selectedApplication && (
        <CompanyInfo
          isOpen={isCompanyModalOpen}
          onClose={() => setIsCompanyModalOpen(false)}
          data={selectedApplication}
        />
      )}
    </div>
  );
}
