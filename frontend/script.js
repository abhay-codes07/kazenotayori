// --- Configuration ---
const BACKEND_URL = "http://127.0.0.1:3000/api/suggest";

// --- State ---
let currentLang = 'ja';
let isRecording = false;
let userCoords = null;
let locationEnabled = false;

// ⭐ NEW: Map Variables
let map = null;
let mapMarker = null;

// --- DOM Elements ---
const langBtn = document.getElementById('lang-toggle');
const mainTitle = document.getElementById('main-title');
const subTitle = document.getElementById('sub-title');
const userInput = document.getElementById('user-input');
const recordBtn = document.getElementById('record-btn');
const recText = document.getElementById('rec-text');
const sendBtn = document.getElementById('send-btn');
const geoBtn = document.getElementById('geo-btn');
const locStatus = document.getElementById('location-status');
const resultArea = document.getElementById('result-area');
const aiText = document.getElementById('ai-text');
const weatherDisplay = document.getElementById('weather-display');
const playBtn = document.getElementById('play-btn');

// --- Text Resources ---
const uiText = {
    ja: {
        title: "今日はどこへ行きますか？",
        subtitle: "天気と気分に合わせて提案します。",
        placeholder: "ここに入力またはマイクを押して話す...",
        recStart: "録音開始",
        recStop: "録音停止",
        send: "送信",
        thinking: "考え中...",
        toggle: "English",
        locOn: "位置情報: オン",
        locOff: "位置情報: オフ",
        play: "▶ 再生",
        pause: "⏸ 一時停止"
    },
    en: {
        title: "Where are you going today?",
        subtitle: "Proposals based on weather & mood.",
        placeholder: "Type here or press mic to speak...",
        recStart: "Start Recording",
        recStop: "Stop Recording",
        send: "Send Plan",
        thinking: "Thinking...",
        toggle: "🇯🇵 日本語",
        locOn: "Location: ON",
        locOff: "Location: OFF",
        play: "🔊 Play",
        pause: "⏸ Pause"
    }
};

// --- Initialization ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
}

// ⭐ NEW: Initialize Map Function
function initMap() {
    // Create map, default view Tokyo
    map = L.map('map').setView([35.6762, 139.6503], 13);
    
    // Add OpenStreetMap Tiles (Free)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

// --- UI Helper ---
function updateUI() {
    const t = uiText[currentLang];
    mainTitle.innerText = t.title;
    subTitle.innerText = t.subtitle;
    userInput.placeholder = t.placeholder;
    recText.innerText = isRecording ? t.recStop : t.recStart;
    sendBtn.innerText = t.send;
    langBtn.innerText = t.toggle;
    locStatus.innerText = locationEnabled ? t.locOn : t.locOff;
    locStatus.style.color = locationEnabled ? "#27ae60" : "#e74c3c";
    
    if (!isSpeaking && !isPaused) {
        playBtn.innerText = t.play;
    }
    
    if (recognition) {
        recognition.lang = currentLang === 'ja' ? 'ja-JP' : 'en-US';
    }
}

// Toggle language
langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'ja' ? 'en' : 'ja';
    updateUI();
    resultArea.classList.add("hidden"); 
    userInput.value = "";
});

// --- Geolocation ---
geoBtn.addEventListener('click', () => {
    if (locationEnabled) {
        locationEnabled = false;
        userCoords = null;
        updateUI();
        return;
    }
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            userCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
            locationEnabled = true;
            updateUI();
        },
        () => alert("Unable to get location.")
    );
});

// --- City Extraction ---
const jpCities = [
    '東京','大阪','京都','札幌','仙台','横浜','名古屋','神戸',
    '福岡','広島','那覇','沖縄','奈良','金沢','長崎','熊本',
    '鹿児島','旭川','高松','松山'
];

function extractCity(text) {
    if (!text) return null;
    for (const c of jpCities) {
        if (text.includes(c)) return c;
    }
    const englishToJapaneseCities = {
        tokyo: "東京", kyoto: "京都", osaka: "大阪", nara: "奈良", sapporo: "札幌",
        fukuoka: "福岡", sendai: "仙台", nagoya: "名古屋", hiroshima: "広島",
        yokohama: "横浜", kobe: "神戸", naha: "那覇", okinawa: "沖縄",
        kanazawa: "金沢", kumamoto: "熊本", kagoshima: "鹿児島"
    };
    const lower = text.toLowerCase();
    for (const key in englishToJapaneseCities) {
        if (lower.includes(key)) return englishToJapaneseCities[key];
    }
    return null;
}

// --- Weather Emoji Helper ---
function getWeatherEmoji(description) {
    if (!description) return '🌡️';
    const desc = description.toLowerCase();
    if (desc.includes('clear') || desc.includes('sunny')) return '☀️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('rain')) return '🌧️';
    if (desc.includes('drizzle')) return '🌦️';
    if (desc.includes('storm') || desc.includes('thunder')) return '🌩️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('mist') || desc.includes('fog')) return '🌫️';
    return '⛅'; 
}

// --- Speech Recognition ---
recordBtn.addEventListener('click', () => {
    if (!recognition) return alert("Speech recognition not supported.");
    if (isRecording) {
        recognition.stop();
        isRecording = false;
        recText.innerText = uiText[currentLang].recStart;
        recordBtn.classList.remove("recording");
    } else {
        userInput.value = "";
        recognition.lang = currentLang === 'ja' ? 'ja-JP' : 'en-US';
        recognition.start();
        isRecording = true;
        recText.innerText = uiText[currentLang].recStop;
        recordBtn.classList.add("recording");
    }
});

if (recognition) {
    recognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal)
                finalTranscript += event.results[i][0].transcript;
        }
        if (finalTranscript) userInput.value += finalTranscript;
    };
}

// --- Send Function ---
sendBtn.addEventListener("click", async () => {
    const text = userInput.value.trim();
    if (!text) return;

    sendBtn.disabled = true;
    sendBtn.innerText = uiText[currentLang].thinking;
    resultArea.classList.add("hidden");

    try {
        const city = extractCity(text);
        const payload = {
            prompt: text,
            city: city || null,
            lat: (!city && userCoords)?.lat || null,
            lon: (!city && userCoords)?.lon || null,
            lang: currentLang
        };

        const resp = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!resp.ok) throw new Error("Backend Error");

        const data = await resp.json();

        resultArea.classList.remove("hidden");

        // Weather Display
        if (data.weather && data.weather.temp !== null) {
            const emoji = getWeatherEmoji(data.weather.description);
            weatherDisplay.innerHTML = `
                <span style="font-size: 1.2em; margin-right: 10px;">${emoji}</span>
                ${data.weather.name}: ${data.weather.temp}°C 
                <span style="font-size: 0.8em; color: #666;">(${data.weather.description})</span>
            `;
            
            // ⭐ NEW: Update Map
            if (data.weather.coord) {
                const { lat, lon } = data.weather.coord;
                
                // Wait for UI to un-hide so map can calculate size
                setTimeout(() => {
                    if (!map) initMap();
                    map.invalidateSize(); // Fix grey map issue
                    map.setView([lat, lon], 13); // Zoom to city
                    
                    // Remove old marker if exists
                    if (mapMarker) map.removeLayer(mapMarker);
                    
                    // Add new marker
                    mapMarker = L.marker([lat, lon]).addTo(map)
                        .bindPopup(`<b>${data.weather.name}</b><br>${data.weather.temp}°C`).openPopup();
                }, 100);
            }

        } else {
            weatherDisplay.innerText = "--°C";
        }

        // Formatting
        let formattedText = data.suggestion;
        formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedText = formattedText.replace(/(^|\n)\* /g, '$1• ');
        formattedText = formattedText.replace(/(^|\n)\- /g, '$1• ');
        aiText.innerHTML = formattedText; 

    } catch (e) {
        alert("Error: " + e.message);
    } finally {
        sendBtn.disabled = false;
        sendBtn.innerText = uiText[currentLang].send;
    }
});

// --- TTS Logic ---
let currentUtterance = null;
let isPaused = false;
let isSpeaking = false;

function setPlayLabel() { playBtn.innerText = uiText[currentLang].play; }
function setPauseLabel() { playBtn.innerText = uiText[currentLang].pause; }

setPlayLabel();

playBtn.addEventListener("click", () => {
    const text = aiText.innerText.trim();
    if (!text) return;

    if (isPaused && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        isPaused = false;
        isSpeaking = true;
        setPauseLabel();
        return;
    }

    if (isSpeaking && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        isPaused = true;
        isSpeaking = false;
        setPlayLabel();
        return;
    }

    window.speechSynthesis.cancel();
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = currentLang === 'ja' ? 'ja-JP' : 'en-US';
    isSpeaking = true;
    isPaused = false;
    setPauseLabel();
    window.speechSynthesis.speak(currentUtterance);
    currentUtterance.onend = () => {
        isSpeaking = false;
        isPaused = false;
        setPlayLabel();
    };
});

// Initial Load
updateUI();
// Don't init map yet, wait for first search to avoid grey box