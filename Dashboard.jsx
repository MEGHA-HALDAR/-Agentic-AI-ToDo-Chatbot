import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [message, setMessage] = useState("");
  const [voiceText, setVoiceText] = useState("");
  const [tasks, setTasks] = useState([]);



const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};




  const fetchTasks = async () => {
    const res = await api.get("/api/tasks");
    setTasks(res.data);
  };

  const sendMessage = async (text) => {
    const msg = text ?? message;
    if (!msg) return;

    await api.post("/api/tasks", { message: msg });
    setMessage("");
    setVoiceText("");
    fetchTasks();
  };

  // 🎤 Voice logic
  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript;
      setVoiceText(spoken);
      sendMessage(spoken); // auto create task
    };
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="dashboard">

      {/* MAIN TASK CARD */}
      <div className="card">
        <h1>🤖 Agentic AI To-Do Chatbot</h1>

        <div className="input-row">
          <input
            placeholder="Type: buy milk, go gym, submit project urgent"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <button className="btn-primary" onClick={() => sendMessage()}>
            Send
          </button>
        </div>

        <ul className="task-list">
          {tasks.map(task => (
            <li className="task-item" key={task._id}>
              <div className="task-left">
                <input
                  type="checkbox"
                  checked={task.status === "completed"}
                  onChange={async () => {
                    await api.put(`/api/tasks/${task._id}`, {
                      status:
                        task.status === "pending"
                          ? "completed"
                          : "pending"
                    });
                    fetchTasks();
                  }}
                />
                <span
                  className={
                    task.status === "completed" ? "task-done" : ""
                  }
                >
                  {task.title}
                </span>

                {task.priority === "high" && (
                  <span className="badge high">High</span>
                )}
              </div>

              <button
                className="btn-delete"
                onClick={async () => {
                  await api.delete(`/api/tasks/${task._id}`);
                  fetchTasks();
                }}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 🎤 VOICE INPUT CARD */}
      <div className="card" style={{ marginTop: "20px" }}>
        <h2>🎤 Add Task by Voice</h2>

        <p style={{ fontSize: "14px", color: "#666" }}>
          Click the mic and speak your task
        </p>

        <div className="input-row">
          <input
            placeholder="Your voice input will appear here..."
            value={voiceText}
            readOnly
          />
          <button className="btn-primary" onClick={startVoice}>
            🎤 Speak
          </button>
        </div>
      </div>


{/* 🚪 LOGOUT */}
<div style={{ textAlign: "center", marginTop: "30px" }}>
  <button
    onClick={handleLogout}
    style={{
      background: "transparent",
      border: "1px solid #ef4444",
      color: "#ef4444",
      padding: "10px 20px",
      borderRadius: "10px",
      fontSize: "14px",
      cursor: "pointer"
    }}
  >
    🚪 Logout
  </button>
</div>




    </div>
  );
}
