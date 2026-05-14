import MainCalendar from '../components/dashboard/calender/MainCalender';
import SideDetailPanel from '../components/dashboard/calender/SideDetail/SideDetailPanel';

const CalendarScreen = () => {
  return (
    <div className="flex h-screen w-full bg-gray-50">
  {/* 왼쪽: 캘린더 영역 */}
  <div className="flex-1 border-r border-gray-200 overflow-auto">
    <MainCalendar />
  </div>

  {/* 오른쪽: 상세 정보 패널 (Fixed Width 추천) */}
  <div className="w-[400px] flex flex-col bg-white overflow-y-auto">
    <SideDetailPanel data={[]} />
  </div>
</div>
  );
};

export default CalendarScreen;