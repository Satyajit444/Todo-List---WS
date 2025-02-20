"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CreateTodo from "@/components/CreateTodo";

const EditTodoPage = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [todo, setTodo] = useState(null);

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await fetch(`/api/todo/${id}`); // Fetch the todo by ID
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setTodo(data);
      } catch (error) {
        console.error("Error fetching todo:", error);
      }
    };

    if (id) fetchTodo();
  }, [id]);

  return (
    <div>
      {todo ? (
        <CreateTodo todoToEdit={todo} />
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-500">Loading...</p>
        </div>
      )}
    </div>
  );
};

export default EditTodoPage;
