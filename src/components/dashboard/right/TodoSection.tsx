import type { Todo } from "../../../types/todo";

interface TodoSectionProps {
  todos: Todo[];
  onAdd: () => void;
  onClick: () => void;
  onToggle: (id: string) => void;
}

export default function TodoSection({
  todos,
  onAdd,
  onToggle,
  onClick,
}: TodoSectionProps) {
  const formatDateTime = (date?: string, time?: string) => {
    if (!date) return "기한 없음";

    const formattedDate = date.replace(/-/g, "/").slice(5);
    const formattedTime = time || "";

    return `${formattedDate} ${formattedTime}`.trim();
  };

  return (
    <div
      onClick={onClick}
      className="mt-4 bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-[0px_1px_3px_0px_#00000040] cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-lg text-[#0F172A] font-bold mb-[15px] mt-2">
          할 일
        </h4>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          className="text-sm px-2 py-1 bg-[#2563EB] text-white rounded-md"
        >
          + 추가
        </button>
      </div>

      <div
        className={`h-[220px] overflow-y-auto pr-1 ${
          todos.length === 0 ? "flex items-center justify-center" : ""
        }`}
      >
        {todos.length === 0 ? (
          <p className="text-base text-gray-400">할 일 없음</p>
        ) : (
          todos.map((t) => (
            <div key={t.id} className="flex items-center gap-4 mb-3 last:mb-0">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(t.id);
                }}
                className={`
                  w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0
                  ${t.isCompleted ? "border-2 border-green-500 bg-white" : "bg-[#D9D9D9]"}
                `}
              >
                {t.isCompleted && (
                  <svg
                    className="w-3 h-3 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="4"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>

              <div className="flex flex-col gap-0.5">
                <h3
                  className={`text-[14px] font-semibold text-gray-800 leading-tight ${t.isCompleted ? "line-through text-gray-400" : ""}`}
                >
                  {t.relatedJob && (
                    <span
                      className={`${t.isCompleted ? "text-gray-400" : "text-[#2563EB]"} mr-1`}
                    >
                      [{t.relatedJob}]
                    </span>
                  )}
                  {t.summary}
                </h3>

                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-gray-400 tabular-nums font-medium">
                    {formatDateTime(t.dueDate, t.dueTime)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
