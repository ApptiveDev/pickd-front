import { useState, useEffect } from "react";

function createDateTime(date: Date, time: string) {
  if (!time) throw new Error("time 없음");

  const parts = time.split(":");
  if (parts.length < 2) throw new Error("time 형식 이상");

  const [h, m] = parts;

  const d = new Date(date);

  d.setHours(Number(h));
  d.setMinutes(Number(m));
  d.setSeconds(0);

  if (isNaN(d.getTime())) throw new Error("잘못된 날짜");

  return d.toISOString();
}

export default function CalendarModal({
  onClose,
  onCreate,
  selectedDate,
}: {
  onClose: () => void;
  onCreate: (data: any) => void;
  selectedDate: Date;
}) {
  const [summary, setSummary] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState<"면접" | "마감" | "제출" | "일반">(
    "일반",
  );

  useEffect(() => {
    setTime("09:00");
  }, [selectedDate]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-80">
        <h2 className="font-bold mb-3">일정 추가</h2>

        <input
          type="text"
          placeholder="일정 제목"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <div className="mt-3">
          <p className="text-sm mb-1 text-gray-500">카테고리</p>

          <div className="flex gap-2">
            {["면접", "마감", "제출", "일반"].map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c as any)}
                className={`
          px-3 py-1 rounded text-xs
          ${
            category === c
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-600"
          }
        `}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose}>취소</button>

          <button
            onClick={() => {
              if (!summary || !time) {
                alert("제목이랑 시간을 입력해 주세요.");
                return;
              }

              const dateTime = createDateTime(selectedDate, time);

              onCreate({
                summary,
                start: {
                  dateTime,
                },
                category,
              });

              onClose();
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            생성
          </button>
        </div>
      </div>
    </div>
  );
}
