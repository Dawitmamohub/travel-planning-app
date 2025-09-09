// test/testAmadeusSearch.js
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// Load your keys from .env
const AMADEUS_API_KEY = process.env.REACT_APP_AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.REACT_APP_AMADEUS_API_SECRET;

// Sandbox base URL
const AMADEUS_AUTH_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
const AMADEUS_BASE_URL = "https://test.api.amadeus.com/v2";

// 1. Get access token
async function getAmadeusToken() {
  try {
    const formData = new URLSearchParams();
    formData.append("grant_type", "client_credentials");
    formData.append("client_id", AMADEUS_API_KEY);
    formData.append("client_secret", AMADEUS_API_SECRET);

    const response = await axios.post(AMADEUS_AUTH_URL, formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    console.log("Access Token:", response.data.access_token);
    console.log("Expires in:", response.data.expires_in, "seconds");
    return response.data.access_token;
  } catch (err) {
    console.error("Failed to get token:", err.response?.data || err.message);
  }
}

// 2. Test flight search
async function searchFlights(token) {
  try {
    const response = await axios.get(`${AMADEUS_BASE_URL}/shopping/flight-offers`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        originLocationCode: "JFK",
        destinationLocationCode: "LAX",
        departureDate: "2025-09-10",
        adults: 1,
        max: 3,
      },
    });
    console.log("Flight Results:", response.data.data);
  } catch (err) {
    console.error("Flight search error:", err.response?.data || err.message);
  }
}

// 3. Test hotel search
async function searchHotels(token) {
  try {
    const response = await axios.get(
      `${AMADEUS_BASE_URL}/reference-data/locations/hotels/by-city`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { cityCode: "NYC", radius: 50, radiusUnit: "KM", hotelSource: "ALL" },
      }
    );
    console.log("Hotel Results:", response.data.data);
  } catch (err) {
    console.error("Hotel search error:", err.response?.data || err.message);
  }
}

// Run tests
(async () => {
  const token = await getAmadeusToken();
  if (!token) return;

  await searchFlights(token);
  await searchHotels(token);
})();
