import {
  type DocumentItem,
  type DocumentStatus,
} from "../../../../types/document";

interface Props {
  item: DocumentItem;
}

const statusStyle: Record<DocumentStatus, string> = {
  작성중: "bg-[#ECFDF3] text-[#22C55E]",
  수정중: "bg-[#FFF7ED] text-[#F59E0B]",
  검토중: "bg-[#EFF6FF] text-[#3B82F6]",
  완료: "bg-[#F5F3FF] text-[#A855F7]",
};

export default function DocumentCard({ item }: Props) {
  return (
    <div className="w-[270px] rounded-[18px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <span
          className={`rounded-full px-3 py-1 text-[12px] font-[600] ${
            statusStyle[item.status]
          }`}
        >
          {item.status}
        </span>
      </div>

      <div className="mt-3">
        <h3 className="text-[22px] font-[700] text-[#0F172A]">{item.title}</h3>

        <p className="mt-1 text-[14px] text-[#94A3B8]">
          {item.company} · {item.type}
        </p>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[13px] text-[#64748B]">진행률</span>

          <span className="text-[13px] font-[600] text-[#64748B]">
            {item.progress}%
          </span>
          
        </div>

        <div className="h-[8px] overflow-hidden rounded-full bg-[#E2E8F0]">
          <div
            className="h-full rounded-full bg-[#2563EB]"
            style={{
              width: `${item.progress}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-[13px] text-[#94A3B8]">
        <div className="h-[10px] w-[10px] rounded-full bg-[#E2E8F0]" />

        {item.updatedAt}
      </div>
    </div>
  );
}
