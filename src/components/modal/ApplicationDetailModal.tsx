import { useState } from "react";
import { Icon } from "@iconify/react";
import { getDDay } from "../../utils/date";
import PostTodo from "./PostTodo";

interface Props {
  open: boolean;
  onClose: () => void;
  application: any;
}

const flow = [
  "지원 예정",
  "작성중",
  "제출 완료",
  "서류 결과 대기",
  "서류 합격",
  "필기 전형",
  "면접 전형",
  "최종 결과",
];

export default function ApplicationDetailModal({
  open,
  onClose,
  application,
}: Props) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [todoModalOpen, setTodoModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  if (!open || !application) return null;

  return (
    <>
      <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
        <div className="relative w-[1180px] max-h-[92vh] overflow-y-auto rounded-[20px] bg-white shadow-[0_10px_40px_rgba(15,23,42,0.12)]">
          {/* 헤더 */}
          <div className="border-b border-[#EEF2F6] px-7 pt-5 pb-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-[13px] text-[#94A3B8]">
                  <span>지원 대시보드</span>
                  <Icon icon="mdi:chevron-right" className="text-[14px]" />
                  <span>상태 관리</span>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                    <Icon
                      icon="ep:office-building"
                      className="text-[22px] text-[#64748B]"
                    />
                  </div>

                  <div>
                    <h1 className="text-[30px] font-bold leading-none text-[#0F172A]">
                      {application.company}
                    </h1>

                    <p className="mt-2 text-[15px] text-[#64748B]">
                      {application.jobTitle} · {application.position}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="rounded-lg p-2 transition-colors hover:bg-[#F8FAFC]"
              >
                <Icon icon="mdi:close" className="text-[22px] text-[#64748B]" />
              </button>
            </div>
          </div>

          <div className="space-y-7 px-7 py-6">
            {/* 공고 기본 정보 */}
            <Section title="공고 기본 정보">
              <div className="flex flex-col gap-5">
                <InfoRow label="기업명" value={application.company} />
                <InfoRow label="공고명" value={application.jobTitle} />
                <InfoRow label="직무" value={application.position} />
                <InfoRow
                  label="마감일"
                  value={
                    application.deadlineDate ? (
                      <div className="flex items-center gap-20">
                        <span>{application.deadlineDate.split("T")[0]}</span>

                        <span className="text-[#94A3B8]">
                          {getDDay(application.deadlineDate)}
                        </span>
                      </div>
                    ) : (
                      "-"
                    )
                  }
                />
              </div>
            </Section>

            {/* 전형 흐름 */}
            <Section>
              <h2 className="mb-4 text-lg font-semibold text-[#334155]">
                전형 흐름
              </h2>

              <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#E2E8F0] p-5">
                {flow.map((step, index) => {
                  const active = step === application.status;

                  return (
                    <div key={step} className="flex items-center gap-2">
                      <div
                        className={`
                        rounded-lg px-3 py-2 text-sm font-medium transition-colors
                        ${
                          active
                            ? "bg-[#DBEAFE] text-[#2563EB]"
                            : "bg-[#F8FAFC] text-[#64748B]"
                        }
                      `}
                      >
                        {step}
                      </div>

                      {index !== flow.length - 1 && (
                        <Icon
                          icon="mdi:chevron-right"
                          className="text-[#CBD5E1]"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </Section>
            <Section
              title="일정 · 할 일"
              right={
                <div className="relative">
                  <button
                    onClick={() => setShowAddMenu((prev) => !prev)}
                    className="flex items-center gap-1 text-[14px] font-medium text-[#64748B] hover:text-[#2563EB]"
                  >
                    <Icon icon="mdi:plus" className="text-[16px]" />
                    추가
                  </button>

                  {showAddMenu && (
                    <div className="absolute right-0 top-8 z-50 w-[160px] overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                      <button
                        className="flex w-full items-center px-4 py-3 text-left text-[14px] text-[#0F172A] transition-colors hover:bg-[#F8FAFC]"
                        onClick={() => {
                          setShowAddMenu(false);
                          setScheduleModalOpen(true);
                        }}
                      >
                        일정 추가
                      </button>

                      <button
                        className="flex w-full items-center px-4 py-3 text-left text-[14px] text-[#0F172A] transition-colors hover:bg-[#F8FAFC]"
                        onClick={() => {
                          setShowAddMenu(false);
                          setTodoModalOpen(true);
                        }}
                      >
                        할 일 추가
                      </button>
                    </div>
                  )}
                </div>
              }
            >
              <div className="overflow-hidden rounded-2xl border border-[#E9EEF5]">
                <table className="w-full">
                  <thead className="bg-[#FAFBFC]">
                    <tr className="border-b border-[#EEF2F6] text-left">
                      <th className="px-5 py-3 text-[13px] font-semibold text-[#64748B]">
                        유형
                      </th>

                      <th className="px-5 py-3 text-[13px] font-semibold text-[#64748B]">
                        제목
                      </th>

                      <th className="px-5 py-3 text-[13px] font-semibold text-[#64748B]">
                        날짜
                      </th>

                      <th className="px-5 py-3 text-[13px] font-semibold text-[#64748B]">
                        상태
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {[
                      {
                        type: "일정",
                        title: "서류 마감",
                        date: "5/20 18:00",
                        status: "예정",
                      },
                      {
                        type: "할 일",
                        title: "자소서 1번 수정",
                        date: "5/18",
                        status: "진행 중",
                      },
                      {
                        type: "할 일",
                        title: "기업분석 정리",
                        date: "5/19",
                        status: "예정",
                      },
                      {
                        type: "일정",
                        title: "면접 예정",
                        date: "미정",
                        status: "예정",
                      },
                    ].map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-[#F1F5F9] last:border-b-0"
                      >
                        <td className="px-5 py-3 text-[14px] text-[#64748B]">
                          {item.type}
                        </td>

                        <td className="px-5 py-3 text-[14px] font-medium text-[#0F172A]">
                          {item.title}
                        </td>

                        <td className="px-5 py-3 text-[14px] text-[#64748B]">
                          {item.date}
                        </td>

                        <td className="px-5 py-3">
                          <span
                            className={`
                            rounded-md px-2 py-[5px]
                            text-[12px] font-semibold
                            ${
                              item.status === "진행 중"
                                ? "bg-[#DBEAFE] text-[#2563EB]"
                                : "bg-[#F1F5F9] text-[#64748B]"
                            }
                          `}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            {/* 메모 */}
            <Section title="메모">
              <textarea
                defaultValue={application.memo}
                placeholder="메모를 입력하세요"
                className="
                min-h-[120px]
                w-full
                resize-none
                rounded-2xl
                border
                border-[#E9EEF5]
                px-5
                py-4
                text-[15px]
                outline-none
                transition-colors
                placeholder:text-[#94A3B8]
                focus:border-[#2563EB]
              "
              />
            </Section>
          </div>
        </div>
      </div>
      {todoModalOpen && (
        <PostTodo
          application={application}
          applications={[application]}
          onClose={() => setTodoModalOpen(false)}
          onConfirm={(data) => {
            console.log(data);

            setTodoModalOpen(false);
          }}
        />
      )}
    </>
  );
}

function Section({ title, right, children }: any) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[17px] font-semibold text-[#334155]">{title}</h2>
        {right}
      </div>

      {children}
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center">
      <span className="w-[110px] text-[13px] font-medium text-[#94A3B8]">
        {label}
      </span>
      <span className="text-[15px] font-medium text-[#0F172A]">
        {value || "-"}
      </span>
    </div>
  );
}
