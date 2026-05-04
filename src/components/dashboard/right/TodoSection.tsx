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
            <div key={t.id} className="flex items-center gap-4 mb-3">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(t.id);
                }}
                className={`
              w-[15px] h-[15px] rounded-full flex items-center justify-center
                      ${
                        t.isCompleted
                          ? "border-2 border-green-500 bg-white"
                          : "bg-[#D9D9D9]"
                      }
            `}
              >
                {t.isCompleted && (
                  <svg
                    className="w-[15px] h-[15px] text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3.5"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>

              <p
                className={`
              text-base
              font-regular
              ${t.isCompleted ? "line-through text-gray-400" : ""}
            `}
              >
                {t.summary}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
