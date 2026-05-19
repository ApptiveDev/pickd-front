import type { ExperienceType } from "../../types/experience";

const EXPERIENCE_FIELDS = [
  { key: "overview", label: "개요" },
  { key: "background", label: "시작 배경" },
  { key: "goal", label: "목표" },
  { key: "problem", label: "문제 상황" },
  { key: "myRole", label: "나의 역할" },
  { key: "execution", label: "실행 과정" },
  { key: "collab", label: "협업 방식" },
  { key: "result", label: "결과 / 성과" },
  { key: "metric", label: "수치 성과" },
  { key: "learned", label: "배운 점" },
  { key: "resumePoint", label: "자소서 활용 포인트" },
  { key: "interviewPoint", label: "면접 활용 포인트" },
];

export const FIELD_SCHEMA: Record<
  ExperienceType,
  {
    key: string;
    label: string;
  }[]
> = {
  프로젝트: EXPERIENCE_FIELDS.map((field) => ({
    ...field,
    label: field.key === "overview" ? "경험 개요" : field.label,
  })),

  대외활동: EXPERIENCE_FIELDS.map((field) => ({
    ...field,
    label: field.key === "overview" ? "활동 개요" : field.label,
  })),

  인턴: EXPERIENCE_FIELDS.map((field) => ({
    ...field,
    label: field.key === "overview" ? "인턴 개요" : field.label,
  })),

  봉사: EXPERIENCE_FIELDS.map((field) => ({
    ...field,
    label: field.key === "overview" ? "봉사 개요" : field.label,
  })),

  교환학생: EXPERIENCE_FIELDS.map((field) => ({
    ...field,
    label: field.key === "overview" ? "교환학생 개요" : field.label,
  })),

  창업: EXPERIENCE_FIELDS.map((field) => ({
    ...field,
    label: field.key === "overview" ? "창업 개요" : field.label,
  })),

  학회: EXPERIENCE_FIELDS.map((field) => ({
    ...field,
    label: field.key === "overview" ? "학회 개요" : field.label,
  })),

  사용자조사: EXPERIENCE_FIELDS.map((field) => ({
    ...field,
    label: field.key === "overview" ? "조사 개요" : field.label,
  })),

  해외경험: EXPERIENCE_FIELDS.map((field) => ({
    ...field,
    label: field.key === "overview" ? "해외경험 개요" : field.label,
  })),

  학점: [{ key: "detail", label: "상세 정보" }],
  수강과목: [{ key: "detail", label: "상세 정보" }],
  자격증: [{ key: "detail", label: "상세 정보" }],
  수상: [{ key: "detail", label: "상세 정보" }],
  교육: [{ key: "detail", label: "상세 정보" }],
  어학: [{ key: "detail", label: "상세 정보" }],
};
