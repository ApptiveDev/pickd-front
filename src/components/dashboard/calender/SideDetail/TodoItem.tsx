import type { Todo } from "../../../../types/todo";

interface TodoProps {
  todo: Todo;
  onToggle?: (id: number) => void;
}

const TodoItem = ({ todo, onToggle }: TodoProps) => {
  const isUrgent =
    todo.dueDateTime &&
    new Date(todo.dueDateTime).getTime() - new Date().getTime() <
      12 * 60 * 60 * 1000; // 12시간 이내 마감인 경우 긴급으로 표시

  const priority = isUrgent ? "긴급" : "보통";

  const time = todo.dueDateTime
    ? new Date(todo.dueDateTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "시간 미정";

  const isOverdue = todo.dueDateTime // 이월 지정 
    ? new Date(todo.dueDateTime) < new Date() && !todo.completed
    : false;

  return (
    <div className="flex items-start gap-3 p-4 hover:bg-blue-50 rounded-xl transition-colors group">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle?.(todo.id)}
        className="mt-1 w-5 h-5 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
      />

      <div className="flex-1">
        <div className="flex justify-between items-center">
          <p
            className={`font-medium leading-tight ${todo.completed ? "text-gray-400 line-through" : "text-gray-800"}`}
          >
            {todo.title}
          </p>
          {isOverdue && (
            <span className="text-xs text-orange-400 bg-orange-50 px-1.5 py-0.5 rounded">
              이월
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1.5">
          <span
            className={`text-xs px-2 py-0.5 rounded font-medium ${priority === "긴급" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"}`}
          >
            {priority}
          </span>

          {todo.application?.company && (
            <span className="text-sm text-gray-400">
              {todo.application.company}
            </span>
          )}

          <span className="text-sm text-gray-400 inline-flex items-center gap-1">
            <span className="text-xs">🕒</span> {time}
          </span>
        </div>

        {todo.memo && (
          <p className="mt-1 text-xs text-gray-400 italic">{todo.memo}</p>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
