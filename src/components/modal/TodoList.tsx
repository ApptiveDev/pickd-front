interface Todo {
  id: string;
  summary: string;
  isCompleted: boolean;
}

interface TodoListModalProps {
  todos: Todo[];
  onToggle: (id: string) => void; // 체크 상태 변경 함수
  onClose: () => void;
}

export default function TodoListModal({
  todos,
  onToggle,
  onClose,
}: TodoListModalProps) {
  return (
    <div className="py-2">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">할 일</h2>
      </div>

      {/* 할 일 리스트 영역 */}
      <div className="space-y-5 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onToggle(todo.id)}
          >
            <div
              className={`w-5 h-5 rounded-full border-1.5 flex items-center justify-center transition-all ${
                todo.isCompleted
                  ? "border-green-500 bg-transparent" // 완료 시
                  : "border-[#D9D9D9] bg-[#D9D9D9] group-hover:border-gray-400" // 미완료 시
              }`}
            >
              {todo.isCompleted && (
                <div className="flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-green-500"
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
                </div>
              )}
            </div>

            {/* 할 일 제목 */}
            <span
              className={`text-[15px] font-medium transition-all ${
                todo.isCompleted
                  ? "text-gray-300 line-through"
                  : "text-gray-700"
              }`}
            >
              {todo.summary}
            </span>
          </div>
        ))}

        {todos.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            등록된 할 일이 없습니다.
          </div>
        )}
      </div>

      <button
        onClick={onClose}
        className="w-full mt-10 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-[0.98]"
      >
        닫기
      </button>
    </div>
  );
}
