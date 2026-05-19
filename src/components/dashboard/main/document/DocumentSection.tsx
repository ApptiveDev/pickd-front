import { useState } from "react";
import { Icon } from "@iconify/react";

import DocumentCard from "./DocumentCard";
import DocumentList from "./DocumentList";

interface Props {
  documents: any[];
}

export default function DocumentSection({ documents = [] }: Props) {
  const [view, setView] = useState<"card" | "list">("card");

  return (
    <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-white">
      <div className="flex items-center justify-between px-5 py-2">
        <div className="flex items-center gap-2">
          <h2 className="text-ms font-[600] text-[#0F172A]">작성중인 서류</h2>

          <span className="text-sm text-[#94A3B8]">{documents.length}건</span>
        </div>

        <div className="flex items-center rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-1">
          <button
            onClick={() => setView("card")}
            className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
              view === "card"
                ? "bg-white text-[#0F172A] shadow-sm"
                : "text-[#64748B]"
            }`}
          >
            <Icon icon="mdi:view-grid-outline" width={16} />
          </button>

          <button
            onClick={() => setView("list")}
            className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
              view === "list"
                ? "bg-white text-[#0F172A] shadow-sm"
                : "text-[#64748B]"
            }`}
          >
            <Icon icon="mdi:table-large" width={16} />
          </button>
        </div>
      </div>

      {view === "card" ? (
        <div className="flex gap-4 overflow-x-auto px-5 pb-5">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} item={doc} />
          ))}
        </div>
      ) : (
        <DocumentList documents={documents} />
      )}
    </div>
  );
}
