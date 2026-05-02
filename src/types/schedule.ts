export interface Schedule {
  id: string;
  summary: string;
  start: { dateTime: string };
  category?: "면접" | "마감" | "제출" | "일반";
}
