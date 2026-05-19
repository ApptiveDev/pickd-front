import type { ExperienceItem } from "../../types/experience";

interface Props {
  items: ExperienceItem[];

  onRowClick: (item: ExperienceItem) => void;
}

export default function ExperienceTable({ items, onRowClick }: Props) {
  return (
    <div
      className="
      mt-1
      overflow-hidden
      rounded-[24px]
      border border-[#E2E8F0]
      bg-white
      "
    >
      <table className="w-full border-collapse">
        {/* HEADER */}
        <thead className="bg-[#F8FAFC]">
          <tr className="border-b border-[#E2E8F0]">
            {/* CHECK */}
            <th className="w-[60px] px-5 py-3">
              <div
                className="
                h-[15px]
                w-[15px]
                rounded-full
                border-2 border-[#3B82F6]
                "
              />
            </th>

            {/* 유형 */}
            <th
              className="
              text-left
              text-[14px]
              font-[600]
              text-[#64748B]
              "
            >
              유형
            </th>

            {/* 항목명 */}
            <th
              className="
              text-left
              text-[14px]
              font-[600]
              text-[#64748B]
              "
            >
              항목명
            </th>

            {/* 핵심역량 */}
            <th
              className="
              text-left
              text-[14px]
              font-[600]
              text-[#64748B]
              "
            >
              핵심역량
            </th>

            {/* 키워드 */}
            <th
              className="
              text-left
              text-[14px]
              font-[600]
              text-[#64748B]
              "
            >
              주요 키워드
            </th>

            {/* 액션 */}
            <th
              className="
              text-left
              text-[14px]
              font-[600]
              text-[#64748B]
              "
            >
              필요 액션
            </th>

            {/* 부족 정보 */}
            <th
              className="
              text-left
              text-[14px]
              font-[600]
              text-[#64748B]
              "
            >
              부족한 정보
            </th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick(item)}
              className="
              cursor-pointer
              border-b border-[#F1F5F9]
              transition-colors
              hover:bg-[#F8FAFC]
              "
            >
              {/* CHECK */}
              <td className="px-5 py-3">
                <div
                  className="
                h-[15px]
                w-[15px]
                rounded-full
                border-2 border-[#3B82F6]
                "
                />
              </td>

              {/* 유형 */}
              <td
                className="
                text-[15px]
                text-[#64748B]
                "
              >
                {item.type}
              </td>

              {/* 항목명 */}
              <td>
                <div>
                  <div className="flex items-center gap-2">
                    <p
                      className="
                      text-[16px]
                      font-[600]
                      text-[#0F172A]
                      "
                    >
                      {item.name || "새 경험"}
                    </p>
                  </div>
                </div>
              </td>

              {/* 핵심역량 */}
              <td>
                <div className="flex flex-wrap gap-2">
                  {item.competencies.map((competency) => (
                    <span
                      key={competency}
                      className="
                        rounded-lg
                        bg-[#EFF6FF]
                        text-[12px]
                        font-[500]
                        text-[#2563EB]
                        "
                    >
                      {competency}
                    </span>
                  ))}
                </div>
              </td>

              {/* 키워드 */}
              <td>
                <div className="flex flex-wrap gap-2">
                  {item.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="
                        rounded-lg
                        bg-[#F1F5F9]
                        text-[12px]
                        text-[#475569]
                        "
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </td>

              {/* 필요 액션 */}
              <td>
                <ActionIcon status={item.status} />
              </td>

              {/* 부족 정보 */}
              <td
                className="
                text-[14px]
                text-[#64748B]
                "
              >
                {item.missing.length > 0 ? item.missing.join(", ") : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ActionProps {
  status: string;
}

function ActionIcon({ status }: ActionProps) {
  if (status === "보완 필요") {
    return <span className="text-[18px] text-[#F59E0B]">ⓘ</span>;
  }

  if (status === "확인 필요") {
    return <span className="text-[18px] text-[#2563EB]">ⓘ</span>;
  }

  if (status === "병합 필요") {
    return <span className="text-[18px] text-[#8B5CF6]">⧉</span>;
  }

  return <span className="text-[#CBD5E1]">—</span>;
}
