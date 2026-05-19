import { FIELD_SCHEMA } from "../../../constants/experience/fieldSchema";

import { EXPERIENCE_TYPES } from "../../../constants/experience/typeGroups";

import type { ExperienceItem } from "../../../types/experience";

interface Props {
  open: boolean;

  item: ExperienceItem | null;

  onClose: () => void;

  onChange: (item: ExperienceItem) => void;
}

export default function ExperienceDetailModal({
  open,
  item,
  onClose,
  onChange,
}: Props) {
  if (!open || !item) return null;

  const fields = FIELD_SCHEMA[item.type];

  const isExperience = EXPERIENCE_TYPES.includes(item.type);

  const updateField = (key: string, value: string) => {
    onChange({
      ...item,

      fields: {
        ...item.fields,
        [key]: value,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex h-[92vh] w-[900px] overflow-hidden rounded-2xl bg-white">
        {/* LEFT */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* HEADER */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[13px] text-[#64748B]">경험정리</p>

              <input
                value={item.name}
                onChange={(e) =>
                  onChange({
                    ...item,
                    name: e.target.value,
                  })
                }
                placeholder="경험 이름"
                className="mt-2 w-full border-none bg-transparent text-[28px] font-[700] text-[#0F172A] outline-none"
              />
            </div>

            <button onClick={onClose} className="text-[28px] text-[#64748B]">
              ×
            </button>
          </div>

          {/* 기본 정보 */}
          <div className="mt-8 rounded-2xl border border-[#E2E8F0]">
            <InfoRow label="유형">
              <select
                value={item.type}
                onChange={(e) =>
                  onChange({
                    ...item,
                    type: e.target.value as any,
                  })
                }
                className="w-full bg-transparent outline-none"
              >
                {[
                  "프로젝트",
                  "대외활동",
                  "인턴",
                  "봉사",
                  "교환학생",
                  "창업",
                  "학회",
                  "사용자조사",
                  "해외경험",
                  "학점",
                  "수강과목",
                  "자격증",
                  "수상",
                  "교육",
                  "어학",
                ].map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </InfoRow>

            <InfoRow label="기관 / 소속">
              <input
                value={item.org ?? ""}
                onChange={(e) =>
                  onChange({
                    ...item,
                    org: e.target.value,
                  })
                }
                className="w-full bg-transparent outline-none"
              />
            </InfoRow>

            <InfoRow label="기간">
              <input
                value={item.period ?? ""}
                onChange={(e) =>
                  onChange({
                    ...item,
                    period: e.target.value,
                  })
                }
                className="w-full bg-transparent outline-none"
              />
            </InfoRow>

            <InfoRow label="역할">
              <input
                value={item.role ?? ""}
                onChange={(e) =>
                  onChange({
                    ...item,
                    role: e.target.value,
                  })
                }
                className="w-full bg-transparent outline-none"
              />
            </InfoRow>
          </div>

          {/* 경험 fields */}
          <div className="mt-6 space-y-4">
            {fields.map((field) => (
              <div
                key={field.key}
                className="rounded-2xl border border-[#E2E8F0] p-5"
              >
                <p className="text-[13px] font-[600] text-[#64748B]">
                  {field.label}
                </p>

                <textarea
                  value={item.fields[field.key] ?? ""}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder={`${field.label}을(를) 입력해주세요`}
                  className="mt-3 min-h-[50px] w-full resize-none border-none bg-transparent text-[15px] text-[#0F172A] outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-[250px] border-l border-[#E2E8F0] bg-[#F8FAFC] p-6">
          <p className="text-[18px] font-[700] text-[#0F172A]">AI 보완 질문</p>

          <p className="mt-2 text-[14px] text-[#64748B]">
            부족한 경험을 AI가 질문해드려요.
          </p>
        </div>
      </div>
    </div>
  );
}

interface RowProps {
  label: string;

  children: React.ReactNode;
}

function InfoRow({ label, children }: RowProps) {
  return (
    <div className="grid grid-cols-[120px_1fr] border-b border-[#E2E8F0] px-5 py-4 last:border-b-0">
      <p className="text-[14px] text-[#64748B]">{label}</p>

      <div>{children}</div>
    </div>
  );
}
