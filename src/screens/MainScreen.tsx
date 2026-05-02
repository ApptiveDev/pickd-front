import { useEffect, useState } from "react";
import ApplicationStateCard from "../components/dashboard/main/ApplicationStateCard";
import ApplicationTable from "../components/dashboard/main/ApplicationTable";
import RightTab from "../components/dashboard/right/RightTab";
import PostRegistration from "../components/modal/PostRegistration";
import { useApplication } from "../context/ApplicationContext";
import { Icon } from "@iconify/react";

export default function MainScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [googleEvents, setGoogleEvents] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const { addApplication } = useApplication();

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

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="flex">
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mt-[173px] mb-6">
            <div>
              <h1 className="text-[40px] font-bold text-[#0F172A]">
                {user ? `${user.nickname}님의 대시보드` : "대시보드"}
              </h1>
              <p className="text-[20px] text-[#64748B] mt-1">
                오늘도 한 걸음 더 가까이, 화이팅!
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-3">
                <button>
                  <Icon
                    icon="mdi:bell-outline"
                    className="text-[30px] text-[#94A3B8]"
                  />
                </button>
                <button>
                  <Icon
                    icon="fluent-emoji-flat:four-leaf-clover"
                    className="text-[30px]"
                  />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#E2E8F0] text-[16px] text-[#334155] hover:bg-gray-50 transition">
                  <Icon icon="material-symbols:target" className="text-xl" />
                  이번 달 목표
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#E2E8F0] text-[16px] text-[#334155] hover:bg-gray-50 transition">
                  <Icon icon="uis:graph-bar" className="text-xl" />
                  지난 달 리포트
                </button>
              </div>
            </div>
          </div>
          {user && (
            <>
              <ApplicationStateCard />
              <div className="mt-6">
                <ApplicationTable onAdd={() => setIsModalOpen(true)} />
              </div>
            </>
          )}
        </div>

        {user && (
          <div className="w-[18.05%] min-w-[240px] border-l border-gray-200 pl-6">
            <RightTab
              googleEvents={googleEvents}
              setGoogleEvents={setGoogleEvents}
            />
          </div>
        )}
      </div>

      {isModalOpen && (
        <PostRegistration
          onClose={() => setIsModalOpen(false)}
          onSubmit={(data: any) => {
            addApplication(data);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
