import { useState } from "react";
import { api } from "../utils/api";

const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState("");

  const [priority, setPriority] =
    useState("medium");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await api.post(
        "/tasks",
        {
          title,
          priority,
        }
      );

      onTaskCreated(result.data);

      setTitle("");
      setPriority("medium");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <form
      className="task-form"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Enter task title..."
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <select
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value)
        }
      >
        <option value="low">
          Low
        </option>

        <option value="medium">
          Medium
        </option>

        <option value="high">
          High
        </option>
      </select>

      <button
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Adding..."
          : "Add Task"}
      </button>

      {error && (
        <p className="error">
          {error}
        </p>
      )}
    </form>
  );
};

export default TaskForm;