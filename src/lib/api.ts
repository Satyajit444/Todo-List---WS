import { Todo } from "@/types/types";

const BASE_URL = "/api/todo/get-all-todos";

// Fetch All Todos
export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch(BASE_URL);
  console.log("🚀 ~ fetchTodos ~ response:", response);
  if (!response.ok) throw new Error("Failed to fetch todos");
  return response.json();
};

// Create Todo
export const createOrUpdateTodo = async (
  data: Partial<Todo>
): Promise<Todo> => {
  try {
    console.log("Sending request to create/update todo:", data);

    const response = await fetch("/api/todo/create-todo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create/update todo: ${errorText}`);
    }

    const result = await response.json();
    console.log("Todo created/updated successfully:", result);
    return result;
  } catch (error) {
    console.error("Error in createOrUpdateTodo:", error);
    throw error;
  }
};

// Delete Todo
export const deleteTodo = async (id: string): Promise<void> => {
  try {
    console.log("Deleting todo with ID:", id);

    const response = await fetch(`/api/todo/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete todo: ${errorText}`);
    }

    console.log("Todo deleted successfully");
  } catch (error) {
    console.error("Error in deleteTodo:", error);
    throw error;
  }
};
