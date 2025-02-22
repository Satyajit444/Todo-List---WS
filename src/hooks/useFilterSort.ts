import { useState, useEffect } from "react";
import { Todo } from "@/types/types";

const useFilterSort = (todos: Todo[]) => {
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>(todos);
  const [filters, setFilters] = useState<{ status?: string; priority?: string }>({
    status: undefined,
    priority: undefined,
  });
  const [sortBy, setSortBy] = useState<string>("title");

  useEffect(() => {
    // Filter todos based on status and priority
    const filtered = todos.filter((todo) => {
      const matchesStatus = filters.status ? todo.status === filters.status : true;
      const matchesPriority = filters.priority ? todo.priority === filters.priority : true;
      return matchesStatus && matchesPriority;
    });

    // Sort the filtered todos
    const sorted = filtered.sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "dueDate") {
        return (
          new Date(a.dueDate ?? "").getTime() -
          new Date(b.dueDate ?? "").getTime()
        );
      } else if (sortBy === "priority") {
        return (a.priority ?? "").localeCompare(b.priority ?? "");
      } else if (sortBy === "status") {
        return (a.status ?? "").localeCompare(b.status ?? "");
      }
      return 0;
    });

    setFilteredTodos(sorted);
  }, [todos, filters, sortBy]);

  return {
    filteredTodos,
    setFilteredTodos,
    setFilters,
    setSortBy,
  };
};

export default useFilterSort;
