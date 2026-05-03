import ModalLayout from "./ModalLayout";

interface CompanyInfoProps {
  isOpen: boolean;
  onClose: () => void;
  data: any; 
}

// 일단 와이어프레임이랑 똑같이 구현함. 추후 내용 수정 필요 

export default function CompanyInfo({ isOpen, onClose, data }: CompanyInfoProps) {
  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} title={`${data.companyName} 공고 정보`}>
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* TIER 1 섹션 */}
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 relative">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-900">TIER 1: 무조건 보는 정보</h3>
            <button className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
              <span>✏️</span> 수정
            </button>
          </div>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• 지원 일정 마감: {data.deadline || "정보 없음"}</li>
            <li>• 지원 자격요건: {data.requirements || "정보 없음"}</li>
            <li>• 채용 규모 직군: {data.scale || "정보 없음"}</li>
          </ul>
        </div>

        {/* TIER 2 섹션 */}
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-900">TIER 2: 개인화 맞춤 핵심 정보</h3>
            <button className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
              <span>✏️</span> 수정
            </button>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {data.tier2Content || "등록된 맞춤 정보가 없습니다."}
          </p>
        </div>

        {/* 하단 푸터 문구 */}
        <p className="text-[11px] text-gray-300 text-center mt-4">
          공고에 있는 경우는 없지만 사용자가 궁금해함. 따라서 직접 채우게함
        </p>
      </div>
    </ModalLayout>
  );
}