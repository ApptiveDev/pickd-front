import { useApplicationForm } from "../../hooks/useApplicationForm";
import type { RegistrationTab } from "../../types/application";

export default function PostRegistration({ onClose, onSubmit }: any) {
  const {
    activeTab,
    setActiveTab,
    formData,
    updateField,
    pdfInputRef,
    imageInputRef,
    handleUploadClick,
    handleFileChange,
  } = useApplicationForm();

  const tabs: { id: RegistrationTab; label: string }[] = [
    { id: "URL", label: "URL 입력" },
    { id: "PDF", label: "PDF 업로드" },
    { id: "IMAGE", label: "이미지 업로드" },
    { id: "MANUAL", label: "직접 입력" },
  ];

  return (
    <div className="w-full">
      {/* 탭 메뉴 */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white shadow-sm text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 숨겨진 파일 인풋 */}
      <input
        type="file"
        ref={pdfInputRef}
        onChange={(e) => handleFileChange(e, "PDF")}
        accept=".pdf"
        className="hidden"
      />
      <input
        type="file"
        ref={imageInputRef}
        onChange={(e) => handleFileChange(e, "IMAGE")}
        accept="image/*"
        className="hidden"
      />

      {/* 컨텐츠 영역 */}
      <div className="min-h-[300px]">
        {activeTab === "URL" && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 font-medium">
              채용 공고의 URL을 붙여넣으세요.
            </p>
            <input
              type="text"
              placeholder="https://example.com/jobs/..."
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        )}

        {(activeTab === "PDF" || activeTab === "IMAGE") && (
          <div
            onClick={handleUploadClick}
            className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-14 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group"
          >
            <div className="bg-blue-50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform text-blue-500 text-3xl">
              📤
            </div>
            <p className="text-gray-600 font-semibold text-center">
              {activeTab === "PDF" ? "PDF 파일" : "공고 이미지"}를 클릭하여
              업로드
              <br />
              <span className="text-gray-400 text-sm font-normal mt-2 block">
                최대 {activeTab === "PDF" ? "10MB" : "5MB"}
              </span>
            </p>
          </div>
        )}

        {activeTab === "MANUAL" && (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="기업명"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.company}
              onChange={(e) => updateField("company", e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="공고명"
                className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.jobTitle}
                onChange={(e) => updateField("jobTitle", e.target.value)}
              />
              <input
                type="text"
                placeholder="직무"
                className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.position}
                onChange={(e) => updateField("position", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="산업"
                className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.industry}
                onChange={(e) => updateField("industry", e.target.value)}
              />
              <input
                type="date"
                className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.deadline}
                onChange={(e) => updateField("deadline", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* 푸터 버튼 */}
      <div className="flex justify-end gap-3 mt-10">
        <button
          onClick={onClose}
          className="px-6 py-2.5 rounded-xl font-bold bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
        >
          취소
        </button>
        <button
          onClick={() => {
            if (!formData.company && activeTab === "MANUAL") {
              alert("기업명을 입력해주세요");
              return;
            }
            onSubmit(formData);
          }}
          className="px-8 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          등록하기
        </button>
      </div>
    </div>
  );
}
