import api from "../api/axios";

export default function TaskItem({ task, refresh }) {

  const toggleStatus = async () => {
    try {
      await api.put(`/api/tasks/${task._id}`, {
        status: task.status === "pending" ? "completed" : "pending"
      });
      refresh();
    } catch (err) {
      console.error("Toggle status error:", err);
    }
  };

  const deleteTask = async () => {
    try {
      await api.delete(`/api/tasks/${task._id}`);
      refresh();
    } catch (err) {
      console.error("Delete task error:", err);
    }
  };

  return (
    <li>
      <input
        type="checkbox"
        checked={task.status === "completed"}
        onChange={toggleStatus}
      />

      <span style={{
        textDecoration: task.status === "completed" ? "line-through" : ""
      }}>
        {task.title} ({task.priority})
      </span>

      <button onClick={deleteTask} style={{ marginLeft: "8px" }}>
        ❌
      </button>
    </li>
  );
}
