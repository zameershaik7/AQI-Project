require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const NodeCache = require("node-cache");

const app = express();
app.use(cors());

// Cache AQI for 10 minutes to improve performance
const cache = new NodeCache({ stdTTL: 600 });

app.get("/api/v1/aqi", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: "City name is required" });
  }

  const cacheKey = city.toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json({ source: "cache", data: cached });
  }

  try {
    // WAQI API endpoint
    const url = `https://api.waqi.info/feed/${encodeURIComponent(
      city
    )}/?token=${process.env.WAQI_TOKEN}`;

    const response = await axios.get(url);

    if (!response.data || response.data.status !== "ok") {
      return res.status(404).json({
        error: "City not found or WAQI API returned an error",
        details: response.data
      });
    }

    const d = response.data.data;

    const output = {
      city: d.city?.name,
      aqi: d.aqi,
      dominantPollutant: d.dominentpol,
      coordinates: d.city?.geo,
      time: d.time?.s,
      temperature: d.iaqi?.t?.v || null,
      humidity: d.iaqi?.h?.v || null,
      source: "WAQI API"
    };

    cache.set(cacheKey, output);
    return res.json({ source: "api", data: output });
  } catch (err) {
    console.log("====== BACKEND ERROR ======");
    console.log("MESSAGE:", err.message);
    console.log("STATUS:", err.response?.status);
    console.log("RESPONSE:", err.response?.data);
    console.log("============================");

    return res.status(500).json({ error: "Failed to fetch AQI from WAQI" });
  }
});

app.listen(5000, () => {
  console.log("WAQI backend running at http://localhost:5000");
});
