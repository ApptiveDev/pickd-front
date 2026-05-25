import { createPortal } from "react-dom"; // 1. createPortal 추가

interface ModalLayoutProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function ModalLayout({ isOpen, onClose, title, children }: ModalLayoutProps) {
  if (!isOpen) return null;
  
  // 서버 사이드 렌더링(SSR) 환경에서 document가 없을 때 발생할 수 있는 에러 방지
  if (typeof window === "undefined") return null;

  // 2. 기존 JSX 구조 전체를 createPortal로 감싸서 document.body로 던져줍니다.
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
      {/* 백드롭 바깥 영역을 클릭해도 모달이 닫히게 하고 싶다면 이 div를 활용할 수 있습니다 */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
      
      <div className="w-[600px] rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body // 3. 렌더링 위치를 body로 지정
  );
}