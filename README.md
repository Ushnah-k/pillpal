💊 PillPal

AI-powered medication reminder with voice interaction.

PillPal helps users manage their medications through smart reminders, an AI chatbot assistant, and natural voice responses. Designed for simplicity, accessibility, and hackathon-ready deployment.

🚀 Elevator Pitch

PillPal is a voice-enabled AI medication reminder that speaks back to you — combining smart scheduling, conversational support, and realistic dose tracking in one clean web app.

✨ Features

Add medications with:

Name

Realistic dose options (1 pill, 5 mL, 1 puff, etc.)

Frequency (Daily, Weekdays, Every other day, Once)

Time scheduling (24-hour format)

“Next Dose” intelligent tracker

Mark dose as taken

AI chatbot powered by OpenAI

Voice responses powered by ElevenLabs

Browser speech-to-text (Web Speech API)

LocalStorage persistence (no database)

Safety disclaimer for medical responsibility

🧠 How It Works

PillPal combines three major technologies:

OpenAI API – Generates intelligent chatbot responses.

ElevenLabs API – Converts chatbot text replies into realistic voice audio.

Web Speech API – Allows users to speak instead of type.

The backend securely handles API keys and forwards:

/api/chat → OpenAI

/api/tts → ElevenLabs

The frontend:

Stores medications in LocalStorage

Computes next dose in real time

Plays AI voice unless muted

Prevents unrealistic dose entries

🛠 Built With

JavaScript

Node.js

Express

OpenAI API

ElevenLabs Text-to-Speech API

Web Speech API

HTML + CSS

LocalStorage

GitHub

🧩 Architecture

Frontend → Express Backend → OpenAI + ElevenLabs APIs
All API keys are stored securely in .env (not exposed to frontend).

🔒 Safety Notice

PillPal is a reminder tool only and does not provide medical advice.
Always consult a licensed healthcare professional for medical decisions.

📦 Setup (Local Development)

Clone the repository:

git clone https://github.com/Ushnah-k/pillpal.git
cd pillpal/server


Install dependencies:

npm install


Create a .env file:

OPENAI_API_KEY=your_key_here
ELEVENLABS_API_KEY=your_key_here
ELEVENLABS_VOICE_ID=your_voice_id_here


Start the server:

node index.js

🎯 Future Improvements

Smart refill alerts

Multi-user profiles

Calendar sync

Medication adherence analytics

Accessibility enhancements

👩‍💻 Creator

Built by Ushnah Khan and Humza Khan
Virginia Tech – Computer Science
NOVA - Computer Science
