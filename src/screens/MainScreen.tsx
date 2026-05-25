import { useEffect, useRef, useState } from "react";
import type { Application } from "../types/application";
import Header from "../components/dashboard/main/Header";
import CompanyInfo from "../components/modal/CompanyInfo";
import RightTab from "../components/dashboard/right/RightTab";
import { useApplication } from "../context/ApplicationContext";
import ApplyInput from "../components/dashboard/main/ApplyInput";
import PostRegistration from "../components/modal/PostRegistration";
import ApplicationDetailModal from "../components/modal/ApplicationDetailModal";
import DocumentSection from "../components/dashboard/main/document/DocumentSection";
import ApplicationTable from "../components/dashboard/main/applicationTable/ApplicationTable";
import { Icon } from "@iconify/react"; // 아이콘 컴포넌트 추가

export default function MainScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [focusedApplication, setFocusedApplication] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // 우측 드로어(Sidebar) 열림 상태 추가
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const documents = applications.flatMap((app) =>
    (app.documents || []).map((doc) => ({
      ...doc,
      application: app,
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
    // relative 속성을 추가하여 드로어가 이 영역을 기준으로 absolute 배치되도록 합니다.
    <div className="relative flex w-full min-h-full overflow-hidden bg-gray-50">
      <div className="flex-1 min-w-0 p-6">
        {user && (
          <>
            <div className="flex justify-between items-center">
              <Header user={user} />
              
              {/* 드로어가 닫혀있을 때만 열기 버튼을 보여줍니다 */}
              {!isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 bg-white rounded-md shadow-md border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all"
                >
                  <Icon icon="lucide:sidebar-open" className="w-5 h-5" />
                </button>
              )}
            </div>

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
                setIsDetailModalOpen={setIsDetailModalOpen}
              />
            </div>
            <DocumentSection documents={documents} />
          </>
        )}
      </div>

      {/* 드로어 배경 딤드(Dimmed) 처리 */}
      {user && isSidebarOpen && (
        <div
          className="absolute inset-0 bg-black/20 z-20 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 우측 슬라이드 드로어 (RightTab) */}
      {user && (
        <div
          className={`absolute top-0 right-0 h-full w-[400px] bg-white shadow-xl z-30 flex flex-col overflow-y-auto transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >

          <div className="flex-1 p-6">
            <RightTab
              todoData={allTodos}
              googleEvents={googleEvents}
              setGoogleEvents={setGoogleEvents}
              focusedApplication={focusedApplication}
            />
          </div>
        </div>
      )}

      {/* 모달 및 기타 컴포넌트들 */}
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

      <ApplicationDetailModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        application={focusedApplication}
      />

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