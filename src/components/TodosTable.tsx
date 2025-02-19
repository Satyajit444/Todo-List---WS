"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchTodos, deleteTodo } from "@/lib/api";
import { Todo } from "@/types/types";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import useFilterSort from "@/hooks/useFilterSort";

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

  // Drag-and-drop setup
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = todos.findIndex((todo) => todo.id === active.id);
    const newIndex = todos.findIndex((todo) => todo.id === over.id);

    setTodos(arrayMove(todos, oldIndex, newIndex));
  };

  // Use custom hook for filtering and sorting
  const { filteredTodos, setFilters, setSortBy } = useFilterSort(todos);

  return (
    <div className="rounded-lg border border-stroke shadow-md max-h-[72vh] overflow-auto">
      <div className="flex justify-between items-center px-6 py-2 border-b border-stroke ">
        <h4 className="text-lg font-semibold ">Task List</h4>
        <div className="flex flex-wrap gap-4 ">
          <select
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setFilters((prevFilters) => ({
                ...prevFilters,
                status: e.target.value,
              }))
            }
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setFilters((prevFilters) => ({
                ...prevFilters,
                priority: e.target.value,
              }))
            }
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="title">Sort by Title</option>
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      {error ? (
        <p className="text-center py-4 text-red-500">{error}</p>
      ) : loading ? (
        <div className="animate-pulse space-y-4 p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md"
            ></div>
          ))}
        </div>
      ) : filteredTodos.length === 0 ? (
        <p className="text-center py-6 ">No tasks available.</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredTodos as []}
            strategy={verticalListSortingStrategy}
          >
            <table className="w-full border-collapse table-fixed">
              <thead>
                <tr className="text-left text-sm">
                  {[
                    "Title",
                    "Description",
                    "Status",
                    "Priority",
                    "Due Date",
                    "Actions",
                  ].map((heading, index) => (
                    <th key={index} className="px-6 py-3 w-1/5">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTodos?.map((task) => (
                  <SortableRow
                    key={task.id}
                    task={task}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

// Sortable row component
const SortableRow = ({
  task,
  handleEdit,
  handleDelete,
}: {
  task: Todo;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id as string });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border-b border-stroke text-sm cursor-grab"
    >
      <td className="px-6 py-4">{task.title}</td>
      <td className="px-6 py-4  hidden md:table-cell">{task.description}</td>
      <td className="px-6 py-4">{task.status}</td>
      <td className="px-6 py-4">{task.priority}</td>
      <td className="px-6 py-4 ">{task.dueDate}</td>
      <td className="px-6 py-4 flex space-x-4">
        <button
          onClick={() => handleEdit(task.id as string)}
          className="text-gray-600 hover:text-blue-800"
        >
          ✏️
        </button>
        <button
          onClick={() => handleDelete(task.id as string)}
          className="text-gray-600 hover:text-red-800"
        >
          🗑️
        </button>
      </td>
    </tr>
  );
};
