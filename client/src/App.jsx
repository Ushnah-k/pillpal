import { useEffect, useRef, useState } from "react";
import logo from "./assets/pillpal.png";

export default function App() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi 👋 I’m PillPal. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [muted, setMuted] = useState(false);
  const [listening, setListening] = useState(false);

  const audioRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function speak(text) {
    if (muted) return;

    const ttsRes = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    if (!ttsRes.ok) return;

    const blob = await ttsRes.blob();
    const url = URL.createObjectURL(blob);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play();
  }

  async function sendMessage(text) {
    if (!text.trim()) return;

    const newMessages = [...messages, { role: "user", text }];
    setMessages(newMessages);
    setInput("");

    const chatRes = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    if (!chatRes.ok) {
      setMessages([...newMessages, { role: "bot", text: "Server error. Try again." }]);
      return;
    }

    const chatData = await chatRes.json();
    const reply = chatData.reply || "Hmm—no reply came back.";

    setMessages([...newMessages, { role: "bot", text: reply }]);
    speak(reply);
  }

  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser. Use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setListening(false);
      sendMessage(transcript);
    };

    recognition.onerror = () => {
      setListening(false);
      alert("Mic error. Try again or type your message.");
    };

    recognition.onend = () => setListening(false);

    recognition.start();
  }

  return (
    <div className="page">
      <div className="shell">
        <header className="header">
          <div className="brand">
            <img className="logo" src={logo} alt="PillPal logo" />
            <div>
              <h1 className="title">PillPal</h1>
              <p className="subtitle">Your friendly medication reminder buddy</p>
            </div>
          </div>

          <div className="toggles">
            <label className="toggle">
              <input
                type="checkbox"
                checked={muted}
                onChange={(e) => setMuted(e.target.checked)}
              />
              <span>Mute voice</span>
            </label>
          </div>
        </header>

        <main className="card">
          <div className="chat">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`row ${msg.role === "user" ? "rowUser" : "rowBot"}`}
              >
                <div className={`bubble ${msg.role === "user" ? "user" : "bot"}`}>
                  <div className="meta">{msg.role === "user" ? "You" : "PillPal"}</div>
                  <div>{msg.text}</div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="composer">
            <input
              className="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a reminder… e.g., “Remind me at 8pm”"
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage(input);
              }}
            />

            <button className="btn" onClick={() => sendMessage(input)}>
              Send
            </button>

            <button className="btn ghost" onClick={startListening}>
              {listening ? "🎙️ Listening…" : "🎤 Talk"}
            </button>
          </div>
        </main>

        <footer className="footer">
          <span>Demo mode: Mock AI responses + ElevenLabs voice</span>
        </footer>
      </div>
    </div>
  );
}
