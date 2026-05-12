import type { Todo } from "./todo";

export type Application = {
  id: number;
  company: string;
  jobTitle: string;
  position: string;
  industry: string;
  status: "진행중" | "지원완료" | "마감완료" | "마감임박";
  applyDate: string;
  interviewDate?: string;
  deadlineDate?: string;
  memo?: string;
  file?: File | null;
  submitted?: boolean;
  checklistInComplete?: boolean;

  todos?: Todo[];
};

export type RegistrationTab = "URL" | "PDF" | "IMAGE" | "MANUAL";
