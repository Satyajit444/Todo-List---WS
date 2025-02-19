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
        const data = await response.json();
        setTodo(data);
      } catch (error) {
        console.error("Error fetching todo:", error);
      }
    };

    if (id) fetchTodo();
  }, [id]);

  return (
    <div>{todo ? <CreateTodo todoToEdit={todo} /> : <p>Loading...</p>}</div>
  );
};

export default EditTodoPage;
