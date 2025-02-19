"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchTodos, deleteTodo } from "@/lib/api";
import { Todo } from "@/types/types";

export const TodosTable = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await fetchTodos();
        setTodos(data);
      } catch (err) {
        setError("Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    console.log(id);
    try {
      await deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
      setError("Failed to delete task.");
    }
  }, []);

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`/edit/${id}`);
    },
    [router]
  );

  return (
    <div className="rounded-lg border border-stroke shadow-md max-h-[72vh] overflow-auto">
      <div className="flex justify-between items-center py-4 px-6 bg-gray-100 dark:bg-gray-800 border-b border-stroke dark:border-strokedark">
        <h4 className="text-lg font-semibold text-black dark:text-white">
          Task List
        </h4>
      </div>

      {error ? (
        <p className="text-center py-4 text-red-500">{error}</p>
      ) : loading ? (
        // Skeleton Loader when loading
        <div className="animate-pulse space-y-4 p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md"
            ></div>
          ))}
        </div>
      ) : todos.length === 0 ? (
        <p className="text-center py-6 text-gray-500 dark:text-gray-400">
          No tasks available.
        </p>
      ) : (
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr className=" text-left text-sm">
              {[
                "Title",
                "Description",
                "Status",
                "Priority",
                "Due Date",
                "Actions",
              ].map((heading, index) => (
                <th key={index} className="px-6 py-3  w-1/5">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="">
            {todos.map(
              ({ id, title, description, status, priority, dueDate }) => (
                <tr key={id} className="border-b border-stroke  text-sm ">
                  <td className="px-6 py-4 ">{title}</td>
                  <td className="px-6 py-4   hidden md:table-cell">
                    {description}
                  </td>
                  <td className="px-6 py-4">{status}</td>
                  <td className="px-6 py-4">{priority}</td>
                  <td className="px-6 py-4  ">{dueDate}</td>
                  <td className="px-6 py-4 flex space-x-4">
                    <button
                      onClick={() => handleEdit(id ?? "")}
                      className=" hover:text-blue-800"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(id ?? "")}
                      className="text-gray-600 hover:text-red-800"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};
