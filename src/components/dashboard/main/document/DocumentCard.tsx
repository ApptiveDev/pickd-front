import {
  type DocumentItem,
  type DocumentStatus,
} from "../../../../types/document";

interface Props {
  item: DocumentItem;
}

const statusStyle: Record<DocumentStatus, string> = {
  작성중: "bg-[#ECFDF5] text-[#10B981]",
  수정중: "bg-[#FFFBEB] text-[#F59E0B]",
  검토중: "bg-[#EFF6FF] text-[#2563EB]",
  완료: "bg-[#F9F2FF] text-[#C082F6]",
};

const getRelativeTime = (dateString?: string) => {
  if (!dateString) return "-";

  const now = new Date();
  const target = new Date(dateString);
  const diffMs = now.getTime() - target.getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;

  return `${days}일 전`;
};

export default function DocumentCard({ item }: Props) {
  return (
    <div className="w-[270px] rounded-[18px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <h3 className="text-[22px] font-[600] text-[#0F172A]">{item.title}</h3>
        <span
          className={`rounded px-3 py-0.5 text-sm font-semibold ${
            statusStyle[item.status]
          }`}
        >
          {item.status}
        </span>
      </div>

      <div className="ml-4"></div>
      <p className="mt-1 text-[14px] text-[#64748B]">
        {item.company} · {item.type}
      </p>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[13px] text-[#64748B]">진행률</span>

          <span className="text-[13px] font-[600] text-[#64748B]">
            {item.progress}%
          </span>
        </div>

        <div className="h-[8px] overflow-hidden rounded-full bg-[#F1F5F9]">
          <div
            className="h-full rounded-full bg-[#2563EB]"
            style={{
              width: `${item.progress}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-[13px] text-[#64748B] font-regular">
        <div className="h-[10px] w-[10px] rounded-full bg-[##F1F5F9]" />
        {getRelativeTime(item.updatedAt)}
      </div>
    </div>
  );
}
