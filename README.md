<div align="center">

# 🍃 KazeNoTayori | 風の便り  
### **AI-Powered Weather & Fashion Advisor (AI 天気・ファッションアドバイザー)**  
**"Bringing the wisdom of the wind to your daily choices."**  
**「風が運ぶ情報で、あなたの日常を彩る。」**

---

## 🚩 Badges

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Frontend](https://img.shields.io/badge/Frontend-HTML%2FJS-blue)
![Backend](https://img.shields.io/badge/Backend-Node.js-green)
![AI](https://img.shields.io/badge/AI-Llama--3%2070B-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Made with Love](https://img.shields.io/badge/Made%20with-❤️-ff69b4)

</div>

---

## 📖 Overview (概要)

**KazeNoTayori** (*“News from the Wind”*) is a **bilingual Japanese–English AI-powered weather concierge**.  
It combines:

- 🔹 **Real-time weather**
- 🔹 **Generative AI reasoning**
- 🔹 **Voice input + TTS**
- 🔹 **Dynamic maps**
- 🔹 **Mood-based suggestions**

…to create a **personalized, polite Japanese-style assistant**.

Unlike normal weather apps, it behaves like a **Concierge**:
> “Based on today's weather in Kyoto and your mood, I recommend…”

---

## ✨ Key Features (主な機能)

| Feature | Description |
|--------|-------------|
| 🎙️ **Voice-First Interface** | Japanese + English STT (Web Speech API) |
| 🧠 **Generative AI Reasoning** | Llama-3-70B (Groq) / GPT-4o |
| 🌤️ **Live Weather** | OpenWeatherMap Integration |
| 🗺️ **Visual Map** | Leaflet + OpenStreetMap |
| 📍 **Geolocation** | Auto-detect user's city |
| 🎨 **Glassmorphism UI** | Clean, modern design |
| 🔊 **Text-to-Speech** | Natural spoken output |

---

## 🏗️ Architecture (アーキテクチャ)

```mermaid
graph TD
  User((User / ユーザー))

  subgraph Frontend [Client Side - HTML/JS]
    UI[Glassmorphism UI]
    STT["Web Speech API\nVoice → Text"]
    TTS["Speech Synthesis\nText → Voice"]
    Map[Leaflet Map]
  end

  subgraph Backend [Node.js / Express]
    Server[API Route Handler]
    Logic["Prompt Engineering & Business Logic"]
    Whisper[Whisper STT]
  end

  subgraph External_APIs [Cloud Services]
    OWM[OpenWeatherMap API]
    LLM["LLM - gpt-3.5 · Grok · Llama-3"]
  end

  User -->|speaks| STT
  STT --> UI
  UI -->|POST /api/generate| Server
  Server -->|GET weather| OWM
  OWM -->|weather JSON| Server
  Server -->|build prompt| Logic
  Logic -->|call LLM| LLM
  LLM -->|AI suggestion| Server
  Server -->|JSON response| UI
  UI -->|update map| Map
  UI -->|speak result| TTS
  TTS --> User

## 🛠️ Tech Stack (技術スタック)

- **Frontend:** HTML5, CSS3 (CSS Variables, Flexbox, Glassmorphism), Vanilla JavaScript (ES6+)
- **Backend:** Node.js, Express.js  
- **AI Model:** Llama-3-70b-Versatile (Hosted by Groq) or OpenAI GPT-4o  
- **Weather Data:** OpenWeatherMap API  
- **Mapping:** Leaflet.js (OpenStreetMap)  
- **Deployment:** Vercel (Frontend) + Render (Backend)


---

## 🚀 Local Installation & Setup (セットアップ)

Follow these steps to run the project locally.

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/kazenotayori.git
cd kazenotayori
```

---

### **2. Backend Setup**
Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder with your API keys:

```
PORT=3000
# Get free key from console.groq.com
OPENAI_API_KEY=gsk_your_groq_api_key_here
# Get free key from openweathermap.org
WEATHER_API_KEY=your_openweather_api_key_here
```

Start the server:

```bash
node server.js
```

Expected output: **Server running on port 3000**

---

### **3. Frontend Setup**
Open a new terminal, navigate to the frontend folder, and serve it:

```bash
cd frontend
# Using Python to serve (or use VS Code Live Server)
python -m http.server 5500
```

Open your browser at:

👉 **http://127.0.0.1:5500**

---

## 🧪 How to Use (使い方)

- **Select Language:** Toggle between English and Japanese using the top-right button.  
- **Input Location:**  
  - Click the Pin Icon (📍) to use your current GPS location  
  - OR Click the Mic Icon (🎙️) and say a city name (e.g., "Kyoto", "London")  
  - OR Type a question manually (e.g., *"What should I wear in Tokyo today?"*)  
- **Get Advice:** Click **Send Plan** — the AI will analyze the weather and generate a custom plan.  
- **Listen:** Click **Play (🔊)** to hear the advice spoken aloud.  
- **View Map:** Scroll down to see the map of the location.

---

## 🔮 Future Roadmap (今後の展望)

To further enhance the user experience, the following features are planned:

- 👗 **Visual Outfit Generation:** Integration with Stable Diffusion to generate an image of the suggested outfit.  
- 📅 **Calendar Sync:** Suggesting outings based on the user's free time in Google Calendar.  
- 🚄 **Route Planning:** Integration with Google Maps API to show train routes to the suggested activity.

---

Thank you for reviewing this project. I enjoyed building this bridge between technology and daily life.  
**本プロジェクトをご覧いただきありがとうございます。技術と日常をつなぐこのアプリケーションの開発を楽しみました。**

