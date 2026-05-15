import type { Schedule } from "../../types/schedule";
interface ScheduleListModalProps {
  schedules: Schedule[];
  onClose: () => void;
}

export default function ScheduleListModal({ schedules, onClose }: ScheduleListModalProps) {
  
  const formatDateTime = (startData: any) => {
  if (!startData) return "시간 정보 없음";

  const dt = startData.dateTime; 

  let rawDate;
  if (typeof dt === "string") {
    rawDate = dt;
  } else if (dt?.value) {
    rawDate = Number(dt.value);
  } else if (typeof startData === "string") {
    rawDate = startData;
  } else {
    rawDate = startData.date;
  }

  if (!rawDate) return "시간 정보 없음";

  const date = new Date(rawDate);

  if (isNaN(date.getTime())) {
    return "시간 정보 없음";
  }

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const time = date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return `${month}/${day} ${time}`;
};

  const getCategoryStyle = (category: string = "일반") => {
    switch (category) {
      case "면접":
        return "bg-purple-50 text-purple-600";
      case "마감":
        return "bg-red-50 text-red-600";
      case "제출":
        return "bg-blue-50 text-blue-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="py-2">
      <div className="space-y-6 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
        {schedules.map((item) => (
          <div key={item.id} className="flex items-start gap-4 p-1">
            <div className="mt-1 text-gray-400 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-[16px] font-bold text-gray-800 leading-tight">
                {item.summary}
              </h3>
              
              <div className="flex items-center gap-3">
                <span className="text-[14px] text-gray-400 tabular-nums font-medium">
                  {formatDateTime(item.start)}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${getCategoryStyle(item.category)}`}
                >
                  {item.category || "일반"}
                </span>
              </div>
            </div>
          </div>
        ))}

        {schedules.length === 0 && (
          <div className="py-16 text-center text-gray-400 text-sm">
            예정된 일정이 없습니다.
          </div>
        )}
      </div>

      <button
        onClick={onClose}
        className="w-full mt-8 py-4 bg-[#1E293B] text-white rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg"
      >
        닫기
      </button>
    </div>
  );
}