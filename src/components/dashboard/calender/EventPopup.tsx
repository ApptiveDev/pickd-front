import { useEffect, useState, type RefObject } from "react";

type EventType = "interview" | "deadline" | "apply" | "default";

type CalendarEvent = {
  date: Date;
  title: string;
  type: EventType;
};

interface EventPopupProps {
  popup: {
    date: Date;
    events: CalendarEvent[];
    x: number;
    y: number;
  };
  popupRef: RefObject<HTMLDivElement | null>;
}

const EventPopup = ({ popup, popupRef }: EventPopupProps) => {
  // 팝업의 최종 렌더링 위치를 관리하는 상태
  const [coords, setCoords] = useState({ x: popup.x, y: popup.y });

  useEffect(() => {
    if (popupRef.current) {
      const popupHeight = popupRef.current.offsetHeight; // 팝업의 실제 높이
      const windowHeight = window.innerHeight; // 브라우저 화면 전체 높이

      let finalY = popup.y;

      // 팝업이 화면 아래쪽 경계를 벗어나는지 확인 (여백 16px 고려)
      if (popup.y + popupHeight > windowHeight - 16) {
        // 화면을 벗어난다면, 마우스/버튼 위쪽으로 팝업이 배치되도록 위치를 올립니다.
        // 버튼 아래로 열리던 것을 버튼 위로 열리게 변경하는 셈입니다.
        finalY = popup.y - popupHeight; 
        
        // 만약 위로 올렸는데 0보다 작아지면 화면 맨 위(16px)에 고정
        if (finalY < 16) {
          finalY = 16;
        }
      }

      setCoords({ x: popup.x, y: finalY });
    }
  }, [popup.x, popup.y, popup.events, popupRef]);

  const getEventColor = (type: EventType) => {
    if (type === "interview") {
      return "bg-purple-50 text-purple-600 border-purple-100";
    }
    if (type === "deadline") {
      return "bg-red-50 text-red-600 border-red-100";
    }
    if (type === "apply") {
      return "bg-green-50 text-green-600 border-green-100";
    }
    return "bg-blue-50 text-blue-600 border-blue-100";
  };

  const getLabel = (type: EventType) => {
    if (type === "interview") return "면접";
    if (type === "deadline") return "마감";
    if (type === "apply") return "지원";
    return "일정";
  };

  return (
    <div
      ref={popupRef}
      className="fixed z-50 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 min-w-[220px]"
      style={{
        left: coords.x,
        top: coords.y, // 👈 보정된 y 좌표를 사용합니다.
      }}
    >
      <div className="font-semibold text-sm mb-3">
        {popup.date.getMonth() + 1}월 {popup.date.getDate()}일 일정
      </div>

      <div className="flex flex-col gap-2">
        {popup.events.map((ev, i) => (
          <div key={i} className="flex items-center gap-2 text-sm" >
            <div
              className={`px-2 py-1 rounded-md text-xs border ${getEventColor(
                ev.type
              )}`}
            >
              {getLabel(ev.type)}
            </div>
            <span>{ev.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventPopup;