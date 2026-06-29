import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Columns3,
  FileText,
  Folder,
  Grid2X2,
  List,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Clipboard,
  X,
} from "lucide-react";

import ExperienceHeader from "../components/experience/ExperienceHeader";
import ExperienceTable, {
  EXPERIENCE_TABLE_COLUMNS,
  getExperienceColumnValue,
  type ExperienceColumnFilter,
  type ExperienceColumnKey,
} from "../components/experience/ExperienceTable";
import ExperienceEntryModal from "../components/experience/modal/ExperienceEntryModal";
import ExperienceDetailModal from "../components/experience/modal/ExperienceDetailModal";
import BasicInfoPanel from "../components/experience/BasicInfoPanel";
import FilesPanel from "../components/experience/FilesPanel";
import ExperiencePasteView from "../components/experience/ExperiencePasteView";
import { useClickOutside } from "../hooks/useClickOutside";

import { MOCK_EXPERIENCES } from "../constants/experience/mockExperiences";
import {
  EXPERIENCE_PRESETS,
  EXPERIENCE_TYPES,
  type ExperienceType,
} from "../constants/experience/experiencePresets";

import type { ExperienceItem } from "../types/experience";

const FILTERS = ["전체", "고정됨", ...EXPERIENCE_TYPES];
const LS_EXPERIENCES = "pickd.experiences.items";
const LS_VISIBLE_COLUMNS = "pickd.experience.visibleColumns.v3";

type ActiveTab = "db" | "basic-info" | "files";
type ViewMode = "list" | "card" | "paste";

const EXTRACT_MOCK_CANDIDATES: Array<{
  id: string;
  type: ExperienceType;
  name: string;
  summary: string;
  values: Record<string, string>;
  keywords: string[];
}> = [
  {
    id: "ec1",
    type: "프로젝트",
    name: "캡스톤 디자인 프로젝트",
    summary: "2024.09 ~ 2025.01 · PM / 기획",
    values: {
      period: "2024.09 ~ 2025.01",
      role: "PM / 기획",
      org: "학교 팀 프로젝트",
    },
    keywords: ["기획력", "문제해결"],
  },
  {
    id: "ec2",
    type: "인턴",
    name: "여름 프론트엔드 인턴십",
    summary: "2025.07 ~ 2025.08 · 프론트엔드",
    values: {
      company: "픽디랩",
      dept: "서비스 개발팀",
      position: "프론트엔드",
      period: "2025.07 ~ 2025.08",
    },
    keywords: ["실행력", "협업"],
  },
  {
    id: "ec3",
    type: "대외활동",
    name: "청년 창업 서포터즈",
    summary: "2024.03 ~ 2024.06 · 콘텐츠 기획",
    values: {
      org: "청년 창업 재단",
      period: "2024.03 ~ 2024.06",
      role: "콘텐츠 기획",
    },
    keywords: ["소통", "기획력"],
  },
];

export default function ExperienceScreen() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>(() =>
    loadExperiences(),
  );
  const [selectedItem, setSelectedItem] = useState<ExperienceItem | null>(null);
  const [entryOpen, setEntryOpen] = useState(false);
  const [extractOpen, setExtractOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("전체");
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("db");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [columnPanelOpen, setColumnPanelOpen] = useState(false);
  const [toastText, setToastText] = useState("");
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<ExperienceColumnKey[]>(
    () => loadVisibleColumns(),
  );
  const [columnFilters, setColumnFilters] = useState<
    Partial<Record<ExperienceColumnKey, ExperienceColumnFilter>>
  >({});
  const [sortState, setSortState] = useState<{
    key: ExperienceColumnKey;
    dir: "asc" | "desc";
  } | null>(null);
  const columnPanelRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(
    [columnPanelRef],
    () => setColumnPanelOpen(false),
    columnPanelOpen,
  );

  useEffect(() => {
    try {
      localStorage.setItem(LS_EXPERIENCES, JSON.stringify(experiences));
    } catch {
      // ignore
    }
  }, [experiences]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_VISIBLE_COLUMNS, JSON.stringify(visibleColumns));
    } catch {
      // ignore
    }
  }, [visibleColumns]);

  const baseFilteredExperiences = useMemo(() => {
    return experiences.filter((item) => {
      const searchValue = searchText.trim().toLowerCase();
      const orgText = getOrgText(item).toLowerCase();

      const matchesSearch =
        searchValue === "" ||
        item.name.toLowerCase().includes(searchValue) ||
        item.type.toLowerCase().includes(searchValue) ||
        orgText.includes(searchValue) ||
        item.keywords.some((keyword) =>
          keyword.toLowerCase().includes(searchValue),
        );

      const matchesFilter =
        selectedFilter === "전체" ||
        (selectedFilter === "고정됨" && Boolean(item.pinned)) ||
        item.type === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [experiences, searchText, selectedFilter]);

  const filteredExperiences = useMemo(() => {
    const filtered = baseFilteredExperiences.filter((item) => {
      for (const [key, filter] of Object.entries(columnFilters) as [
        ExperienceColumnKey,
        ExperienceColumnFilter,
      ][]) {
        if (!filter) continue;

        const value = getExperienceColumnValue(item, key);
        if (filter.kind === "select") {
          if (filter.values.length === 0) continue;
          if (Array.isArray(value)) {
            if (!value.some((entry) => filter.values.includes(entry)))
              return false;
          } else if (!filter.values.includes(String(value))) {
            return false;
          }
        } else {
          const query = filter.q.trim().toLowerCase();
          if (!query) continue;
          if (Array.isArray(value)) {
            if (!value.some((entry) => entry.toLowerCase().includes(query)))
              return false;
          } else if (!String(value).toLowerCase().includes(query)) {
            return false;
          }
        }
      }

      return true;
    });

    if (!sortState) return filtered;

    return [...filtered].sort((a, b) => {
      const aValue = getExperienceColumnValue(a, sortState.key);
      const bValue = getExperienceColumnValue(b, sortState.key);
      const aText = Array.isArray(aValue) ? aValue.join(",") : String(aValue);
      const bText = Array.isArray(bValue) ? bValue.join(",") : String(bValue);
      const compare = aText.localeCompare(bText, "ko", { numeric: true });
      return sortState.dir === "asc" ? compare : -compare;
    });
  }, [baseFilteredExperiences, columnFilters, sortState]);

  const filterOptions = useMemo(() => {
    const options: Partial<Record<ExperienceColumnKey, string[]>> = {};

    EXPERIENCE_TABLE_COLUMNS.forEach((column) => {
      const set = new Set<string>();
      experiences.forEach((item) => {
        const value = getExperienceColumnValue(item, column.key);
        if (Array.isArray(value))
          value.forEach((entry) => entry && set.add(entry));
        else if (value) set.add(String(value));
      });
      options[column.key] = Array.from(set).sort((a, b) =>
        a.localeCompare(b, "ko", { numeric: true }),
      );
    });

    return options;
  }, [experiences]);

  const activeFilterCount = (
    Object.values(columnFilters) as ExperienceColumnFilter[]
  ).filter((filter) => {
    if (!filter) return false;
    return filter.kind === "text"
      ? Boolean(filter.q.trim())
      : filter.values.length > 0;
  }).length;

  const createNewExperience = (
    type: ExperienceType = "프로젝트",
    patch?: Partial<ExperienceItem>,
  ) => {
    const preset = EXPERIENCE_PRESETS[type];
    const fields = preset.topFields.reduce<Record<string, string>>(
      (acc, field) => {
        acc[field.key] = "";
        return acc;
      },
      {},
    );

    const newItem: ExperienceItem = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      type,
      name: patch?.name ?? "새 경험",
      org: "",
      period: "",
      role: "",
      competencies: [],
      keywords: [],
      status: "작성중",
      missing: [],
      linkedExperienceIds: [],
      important: false,
      importance: "보통",
      pinned: false,
      customTopFields: [],
      hiddenFieldKeys: [],
      topFieldOrder: undefined,
      fieldLabels: {},
      updatedAt: "방금 전",
      ...patch,
      fields: {
        ...fields,
        ...(patch?.fields ?? {}),
      },
    };

    setExperiences((prev) => [newItem, ...prev]);
    setSelectedItem(newItem);
    setEntryOpen(false);
    setActiveTab("db");
    return newItem;
  };

  const updateExperience = (updatedItem: ExperienceItem) => {
    const normalizedItem = {
      ...updatedItem,
      updatedAt: "방금 전",
    };

    setSelectedItem(normalizedItem);
    setExperiences((prev) =>
      prev.map((experience) =>
        experience.id === normalizedItem.id ? normalizedItem : experience,
      ),
    );
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const toggleSelectAll = (ids: number[]) => {
    setSelectedIds((prev) => {
      const allChecked = ids.length > 0 && ids.every((id) => prev.includes(id));
      if (allChecked) return prev.filter((id) => !ids.includes(id));
      return [...new Set([...prev, ...ids])];
    });
  };

  const toggleImportant = (id: number) => {
    setExperiences((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextImportant = !(item.important || item.importance === "높음");
        return {
          ...item,
          important: nextImportant,
          importance: nextImportant ? "높음" : "보통",
          updatedAt: "방금 전",
        };
      }),
    );
  };

  const togglePin = (id: number) => {
    setExperiences((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              pinned: !item.pinned,
              updatedAt: "방금 전",
            }
          : item,
      ),
    );
  };

  const setSelectFilter = (key: ExperienceColumnKey, values: string[]) => {
    setColumnFilters((prev) => {
      const next = { ...prev };
      if (values.length === 0) delete next[key];
      else next[key] = { kind: "select", values };
      return next;
    });
  };

  const setTextFilter = (key: ExperienceColumnKey, q: string) => {
    setColumnFilters((prev) => {
      const next = { ...prev };
      if (!q.trim()) delete next[key];
      else next[key] = { kind: "text", q };
      return next;
    });
  };

  const toggleSort = (key: ExperienceColumnKey) => {
    setSortState((prev) => {
      if (!prev || prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  };

  const toggleVisibleColumn = (key: ExperienceColumnKey) => {
    setVisibleColumns((prev) => {
      if (prev.includes(key))
        return prev.filter((columnKey) => columnKey !== key);
      return [...prev, key];
    });
  };

  const resetColumns = () => {
    setVisibleColumns(
      EXPERIENCE_TABLE_COLUMNS.filter((column) => column.defaultVisible).map(
        (column) => column.key,
      ),
    );
    try {
      localStorage.removeItem("pickd.experience.colWidths.v3");
      localStorage.removeItem("pickd.experience.columnOrder.v3");
      localStorage.removeItem(LS_VISIBLE_COLUMNS);
    } catch {
      // ignore
    }
  };

  const copyText = async (text: string) => {
    if (!text.trim()) return;
    await navigator.clipboard?.writeText(text);
    showToast("복사되었습니다.");
  };

  const showToast = (message: string) => {
    setToastText(message);
    window.setTimeout(() => setToastText(""), 1400);
  };

  const exportItemsToCsv = (
    items: ExperienceItem[],
    filename: string,
    toastMessage: string,
  ) => {
    const headers = [
      "유형",
      "항목명",
      "기관/소속",
      "기간",
      "주요 키워드",
      "중요도",
      "관리 상태",
      "최근 수정",
      "본문",
    ];

    const rows = items.map((item) => [
      item.type,
      item.name,
      getOrgText(item),
      getPeriodText(item),
      item.keywords.join(", "),
      item.importance ?? (item.important ? "높음" : "보통"),
      item.status,
      item.updatedAt ?? "",
      item.fields.__body ?? "",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
    showToast(toastMessage);
  };

  const exportExcel = () => {
    exportItemsToCsv(
      filteredExperiences,
      "experience-export.csv",
      "Excel에서 열 수 있는 CSV 파일로 내보냈습니다.",
    );
  };

  const exportSelectedItems = () => {
    const selectedItems = experiences.filter((item) =>
      selectedIds.includes(item.id),
    );

    if (selectedItems.length === 0) return;

    exportItemsToCsv(
      selectedItems,
      "experience-selected-export.csv",
      "선택 항목을 Excel에서 열 수 있는 CSV 파일로 내보냈습니다.",
    );
  };

  const confirmBulkDelete = () => {
    setExperiences((prev) =>
      prev.filter((item) => !selectedIds.includes(item.id)),
    );
    setSelectedIds([]);
    setBulkDeleteConfirmOpen(false);
    showToast("선택 항목이 삭제되었습니다.");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-[150px] pt-[70px]">
      <div className="mx-auto max-w-[1780px]">
        <ExperienceHeader
          onOpenPaste={() => {
            setActiveTab("db");
            setViewMode("paste");
          }}
          onExtract={() => {
            setActiveTab("db");
            setExtractOpen(true);
          }}
          onExportExcel={exportExcel}
        />

        <div className="mt-[22px] flex w-fit items-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white p-1 shadow-sm">
          <TabButton
            active={activeTab === "db"}
            onClick={() => setActiveTab("db")}
            icon={<List size={16} />}
          >
            경험·스펙 DB
          </TabButton>
          <TabButton
            active={activeTab === "basic-info"}
            onClick={() => setActiveTab("basic-info")}
            icon={<FileText size={16} />}
          >
            기본정보
          </TabButton>
          <TabButton
            active={activeTab === "files"}
            onClick={() => setActiveTab("files")}
            icon={<Folder size={16} />}
          >
            파일함
          </TabButton>
        </div>

        {activeTab === "db" && (
          <>
            <div className="mt-[26px] flex items-center justify-between">
              <button
                onClick={() => setEntryOpen(true)}
                className="inline-flex h-[38px] items-center gap-2 rounded-[10px] bg-[#3B78D8] px-4 text-[15px] font-[700] text-white shadow-sm transition-colors hover:bg-[#2563EB]"
              >
                <Plus size={18} strokeWidth={2.3} />
                경험 추가
              </button>

              <div className="flex items-center gap-3">
                <div className="flex h-[34px] w-[210px] items-center gap-2 rounded-[10px] border border-[#E2E8F0] bg-white px-3">
                  <Search size={16} className="text-[#64748B]" />
                  <input
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder="항목명 / 기관 / 키워드 검색"
                    className="w-full bg-transparent text-[15px] font-[500] text-[#0F172A] outline-none placeholder:text-[#64748B]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setColumnFilters({});
                    setSortState(null);
                  }}
                  className={`relative flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-[#E2E8F0] bg-white transition-colors hover:bg-[#F8FAFC] ${activeFilterCount ? "text-[#2563EB]" : "text-[#64748B]"}`}
                  title="컬럼 필터 초기화"
                >
                  <SlidersHorizontal size={17} />
                  {activeFilterCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2563EB] px-1 text-[10px] font-[800] text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <div ref={columnPanelRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setColumnPanelOpen((prev) => !prev)}
                    className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-[#E2E8F0] bg-white text-[#64748B] transition-colors hover:bg-[#F8FAFC]"
                    title="컬럼 표시"
                  >
                    <Columns3 size={17} />
                  </button>

                  {columnPanelOpen && (
                    <ColumnPanel
                      visibleColumns={visibleColumns}
                      onToggleColumn={toggleVisibleColumn}
                      onReset={resetColumns}
                      onClose={() => setColumnPanelOpen(false)}
                    />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-[#E2E8F0] bg-white transition-colors hover:bg-[#F8FAFC] ${viewMode === "list" ? "text-[#0F172A]" : "text-[#94A3B8]"}`}
                  >
                    <List size={18} />
                  </button>

                  <button
                    onClick={() => setViewMode("card")}
                    className={`flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-[#E2E8F0] bg-white transition-colors hover:bg-[#F8FAFC] ${viewMode === "card" ? "text-[#0F172A]" : "text-[#94A3B8]"}`}
                  >
                    <Grid2X2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-[14px] flex flex-wrap items-center gap-2">
              {FILTERS.map((filter) => {
                const active =
                  selectedFilter === filter && viewMode !== "paste";
                return (
                  <button
                    key={filter}
                    onClick={() => {
                      setSelectedFilter(filter);
                      if (viewMode === "paste") setViewMode("list");
                    }}
                    className={`h-[32px] rounded-[10px] px-3 text-[14px] font-[500] transition-colors ${
                      active
                        ? "bg-[#EFF6FF] text-[#2563EB]"
                        : "text-[#64748B] hover:bg-white"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() =>
                  setViewMode((prev) => (prev === "paste" ? "list" : "paste"))
                }
                className={`ml-auto inline-flex h-[32px] items-center gap-2 rounded-[10px] border px-2 text-[13px] font-[800] transition-colors ${
                  viewMode === "paste"
                    ? "border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB]"
                    : "border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]"
                }`}
              >
                <Clipboard size={17} />
              </button>
            </div>

            {selectedIds.length > 0 && viewMode !== "paste" && (
              <div className="mt-4 flex items-center justify-between rounded-[16px] border border-[#D8E4F5] bg-[#F8FBFF] px-5 py-2">
                <div className="flex items-center gap-4 text-[15px] font-[700]">
                  <span className="text-[#2563EB]">
                    {selectedIds.length}개 선택됨
                  </span>

                  <span className="h-5 w-px bg-[#D8E4F5]" />

                  <button
                    type="button"
                    onClick={() => setBulkDeleteConfirmOpen(true)}
                    className="text-[#EF4444] transition-colors hover:text-[#DC2626]"
                  >
                    삭제
                  </button>

                  <button
                    type="button"
                    onClick={exportSelectedItems}
                    className="text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
                  >
                    내보내기
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-[#EFF6FF] hover:text-[#64748B]"
                  title="선택 해제"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {viewMode === "paste" ? (
              <ExperiencePasteView
                items={baseFilteredExperiences}
                onCopy={copyText}
                onOpenItem={(item) => setSelectedItem(item)}
                onTogglePin={togglePin}
              />
            ) : viewMode === "list" ? (
              <ExperienceTable
                items={filteredExperiences}
                onRowClick={(item) => setSelectedItem(item)}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onToggleSelectAll={toggleSelectAll}
                onToggleImportant={toggleImportant}
                onTogglePin={togglePin}
                visibleColumns={visibleColumns}
                columnFilters={columnFilters}
                filterOptions={filterOptions}
                onSetSelectFilter={setSelectFilter}
                onSetTextFilter={setTextFilter}
                sortState={sortState}
                onToggleSort={toggleSort}
              />
            ) : (
              <ExperienceCardGrid
                items={filteredExperiences}
                onOpen={(item) => setSelectedItem(item)}
                onToggleImportant={toggleImportant}
                onTogglePin={togglePin}
              />
            )}
          </>
        )}

        {activeTab === "basic-info" && (
          <div className="mt-[26px]">
            <BasicInfoPanel />
          </div>
        )}

        {activeTab === "files" && (
          <div className="mt-[26px]">
            <FilesPanel />
          </div>
        )}

        <ExperienceEntryModal
          open={entryOpen}
          onClose={() => setEntryOpen(false)}
          onDirectInput={() => createNewExperience()}
          onImport={() => {
            setEntryOpen(false);
            setExtractOpen(true);
          }}
        />

        <ExtractExperienceModal
          open={extractOpen}
          onClose={() => setExtractOpen(false)}
          onCreate={(candidateIds) => {
            candidateIds.forEach((id) => {
              const candidate = EXTRACT_MOCK_CANDIDATES.find(
                (item) => item.id === id,
              );
              if (!candidate) return;
              createNewExperience(candidate.type, {
                name: candidate.name,
                keywords: candidate.keywords,
                pinned: true,
                status: "작성중",
                hasUnansweredAiQuestion: true,
                fields: {
                  ...candidate.values,
                  __body: `${candidate.name} 경험을 자소서에서 추출했습니다. 구체적인 역할, 과정, 결과를 이어서 정리해 주세요.`,
                },
              });
            });
            setExtractOpen(false);
            showToast("자소서에서 경험 후보를 추가했습니다.");
          }}
        />

        <ExperienceDetailModal
          open={!!selectedItem}
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onChange={updateExperience}
          onCopyToast={() => showToast("복사되었습니다.")}
        />

        {bulkDeleteConfirmOpen && (
          <DeleteConfirmModal
            title="정말 삭제하시겠어요?"
            description={`${selectedIds.length}개의 경험을 삭제하면 되돌릴 수 없어요.`}
            onCancel={() => setBulkDeleteConfirmOpen(false)}
            onConfirm={confirmBulkDelete}
          />
        )}

        {toastText && (
          <div className="fixed bottom-8 left-1/2 z-[90] -translate-x-1/2 rounded-full bg-[#0F172A] px-5 py-3 text-[14px] font-[800] text-white shadow-[0_14px_30px_rgba(15,23,42,0.22)]">
            {toastText}
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-9 items-center gap-2 rounded-xl px-4 text-[14px] font-[800] transition ${
        active
          ? "bg-[#EFF6FF] text-[#2563EB]"
          : "text-[#64748B] hover:bg-[#F8FAFC]"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function ColumnPanel({
  visibleColumns,
  onToggleColumn,
  onReset,
  onClose,
}: {
  visibleColumns: ExperienceColumnKey[];
  onToggleColumn: (key: ExperienceColumnKey) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute right-0 top-10 z-40 w-[230px] rounded-[12px] border border-[#E2E8F0] bg-white p-2 shadow-[0_14px_34px_rgba(15,23,42,0.16)]">
      <div className="mb-1 flex items-center justify-between px-2 py-1">
        <p className="text-[13px] font-[800] text-[#0F172A]">컬럼 표시</p>
        <button
          type="button"
          onClick={onClose}
          className="text-[#94A3B8] hover:text-[#64748B]"
        >
          <X size={16} />
        </button>
      </div>

      {EXPERIENCE_TABLE_COLUMNS.map((column) => {
        const checked = visibleColumns.includes(column.key);
        return (
          <label
            key={column.key}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 hover:bg-[#F8FAFC]"
          >
            <span
              className={`flex h-[16px] w-[16px] items-center justify-center rounded-[4px] border ${checked ? "border-[#2563EB] bg-[#2563EB]" : "border-[#CBD5E1] bg-white"}`}
            >
              {checked && (
                <Check size={11} strokeWidth={3} className="text-white" />
              )}
            </span>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggleColumn(column.key)}
              className="sr-only"
            />
            <span className="text-[13px] font-[700] text-[#334155]">
              {column.label}
            </span>
          </label>
        );
      })}

      <button
        type="button"
        onClick={onReset}
        className="mt-1 h-9 w-full rounded-lg border border-[#E2E8F0] text-[13px] font-[800] text-[#64748B] hover:bg-[#F8FAFC]"
      >
        기본값으로 되돌리기
      </button>
    </div>
  );
}

function ExtractExperienceModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (candidateIds: string[]) => void;
}) {
  const [text, setText] = useState("");
  const [checkedIds, setCheckedIds] = useState<string[]>(
    EXTRACT_MOCK_CANDIDATES.map((item) => item.id),
  );
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open) {
      setDone(false);
      setCheckedIds(EXTRACT_MOCK_CANDIDATES.map((item) => item.id));
    }
  }, [open]);

  if (!open) return null;

  const toggle = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4"
      onClick={onClose}
    >
      <div
        className="w-[760px] overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-[#E2E8F0] px-5 py-4">
          <div>
            <h3 className="text-[18px] font-[800] text-[#0F172A]">
              자소서에서 경험 추출
            </h3>
            <p className="mt-1 text-[13px] font-[500] text-[#64748B]">
              두 번째 프로젝트처럼 자소서 텍스트에서 경험 후보를 골라 DB에
              추가하는 흐름입니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-[1fr_300px] gap-4 px-5 py-4">
          <div>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="자소서 문단을 붙여넣어 주세요. 지금은 목업 후보를 보여주고, 백엔드/AI 연결 시 실제 추출 결과로 교체하면 됩니다."
              className="h-[300px] w-full resize-none rounded-[12px] border border-[#E2E8F0] bg-[#FBFCFE] p-3 text-[14px] font-[500] leading-7 text-[#0F172A] outline-none focus:border-[#2563EB]"
            />
            <button
              type="button"
              onClick={() => setDone(true)}
              className="mt-3 inline-flex h-9 items-center gap-2 rounded-[8px] bg-[#2563EB] px-4 text-[13px] font-[800] text-white hover:bg-[#1D4ED8]"
            >
              <Sparkles size={15} />
              후보 추출하기
            </button>
          </div>

          <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] p-3">
            <p className="mb-3 text-[13px] font-[800] text-[#0F172A]">
              추출 후보
            </p>
            <div className="space-y-2">
              {EXTRACT_MOCK_CANDIDATES.map((candidate) => {
                const checked = checkedIds.includes(candidate.id);
                return (
                  <label
                    key={candidate.id}
                    className="block cursor-pointer rounded-[10px] border border-[#E2E8F0] bg-white p-3 hover:border-[#BFDBFE]"
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={`mt-0.5 flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-[4px] border ${checked ? "border-[#2563EB] bg-[#2563EB]" : "border-[#CBD5E1] bg-white"}`}
                      >
                        {checked && (
                          <Check
                            size={11}
                            strokeWidth={3}
                            className="text-white"
                          />
                        )}
                      </span>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(candidate.id)}
                        className="sr-only"
                      />
                      <div className="min-w-0">
                        <p className="text-[13px] font-[800] text-[#0F172A]">
                          {candidate.name}
                        </p>
                        <p className="mt-1 text-[11px] font-[700] text-[#2563EB]">
                          {candidate.type}
                        </p>
                        <p className="mt-1 text-[12px] font-[600] text-[#64748B]">
                          {candidate.summary}
                        </p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
            {done && (
              <p className="mt-3 text-[12px] font-[700] text-[#2563EB]">
                후보 {EXTRACT_MOCK_CANDIDATES.length}개를 찾았습니다.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-[#E2E8F0] px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-[8px] border border-[#E2E8F0] px-4 text-[13px] font-[800] text-[#64748B] hover:bg-[#F8FAFC]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => onCreate(checkedIds)}
            className="h-9 rounded-[8px] bg-[#2563EB] px-4 text-[13px] font-[800] text-white hover:bg-[#1D4ED8]"
          >
            선택 항목 추가
          </button>
        </div>
      </div>
    </div>
  );
}

function ExperienceCardGrid({
  items,
  onOpen,
  onToggleImportant,
  onTogglePin,
}: {
  items: ExperienceItem[];
  onOpen: (item: ExperienceItem) => void;
  onToggleImportant: (id: number) => void;
  onTogglePin: (id: number) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="mt-[18px] rounded-[16px] border border-dashed border-[#CBD5E1] bg-white py-16 text-center text-[#94A3B8]">
        <p className="text-sm font-[700]">조건에 맞는 경험이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mt-[18px] grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const important = Boolean(item.important || item.importance === "높음");
        return (
          <article
            key={item.id}
            onClick={() => onOpen(item)}
            className="cursor-pointer rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[13px] font-[800] text-[#2563EB]">
                  {item.type}
                </p>
                <h3 className="mt-1 truncate text-[18px] font-[800] text-[#0F172A]">
                  {item.name}
                </h3>
                <p className="mt-2 truncate text-[13px] font-[600] text-[#64748B]">
                  {getOrgText(item)} · {getPeriodText(item) || "기간 미입력"}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleImportant(item.id);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#F8FAFC]"
                >
                  <Star
                    size={17}
                    className={
                      important
                        ? "fill-[#F58A1F] text-[#F58A1F]"
                        : "text-[#94A3B8]"
                    }
                  />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onTogglePin(item.id);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#F8FAFC]"
                >
                  <span
                    className={
                      item.pinned ? "text-[#2563EB]" : "text-[#94A3B8]"
                    }
                  >
                    ⌖
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {item.keywords.length > 0 ? (
                item.keywords.slice(0, 4).map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-[#F1F5F9] px-3 py-1 text-[12px] font-[700] text-[#475569]"
                  >
                    {keyword}
                  </span>
                ))
              ) : (
                <span className="text-[13px] font-[600] text-[#CBD5E1]">
                  키워드 없음
                </span>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function DeleteConfirmModal({
  title,
  description,
  onCancel,
  onConfirm,
}: {
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[600px] rounded-[20px] bg-white px-9 pb-9 pt-8 shadow-[0_24px_60px_rgba(15,23,42,0.22)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[20px] font-[800] text-[#0F172A]">{title}</h3>
            <p className="mt-4 text-[16px] font-[500] text-[#64748B]">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#64748B] transition-colors hover:bg-[#F8FAFC]"
          >
            <X size={22} />
          </button>
        </div>

        <div className="mt-12 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-[48px] rounded-[12px] border border-[#E2E8F0] bg-white px-6 text-[15px] font-[700] text-[#334155] transition-colors hover:bg-[#F8FAFC]"
          >
            취소
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="h-[48px] rounded-[12px] bg-[#E25B52] px-6 text-[15px] font-[700] text-white transition-colors hover:bg-[#DC4B41]"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

function loadExperiences() {
  try {
    const raw = localStorage.getItem(LS_EXPERIENCES);
    if (raw) {
      const parsed = JSON.parse(raw) as ExperienceItem[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return MOCK_EXPERIENCES;
}

function loadVisibleColumns() {
  try {
    const raw = localStorage.getItem(LS_VISIBLE_COLUMNS);
    if (raw) {
      const parsed = JSON.parse(raw) as ExperienceColumnKey[];
      const validKeys = new Set(
        EXPERIENCE_TABLE_COLUMNS.map((column) => column.key),
      );
      const filtered = parsed.filter((key) => validKeys.has(key));
      if (filtered.length > 0) return filtered;
    }
  } catch {
    // ignore
  }
  return EXPERIENCE_TABLE_COLUMNS.filter((column) => column.defaultVisible).map(
    (column) => column.key,
  );
}

function getOrgText(item: ExperienceItem) {
  return (
    item.org ||
    item.fields.org ||
    item.fields.company ||
    item.fields.host ||
    item.fields.issuer ||
    item.fields.school ||
    item.fields.univ ||
    item.fields.lab ||
    "기관 미입력"
  );
}

function getPeriodText(item: ExperienceItem) {
  return (
    item.period ||
    item.fields.period ||
    item.fields.testDate ||
    item.fields.issuedAt ||
    item.fields.awardedAt ||
    item.fields.semester ||
    ""
  );
}
