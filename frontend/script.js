function getAQICategory(aqi) {
  if (aqi <= 50) return { cat: "Good", color: "#2ecc71" };
  if (aqi <= 100) return { cat: "Moderate", color: "#f1c40f" };
  if (aqi <= 150) return { cat: "Unhealthy for Sensitive Groups", color: "#e67e22" };
  if (aqi <= 200) return { cat: "Unhealthy", color: "#e74c3c" };
  if (aqi <= 300) return { cat: "Very Unhealthy", color: "#8e44ad" };
  return { cat: "Hazardous", color: "#990000" };
}

async function fetchAQI() {
  const city = document.getElementById("cityInput").value;
  const error = document.getElementById("error");
  const card = document.getElementById("resultCard");

  error.textContent = "";
  card.classList.add("hidden");

  if (!city) {
    error.textContent = "Please enter a city.";
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/v1/aqi?city=${city}`);
    const data = await res.json();

    if (data.error) {
      error.textContent = data.error;
      return;
    }

    const d = data.data;

    document.getElementById("locationName").textContent = d.city;
    document.getElementById("aqiValue").textContent = d.aqi;
    document.getElementById("pollutant").textContent = d.dominantPollutant;
    document.getElementById("temp").textContent = d.temperature ?? "N/A";
    document.getElementById("humidity").textContent = d.humidity ?? "N/A";
    document.getElementById("coords").textContent = d.coordinates.join(", ");
    document.getElementById("time").textContent = d.time;

    const cat = getAQICategory(d.aqi);
    const badge = document.getElementById("aqiCategory");
    badge.textContent = cat.cat;
    badge.style.background = cat.color;

    setTimeout(() => {
      card.classList.remove("hidden");
    }, 100);

  } catch (err) {
    error.textContent = "Failed to connect to backend.";
  }
}
