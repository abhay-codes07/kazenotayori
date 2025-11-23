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




本プロジェクトをご覧いただきありがとうございます。技術と日常をつなぐこのアプリケーションの開発を楽しみました。
