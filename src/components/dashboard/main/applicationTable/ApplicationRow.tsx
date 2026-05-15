import ApplicationMenu from "../ApplicationMenu";
import { getStatusStyle } from "../../../../utils/status";
import {
  getDDay,
  formatDate,
  getPositionColor,
} from "../../../../utils/application";

interface Props {
  row: any;
  checkedIds: number[];
  toggleCheck: (id: number) => void;
  onCompanyClick: any;
  setFocusedApplication: any;
  focusedApplication: any;
  onEdit: any;
  onDelete: any;
  onChange: any;
  deleteApplications: any;
  addDocument: any;
  setCheckedIds: any;
}

export default function ApplicationRow({
  row,
  checkedIds,
  toggleCheck,
  onCompanyClick,
  setFocusedApplication,
  focusedApplication,
  onEdit,
  onDelete,
  onChange,
  deleteApplications,
  addDocument,
  setCheckedIds,
}: Props) {
  const isChecked = checkedIds.includes(row.id);
  const completedCount =
    row.todos?.filter((todo: any) => todo.completed).length || 0;
  const totalCount = row.todos?.length || 0;
  const progress = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

  return (
    <tr
      className="border-b hover:bg-gray-50"
      onClick={() => setFocusedApplication(row)}
    >
      <td className="px-4 py-2 border-b text-sm">
        <label
          className="flex items-center justify-center cursor-pointer p-2 -m-2"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            className="hidden"
            checked={isChecked}
            onChange={() => toggleCheck(row.id)}
          />
          <div className="w-[15px] h-[15px] rounded-[4px] border-[1.5px] border-[#2563EB] flex items-center justify-center">
            {isChecked && (
              <svg
                className="w-3 h-3 text-[#2563EB]"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </label>
      </td>

      <td className="px-4 py-2 border-b whitespace-nowrap">
        <span
          className="cursor-pointer text-black font-medium text-sm hover:text-green-600"
          onClick={(e) => {
            e.stopPropagation();
            onCompanyClick(row);
          }}
        >
          {row.company}
        </span>
      </td>
      <td className="px-4 py-2 border-b whitespace-nowrap text-sm">
        {row.jobTitle}
      </td>
      <td className="px-4 py-2 border-b whitespace-nowrap text-sm">
        <span
          className={`inline-flex w-fit px-2 py-[2px] text-xs font-semibold rounded ${getPositionColor(
            row.position,
          )}`}
        >
          {row.position || "-"}
        </span>
      </td>
      <td className="px-4 py-2 border-b whitespace-nowrap text-sm text-[#334155]">
        {row.industry || "-"}
      </td>
      <td className="px-4 py-2 border-b whitespace-nowrap text-sm text-[#334155]">
        {formatDate(row.applyDate)}
      </td>
      <td
        className={`px-4 py-2 border-b whitespace-nowrap text-sm font-semibold ${
          getDDay(row.deadlineDate) === "-"
            ? "text-[#64748B]"
            : getDDay(row.deadlineDate).startsWith("D+")
              ? "text-[#94A3B8]"
              : getDDay(row.deadlineDate) === "D-Day" ||
                  (getDDay(row.deadlineDate).startsWith("D-") &&
                    parseInt(getDDay(row.deadlineDate).replace("D-", "")) <= 7)
                ? "text-[#EF4444]"
                : "text-[#64748B]"
        }`}
      >
        {getDDay(row.deadlineDate)}
      </td>
      <td className="px-4 py-2 border-b whitespace-nowrap">
        <span
          className={`inline-flex w-fit px-2 py-[2px] text-xs font-semibold rounded ${getStatusStyle(
            row.status,
          )}`}
        >
          {row.status || "-"}
        </span>
      </td>

      <td className="px-4 py-2 border-b whitespace-nowrap text-sm text-[#64748B]">
        {row.submitted ? "제출" : "미제출"}
      </td>

      <td className="px-4 py-2 border-b whitespace-nowrap">
        <div className="flex items-center gap-2 min-w-[120px]">
          <div className="w-[80px] h-[6px] bg-[#E5E7EB] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2563EB] rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <span className="text-[13px] text-[#64748B] whitespace-nowrap">
            {completedCount}/{totalCount}
          </span>
        </div>
      </td>

      <td className="px-4 py-2 border-b whitespace-nowrap text-sm text-[#64748B]">
        {row.documents?.length ? `${row.documents.length}건` : "없음"}
      </td>

      <td className="px-4 py-2 border-b text-sm text-[#64748B] max-w-[180px] truncate">
        {row.memo || "-"}
      </td>

      <td
        className="w-[56px] min-w-[56px] max-w-[56px] border-b sticky right-0 bg-white z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <ApplicationMenu
          row={row}
          onEdit={onEdit}
          onDelete={async () => {
            const ok = window.confirm(
              `${row.company} 항목을 삭제하시겠습니까?`,
            );
            if (!ok) return;

            await deleteApplications([row.id]);
            onDelete?.(row.id);

            setCheckedIds((prev: number[]) =>
              prev.filter((id) => id !== row.id),
            );
            if (focusedApplication?.id === row.id) {
              setFocusedApplication(null);
            }
            if (onChange) await onChange();
            alert("삭제되었습니다");
          }}
          onAddDocument={(row, title) => addDocument(row.id, title)}
        />
      </td>
    </tr>
  );
}
