interface TodoProps {
  task: string;
  company: string;
  time: string;
  priority: '긴급' | '보통';
  isOverdue?: boolean;
}

const TodoItem = ({ task, company, time, priority, isOverdue }: TodoProps) => (
  <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group">
    <input type="checkbox" className="mt-1 w-5 h-5 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500" />
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-gray-800 leading-tight">{task}</p>
        {isOverdue && <span className="text-[10px] text-orange-400 bg-orange-50 px-1 rounded">이월</span>}
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${priority === '긴급' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
          {priority}
        </span>
        <span className="text-[10px] text-gray-400">{company}</span>
        <span className="text-[10px] text-gray-400 inline-flex items-center gap-0.5">
          🕒 {time}
        </span>
      </div>
    </div>
  </div>
);

export default TodoItem;