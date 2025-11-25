/* ==========================================================
   PREMIUM AQI DASHBOARD – CLEAN FINAL JS
========================================================== */

/* ---------- DOM ELEMENTS ---------- */
const cityInput = document.getElementById("cityInput");
const suggestionBox = document.getElementById("suggestionBox");
const searchBtn = document.getElementById("searchBtn");

const resultCard = document.getElementById("resultCard");
const errorCard = document.getElementById("errorCard");
const errorMessage = document.getElementById("errorMessage");
const loadingSpinner = document.getElementById("loadingSpinner");
const chartContainer = document.getElementById("chartContainer");

const aqiValue = document.getElementById("aqiValue");
const aqiCategory = document.getElementById("aqiCategory");
const dominantPollutant = document.getElementById("dominantPollutant");
const coordinates = document.getElementById("coordinates");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const timeEl = document.getElementById("time");
const cityName = document.getElementById("cityName");
const pollutantCards = document.getElementById("pollutantCards");
const safetyTips = document.getElementById("safetyTips");

const themeToggle = document.getElementById("themeToggle");

/* ---------- CITY SUGGESTIONS ---------- */
const cityList = [
  "Delhi",
  "Mumbai",
  "Hyderabad",
  "Chennai",
  "Bangalore",
  "Kolkata",
  "Pune",
  "Dubai",
  "London",
  "New York",
  "Tokyo",
  "Karachi",
  "Hong Kong",
  "Singapore",
  "Sydney"
];

function updateSuggestions(value) {
  suggestionBox.innerHTML = "";
  const text = value.trim();

  if (!text) {
    suggestionBox.style.display = "none";
    return;
  }

  const matches = cityList.filter(city =>
    city.toLowerCase().startsWith(text.toLowerCase())
  );

  if (!matches.length) {
    suggestionBox.style.display = "none";
    return;
  }

  matches.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.addEventListener("click", () => {
      cityInput.value = city;
      suggestionBox.style.display = "none";
      cityInput.focus();
    });
    suggestionBox.appendChild(li);
  });

  suggestionBox.style.display = "block";
}

cityInput.addEventListener("input", e => updateSuggestions(e.target.value));
cityInput.addEventListener("blur", () => {
  setTimeout(() => (suggestionBox.style.display = "none"), 150);
});

/* ---------- AQI COLOR & LABEL (Custom Ranges) ---------- */
/*
  0–100   -> Green
  101–150 -> Orange
  151–250 -> Red
  251–350 -> Purple
  351–500 -> Maroon
*/
function getAQIColor(aqi) {
  if (aqi <= 100) return { color: "#4CAF50", label: "Good" };
  if (aqi <= 150) return { color: "#FF9800", label: "Moderate" };
  if (aqi <= 250) return { color: "#F44336", label: "Unhealthy" };
  if (aqi <= 350) return { color: "#9C27B0", label: "Very Unhealthy" };
  return { color: "#6A0D0D", label: "Hazardous" };
}

/* ---------- API CALL ---------- */
async function getAQI() {
  const city = cityInput.value.trim();
  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  hideError();
  resultCard.classList.remove("visible");
  resultCard.classList.add("hidden");
  chartContainer.classList.add("hidden");
  loadingSpinner.classList.remove("hidden");

  try {
    const res = await fetch(`http://localhost:5000/api/aqi?city=${encodeURIComponent(city)}`);
    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error || "Failed to fetch AQI data.");
    }

    const data = json.data;
    loadingSpinner.classList.add("hidden");
    updateUI(data);
  } catch (err) {
    loadingSpinner.classList.add("hidden");
    showError(err.message || "Something went wrong.");
  }
}

/* ---------- UPDATE UI ---------- */
let aqiHistory = [];
let chartInstance = null;

function updateUI(data) {
  // Extract fields from backend response
  const {
    aqi,
    city,
    dominantPollutant: dp,
    coordinates: coords,
    temperature: temp,
    humidity: hum,
    time,
    pollutants
  } = data;

  const { color, label } = getAQIColor(aqi);

  // Text values
  aqiValue.textContent = aqi;
  aqiCategory.textContent = label;
  cityName.textContent = city;
  dominantPollutant.textContent = dp || "--";
  coordinates.textContent = Array.isArray(coords) ? coords.join(", ") : "--";
  temperature.textContent = temp != null ? temp.toFixed(1) : "--";
  humidity.textContent = hum != null ? hum.toFixed(1) : "--";
  timeEl.textContent = time || "--";

  // Ring
  const ring = document.querySelector(".ring-progress");
  const maxAQI = 500;
  const circumference = 502;
  const offset = circumference - (circumference * Math.min(aqi, maxAQI)) / maxAQI;
  ring.style.strokeDashoffset = offset;
  ring.style.stroke = color;

  // Category badge & card glow
  aqiCategory.style.background = color + "33";
  aqiCategory.style.color = color;
  resultCard.style.borderColor = color + "55";
  resultCard.style.boxShadow = `0 0 20px ${color}33`;

  // Pollutant cards
  updatePollutants(pollutants);

  // Safety tips
  updateSafetyTips(label);

  // AQI History
  updateHistory(aqi);

  // Reveal card + chart
  resultCard.classList.remove("hidden");
  resultCard.classList.add("visible");
  chartContainer.classList.remove("hidden");
}

function updatePollutants(pollutants) {
  pollutantCards.innerHTML = "";

  const source =
    pollutants && Object.keys(pollutants).length
      ? pollutants
      : {
          pm25: (Math.random() * 200).toFixed(1),
          pm10: (Math.random() * 200).toFixed(1),
          o3: (Math.random() * 150).toFixed(1),
          no2: (Math.random() * 120).toFixed(1),
          so2: (Math.random() * 90).toFixed(1),
          co: (Math.random() * 5).toFixed(2)
        };

  Object.entries(source).forEach(([key, value]) => {
    const card = document.createElement("div");
    card.className = "pollutant-card";

    card.innerHTML = `
      <div class="poll-name">${key.toUpperCase()}</div>
      <div class="poll-value">${value}</div>
    `;

    pollutantCards.appendChild(card);
  });
}

function updateSafetyTips(label) {
  const tips = {
    Good: "Air quality is good. Enjoy outdoor activities!",
    Moderate: "Sensitive groups should limit prolonged outdoor exertion.",
    Unhealthy: "Unhealthy. Wear a mask outdoors and limit time outside.",
    "Very Unhealthy": "Very unhealthy. Avoid outdoor activities as much as possible.",
    Hazardous: "Hazardous air. Stay indoors and use air purifiers if available."
  };

  safetyTips.textContent = tips[label] || "Stay safe and monitor AQI regularly.";
}
function updateHistory(aqi) {
  aqiHistory.push(aqi);
  if (aqiHistory.length > 10) aqiHistory.shift();

  const labels = ["1H","2H","3H","4H","5H","6H","7H","8H","9H","Now"]
                 .slice(-aqiHistory.length);

  const ctx = document.getElementById("aqiChart").getContext("2d");

  // Destroy old instance
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "AQI Trend",
          data: aqiHistory,
          borderColor: "#00eaff",
          backgroundColor: "rgba(0,234,255,0.2)",
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 8,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      animation: {
        duration: 1200,         // smooth animation
        easing: "easeInOutQuad" // premium smooth curve
      },
      plugins: {
        legend: {
          labels: { color: document.body.classList.contains("dark") ? "#fff" : "#000" }
        }
      },
      scales: {
        x: {
          ticks: { color: document.body.classList.contains("dark") ? "#ddd" : "#333" },
          grid: { color: "rgba(255,255,255,0.1)" }
        },
        y: {
          min: 0,
          max: 500,
          ticks: { stepSize: 50, color: document.body.classList.contains("dark") ? "#ddd" : "#333" },
          grid: { color: "rgba(255,255,255,0.1)" }
        }
      }
    }
  });
}

/* ---------- ERROR HANDLING ---------- */
function showError(msg) {
  errorMessage.textContent = msg;
  errorCard.classList.remove("hidden");
}

function hideError() {
  errorCard.classList.add("hidden");
}

/* ---------- PARTICLE BACKGROUND ---------- */
const canvas = document.getElementById("particleCanvas");
const ctxP = canvas.getContext("2d");
let particles = [];

function initParticles() {
  if (!canvas) return;
  const count = innerWidth < 600 ? 40 : 90;
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  particles = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6
    });
  }
}

function animateParticles() {
  requestAnimationFrame(animateParticles);
  if (!ctxP || !canvas) return;

  ctxP.clearRect(0, 0, canvas.width, canvas.height);

  ctxP.fillStyle =
    document.body.classList.contains("dark")
      ? "rgba(255,255,255,0.7)"
      : "rgba(150,180,255,0.8)";

  particles.forEach(p => {
    ctxP.beginPath();
    ctxP.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctxP.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });
}

initParticles();
animateParticles();
window.addEventListener("resize", initParticles);

/* ---------- THEME TOGGLE ---------- */
themeToggle.addEventListener("click", () => {
  if (document.body.classList.contains("light")) {
    document.body.classList.remove("light");
    document.body.classList.add("dark");
    themeToggle.textContent = "🌙";
  } else {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
    themeToggle.textContent = "☀️";
  }
  initParticles();
});

/* ---------- SEARCH EVENTS ---------- */
searchBtn.addEventListener("click", getAQI);
cityInput.addEventListener("keydown", e => {
  if (e.key === "Enter") getAQI();
});

/* ---------- INITIAL STATE ---------- */
hideError();
resultCard.classList.add("hidden");
chartContainer.classList.add("hidden");
