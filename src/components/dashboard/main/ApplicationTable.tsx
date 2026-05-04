import { useState } from "react";
import { Icon } from "@iconify/react";
import ApplicationState from "./ApplicationState";
import { getStatusStyle } from "../../../utils/status";
import { useApplication } from "../../../context/ApplicationContext";

const getDDay = (deadline?: string) => {
  if (!deadline) return "-";

  const end = new Date(deadline);
  if (isNaN(end.getTime())) return "-";

  const today = new Date();
  const diff = Math.ceil(
    (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diff < 0) return "마감";
  if (diff === 0) return "D-Day";
  return `D-${diff}`;
};

export default function ApplicationTable({ onEdit, onCompanyClick }: any) {
  const { applications, deleteApplications } = useApplication();

  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<string | null>(null);

  const toggleCheck = (id: number) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };

  const handleDeleteSelected = () => {
    if (checkedIds.length === 0) {
      alert("삭제할 항목을 선택해주세요.");
      return;
    }

    const confirmDelete = window.confirm(
      `${checkedIds.length}개의 항목을 삭제하시겠습니까?`,
    );

    if (!confirmDelete) return;

    deleteApplications(checkedIds);
    setCheckedIds([]);

    alert("삭제되었습니다");
  };

  const handleEditSelected = () => {
    if (checkedIds.length !== 1) return;
    const target = applications.find((a) => a.id === checkedIds[0]);
    if (target && onEdit) onEdit(target);
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
      "체크리스트",
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
        <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${selectedRows
          .map(
            (row) => `
          <tr>
            <td>${escapeHtml(row.company)}</td>
            <td>${escapeHtml(row.jobTitle)}</td>
            <td>${escapeHtml(row.position)}</td>
            <td>${escapeHtml(row.industry)}</td>
            <td>${escapeHtml(row.deadlineDate)}</td>
            <td>${escapeHtml(getDDay(row.deadlineDate))}</td>
            <td>${escapeHtml(row.status)}</td>
            <td>${row.submitted ? "제출" : "미제출"}</td>
            <td>${row.checklistInComplete ? "미완료" : "완료"}</td>
            <td>${row.file ? "제출됨" : "없음"}</td>
            <td>${escapeHtml(row.memo)}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  `;
    const text = [
      headers.join("\t"),
      ...selectedRows.map((row) =>
        [
          row.company,
          row.jobTitle,
          row.position,
          row.industry,
          row.deadlineDate,
          getDDay(row.deadlineDate),
          row.status,
          row.submitted ? "제출" : "미제출",
          row.checklistInComplete ? "미완료" : "완료",
          row.file ? "제출됨" : "없음",
          row.memo || "",
        ].join("\t"),
      ),
    ].join("\n");

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([text], { type: "text/plain" }),
        }),
      ]);
      alert("복사가 완료되었습니다.");
    } catch (err) {
      alert("복사에 실패했습니다.");
    }
  };
  const toggleFilter = (type: string) => {
    setIsOpen((prev) => (prev === type ? null : type));
    setFilterType(type);
  };

  const getUniqueValues = (key: string) => {
    const values = applications.map((row: any) => row[key]).filter(Boolean);
    return [...new Set(values)];
  };

  const filteredRows = applications.filter((row: any) => {
    if (!filterType || !filterValue) return true;
    return row[filterType] === filterValue;
  });

  const EMPTY_COUNT = Math.max(0, 8 - filteredRows.length);

  return (
    <div className="bg-white rounded-xl">
      <div className="px-4 pt-[6px] pb-[6px]">
        <ApplicationState />
      </div>
      {checkedIds.length > 0 && (
        <div className="mx-4 mt-4 flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm border">
          <span className="text-sm text-gray-600">
            {checkedIds.length}개 선택됨
          </span>

          {checkedIds.length === 1 && (
            <button onClick={handleEditSelected}>편집</button>
          )}

          <button onClick={handleDeleteSelected}>삭제</button>
          <button onClick={handleCopySelected}>복사</button>
        </div>
      )}

      <div className="grid grid-cols-[48px_1fr_1.4fr_1fr_1fr_1fr_0.8fr_1fr_0.8fr_1fr_0.8fr_1fr] bg-[#F1F5F9] text-[13px] text-black font-[500] px-4 py-3">
        <span></span>

        {[
          ["company", "기업명"],
          ["jobTitle", "공고명"],
          ["position", "직무"],
          ["industry", "산업"],
          ["deadlineDate", "지원기한"],
          ["dday", "D-day"],
          ["status", "지원상태"],
          ["submitted", "제출"],
          ["checklistInComplete", "체크리스트"],
          ["documents", "서류"],
          ["notes", "메모"],
        ].map(([key, label], idx) => (
          <span key={key + idx} className="relative">
            <div className="flex items-center gap-1 cursor-pointer">
              {label}
              <button onClick={() => toggleFilter(key)}>
                <Icon icon="mdi:chevron-down" width={20} />
              </button>
            </div>

            {isOpen === key && (
              <div className="absolute top-6 left-0 bg-white border rounded shadow p-2 z-[999]">
                {getUniqueValues(key).map((value: any) => (
                  <div
                    key={value}
                    onClick={() => {
                      setFilterValue(value);
                      setFilterType(key);
                      setIsOpen(null);
                    }}
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  >
                    {value}
                  </div>
                ))}
                <div
                  onClick={() => {
                    setFilterValue(null);
                    setFilterType(null);
                    setIsOpen(null);
                  }}
                  className="px-2 py-1 text-gray-400 cursor-pointer"
                >
                  전체
                </div>
              </div>
            )}
          </span>
        ))}
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {filteredRows.map((row) => {
          const isChecked = checkedIds.includes(row.id);

          return (
            <div
              key={row.id}
              className="grid grid-cols-[48px_1fr_1.4fr_1fr_1fr_1fr_0.8fr_1fr_0.8fr_1fr_0.8fr_1fr] items-center px-4 py-3 text-[13px] border-b hover:bg-gray-50"
            >
              <label className="flex items-center justify-center cursor-pointer">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={isChecked}
                  onChange={() => toggleCheck(row.id)}
                />
                <div className="w-[15px] h-[15px] opacity-100 rounded-[4px] border-[1.5px] border-[#2563EB] flex items-center justify-center">
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

              <span
                className="cursor-pointer text-black font-medium text-[13px] hover:text-green-600"
                onClick={() => onCompanyClick(row)}
              >
                {row.company}
              </span>
              <span className="text-[13px] text-black font-regular">
                {row.jobTitle}
              </span>
              <span className="text-[13px] text-black font-medium">
                {row.position}
              </span>
              <span className="text-[13px] text-[#334155] font-regular">
                {row.industry}
              </span>
              <span className="text-[13px] text-[#334155] font-regular">
                {row.deadlineDate}
              </span>
              <span
                className={`text-[13px] font-semibold ${
                  getDDay(row.deadlineDate) !== "-" &&
                  getDDay(row.deadlineDate) !== "마감" &&
                  parseInt(getDDay(row.deadlineDate).replace("D-", "")) <= 7
                    ? "text-[#EF4444]"
                    : "text-[#64748B]"
                }`}
              >
                {getDDay(row.deadlineDate)}
              </span>

              <span
                className={`inline-flex w-fit px-2 py-[2px] text-[11px] rounded ${getStatusStyle(row.status)}`}
              >
                {row.status}
              </span>

              <span className="text-[13px] text-[#64748B] font-regular">
                {row.submitted ? "제출" : "미제출"}
              </span>
              <span className="text-[12px] text-[#64748B] font-regular">
                {row.checklistInComplete ? "미완료" : "완료"}
              </span>
              <span className="text-[13px] text-[#64748B] font-regular">
                {row.file ? "제출됨" : "없음"}
              </span>
              <span className="truncate text-[13px] text-[#64748B] font-regular">
                {row.memo || "-"}
              </span>

              <div className="flex gap-2">
                <button onClick={() => onEdit && onEdit(row)}>✏️</button>
                <button
                  onClick={() => {
                    const ok = window.confirm("이 항목을 삭제하시겠습니까?");
                    if (ok) {
                      deleteApplications([row.id]);
                      alert("삭제되었습니다");
                    }
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}

        {Array.from({ length: EMPTY_COUNT }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="grid grid-cols-[48px_1fr_1.4fr_1fr_1fr_1fr_0.8fr_1fr_0.8fr_1fr_0.8fr_1fr] px-4 py-3"
          >
            {Array(12)
              .fill(null)
              .map((_, idx) => (
                <span key={idx}>&nbsp;</span>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
