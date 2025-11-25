// --------------------------------------------
// IMPORTS
// --------------------------------------------
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const NodeCache = require("node-cache");
require("dotenv").config();

// --------------------------------------------
// APP + MIDDLEWARE
// --------------------------------------------
const app = express();
app.use(cors({ origin: "*" }));

// Cache: 10 minutes TTL
const cache = new NodeCache({ stdTTL: 600 });

// --------------------------------------------
// WAQI TOKEN
// --------------------------------------------
const TOKEN = process.env.WAQI_TOKEN;

// --------------------------------------------
// ROUTE: GET AQI BY CITY
// --------------------------------------------
app.get("/api/aqi", async (req, res) => {
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
    // WAQI API URL
    const url = `https://api.waqi.info/feed/${encodeURIComponent(city)}/?token=${TOKEN}`;

    const response = await axios.get(url);

    if (!response.data || response.data.status !== "ok") {
      return res.status(404).json({ error: "City not found or WAQI returned an error" });
    }

    const data = response.data.data;

    // --------------------------------------------
    // Extract pollutant values
    // --------------------------------------------
    const pollutants = {
      pm25: data.iaqi.pm25?.v || null,
      pm10: data.iaqi.pm10?.v || null,
      o3: data.iaqi.o3?.v || null,
      no2: data.iaqi.no2?.v || null,
      so2: data.iaqi.so2?.v || null,
      co: data.iaqi.co?.v || null,
    };

    // --------------------------------------------
    // Final Response Object
    // --------------------------------------------
    const result = {
      city: data.city.name,
      aqi: data.aqi,
      dominantPollutant: data.dominentpol || null,
      coordinates: data.city.geo || [],
      time: data.time.s || "",
      temperature: data.iaqi.t?.v || null,
      humidity: data.iaqi.h?.v || null,
      pollutants: pollutants,       // << NEW FIELD
    };

    // Cache the response
    cache.set(cacheKey, result);

    res.json({ source: "api", data: result });

  } catch (error) {
    console.log("============== BACKEND ERROR ==============");
    console.log("Message:", error.message);
    console.log("Status:", error.response?.status);
    console.log("Response:", error.response?.data);
    console.log("URL:", error.config?.url);
    console.log("===========================================");

    return res.status(500).json({ error: "Server error fetching AQI" });
  }
});

// --------------------------------------------
// START SERVER
// --------------------------------------------
app.listen(5000, () => {
  console.log("Backend running at http://localhost:5000");
});
