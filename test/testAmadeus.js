import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;
const AMADEUS_AUTH_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";

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
  } catch (error) {
    console.error("Error getting token:", error.response?.data || error.message);
  }
}

getAmadeusToken();
