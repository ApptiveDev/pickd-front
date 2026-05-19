import { useState } from "react";
import TableFilter from "./TableFilter";
import ActiveFilter from "./ActiveFilter";
import ApplicationRow from "./ApplicationRow";
import ApplicationState from "../ApplicationState";
import { getDDay } from "../../../../utils/date";
import { useApplication } from "../../../../context/ApplicationContext";

export default function ApplicationTable({
  onEdit,
  onCompanyClick,
  onChange,
  onDelete,
  focusedApplication,
  setFocusedApplication,
}: any) {
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [showActiveFilters, setShowActiveFilters] = useState(false);
  const [filters, setFilters] = useState<{ key: string; value: string }[]>([]);
  const [sort, setSort] = useState<{
    key: string;
    order: "asc" | "desc";
  } | null>(null);

  const { applications, deleteApplications } = useApplication();
  const { addDocument } = useApplication();
  console.log(applications.map((a) => a.status));

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
                  <td>${row.documents?.length ? `${row.documents.length}건` : "없음"}</td>
                  <td>${escapeHtml(row.memo)}</td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    `;

    const text = [
      headers.join("\t"),

      ...selectedRows.map((row) => {
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
          row.documents?.length ? `${row.documents.length}건` : "없음",
          row.memo || "",
        ].join("\t");
      }),
    ].join("\n");
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

  const getUniqueValues = (key: string) => {
    const values = applications.map((row: any) => row[key]).filter(Boolean);

    return [...new Set(values)];
  };

  const groupedFilters = filters.reduce(
    (acc, filter) => {
      if (!acc[filter.key]) {
        acc[filter.key] = [];
      }

      acc[filter.key].push(filter.value);

      return acc;
    },
    {} as Record<string, string[]>,
  );

  const filteredRows = applications.filter((row) => {
    return Object.entries(groupedFilters).every(([key, values]) => {
      const rowValue = (row as any)[key];

      if (rowValue == null) return false;

      return values.some((value) => String(rowValue).includes(String(value)));
    });
  });

  const sortedRows = [...filteredRows];

  if (sort) {
    sortedRows.sort((a, b) => {
      let aValue = 0;
      let bValue = 0;

      if (sort.key === "applyDate") {
        aValue = a.applyDate ? new Date(a.applyDate).getTime() : 0;
        bValue = b.applyDate ? new Date(b.applyDate).getTime() : 0;
      }

      if (sort.key === "dday") {
        aValue = a.deadlineDate ? new Date(a.deadlineDate).getTime() : 0;
        bValue = b.deadlineDate ? new Date(b.deadlineDate).getTime() : 0;
      }

      if (sort.key === "checklistInComplete") {
        aValue = a.todos?.filter((t) => !t.completed).length || 0;
        bValue = b.todos?.filter((t) => !t.completed).length || 0;
      }
      return sort.order === "asc" ? aValue - bValue : bValue - aValue;
    });
  }

  const handleSort = (key: string, order: "asc" | "desc") => {
    setSort({ key, order });
  };

  const EMPTY_COUNT = Math.max(0, 8 - sortedRows.length);

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="px-4 pt-[6px] pb-[6px] flex items-center justify-between">
        <ApplicationState />
        <div className="flex items-center gap-2">
          {checkedIds.length > 0 && (
            <div className="flex items-center rounded-xl bg-white px-4">
              <span className="text-sm text-[#64748B] px-1">
                {checkedIds.length}개 선택됨
              </span>
              <button
                onClick={handleDeleteSelected}
                className="text-sm text-[#334155] px-3 py-1 hover:bg-gray-50"
              >
                삭제
              </button>
              <button
                onClick={handleCopySelected}
                className="text-sm text-[#334155] px-3 py-1 hover:bg-gray-50"
              >
                복사
              </button>
            </div>
          )}
          <ActiveFilter
            show={showActiveFilters}
            setShow={setShowActiveFilters}
            filters={filters}
            setFilters={setFilters}
            sort={sort}
            setSort={setSort}
            groupedFilters={groupedFilters}
          />
        </div>
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
                          setCheckedIds(sortedRows.map((row) => row.id));
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

                      {["applyDate", "dday", "checklistInComplete"].includes(
                        key,
                      ) ? (
                        <TableFilter
                          mode="sort"
                          columnKey={key}
                          setFilters={setFilters}
                          handleSort={handleSort}
                        />
                      ) : !["documents", "notes"].includes(key) ? (
                        <TableFilter
                          mode="filter"
                          columnKey={key}
                          values={getUniqueValues(key)}
                          setFilters={setFilters}
                        />
                      ) : null}
                    </div>
                  </th>
                ))}
                <th className="w-[56px] min-w-[56px] max-w-[56px] sticky right-0 bg-[#F1F5F9] z-20"></th>
              </tr>
            </thead>
            <tbody className="max-h-[400px] overflow-y-auto">
              {sortedRows.map((row) => (
                <ApplicationRow
                  key={row.id}
                  row={row}
                  checkedIds={checkedIds}
                  toggleCheck={toggleCheck}
                  onCompanyClick={onCompanyClick}
                  setFocusedApplication={setFocusedApplication}
                  focusedApplication={focusedApplication}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onChange={onChange}
                  deleteApplications={deleteApplications}
                  addDocument={addDocument}
                  setCheckedIds={setCheckedIds}
                />
              ))}
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
