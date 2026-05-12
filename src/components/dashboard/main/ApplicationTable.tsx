import { useState } from "react";
import TableFilterDropdown from "./TableFilter";
import ApplicationMenu from "./ApplicationMenu";
import ApplicationState from "./ApplicationState";
import { getStatusStyle } from "../../../utils/status";
import { useApplication } from "../../../context/ApplicationContext";

const getDDay = (deadline?: string) => {
  if (!deadline) return "-";

  const end = new Date(deadline.replace("T", " "));
  if (isNaN(end.getTime())) return "-";

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diff = Math.ceil(
    (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diff < 0) return "마감";
  if (diff === 0) return "D-Day";

  return `D-${diff}`;
};

const formatDate = (date?: string) => {
  if (!date) return "-";
  const d = new Date(date);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
};

export default function ApplicationTable({
  onEdit,
  onCompanyClick,
  onChange,
  onDelete,
  focusedApplication,
  setFocusedApplication,
}: any) {
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string | null>(null);

  const { applications, deleteApplications } = useApplication();

  const toggleCheck = (id: number) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };

  const handleDeleteSelected = async () => {
    if (checkedIds.length === 0) {
      alert("삭제할 항목을 선택해주세요.");
      return;
    }

    const confirmDelete = window.confirm(
      `${checkedIds.length}개의 항목을 삭제하시겠습니까?`,
    );

    if (!confirmDelete) return;

    await deleteApplications(checkedIds);
    checkedIds.forEach((id) => {
      onDelete?.(id);
    });

    if (onChange) await onChange();
    setCheckedIds([]);
    alert("삭제되었습니다");
  };

  const handleCopySelected = async () => {
    const selectedRows = applications.filter((app) =>
      checkedIds.includes(app.id),
    );

    if (selectedRows.length === 0) {
      alert("복사할 항목을 선택해주세요.");
      return;
    }

    const headers = [
      "기업명",
      "공고명",
      "직무",
      "산업",
      "지원기한",
      "D-day",
      "상태",
      "제출",
      "할 일",
      "서류",
      "메모",
    ];

    const escapeHtml = (value: any) =>
      String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");

    const html = `
      <table border="1" style="border-collapse: collapse;">
        <thead>
          <tr>
            ${headers.map((h) => `<th>${h}</th>`).join("")}
          </tr>
        </thead>

        <tbody>
          ${selectedRows
            .map((row) => {
              const completedCount =
                row.todos?.filter((todo) => todo.completed).length || 0;
              const totalCount = row.todos?.length || 0;

              return `
                <tr>
                  <td>${escapeHtml(row.company)}</td>
                  <td>${escapeHtml(row.jobTitle)}</td>
                  <td>${escapeHtml(row.position)}</td>
                  <td>${escapeHtml(row.industry)}</td>
                  <td>${escapeHtml(row.applyDate)}</td>
                  <td>${escapeHtml(getDDay(row.deadlineDate))}</td>
                  <td>${escapeHtml(row.status)}</td>
                  <td>${row.submitted ? "제출" : "미제출"}</td>
                  <td>${completedCount}/${totalCount}</td>
                  <td>${row.file ? "제출됨" : "없음"}</td>
                  <td>${escapeHtml(row.memo)}</td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    `;

    const text = selectedRows
      .map((row) => {
        const completedCount =
          row.todos?.filter((todo) => todo.completed).length || 0;

        const totalCount = row.todos?.length || 0;

        return [
          row.company,
          row.jobTitle,
          row.position,
          row.industry,
          row.applyDate,
          getDDay(row.deadlineDate),
          row.status,
          row.submitted ? "제출" : "미제출",
          `${completedCount}/${totalCount}`,
          row.file ? "제출됨" : "없음",
          row.memo || "",
        ].join("\t");
      })
      .join("\n");

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], {
            type: "text/html",
          }),
          "text/plain": new Blob([text], {
            type: "text/plain",
          }),
        }),
      ]);

      alert("복사가 완료되었습니다.");
    } catch (err) {
      alert("복사에 실패했습니다.");
    }
  };

  const badgeColors = [
    "bg-red-100 text-red-500",
    "bg-orange-100 text-orange-500",
    "bg-yellow-100 text-yellow-600",
    "bg-green-100 text-green-500",
    "bg-blue-100 text-blue-500",
    "bg-purple-100 text-purple-500",
    "bg-pink-100 text-pink-500",
    "bg-indigo-100 text-indigo-500",
    "bg-teal-100 text-teal-500",
    "bg-cyan-100 text-cyan-500",
  ];

  const getPositionColor = (position: string) => {
    let hash = 0;

    for (let i = 0; i < position.length; i++) {
      hash = position.charCodeAt(i) + ((hash << 5) - hash);
    }

    return badgeColors[Math.abs(hash) % badgeColors.length];
  };

  const getUniqueValues = (key: string) => {
    const values = applications.map((row: any) => row[key]).filter(Boolean);

    return [...new Set(values)];
  };

  const filteredRows = applications.filter((row: any) => {
    if (!filterType || !filterValue) return true;

    const value = row[filterType];

    if (value == null) return true;

    return String(value).includes(String(filterValue));
  });

  const EMPTY_COUNT = Math.max(0, 8 - filteredRows.length);

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="px-4 pt-[6px] pb-[6px] flex items-center justify-between">
        <ApplicationState />
        {checkedIds.length > 0 && (
          <div className="mx-4 flex items-center gap-2 rounded-xl bg-white px-4">
            <span className="text-sm text-gray-600">
              {checkedIds.length}개 선택됨
            </span>

            <button onClick={handleDeleteSelected} className="text-sm">
              삭제
            </button>

            <button onClick={handleCopySelected} className="text-sm">
              복사
            </button>
          </div>
        )}
      </div>

      <div className="w-full overflow-hidden">
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="min-w-max w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-30 bg-[#F1F5F9] text-sm text-black font-medium">
              <tr>
                <th className="w-[48px] px-4 py-3 bg-[#F1F5F9] sticky left-0 z-20">
                  <label className="flex items-center justify-center cursor-pointer p-2 -m-2">
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={
                        filteredRows.length > 0 &&
                        checkedIds.length === filteredRows.length
                      }
                      onChange={() => {
                        const isAllChecked =
                          checkedIds.length === filteredRows.length;

                        if (isAllChecked) {
                          setCheckedIds([]);
                        } else {
                          setCheckedIds(filteredRows.map((row) => row.id));
                        }
                      }}
                    />

                    <div className="w-[15px] h-[15px] rounded-[4px] border-[1.5px] border-[#2563EB] flex items-center justify-center">
                      {filteredRows.length > 0 &&
                        checkedIds.length === filteredRows.length && (
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
                </th>
                {[
                  ["company", "기업명"],
                  ["jobTitle", "공고명"],
                  ["position", "직무"],
                  ["industry", "산업"],
                  ["applyDate", "지원기한"],
                  ["dday", "D-day"],
                  ["status", "지원상태"],
                  ["submitted", "제출"],
                  ["checklistInComplete", "할 일"],
                  ["documents", "서류"],
                  ["notes", "메모"],
                ].map(([key, label], idx) => (
                  <th
                    key={key + idx}
                    className="px-4 py-3 text-left whitespace-nowrap relative bg-[#F1F5F9]"
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      <TableFilterDropdown
                        columnKey={key}
                        values={getUniqueValues(key)}
                        onSelect={(value) => {
                          setFilterValue(value);
                          setFilterType(value ? key : null);
                        }}
                      />
                    </div>
                  </th>
                ))}
                <th className="w-[56px] min-w-[56px] max-w-[56px] sticky right-0 bg-[#F1F5F9] z-20"></th>
              </tr>
            </thead>
            <tbody className="max-h-[400px] overflow-y-auto">
              {filteredRows.map((row) => {
                const isChecked = checkedIds.includes(row.id);
                const completedCount =
                  row.todos?.filter((todo) => todo.completed).length || 0;
                const totalCount = row.todos?.length || 0;
                const progress =
                  totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

                return (
                  <tr
                    key={row.id}
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
                    <td className="px-4 py-2 border-b whitespace-nowrap text-sm text-black font-regular">
                      {row.jobTitle}
                    </td>

                    <td className="px-4 py-2 border-b whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPositionColor(row.position)}`}
                      >
                        {row.position}
                      </span>
                    </td>

                    <td className="px-4 py-2 border-b whitespace-nowrap text-sm text-[#334155] font-regular">
                      {row.industry}
                    </td>

                    <td className="px-4 py-2 border-b whitespace-nowrap text-sm text-[#334155] font-regular">
                      {formatDate(row.applyDate)}
                    </td>
                    <td
                      className={`px-4 py-2 border-b whitespace-nowrap text-sm font-semibold ${
                        getDDay(row.deadlineDate) !== "-" &&
                        getDDay(row.deadlineDate) !== "마감" &&
                        parseInt(getDDay(row.deadlineDate).replace("D-", "")) <=
                          7
                          ? "text-[#EF4444]"
                          : "text-[#64748B]"
                      }`}
                    >
                      {getDDay(row.deadlineDate)}
                    </td>

                    <td className="px-4 py-2 border-b whitespace-nowrap">
                      <span
                        className={`inline-flex w-fit px-2 py-[2px] text-[11px] rounded ${getStatusStyle(
                          row.status,
                        )}`}
                      >
                        {row.status}
                      </span>
                    </td>

                    <td className="px-4 py-2 border-b whitespace-nowrap text-sm text-[#64748B] font-regular">
                      {row.submitted ? "제출" : "미제출"}
                    </td>

                    <td className="px-4 py-2 border-b whitespace-nowrap">
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <div className="w-[80px] h-[6px] bg-[#E5E7EB] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#2563EB] rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                        <span className="text-[13px] text-[#64748B] whitespace-nowrap">
                          {completedCount}/{totalCount}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-2 border-b whitespace-nowrap text-sm text-[#64748B] font-regular">
                      {row.file ? "제출됨" : "없음"}
                    </td>

                    <td className="px-4 py-2 border-b text-sm text-[#64748B] font-regular max-w-[180px] truncate">
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
                          setCheckedIds((prev) =>
                            prev.filter((id) => id !== row.id),
                          );
                          if (focusedApplication?.id === row.id) {
                            setFocusedApplication(null);
                          }
                          if (onChange) await onChange();

                          alert("삭제되었습니다");
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
              {Array.from({ length: EMPTY_COUNT }).map((_, i) => (
                <tr key={`empty-${i}`} className="h-[67px]">
                  {Array(13)
                    .fill(null)
                    .map((_, idx) => (
                      <td key={idx}>&nbsp;</td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
