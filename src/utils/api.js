const AMADEUS_CLIENT_ID = import.meta.env.VITE_AMADEUS_CLIENT_ID;
const AMADEUS_CLIENT_SECRET = import.meta.env.VITE_AMADEUS_CLIENT_SECRET;
const AMADEUS_BASE = "https://test.api.amadeus.com/v1";
const OPENWEATHER_BASE = "https://api.openweathermap.org/data/2.5";

/**
 * Get Amadeus OAuth token
*/
export async function getAmadeusToken() {
  const res = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: AMADEUS_CLIENT_ID,
      client_secret: AMADEUS_CLIENT_SECRET,
    }),
  });

  if (!res.ok) throw new Error("Failed to fetch Amadeus token");
  return res.json(); // returns { access_token, expires_in, token_type }
}

/**
 * Search destinations to get IATA code
 */
export async function searchDestinations(query, token) {
  const res = await fetch(
    `${AMADEUS_BASE}/reference-data/locations?subType=CITY&keyword=${query}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error("Failed to fetch destinations");
  return res.json();
}

/**
 * Fetch flights between origin and destination
 */
export async function fetchFlights(origin, destination, token) {
  const res = await fetch(
    `${AMADEUS_BASE}/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&adults=1`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error("Failed to fetch flights");
  return res.json();
}

/**
 * Fetch hotels for a city code
 */
export async function fetchHotels(cityCode, token) {
  const res = await fetch(
    `${AMADEUS_BASE}/shopping/hotel-offers?cityCode=${cityCode}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error("Failed to fetch hotels");
  return res.json();
}

/**
 * Fetch current weather for a city
 */
export async function fetchWeather(city) {
  const res = await fetch(
    `${OPENWEATHER_BASE}/weather?q=${city}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric`
  );
  if (!res.ok) throw new Error("Failed to fetch weather");
  return res.json();
}
