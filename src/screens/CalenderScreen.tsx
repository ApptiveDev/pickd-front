import { useState, useEffect } from "react";
import MainCalendar from "../components/dashboard/calender/MainCalender";
import SideDetailPanel from "../components/dashboard/calender/SideDetail/SideDetailPanel";
import { Icon } from "@iconify/react";
import { useApplication } from "../context/ApplicationContext";

const CalendarScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { applications, loadData } = useApplication();

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return (
    <div className="relative flex h-screen w-full bg-gray-50 overflow-hidden">
      <div className="flex-1 overflow-auto">
        <MainCalendar applications={applications} />
      </div>

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{ right: isSidebarOpen ? "400px" : "0px" }}
        className="absolute top-1/3 -translate-y-1/2 flex items-center justify-center w-6 h-16 bg-white border border-r-0 border-gray-200 rounded-l-xl shadow-md hover:bg-gray-50 text-gray-500 transition-all group z-40"
      >
        <Icon
          icon={isSidebarOpen ? "lucide:chevron-right" : "lucide:chevron-left"}
          className={`w-4 h-4 transition-transform ${
            isSidebarOpen ? "group-hover:translate-x-0.5" : "group-hover:-translate-x-0.5"
          }`}
        />
      </button>

      <div
        className={`absolute top-0 right-0 h-full w-[400px] bg-white shadow-xl z-30 flex flex-col overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <span className="font-medium text-gray-700">상세 정보</span>
        </div>

        <div className="flex-1">
          <SideDetailPanel applications={applications} />
        </div>
      </div>
    </div>
  );
};

export default CalendarScreen;
