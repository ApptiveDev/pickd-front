import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { useApplication } from "../../../context/ApplicationContext";

interface Props {
  row: any;
  onEdit?: (row: any) => void;
  onDelete?: () => void;
  onAddDocument: (row: any, title: string) => void;
}

export default function ApplicationMenu({
  row,
  onEdit,
  onDelete,
  onAddDocument,
}: Props) {
  const { addTodo } = useApplication();
  const [open, setOpen] = useState(false);
  const [todoInput, setTodoInput] = useState("");
  const [documentInput, setDocumentInput] = useState("");
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex justify-center">
      <button
        className="w-full h-full py-2 text-[20px] text-gray-400"
        onClick={(e) => {
          e.stopPropagation();

          const rect = e.currentTarget.getBoundingClientRect();
          const menuWidth = 220;
          const menuHeight = 260;
          let top = rect.bottom + 8;
          let left = rect.left - menuWidth;

          if (top + menuHeight > window.innerHeight) {
            top = rect.top - menuHeight - 8;
          }

          if (left < 8) left = 8;
          setMenuPosition({ top, left });
          setOpen((prev) => !prev);
        }}
      >
        ⋯
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed min-w-[220px] bg-white border border-[#E2E8F0] rounded-2xl shadow-lg p-3 z-[9999]"
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
            }}
          >
            <div className="mb-3">
              <p className="text-[14px] text-[#334155] font-bold mb-1">
                {row.company} 할 일 추가
              </p>

              <div className="flex gap-2">
                <input
                  value={todoInput}
                  onChange={(e) => setTodoInput(e.target.value)}
                  placeholder="할 일을 입력하세요"
                  className="flex-1 border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm outline-none"
                />

                <button
                  onClick={async () => {
                    if (!todoInput.trim()) return;
                    await addTodo({ title: todoInput, applicationId: row.id });
                    setTodoInput("");
                    setOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#2563EB] text-white text-sm whitespace-nowrap"
                >
                  추가
                </button>
              </div>
            </div>
            <div className="mt-3 pt-2">
              <p className="text-[14px] text-[#334155] font-bold mb-1">
                {row.company} 서류 추가
              </p>

              <div className="flex gap-2">
                <input
                  value={documentInput}
                  onChange={(e) => setDocumentInput(e.target.value)}
                  placeholder="예: 포트폴리오"
                  className="flex-1 border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm outline-none"
                />

                <button
                  onClick={() => {
                    if (!documentInput.trim()) return;

                    onAddDocument(row, documentInput);

                    setDocumentInput("");
                    setOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#2563EB] text-white text-sm whitespace-nowrap"
                >
                  추가
                </button>
              </div>
            </div>
            <div className="h-[1px] bg-[#E2E8F0] my-2" />
            <button
              onClick={() => {
                onEdit?.(row);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold rounded-lg hover:bg-gray-50"
            >
              ✏️ 수정
            </button>

            <button
              onClick={async () => {
                await onDelete?.();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold rounded-lg text-red-500 hover:bg-red-50"
            >
              🗑️ 삭제
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}
