export type ExperienceType =
  | "프로젝트"
  | "대외활동"
  | "인턴"
  | "봉사"
  | "교환학생"
  | "창업"
  | "학회"
  | "사용자조사"
  | "해외경험"
  | "학점"
  | "수강과목"
  | "자격증"
  | "수상"
  | "교육"
  | "어학";

export type ExperienceStatus =
  | "정리 완료"
  | "보완 필요"
  | "확인 필요"
  | "정보 부족"
  | "AI 질문 필요"
  | "병합 필요";

export interface ExperienceItem {
  id: number;
  type: ExperienceType;
  name: string;
  org?: string;
  period?: string;
  role?: string;
  importance?: "높음" | "보통" | "낮음";
  competencies: string[];
  keywords: string[];
  status: ExperienceStatus;
  missing: string[];
  pinned?: boolean;
  linkedExperienceIds: number[];
  fields: Record<string, string>;
}