import type { Todo } from "./todo";
import type { DocumentItem } from "./document";

export type Application = {
  id: number;
  company: string;
  jobTitle: string;
  position: string;
  industry: string;
  applyDate: string;
  interviewDate?: string;
  deadlineDate?: string;
  status: "준비중" | "지원완료" | "마감완료" | "마감임박";
  submitted?: boolean;
  checklistInComplete?: boolean;

  documents?: DocumentItem[];
  memo?: string;
  todos?: Todo[];
};

export type RegistrationTab = "URL" | "PDF" | "IMAGE" | "MANUAL";
