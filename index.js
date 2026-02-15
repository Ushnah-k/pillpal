import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => res.json({ ok: true }));

// ✅ MOCK CHAT (no OpenAI)
app.post("/api/chat", (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ reply: "Please say something." });
  }

  const text = message.toLowerCase();
  let reply = "";

  if (text.includes("remind")) {
    reply = "Got it 💊 What time should I remind you, and is it daily or one-time?";
  } else if (text.match(/\b(\d{1,2})(:\d{2})?\s?(am|pm)\b/) || text.includes("8pm")) {
    reply = "Reminder set ✅ I’ll help you stay on track.";
  } else if (text.includes("missed") || text.includes("forgot")) {
    reply = "It happens 💙 Want me to set an extra reminder for later today?";
  } else if (text.includes("hi") || text.includes("hello")) {
    reply = "Hi 👋 I’m PillPal. Want to add a medication reminder or check your next dose?";
  } else if (text.includes("thank")) {
    reply = "You’re welcome! Consistency is the goal 💪";
  } else {
    reply = "Tell me the medication name and the time you want the reminder.";
  }

  res.json({ reply });
});

// ✅ ELEVENLABS TTS
app.post("/api/tts", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Missing 'text' string" });
    }

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`;

    const elevenRes = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg"
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.45, similarity_boost: 0.75 }
      })
    });

    if (!elevenRes.ok) {
      const errText = await elevenRes.text();
      return res.status(500).json({ error: "ElevenLabs error", details: errText });
    }

    const audioBuffer = Buffer.from(await elevenRes.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(audioBuffer);
  } catch (e) {
    res.status(500).json({ error: "TTS failed", details: String(e) });
  }
});

app.listen(3001, () => console.log("Server running http://localhost:3001"));
