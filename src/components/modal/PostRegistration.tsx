import * as React from "react";
import { useApplicationForm } from "../../hooks/useApplicationForm";
import type { RegistrationTab } from "../../types/application";
import { LinkIcon, PdfIcon, ImageIcon, ManualIcon } from "../../assets"; 

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

  const tabs: { id: RegistrationTab; label: string; icon: React.ReactNode }[] = [
    { id: "URL", label: "URL 입력", icon: <LinkIcon size={14} color="currentColor" /> },
    { id: "PDF", label: "PDF 업로드", icon: <PdfIcon size={14} color="currentColor" /> },
    { id: "IMAGE", label: "이미지 업로드", icon: <ImageIcon size={14} color="currentColor" /> },
    { id: "MANUAL", label: "직접 입력", icon: <ManualIcon size={14} color="currentColor" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
      <div className="w-full max-w-[500px] bg-white rounded-[24px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-7 pt-6 pb-4">
          <h2 className="text-[20px] font-extrabold text-[#0F172A] tracking-tight">
            공고등록
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <span className="text-[18px] text-[#94A3B8] font-light">✕</span>
          </button>
        </div>

        <div className="px-7">
          <div className="h-[1px] bg-[#E2E8F0] w-full" />
        </div>

        <div className="p-7">
          <div className="flex bg-[#F8F9FB] p-1 rounded-xl mb-6">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[13px] font-bold transition-all ${
                    isActive
                      ? "bg-white shadow-sm text-[#0F172A]"
                      : "text-[#94A3B8] hover:text-gray-500"
                  }`}
                >
                  {tab.icon}
                  <span className="whitespace-nowrap leading-none">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <input type="file" ref={pdfInputRef} onChange={(e) => handleFileChange(e, "PDF")} accept=".pdf" className="hidden" />
          <input type="file" ref={imageInputRef} onChange={(e) => handleFileChange(e, "IMAGE")} accept="image/*" className="hidden" />

          <div className="min-h-[180px] mb-8 flex flex-col justify-center">
            {activeTab === "URL" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 px-1 text-[#64748B]">
                  <LinkIcon size={14} />
                  <p className="text-[14px] font-semibold tracking-tight">
                    채용 공고 URL을 입력하세요.
                  </p>
                </div>

                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors">
                    <LinkIcon size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="공고 상세 페이지의 URL을 붙여넣어 주세요"
                    className="w-full py-3.5 pl-11 pr-4 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-300 text-[14px]"
                    value={(formData as any).url || ""}
                    onChange={(e) => updateField("url" as any, e.target.value)}
                  />
                </div>
                <p className="text-[12px] text-[#94A3B8] font-medium leading-relaxed px-1">
                  * AI가 공고 내용을 자동으로 분석하여 가져옵니다.
                </p>
              </div>
            )}

            {(activeTab === "PDF" || activeTab === "IMAGE") && (
              <div
                onClick={handleUploadClick}
                className="border-2 border-dashed border-[#E2E8F0] rounded-[5px] flex flex-col items-center justify-center py-10 px-6 hover:border-[#0F172A] hover:bg-blue-50/10 transition-all cursor-pointer group"
              >
                <div className="mb-3 text-[#94A3B8] group-hover:text-blue-500 transition-all group-hover:scale-105">
                  {activeTab === "PDF" ? <PdfIcon size={36} color="#64748B" /> : <ImageIcon size={34} />}
                </div>
                <div className="text-center">
                  <p className="text-[#475569] text-[15px] font-bold">
                    {activeTab === "PDF" ? "PDF 파일을 드래그 하거나 클릭하여 업로드" : "이미지 파일을 드래그 하거나 클릭하여 업로드"} 
                  </p>
                  <p className="text-[#94A3B8] text-[12px] mt-1 font-medium">
                    최대 {activeTab === "PDF" ? "10MB" : "5MB"} 지원
                  </p>
                </div>
              </div>
            )}

            {activeTab === "MANUAL" && (
              <div className="flex flex-col gap-3 animate-in fade-in duration-300">
                {["company", "jobTitle", "position"].map((field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field === "company" ? "기업명" : field === "jobTitle" ? "공고명" : "직무명"}
                    className="w-full py-3.5 px-4 border border-[#E2E8F0] rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-300"
                    value={(formData as any)[field]}
                    onChange={(e) => updateField(field as any, e.target.value)}
                  />
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onSubmit(formData)}
            className="w-full py-4 rounded-[16px] font-bold bg-[#0F172A] text-white text-[16px] hover:bg-[#1e293b] shadow-lg shadow-gray-200 transition-all active:scale-[0.98]"
          >
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
}