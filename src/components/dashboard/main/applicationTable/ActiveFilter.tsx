import { Icon } from "@iconify/react";
import { useEffect, useRef } from "react";

interface Props {
  show: boolean;
  setShow: (value: boolean) => void;

  filters: { key: string; value: string }[];

  sort: { key: string; order: "asc" | "desc" } | null;
  setFilters: React.Dispatch<
    React.SetStateAction<{ key: string; value: string }[]>
  >;
  setSort: React.Dispatch<
    React.SetStateAction<{ key: string; order: "asc" | "desc" } | null>
  >;
}

const filterLabelMap: Record<string, string> = {
  company: "기업명",
  jobTitle: "공고명",
  position: "직무",
  industry: "산업",
  status: "지원상태",
  submitted: "제출",
  applyDate: "지원기한",
  dday: "D-day",
  checklistInComplete: "할 일",
};

export default function ActiveFilter({
  show,
  setShow,
  filters,
  sort,
  setFilters,
  setSort,
}: Props) {
  const filterRef = useRef<HTMLDivElement | null>(null);

  const removeFilter = (key: string, value: string) => {
    setFilters((prev) =>
      prev.filter((f) => !(f.key === key && f.value === value)),
    );
  };

  const removeSort = () => {
    setSort(null);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setShow(!show)}
        className="flex items-center gap-1 px-3 py-2 rounded-xl border border-[#E2E8F0] hover:bg-gray-50"
      >
        <Icon
          icon="mdi:filter-variant"
          className="text-[18px] text-[#64748B]"
        />
        <span className="text-sm text-[#475569]"></span>
      </button>

      {show && (
        <div
          ref={filterRef}
          className="absolute top-12 right-0 w-[280px] bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-3 z-[9999]"
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-sm font-[600] text-[#334155]">
              적용된 필터
            </span>

            <button
              onClick={() => setShow(false)}
              className="text-[#94A3B8] hover:text-[#334155]"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {filters.map((filter, idx) => (
              <div
                key={`${filter.key}-${filter.value}-${idx}`}
                className="flex items-center justify-between gap-3 bg-[#F8FAFC] rounded-xl px-3 py-2"
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] text-[#94A3B8]">
                    {filterLabelMap[filter.key] || filter.key}
                  </span>

                  <span className="text-sm font-[500] text-[#334155] whitespace-nowrap">
                    {filter.value}
                  </span>
                </div>

                <button
                  onClick={() => removeFilter(filter.key, filter.value)}
                  className="shrink-0 text-[#64748B] hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}

            {sort && (
              <div className="flex items-center justify-between gap-3 bg-[#F8FAFC] rounded-xl px-3 py-2">
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#94A3B8]">정렬</span>

                  <span className="text-sm font-[500] text-[#334155]">
                    {filterLabelMap[sort.key] || sort.key} (
                    {sort.order === "asc" ? "오름차순" : "내림차순"})
                  </span>
                </div>

                <button
                  onClick={removeSort}
                  className="shrink-0 text-[#64748B] hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            )}

            {filters.length === 0 && !sort && (
              <div className="text-sm text-[#94A3B8] text-center py-4">
                적용된 필터가 없습니다.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
