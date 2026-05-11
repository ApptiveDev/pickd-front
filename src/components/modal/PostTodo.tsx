import React, { useState } from "react";

interface PostTodoProps {
  onClose: () => void;
  onConfirm: (data: {
    summary: string;
    dueDate: string;
    dueTime: string;
    relatedJob: string;
    memo: string;
  }) => void;
}

export default function PostTodo({ onClose, onConfirm }: PostTodoProps) {
  const [formData, setFormData] = useState({
    summary: "",
    dueDate: "",
    dueTime: "",
    relatedJob: "",
    memo: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirm = () => {
    // 2. 필수 입력값 검증 (예: 제목은 필수)
    if (!formData.summary.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    // 3. 부모 컴포넌트로 데이터 전달
    onConfirm(formData);
  };

  return (
    <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl" onClick={(e) => e.stopPropagation()}>
      <h2 className="text-xl font-bold mb-4 text-[#0F172A]">할 일 추가</h2>

      <div className="space-y-4">
        {/* 각 input에 name 속성을 추가하고 value와 onChange를 연결합니다. */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
          <input
            name="summary"
            type="text"
            placeholder="제목을 입력하세요"
            value={formData.summary}
            onChange={handleChange}
            className="w-full border p-2 rounded outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">마감일</label>
          <input
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full border p-2 rounded outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">마감시간</label>
          <input
            name="dueTime"
            type="time"
            value={formData.dueTime}
            onChange={handleChange}
            className="w-full border p-2 rounded outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">관련공고</label>
          <input
            name="relatedJob"
            type="text"
            placeholder="관련 공고명"
            value={formData.relatedJob}
            onChange={handleChange}
            className="w-full border p-2 rounded outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">메모</label>
          <textarea
            name="memo"
            placeholder="메모를 입력하세요"
            value={formData.memo}
            onChange={handleChange}
            className="w-full border p-2 rounded h-24 resize-none outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">
          취소
        </button>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 bg-[#2563EB] text-white rounded hover:bg-blue-700 transition"
        >
          확인
        </button>
      </div>
    </div>
  );
}