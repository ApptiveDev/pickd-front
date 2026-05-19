import { useState } from "react";
import ExperienceHeader from "../components/experience/ExperienceHeader";
import { MOCK_EXPERIENCES } from "../constants/experience/mockExperiences";
import ExperienceEntryModal from "../components/experience/modal/ExperienceEntryModal";
import type { ExperienceItem } from "../types/experience";
import ExperienceDetailModal from "../components/experience/modal/ExperienceDetailModal";
import ExperienceTable from "../components/experience/ExperienceTable";

const FILTERS = [
  "전체",
  "고정됨",
  "프로젝트",
  "대외활동",
  "해외경험",
  "수상",
  "자격증",
  "수강과목",
  "학점",
  "교육",
  "어학",
];

export default function ExperiencePage() {
  const [experiences, setExperiences] =
    useState<ExperienceItem[]>(MOCK_EXPERIENCES);
  const [selectedItem, setSelectedItem] = useState<ExperienceItem | null>(null);

  const [entryOpen, setEntryOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("전체");

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-14 py-8">
      <div className="mx-auto max-w-[1720px]">
        <ExperienceHeader />
        <div className="mt-8 flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEntryOpen(true)}
              className="
              flex h-[35px]
              items-center gap-2
              rounded-2xl
              bg-[#2563EB]
              px-5
              text-[15px]
              font-[600]
              text-white
              "
            >
              + 경험 추가
            </button>

            <button
              className="
              flex h-[35px]
              items-center gap-2
              rounded-2xl
              border border-[#E2E8F0]
              bg-white
              px-5
              text-[15px]
              font-[500]
              text-[#64748B]
              "
            >
              확인 필요 0
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* 검색창 */}
            <div
              className="
              flex h-[44px]
              w-[260px]
              items-center
              rounded-xl
              border border-[#E2E8F0]
              bg-white
              px-4
              "
            >
              <input
                placeholder="항목명 검색"
                className="
                w-full
                bg-transparent
                text-[14px]
                outline-none
                placeholder:text-[#94A3B8]
                "
              />
            </div>
          </div>
        </div>

        {/* FILTER */}
        <div className="mt-3 flex items-center gap-2">
          {FILTERS.map((filter) => {
            const active = selectedFilter === filter;

            return (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`
                  h-[38px]
                  rounded-xl
                  px-4
                  text-[14px]
                  font-[500]
                  transition-colors
                  
                  ${
                    active
                      ? "bg-[#EFF6FF] text-[#2563EB]"
                      : "text-[#64748B] hover:bg-white"
                  }
                `}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* TABLE */}
        <ExperienceTable
          items={experiences}
          onRowClick={(item) => {
            setSelectedItem(item);
          }}
        />

        {/* ENTRY MODAL */}
        <ExperienceEntryModal
          open={entryOpen}
          onClose={() => setEntryOpen(false)}
          onDirectInput={() => {
            const newItem: ExperienceItem = {
              id: Date.now(),

              type: "프로젝트",

              name: "",

              competencies: [],

              keywords: [],

              status: "정보 부족",

              missing: [],

              linkedExperienceIds: [],

              fields: {},
            };

            setExperiences((prev) => [newItem, ...prev]);

            setSelectedItem(newItem);

            setEntryOpen(false);
          }}
          onImport={() => {
            console.log("파일 불러오기");
          }}
        />

        {/* DETAIL MODAL */}
        <ExperienceDetailModal
          open={!!selectedItem}
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onChange={(updatedItem) => {
            setSelectedItem(updatedItem);

            setExperiences((prev) =>
              prev.map((experience) =>
                experience.id === updatedItem.id ? updatedItem : experience,
              ),
            );
          }}
        />
      </div>
    </div>
  );
}
