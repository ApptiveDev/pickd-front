import { getDDay } from "../../../utils/application";
import { useApplication } from "../../../context/ApplicationContext";

export default function ApplicationState() {
  const { applications } = useApplication();
  const total = applications.length;
  const ongoing = applications.filter((a) => a.status === "준비중").length;
  const urgent = applications.filter((a) => {
    const dday = getDDay(a.deadlineDate);
    return (
      dday === "D-Day" ||
      (dday.startsWith("D-") && parseInt(dday.replace("D-", "")) <= 7)
    );
  }).length;
  const done = applications.filter((a) => {
    const dday = getDDay(a.deadlineDate);
    return dday.startsWith("D+");
  }).length;
  const submitted = applications.filter((a) => a.submitted).length;

  const checklist = applications.filter((a) => {
    const todos = a.todos || [];
    return todos.length > 0 && todos.some((todo) => !todo.completed);
  }).length;

  return (
    <div className="flex items-center gap-10 text-[13px] font-[600]">
      <span className="rounded-xl rounded-bl-none px-4 py-2 flex gap-2 bg-[#EFF6FF] text-[#2563EB]">
        전체 {total}
      </span>
      <span className="text-[#64748B]">진행중 {ongoing}</span>
      <span className="text-[#64748B]">마감임박 {urgent}</span>
      <span className="text-[#64748B]">마감완료 {done}</span>
      <span className="text-[#64748B]">제출완료 {submitted}</span>
      <span className="text-[#64748B]">할 일 미완료 {checklist}</span>
    </div>
  );
}
