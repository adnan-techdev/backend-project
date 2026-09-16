import { useState } from "react";
import { api } from "../utils/api";

const TaskItem = ({
  task,
  onTaskUpdated,
  onTaskDeleted,
}) => {
  const [loading, setLoading] =
    useState(false);


  const toggleCompleted = async () => {
    try {
      setLoading(true);

      const result = await api.put(
        `/tasks/${task._id}`,
        {
          completed: !task.completed,
        }
      );

      onTaskUpdated(result.data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };


  const deleteTask = async () => {
    const confirmed =
      window.confirm(
        "Delete this task?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      await api.delete(
        `/tasks/${task._id}`
      );

      onTaskDeleted(task._id);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className={`task-item ${
        task.completed
          ? "completed"
          : ""
      }`}
    >
      <div className="task-content">

        <h3>{task.title}</h3>

        <div className="task-meta">

          <span
            className={`priority ${task.priority}`}
          >
            {task.priority}
          </span>

          <span>
            {task.completed
              ? "Completed"
              : "Pending"}
          </span>

        </div>

      </div>


      <div className="task-actions">

        <button
          onClick={toggleCompleted}
          disabled={loading}
        >
          {task.completed
            ? "Undo"
            : "Complete"}
        </button>

        <button
          onClick={deleteTask}
          disabled={loading}
          className="delete-button"
        >
          Delete
        </button>

      </div>
    </div>
  );
};

export default TaskItem;