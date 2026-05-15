export type DocumentStatus = "작성중" | "수정중" | "검토중" | "완료";

export interface DocumentItem {
  id: number;
  title: string;
  company: string;
  type: string;
  progress: number;
  status: DocumentStatus;
  updatedAt: string;
}
