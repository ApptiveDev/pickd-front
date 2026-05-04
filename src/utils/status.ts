export function getStatusStyle(status: string) {
  switch (status) {
    case "준비중":
      return "bg-[#EFF6FF] text-[#3B8EF6]";
    case "지원완료":
      return "bg-[#ECFDF5] text-[#10B981]";
    case "면접진행":
      return "bg-yellow-100 text-yellow-600";
    case "불합격":
      return "bg-gray-200 text-gray-600";
    case "최종합격":
      return "bg-red-100 text-red-600";
    default:
      return "bg-[#E2E8F0] text-[#94A3B8]";
  }
}
