export default function ChatInput({ message, setMessage, onSend }) {
  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setMessage(text);
      onSend(); // 🔥 auto send after speaking
    };
  };

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <input
        placeholder="Type or speak a task..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      <button onClick={onSend}>Send</button>

      <button onClick={startVoice}>🎤</button>
    </div>
  );
}
