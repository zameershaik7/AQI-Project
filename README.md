# Air Quality Index (AQI) Checker

A full-stack AQI Search Application built as part of the Finfactor Technologies SDE assignment.

Users can search for any city and view AQI, dominant pollutant, temperature, humidity, coordinates, and last updated time. The backend includes caching for performance and reduced API calls.

# ✨ Features

## 🖥️ Frontend (HTML, CSS, JavaScript)
- City search input
- Clean and responsive UI
- AQI result card with color-coded category
- Temperature and humidity display
- Proper error handling

## ⚙️ Backend (Node.js + Express)
- REST API endpoint: /api/aqi?city=CityName
- Fetches data from WAQI API
- Server-side caching implemented using Node-Cache
- Handles all edge cases and errors
- Uses dotenv to protect API key

# 📁 Project Structure
AQI-Project/
│
├── backend/
│ ├── index.js
│ ├── .env
│ ├── package.json
│ └── node_modules/
│
└── frontend/
├── index.html
├── style.css
├── script.js
├── server.js
├── package.json
└── node_modules/


# 🛠 Technologies Used

## Backend:
- Node.js
- Express.js
- Axios
- Node-Cache
- dotenv

## Frontend:
- HTML
- CSS
- Vanilla JavaScript
- Express static server (for hosting UI)

# 🌐 API Provider Used

## WAQI API (World Air Quality Index)
https://aqicn.org/api/

### API Authentication Format:
https://api.waqi.info/feed/{city}/?token=YOUR_API_KEY

### .env Format:
WAQI_API_KEY=your_api_key_here

# 🏃 How to Run the Project

## 1. Clone the Repository:
git clone https://github.com/your-username/aqi-project.git
cd aqi-project

## 2. Backend Setup:
cd backend
npm install

Create `.env` inside backend:
WAQI_API_KEY=your_api_key_here

Start backend:
node index.js

Backend runs at:
http://localhost:5000

## 3. Frontend Setup:
cd frontend
npm install
node server.js

Frontend runs at:
http://localhost:3000

# 📡 Backend API Documentation

## GET /api/aqi?city={cityName}

### Example:
http://localhost:5000/api/aqi?city=Delhi

### Sample Response:
{
  "source": "api",
  "data": {
    "city": "Major Dhyan Chand National Stadium, Delhi, India",
    "aqi": 213,
    "dominantPollutant": "pm25",
    "temperature": 14.6,
    "humidity": 82,
    "coordinates": [28.612498, 77.237388],
    "time": "2025-11-25 00:00:00"
  }
}

# ⚡ Caching Logic

- Cache TTL: 10 minutes  
- Reduces external API calls  
- Improves UI response speed  
- Meets the assignment's performance requirement

# 📬 Submission Notes

- Upload the project to a **public GitHub repo**
- Reply to the assignment email
- **Do not change the subject line**
- Include your GitHub repository link in the message body

# 🏁 Final Notes

This solution fully meets the coding challenge requirements:
- Node.js REST API
- Caching with expiry
- Clean structured frontend
- Proper documentation
- Runs fully locally
- Error handling included
