export const createTodo = async (data: {
  title: string;
  dueDate?: string;
  dueTime?: string;
  memo?: string;
  applicationId?: number;
}) => {
  const res = await fetch("/api/todo", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("할 일 생성 실패");
  }

  return res.json();
};

export const toggleTodoApi = async (id: number) => {
  await fetch(`/api/todo/${id}`, {
    method: "PUT",
    credentials: "include",
  });
};

export const deleteTodoApi = async (id: number) => {
  await fetch(`/api/todo/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
};

export const getTodos = async () => {
  const res = await fetch("/api/todo", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("할 일 조회 실패");
  }

  return res.json();
};