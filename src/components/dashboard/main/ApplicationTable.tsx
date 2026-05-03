import { useApplication } from "../../../context/ApplicationContext";
import { getStatusStyle } from "../../../utils/status";

export default function ApplicationTable({ onAdd, onEdit, onCompanyClick }: any) {
  const { applications } = useApplication();

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="font-bold text-lg">지원 현황</h2>
          <p className="text-sm text-gray-400">
            총 {applications.length}개의 지원
          </p>
        </div>

        <button
          onClick={onAdd}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          + 추가
        </button>
      </div>

      <table className="w-full text-sm">
        <thead className="text-gray-400 text-left border-b">
          <tr>
            <th className="py-2">회사명</th>
            <th>직무</th>
            <th>상태</th>
            <th>지원일</th>
            <th>면접일</th>
            <th>메모</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {applications.map((a) => (
            <tr key={a.id} className="border-b hover:bg-gray-50">
              <td 
                className="py-3 font-medium cursor-pointer hover:text-green-600 transition-colors"
                onClick={() => onCompanyClick(a)} 
              >
                {a.company}
              </td>
              
              <td>{a.position}</td>

              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${getStatusStyle(
                    a.status,
                  )}`}
                >
                  {a.status}
                </span>
              </td>

              <td>{a.applyDate}</td>
              <td>{a.interviewDate || "-"}</td>
              <td className="text-gray-500 max-w-[150px] truncate">
                {a.memo || "-"}
              </td>

              <td className="flex gap-3 py-3">
                <button 
                  onClick={() => onEdit(a)} 
                  className="hover:scale-110 transition-transform"
                  title="수정"
                >
                  ✏️
                </button>
                <button 
                  className="hover:scale-110 transition-transform"
                  title="삭제"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}