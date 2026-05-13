import React, { useState } from "react";
import { type Application } from "../../types/application"

interface PostTodoProps {
  onClose: () => void;
  applications: Application[];
  onConfirm: (data: {
    summary: string;
    dueDate: string;
    dueTime: string;
    relatedJob: string;
    memo: string;
  }) => void;
}

export default function PostTodo({ onClose, onConfirm, applications }: PostTodoProps) {
  const [formData, setFormData] = useState({
    summary: "",
    dueDate: "",
    dueTime: "",
    relatedJob: "",
    memo: "",
  });

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  const handleConfirm = () => {
    if (!formData.summary.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    onConfirm(formData);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
    <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl" onClick={(e) => e.stopPropagation()}>
      <h2 className="text-xl font-bold mb-4 text-[#0F172A]">할 일 추가</h2>

      <div className="space-y-4">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">연결 공고</label>
          <select
            name="relatedJob"
            value={formData.relatedJob}
            onChange={handleChange}
            className="w-full border p-2 rounded outline-none focus:border-blue-500 bg-white cursor-pointer"
          >
            <option value="">연결할 공고를 선택하세요 (선택)</option>
            {applications.map((app) => (
              <option key={app.id} value={app.company}>
                {app.company}
              </option>
            ))}
          </select>
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
  </div>
  );
}
