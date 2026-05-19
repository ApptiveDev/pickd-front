interface Props {
  open: boolean;
  onClose: () => void;

  onDirectInput: () => void;

  onImport: () => void;
}

export default function ExperienceEntryModal({
  open,
  onClose,
  onDirectInput,
  onImport,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[440px] rounded-2xl bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[24px] font-[700] text-[#0F172A]">경험 추가</h2>

            <p className="mt-1 text-[14px] text-[#64748B]">
              어떤 방식으로 추가할까요?
            </p>
          </div>

          <button onClick={onClose} className="text-[20px] text-[#64748B]">
            ×
          </button>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={onDirectInput}
            className="w-full rounded-xl border border-[#E2E8F0] p-4 text-left hover:bg-[#F8FAFC]"
          >
            <p className="text-[16px] font-[600] text-[#0F172A]">
              경험 직접 입력
            </p>

            <p className="mt-1 text-[14px] text-[#64748B]">
              직접 떠오르는 경험을 빠르게 정리할 때 좋아요.
            </p>
          </button>

          <button
            onClick={onImport}
            className="w-full rounded-xl border border-[#E2E8F0] p-4 text-left hover:bg-[#F8FAFC]"
          >
            <p className="text-[16px] font-[600] text-[#0F172A]">
              자소서 파일 불러오기
            </p>

            <p className="mt-1 text-[14px] text-[#64748B]">
              기존 자소서에서 경험을 자동으로 추출해요.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
