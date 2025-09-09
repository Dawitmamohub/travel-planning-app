import axios from "axios";

// API Keys (use env variables in production)
const WEATHER_API_KEY = "bd172694d69510e89d0b8f0418565adb";
const UNSPLASH_ACCESS_KEY = "5fTHzdMK5YQ9iyCRWCu6y9LwBNw6xf9UniYwgvDN5P4";
const AMADEUS_API_KEY = "APvENESnx4EYFJdo6B11gAPn3EOcI8tB";
const AMADEUS_API_SECRET = "8hlmoyaEVIsHrGL2";

// Base URLs
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";
const UNSPLASH_BASE_URL = "https://api.unsplash.com";
const AMADEUS_AUTH_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
const AMADEUS_BASE_URL = "https://test.api.amadeus.com/v2";

// Amadeus Token Management
let amadeusAccessToken = null;
let amadeusTokenExpiry = null;

// Rate limiting to avoid API quota issues
let lastRequestTime = 0;
const REQUEST_DELAY = 500; // ms between requests

// Mock data for fallback
const mockFlights = [
  {
    id: 1,
    airline: "Delta Airlines",
    flightNumber: "DL 1234",
    departure: { 
      airport: "JFK", 
      time: new Date(Date.now() + 86400000).toISOString(), 
      city: "New York" 
    },
    arrival: { 
      airport: "LAX", 
      time: new Date(Date.now() + 86400000 + 21600000).toISOString(), 
      city: "Los Angeles" 
    },
    duration: "6h 00m",
    price: 350,
    currency: "USD",
  },
  {
    id: 2,
    airline: "United Airlines",
    flightNumber: "UA 5678",
    departure: { 
      airport: "JFK", 
      time: new Date(Date.now() + 86400000 + 10800000).toISOString(), 
      city: "New York" 
    },
    arrival: { 
      airport: "LAX", 
      time: new Date(Date.now() + 86400000 + 32400000).toISOString(), 
      city: "Los Angeles" 
    },
    duration: "6h 00m",
    price: 290,
    currency: "USD",
  },
];

const mockHotels = [
  {
    id: 1,
    name: "Luxury Resort & Spa",
    rating: 4.5,
    price: 200,
    currency: "USD",
    address: "123 Beach Road, Malibu, CA",
    amenities: ["Pool", "Spa", "Free WiFi", "Breakfast"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
  },
  {
    id: 2,
    name: "City Center Hotel",
    rating: 4.2,
    price: 120,
    currency: "USD",
    address: "456 Main Street, Los Angeles, CA",
    amenities: ["Gym", "Restaurant", "Free WiFi", "Parking"],
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
  },
];

// Rate-limited request function
const rateLimitedRequest = async (fn, ...args) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < REQUEST_DELAY) {
    await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();
  return fn(...args);
};

export const getAmadeusToken = async () => {
  // Return existing token if it's still valid
  if (amadeusAccessToken && amadeusTokenExpiry && new Date() < amadeusTokenExpiry) {
    return amadeusAccessToken;
  }

  try {
    const formData = new URLSearchParams();
    formData.append("grant_type", "client_credentials");
    formData.append("client_id", AMADEUS_API_KEY);
    formData.append("client_secret", AMADEUS_API_SECRET);

    const res = await axios.post(AMADEUS_AUTH_URL, formData, {
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    amadeusAccessToken = res.data.access_token;
    const expiresIn = res.data.expires_in || 1800;
    amadeusTokenExpiry = new Date(Date.now() + expiresIn * 1000);
    
    console.log("Amadeus token acquired successfully");
    return amadeusAccessToken;
  } catch (err) {
    console.error("Amadeus auth error:", err.response?.data || err.message);
    throw new Error("Failed to authenticate with Amadeus API. Check your credentials.");
  }
};

// City to IATA code mapping for common cities
const cityToIataMap = {
  "new york": "NYC",
  "new york city": "NYC",
  "nyc": "NYC",
  "los angeles": "LAX",
  "la": "LAX",
  "chicago": "ORD",
  "san francisco": "SFO",
  "sf": "SFO",
  "miami": "MIA",
  "las vegas": "LAS",
  "paris": "PAR",
  "london": "LON",
  "london uk": "LHR",
  "london heathrow": "LHR",
  "tokyo": "TYO",
  "tokyo narita": "NRT",
  "tokyo haneda": "HND",
  "sydney": "SYD",
  "dubai": "DXB",
  "rome": "ROM",
  "madrid": "MAD",
  "barcelona": "BCN",
  "berlin": "BER",
  "amsterdam": "AMS",
  "frankfurt": "FRA",
  "munich": "MUC",
  "vienna": "VIE",
  "prague": "PRG",
  "budapest": "BUD",
  "warsaw": "WAW",
  "moscow": "SVO",
  "istanbul": "IST",
  "athens": "ATH",
  "dublin": "DUB",
  "copenhagen": "CPH",
  "stockholm": "ARN",
  "oslo": "OSL",
  "helsinki": "HEL",
  "brussels": "BRU",
  "zurich": "ZRH",
  "milan": "MIL",
  "venice": "VCE",
  "florence": "FLR",
  "naples": "NAP",
  "boston": "BOS",
  "washington": "WAS",
  "dc": "WAS",
  "washington dc": "WAS",
  "seattle": "SEA",
  "portland": "PDX",
  "phoenix": "PHX",
  "denver": "DEN",
  "dallas": "DFW",
  "houston": "HOU",
  "atlanta": "ATL",
  "orlando": "MCO",
  "tampa": "TPA",
  "montreal": "YUL",
  "toronto": "YYZ",
  "vancouver": "YVR",
  "mexico city": "MEX",
  "cancun": "CUN",
  "rio de janeiro": "GIG",
  "sao paulo": "GRU",
  "buenos aires": "EZE",
  "santiago": "SCL",
  "lima": "LIM",
  "bogota": "BOG",
  "beijing": "PEK",
  "shanghai": "PVG",
  "hong kong": "HKG",
  "singapore": "SIN",
  "bangkok": "BKK",
  "kuala lumpur": "KUL",
  "jakarta": "CGK",
  "manila": "MNL",
  "seoul": "ICN",
  "delhi": "DEL",
  "mumbai": "BOM",
  "bangalore": "BLR",
  "chennai": "MAA",
  "hyderabad": "HYD",
  "kolkata": "CCU",
  "cairo": "CAI",
  "casablanca": "CMN",
  "cape town": "CPT",
  "johannesburg": "JNB",
  "nairobi": "NBO",
  "dakar": "DKR",
  "accra": "ACC",
  "lagos": "LOS",
  "addis ababa": "ADD",
  "dar es salaam": "DAR",
  "kampala": "EBB"
};

// Convert destination to city code
export const getCityCode = (destination) => {
  if (!destination) return "XXX";
  
  // Clean the destination string
  const cleanDest = destination.toLowerCase().trim().split(",")[0].trim();
  
  // Check if it's already an IATA code (3 uppercase letters)
  if (/^[A-Z]{3}$/.test(cleanDest.toUpperCase())) {
    return cleanDest.toUpperCase();
  }
  
  // Look up in our mapping
  return cityToIataMap[cleanDest] || "LAX"; // Default to LAX if not found
};

// Search Flights
export const searchFlights = async (origin, destination, departureDate) => {
  try {
    const token = await getAmadeusToken();
    const originCode = getCityCode(origin);
    const destCode = getCityCode(destination);
    
    console.log(`Searching flights from ${originCode} to ${destCode} on ${departureDate}`);
    
    const res = await rateLimitedRequest(
      axios.get,
      `${AMADEUS_BASE_URL}/shopping/flight-offers`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          originLocationCode: originCode,
          destinationLocationCode: destCode,
          departureDate,
          adults: 1,
          max: 5,
          currencyCode: "USD",
        },
        timeout: 10000, // 10 second timeout
      }
    );
    
    return formatFlightData(res.data.data || []);
  } catch (err) {
    console.error("Flight search error:", err.response?.data || err.message);
    
    // Mock fallback with dates based on the departureDate parameter
    const departureDateObj = new Date(departureDate);
    return mockFlights.map(flight => ({
      ...flight,
      departure: {
        ...flight.departure,
        time: new Date(departureDateObj.getTime() + 9 * 60 * 60 * 1000).toISOString(), // 9 AM
        city: origin
      },
      arrival: {
        ...flight.arrival,
        time: new Date(departureDateObj.getTime() + 15 * 60 * 60 * 1000).toISOString(), // 3 PM
        city: destination
      },
      price: 350 + Math.floor(Math.random() * 200),
    }));
  }
};

// Search Hotels
export const searchHotels = async (destination, checkIn, checkOut) => {
  try {
    const token = await getAmadeusToken();
    const cityCode = getCityCode(destination);
    
    console.log(`Searching hotels in ${cityCode} from ${checkIn} to ${checkOut}`);
    
    // Try the reference data API first to get hotel IDs
    const refResponse = await rateLimitedRequest(
      axios.get,
      `${AMADEUS_BASE_URL}/reference-data/locations/hotels/by-city`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          cityCode,
          radius: 50,
          radiusUnit: 'KM',
          ratings: '3,4,5',
          sort: 'RELEVANCE',
          page: { limit: 10, offset: 0 }
        },
        timeout: 10000,
      }
    );
    
    if (!refResponse.data.data || refResponse.data.data.length === 0) {
      throw new Error("No hotels found for this destination");
    }
    
    const hotelIds = refResponse.data.data.map(hotel => hotel.hotelId).join(',');
    
    // Now search for offers
    const offersResponse = await rateLimitedRequest(
      axios.get,
      `${AMADEUS_BASE_URL}/shopping/hotel-offers`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          hotelIds,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          adults: 1,
          roomQuantity: 1,
          currency: 'USD',
          bestRateOnly: true
        },
        timeout: 10000,
      }
    );
    
    return formatHotelData(offersResponse.data.data || []);
  } catch (err) {
    console.error("Hotel search error:", err.response?.data || err.message);
    
    // Mock fallback
    return mockHotels.map(hotel => ({
      ...hotel,
      price: 120 + Math.floor(Math.random() * 150),
      address: `123 Main Street, ${destination}`,
    }));
  }
};

// Format flight data
export const formatFlightData = (flightData) => {
  if (!flightData || flightData.length === 0) return [];
  
  // Check if it's already mock data
  if (flightData[0].airline) return flightData;
  
  return flightData.map((offer, index) => {
    const itinerary = offer.itineraries[0];
    const segment = itinerary.segments[0];
    const price = offer.price;
    
    // Calculate duration in hours and minutes
    const durationMs = new Date(segment.arrival.at) - new Date(segment.departure.at);
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const duration = `${hours}h ${minutes}m`;
    
    return {
      id: index,
      airline: segment.carrierCode,
      flightNumber: `${segment.carrierCode} ${segment.number}`,
      departure: { 
        airport: segment.departure.iataCode, 
        time: segment.departure.at, 
        city: segment.departure.iataCode 
      },
      arrival: { 
        airport: segment.arrival.iataCode, 
        time: segment.arrival.at, 
        city: segment.arrival.iataCode 
      },
      duration,
      price: price.total,
      currency: price.currency,
    };
  });
};

// Format hotel data
const formatHotelData = (hotelData) => {
  if (!hotelData || hotelData.length === 0) return [];
  
  return hotelData.map((hotel, index) => {
    const offer = hotel.offers[0];
    const price = offer.price;
    
    return {
      id: index,
      name: hotel.hotel.name,
      rating: parseFloat(hotel.hotel.rating || 4),
      price: price.total,
      currency: price.currency,
      address: hotel.hotel.address?.lines?.join(', ') || 'Address not available',
      amenities: hotel.hotel.amenities || ['Free WiFi', 'Air Conditioning'],
      image: hotel.hotel.media?.uri || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    };
  });
};

// Weather
export const getWeatherData = async (destination) => {
  try {
    const city = destination.split(",")[0].trim();
    const [currentRes, forecastRes] = await Promise.all([
      axios.get(`${WEATHER_BASE_URL}/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`),
      axios.get(`${WEATHER_BASE_URL}/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`),
    ]);
    
    const dailyForecast = [];
    const seenDates = new Set();
    
    forecastRes.data.list.forEach((entry) => {
      const [date, time] = entry.dt_txt.split(" ");
      if (time === "12:00:00" && !seenDates.has(date)) {
        seenDates.add(date);
        dailyForecast.push({ 
          date, 
          temp: Math.round(entry.main.temp), 
          icon: entry.weather[0].icon, 
          description: entry.weather[0].description 
        });
      }
    });
    
    return { 
      current: currentRes.data, 
      forecast: dailyForecast.slice(0, 5) 
    };
  } catch (err) {
    console.error("Weather error:", err.response?.data || err.message);
    
    // Mock weather data
    const currentDate = new Date();
    const forecast = [];
    
    for (let i = 1; i <= 5; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      forecast.push({
        date: date.toISOString().split('T')[0],
        temp: Math.floor(Math.random() * 15) + 15, // 15-30°C
        icon: '01d',
        description: 'Sunny'
      });
    }
    
    return {
      current: {
        main: { temp: 22 },
        weather: [{ description: 'Sunny', icon: '01d' }]
      },
      forecast
    };
  }
};

// Unsplash photo
export const getDestinationPhoto = async (destination) => {
  try {
    const city = destination.split(",")[0].trim();
    const res = await axios.get(
      `${UNSPLASH_BASE_URL}/search/photos?query=${encodeURIComponent(city)}&client_id=${UNSPLASH_ACCESS_KEY}&orientation=landscape&per_page=1`
    );
    
    return res.data.results[0]?.urls?.regular || null;
  } catch (err) {
    console.error("Unsplash error:", err.response?.data || err.message);
    
    // Fallback to a generic travel image
    return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1335&q=80";
  }
};