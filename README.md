🍃 KazeNoTayori | 風の便り
AI-Powered Weather & Fashion Advisor (AI 天気・ファッションアドバイザー)
"Bringing the wisdom of the wind to your daily choices."
「風が運ぶ情報で、あなたの日常を彩る。」

📖 Overview (概要)
KazeNoTayori (literally "News from the Wind") is a bilingual, voice-activated web application designed to help users plan their day. It combines real-time weather data with Generative AI to offer personalized activity and outfit recommendations suggestions based on current mood.
Unlike standard weather apps that just show numbers, KazeNoTayori acts as a Japanese Concierge, offering polite, context-aware advice based on the user's mood and location.
Key Objective: To demonstrate rapid prototyping of Generative AI, Voice UI, and Geolocation APIs within a modern, responsive web interface.

✨ Key Features (主な機能)
🎙️ Voice-First Interface (音声入力): Seamless Japanese and English speech recognition using the Web Speech API.
🧠 Generative AI Logic: Uses Llama-3-70b (via Groq) for ultra-fast, context-aware reasoning to generate unique fashion and travel plans.
🌤️ Real-time Weather: Fetches live temperature and conditions via OpenWeatherMap.
🗺️ Visual Context: Dynamic map integration using Leaflet.js to visualize the target location.
📍 Geolocation: One-click detection of the user's current city.
🎨 Glassmorphism UI: A modern, aesthetic interface optimized for both Desktop and Mobile devices.
🗣️ Text-to-Speech (読み上げ): The AI reads the advice aloud in a natural voice.

🏗️ Architecture (アーキテクチャ)
The application follows a clean Client-Server architecture. It separates the frontend (UI/Voice) from the backend (API/Logic) to ensure security of API keys and modularity.
graph TD
  User((User / ユーザー))

  subgraph Frontend [Client Side - HTML/JS]
    UI[Glassmorphism UI]
    STT[Web Speech API<br/>(Voice → Text)]
    TTS[Speech Synthesis<br/>(Text → Voice)]
    Map[Leaflet Map]
  end

  subgraph Backend [Node.js / Express]
    Server[API Route Handler]
    Logic[Prompt Engineering\n& Business Logic]
    # Optional server-side STT
    Whisper[Whisper / Server STT]
  end

  subgraph External_APIs [Cloud Services]
    OWM[OpenWeatherMap API]
    LLM[LLM (gpt-3.5 / Grok / Llama-3)]
  end

  %% main flows
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

  %% optional: server-side STT flow (uncomment if used)
  %% User -->|upload audio| Server
  %% Server -->|transcribe| Whisper
  %% Whisper -->|transcript| Logic

🛠️ Tech Stack (技術スタック)
Frontend: HTML5, CSS3 (CSS Variables, Flexbox, Glassmorphism), Vanilla JavaScript (ES6+).
Backend: Node.js, Express.js.
AI Model: Llama-3-70b-Versatile (Hosted by Groq) or OpenAI GPT-4o.
Weather Data: OpenWeatherMap API.
Mapping: Leaflet.js (OpenStreetMap).
Deployment: Vercel (Frontend) + Render (Backend).

🚀 Local Installation & Setup (セットアップ)
Follow these steps to run the project locally.
1. Clone the Repository
git clone https://github.com/yourusername/kazenotayori.git
cd kazenotayori

2. Backend Setup
Navigate to the backend folder and install dependencies.
cd backend
npm install

Create a .env file in the backend folder with your API keys:
PORT=3000
# Get free key from console.groq.com
OPENAI_API_KEY=gsk_your_groq_api_key_here
# Get free key from openweathermap.org
WEATHER_API_KEY=your_openweather_api_key_here

Start the server:
node server.js

Output should be: Server running on port 3000

3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and serve it.
cd frontend
# Using Python to serve (or use VS Code Live Server)
python -m http.server 5500

Open your browser to: http://127.0.0.1:5500

🧪 How to Use (使い方)
Select Language: Toggle between English and Japanese using the top-right button.
Input Location:
Click the Pin Icon (📍) to use your current GPS location.
OR Click the Mic Icon (🎙️) and say a city name (e.g., "Kyoto", "London").
OR Type a question manually (e.g., "What should I wear in Tokyo today?").
Get Advice: Click Send Plan. The AI will analyze the weather and generate a custom plan.
Listen: Click Play (🔊) to hear the advice spoken aloud.
View Map: Scroll down to see the map of the location.

🔮 Future Roadmap (今後の展望)
To further enhance the user experience, the following features are planned:
👗 Visual Outfit Generation: Integration with Stable Diffusion to generate an image of the suggested outfit.
📅 Calendar Sync: Suggesting outings based on the user's free time in Google Calendar.
🚄 Route Planning: Integration with Google Maps API to show train routes to the suggested activity.

Thank you for reviewing this project. I enjoyed building this bridge between technology and daily life.
本プロジェクトをご覧いただきありがとうございます。技術と日常をつなぐこのアプリケーションの開発を楽しみました。