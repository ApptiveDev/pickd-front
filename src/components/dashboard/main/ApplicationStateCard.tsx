import { useApplication } from "../../../context/ApplicationContext";

export default function ApplicationStateCard() {
  const { applications } = useApplication();

  const total = applications.length;
  const passed = applications.filter((a) => a.status === "서류통과").length;
  const interview = applications.filter((a) => a.status === "면접예정").length;
  const final = applications.filter((a) => a.status === "최종합격").length;

  return (
    <div className="flex justify-start px-6">
      <div className="grid grid-cols-4 gap-4 max-w-5xl w-full">
        <Card title="총 지원" value={total} color="bg-gray-100" />
        <Card title="서류 통과" value={passed} color="bg-green-100" />
        <Card title="면접 예정" value={interview} color="bg-yellow-100" />
        <Card title="최종 합격" value={final} color="bg-red-100" />
      </div>
    </div>
  );
}

function Card({ title, value, color }: any) {
  return (
    <div
      className={`
        ${color}
        p-4 rounded-xl
        flex items-center gap-4

        transition
        duration-200
        hover:scale-105
        hover:shadow-md
        cursor-pointer
      `}
    >
      {/* 아이콘 넣을거면 여기에다가?*/}
      <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg text-lg">
        icon?
      </div>

      {/* 텍스트 */}
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
