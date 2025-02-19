import React, { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { createOrUpdateTodo } from "@/lib/api";
import { Todo } from "@/types/types";
import { showToast } from "@/utils/toast";
import { useRouter } from "next/navigation";

interface CreateTodoProps {
  todoToEdit?: Todo;
  onSave?: (todo: Todo) => void;
  onDelete?: (id: number) => void;
}

const CreateTodo: React.FC<CreateTodoProps> = ({
  todoToEdit,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<Todo>({
    title: "",
    description: "",
    status: "in_progress",
    priority: "medium",
    dueDate: "",
  });

  const [dropdowns, setDropdowns] = useState({
    status: false,
    priority: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const statusOptions = ["Pending", "In Progress", "Completed"];
  const priorityOptions = ["Low", "Medium", "High"];
  const router = useRouter();
  const statusMap: Record<string, string> = {
    Pending: "pending",
    "In Progress": "in_progress",
    Completed: "completed",
  };

  const priorityMap: Record<string, string> = {
    Low: "low",
    Medium: "medium",
    High: "high",
  };
  useEffect(() => {
    if (todoToEdit) {
      setFormData(todoToEdit);
    }
  }, [todoToEdit]);

  const handleChange = (field: keyof Todo, value: string) => {
    const mappedValue =
      field === "status"
        ? statusMap[value]
        : field === "priority"
        ? priorityMap[value]
        : value;

    setFormData({ ...formData, [field]: mappedValue });
    setDropdowns({ ...dropdowns, [field]: false });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true); // Show loading state

      const updatedTodo = await createOrUpdateTodo(formData); // API call

      onSave?.(updatedTodo); // Pass the created todo back to parent component
      setFormData({
        title: "",
        description: "",
        status: "in_progress",
        priority: "low",
        dueDate: "",
      });
      showToast("Todo saved successfully!", "success");
    } catch (error) {
      console.error("Error creating todo:", error);
      showToast("Error creating todo!", "error");
      router.push("/");
    } finally {
      setIsLoading(false); // Remove loading state
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 shadow-xl rounded-lg  mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        {todoToEdit ? "Edit Task" : "Create New Task"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
          required
            type="text"
            name="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="mt-1 w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Enter task title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
          required
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className="mt-1 w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Enter task description"
          ></textarea>
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <div
            className="mt-1 w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white flex justify-between items-center cursor-pointer"
            onClick={() =>
              setDropdowns({ ...dropdowns, status: !dropdowns.status })
            }
          >
            {formData.status}
            <ChevronDownIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </div>
          {dropdowns.status && (
            <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
              {statusOptions.map((option) => (
                <li
                  key={option}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleChange("status", option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Priority Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Priority
          </label>
          <div
            className="mt-1 w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white flex justify-between items-center cursor-pointer"
            onClick={() =>
              setDropdowns({ ...dropdowns, priority: !dropdowns.priority })
            }
          >
            {formData.priority}
            <ChevronDownIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </div>
          {dropdowns.priority && (
            <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
              {priorityOptions.map((option) => (
                <li
                  key={option}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleChange("priority", option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Due Date
          </label>
          <input
          required
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            className="mt-1 w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
            disabled={isLoading} // Disable button during API call
          >
            {isLoading
              ? "Creating..."
              : todoToEdit
              ? "Update Task"
              : "Create Task"}
          </button>

          {todoToEdit && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(Number(todoToEdit.id))}
              className="ml-4 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              Delete Task
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateTodo;
