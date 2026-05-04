import { useEffect, useState } from "react";
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
  const [editData, setEditData] = useState<any>(null);

  const [googleEvents, setGoogleEvents] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const { handleSubmit } = useApplication();

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

  const handleCompanyClick = (application: any) => {
    setSelectedApplication(application);
    setIsCompanyModalOpen(true);
  };

  return (
    <div className="flex w-full min-h-full">
      <div className="flex-1 p-6">
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
                onCompanyClick={handleCompanyClick}
              />
            </div>
          </>
        )}
      </div>

      {user && (
        <div className="w-[18.05%] min-w-[280px] border-l border-gray-200 p-6 bg-white/50">
          <RightTab
            googleEvents={googleEvents}
            setGoogleEvents={setGoogleEvents}
          />
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[600px] shadow-xl">
            <PostRegistration
              initialData={selectedApplication}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedApplication(null);
                setEditData(null);
              }}
              onSubmit={(data: any) => {
                if (editData) {
                  handleSubmit({
                    ...data,
                    id: editData.id,
                  });
                } else {
                  handleSubmit({
                    id: Date.now(),
                    company: data.company || "",
                    jobTitle: data.jobTitle || "",
                    position: data.position || "",
                    industry: data.industry || "",
                    deadlineDate: data.deadlineDate || "",
                    applyDate: data.applyDate || "",
                    status: data.status || "진행중",
                    memo: data.memo || "",
                    submitted: false,
                    checklistInComplete: true,
                  });
                }
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
