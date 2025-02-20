"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchTodos, deleteTodo } from "@/lib/api";
import { Todo } from "@/types/types";
import moment from "moment";

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import useFilterSort from "@/hooks/useFilterSort";
import { MdDragIndicator } from "react-icons/md";
import { showToast } from "@/utils/toast";

// Define types explicitly
type Status = "pending" | "in_progress" | "completed";
type Priority = "low" | "medium" | "high";

// Status Formatting & Colors
const statusMap: Record<Status, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

const statusColors: Record<Status, string> = {
  pending: "bg-yellow-200 text-yellow-800",
  in_progress: "bg-blue-200 text-blue-800",
  completed: "bg-green-200 text-green-800",
};

const formatStatus = (status?: Status): string =>
  statusMap[status ?? "pending"];

// Priority Formatting & Colors
const priorityMap: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const priorityColors: Record<Priority, string> = {
  low: "bg-green-200 text-green-800",
  medium: "bg-orange-200 text-orange-800",
  high: "bg-red-200 text-red-800",
};

const formatPriority = (priority?: Priority): string =>
  priorityMap[priority ?? "low"];

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
        console.log(err);

        setError("Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  const handleDelete = async (id: string) => {
    console.log("triggered");
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    setFilteredTodos((prevFilteredTodos) =>
      prevFilteredTodos.filter((todo) => todo.id !== id)
    );

    try {
      await deleteTodo(id);
      showToast("Todo deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting todo:", error);
      setError("Failed to delete task.");
      showToast("Failed to delete task!", "error");
    }
  };

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`/edit/${id}`);
    },
    [router]
  );

  // Drag-and-drop setup
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filteredTodos.findIndex((todo) => todo.id === active.id);
    const newIndex = filteredTodos.findIndex((todo) => todo.id === over.id);

    setFilteredTodos(arrayMove(filteredTodos, oldIndex, newIndex));
  };

  // Use custom hook for filtering and sorting
  const { filteredTodos, setFilteredTodos, setFilters, setSortBy } =
    useFilterSort(todos);

  return (
    <div className="rounded-lg border border-stroke shadow-md max-h-[72vh] overflow-auto">
      <div className="flex justify-between items-center px-6 py-2 border-b border-stroke ">
        <h4 className="text-lg font-semibold ">Task List</h4>
        <div className="flex flex-wrap gap-4 ">
          <select
            className="p-2 border dark:bg-slate-800 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
            className="p-2 border border-gray-300 dark:bg-slate-800 rounded-md focus:ring-2 focus:ring-blue-500"
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
            className="p-2 border dark:bg-slate-800 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
              <thead className="border-b">
                <tr className="text-left text-sm">
                  <th className="px-6 py-3 w-20">{""}</th>
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
    <tr style={style} className="border-b border-stroke text-sm">
      <td
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className="cursor-grab px-4 w-20"
      >
        <MdDragIndicator />
      </td>
      <td className="px-6 py-4">{task.title}</td>
      <td className="px-6 py-4">{task.description}</td>
      <td>
        <span
          className={`px-3 py-1 text-center rounded-full ${
            statusColors[task.status ?? "pending"]
          }`}
        >
          {formatStatus(task.status)}
        </span>
      </td>
      <td>
        {" "}
        <span
          className={`px-3 py-1 text-center rounded-full ${
            priorityColors[task.priority ?? "low"]
          }`}
        >
          {formatPriority(task.priority)}
        </span>
      </td>
      <td className="px-6 py-4">
        {moment(task.dueDate).format("MMM D, YYYY")}
      </td>
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
