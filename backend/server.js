require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: [
    'https://kazenotayori.vercel.app', 
    'http://127.0.0.1:5500',           
    'http://localhost:5500'            
  ],
  methods: ['GET','POST']
}));
app.use(express.json());

app.get('/', (_, res) => res.send('Backend OK'));

// Japanese -> English city name map
const CITY_MAP = {
  '東京':'Tokyo','大阪':'Osaka','京都':'Kyoto','札幌':'Sapporo','仙台':'Sendai','横浜':'Yokohama','名古屋':'Nagoya',
  '神戸':'Kobe','福岡':'Fukuoka','広島':'Hiroshima','那覇':'Naha','沖縄':'Naha','奈良':'Nara','金沢':'Kanazawa',
  '長崎':'Nagasaki','熊本':'Kumamoto','鹿児島':'Kagoshima','旭川':'Asahikawa','高松':'Takamatsu','松山':'Matsuyama'
};

async function getWeather({ city, lat, lon, lang }) {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) return null;

  try {
    const weatherLang = lang === "en" ? "en" : "ja";
    let url;
    if (city) {
      const mapped = CITY_MAP[city] || city;
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(mapped)}&units=metric&lang=${weatherLang}&appid=${apiKey}`;
    } else if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=${weatherLang}&appid=${apiKey}`;
    } else {
      return null;
    }

    const resp = await fetch(url);
    if (!resp.ok) return null;

    const data = await resp.json();
    return {
      name: data.name || city || '',
      description: data.weather?.[0]?.description || '',
      temp: data.main?.temp ?? null,
      // ⭐ NEW: Sending Coordinates for the Map
      coord: data.coord // { lat: ..., lon: ... }
    };

  } catch (e) {
    console.error('Weather error:', e.message);
    return null;
  }
}

app.post('/api/suggest', async (req, res) => {
  try {
    const { prompt, lat, lon, city, lang } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    const weather = await getWeather({ city, lat, lon, lang });

    const systemPrompt = lang === "en"
        ? "You are a helpful assistant who gives weather-based outing suggestions in English."
        : "あなたは天気と気分を考慮し日本語でお出かけプランを提案するアシスタントです。";

    let userContent;
    if (lang === "en") {
      userContent = `User request: ${prompt}\n`;
      if (weather) userContent += `Current weather (${weather.name}): ${weather.description}, Temperature ${weather.temp}°C.\n`;
    } else {
      userContent = `ユーザー要望: ${prompt}\n`;
      if (weather) userContent += `現在の天気(${weather.name}): ${weather.description}, 気温 ${weather.temp}°C\n`;
    }

    // Use Groq (or OpenAI if you switched back)
    const key = process.env.OPENAI_API_KEY; // Using Groq Key stored here
    const body = {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent }
      ],
      temperature: 0.7
    };

    const aiResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!aiResp.ok) {
      return res.status(500).json({ error: 'AI service error' });
    }

    const aiData = await aiResp.json();

    res.json({
      suggestion: aiData.choices?.[0]?.message?.content || '',
      weather
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));