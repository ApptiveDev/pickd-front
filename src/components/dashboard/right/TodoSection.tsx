import type { Todo } from "../../../types/todo";

interface TodoSectionProps {
  todos: Todo[];
  onClick: () => void;
}

export default function TodoSection({ todos, onClick }: TodoSectionProps) {
  return (
    <div
      onClick={onClick}
      className="mt-4 bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-[0px_1px_3px_0px_#00000040] cursor-pointer"
    >
      <h4 className="text-[15px] text-[#0F172A] font-bold mb-3">할 일</h4>
      <div className="max-h-[180px] overflow-y-auto pr-1">
        {todos.length === 0 && (
          <p className="text-sm text-gray-400">아직 없음</p>
        )}

        {todos.map((t) => (
          <div key={t.id} className="flex items-center gap-2">
            <div
              className={`
              w-[15px] h-[15px] rounded-full flex items-center justify-center
                      ${
                        t.isCompleted
                          ? "border-2 border-green-500 bg-white"
                          : "bg-gray-300"
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
              text-[15px]
              ${t.isCompleted ? "line-through text-gray-400" : ""}
            `}
            >
              {t.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
