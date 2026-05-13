import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import PostTodo from '../../../modal/PostTodo';
import type { Application } from '../../../../types/application';

interface SectionHeaderProps {
  title: string;
  count?: number;
  applications?: Application[]; // 공고 리스트를 부모로부터 받을 수 있게 추가
}

const SectionHeader = ({ title, count, applications = [] }: SectionHeaderProps) => {
  // 1. 모달 열림/닫힘 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. 모달에서 '확인'을 눌렀을 때 실행될 로직
  const handlePostTodo = (data: any) => {
    console.log('새로운 할 일 데이터:', data);
    // TODO: 여기서 API를 호출하거나 상태 관리 라이브러리(Zustand 등)에 저장
    setIsModalOpen(false); // 처리 후 모달 닫기
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
          {/* 개수 표시 배지 */}
          {count !== undefined && (
            <span className="flex items-center justify-center w-5 h-5 bg-gray-200 text-gray-500 text-[11px] font-bold rounded-full">
              {count}
            </span>
          )}
        </div>
        
        {/* 플러스 버튼: 클릭 시 모달 Open */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Plus size={20} className="text-gray-400" />
        </button>
      </div>

      {/* 3. PostTodo 모달 연결 */}
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