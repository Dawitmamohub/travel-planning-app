import { useEffect, useState } from "react";
import { fetchFlights, fetchHotels, fetchWeather } from "../utils/api";

export default function DestinationDetails({ cityCode, cityName }) {
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem("amadeus_token"); // or via serverless
      setFlights(await fetchFlights("LON", cityCode, token));
      setHotels(await fetchHotels(cityCode, token));
      setWeather(await fetchWeather(cityName));
    }
    loadData();
  }, [cityCode]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{cityName}</h1>
      {weather && (
        <p>Current Temp: {weather.main.temp}°C</p>
      )}

      <section>
        <h2 className="text-xl font-semibold">Flights</h2>
        {flights.data?.map(f => (
          <p key={f.id}>
            {f.itineraries[0].segments[0].carrierCode} - ${f.price.total}
          </p>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold">Hotels</h2>
        {hotels.data?.map(h => (
          <p key={h.hotel.hotelId}>{h.hotel.name}</p>
        ))}
      </section>
    </div>
  );
}
