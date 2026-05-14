import { useState } from 'react';
import { Plus } from 'lucide-react';
import PostTodo from '../../../modal/PostTodo';
import type { Application } from '../../../../types/application';

interface SectionHeaderProps {
  title: string;
  count?: number;
  applications?: Application[]; 
}

const SectionHeader = ({ title, count, applications = [] }: SectionHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isTodaySchedule = title.includes("일정");

  const handlePostTodo = (data: any) => {
    console.log('새로운 할 일 데이터:', data);
    setIsModalOpen(false); 
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
          {count !== undefined && (
            <span className="flex items-center justify-center w-5 h-5 bg-gray-200 text-gray-500 text-[11px] font-bold rounded-full">
              {count}
            </span>
          )}
        </div>

        {!isTodaySchedule && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Plus size={20} className="text-gray-400" />
          </button>
        )}
      </div>

      {isModalOpen && (
        <PostTodo 
          onClose={() => setIsModalOpen(false)} 
          onConfirm={handlePostTodo}
          applications={applications} 
        />
      )}
    </>
  );
};

export default SectionHeader;