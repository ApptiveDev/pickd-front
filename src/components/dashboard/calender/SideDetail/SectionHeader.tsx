import { useState } from "react";
import { Plus } from "lucide-react";
import PostTodo from "../../../modal/PostTodo";
import { useApplication } from "../../../../context/ApplicationContext";

interface SectionHeaderProps {
  title: string;
  count?: number;
  onConfirm?: (data: any) => void;
  showAddButton?: boolean;
}

const SectionHeader = ({
  title,
  count,
  onConfirm,
  showAddButton = true,
}: SectionHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { applications } = useApplication();

  const handlePostTodo = (data: any) => {
    if (onConfirm) {
      onConfirm(data);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-800 text-base">
            {title}
          </h3>

          {count !== undefined && (
            <span className="flex items-center justify-center w-5 h-5 bg-gray-200 text-gray-500 text-[11px] font-bold rounded-full">
              {count}
            </span>
          )}
        </div>

        {showAddButton && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors group"
            title="새 할 일 추가"
          >
            <Plus
              size={20}
              className="text-gray-400 group-hover:text-blue-500"
            />
          </button>
        )}
      </div>

      {isModalOpen && (
        <PostTodo
          onClose={() => setIsModalOpen(false)}
          onConfirm={handlePostTodo}
          applications={applications} // 여기서 실제 공고 연결
        />
      )}
    </>
  );
};

export default SectionHeader;