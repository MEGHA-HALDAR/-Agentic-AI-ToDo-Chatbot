export default function VoiceInput({ onResult }) {
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = e => {
      const text = e.results[0][0].transcript;
      onResult(text);
    };
  };

  return (
    <button onClick={startListening}>
      🎤 Speak
    </button>
  );
}
