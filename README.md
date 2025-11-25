# 🌍 Premium AQI Dashboard  
Real-time Air Quality Monitoring with Interactive UI, Trend Graphs, Pollutant Insights & Dark/Light Mode

---

## 📌 Project Overview
The **Premium AQI Dashboard** is a full-stack application that shows real-time Air Quality Index (AQI) for any city.  
It includes a **Node.js backend**, a **modern animated frontend**, and powerful UI features like:

- 🌗 Dark/Light Mode  
- 🌬 Floating Particle Background  
- 📈 Live AQI Trend Graph  
- 💠 Circular AQI Ring Animation  
- 🔍 City Auto-Suggestion  
- 🧪 Pollutant Cards  
- 💡 Safety Tips (Based on AQI Category)  
- ⚡ Cached Backend API for Fast Responses  

---

## 🏗️ Tech Stack

### Backend
- Node.js  
- Express  
- Axios  
- Node-Cache  
- WAQI API  

### Frontend
- HTML5  
- CSS3  
- JavaScript  
- Chart.js  
- Canvas API  

---

## 📁 Project Structure
```
AQI-Project/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── node_modules/
│
└── frontend/
    ├── index.html
    ├── style.css
    ├── script.js
    ├── server.js
    ├── package.json
    └── node_modules/
```

---

## 🔑 Environment Variables
Create a `.env` file inside **backend**:

```
WAQI_TOKEN=your_api_key_here
PORT=5000
```

---

## 🚀 How to Run the Project

### 1️⃣ Backend Setup
```
cd backend
npm install
node server.js
```
Backend runs at: **http://localhost:5000**

---

### 2️⃣ Frontend Setup
```
cd frontend
npm install
node server.js
```
Frontend runs at: **http://localhost:3000**

---

## 🌈 Frontend Features

### 🔍 Smart City Search
- Auto-suggestion dropdown  
- Real-time filtering  

### 🌗 Dark & Light Theme
- Smooth transitions  
- Particle animation adapts to theme  

### 💠 AQI Circular Ring
- Animated from 0 → AQI  
- AQI category color-coded  

### 📈 AQI Trend History Graph
- Up to last 10 AQI values  
- Smooth line animation  
- Responsive  

### 🧪 Pollutant Cards
Shows live/mocked values for:
- PM2.5  
- PM10  
- CO  
- O₃  
- NO₂  
- SO₂  

### 💡 Safety Tips
Tips update based on AQI category:
- Good  
- Moderate  
- Unhealthy  
- Very Unhealthy  
- Hazardous  

---

## ⚙️ Backend Features

### 📡 WAQI API Integration
Fetches AQI, temperature, humidity, dominant pollutant & more.

### ⚡ Caching
- Faster repeated searches  
- API rate-limiting protection  
- Cache expiration included  

---
```
## 🎨 AQI Color Mapping

| AQI Range | Color | Category |
|----------|--------|----------|
| 0–100 | 🟢 Green | Good |
| 101–150 | 🟠 Orange | Moderate |
| 151–250 | 🔴 Red | Unhealthy |
| 251–350 | 🟣 Purple | Very Unhealthy |
| 351–500 | 🟤 Maroon | Hazardous |
```
---

## 🧪 Sample API Response
```
{
  "city": "Delhi",
  "aqi": 163,
  "dominantPollutant": "pm25",
  "temperature": 21.3,
  "humidity": 45,
  "coordinates": [28.6, 77.2],
  "pollutants": {
    "pm25": 163,
    "pm10": 120,
    "o3": 77,
    "no2": 18,
    "so2": 10,
    "co": 3.4
  }
}
```

---

## 🏆 Author
**Zameer Ur Rahiman Shaik**  
Aspiring AI Engineer & Software Developer

