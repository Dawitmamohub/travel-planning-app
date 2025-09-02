import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import amadeusService from '../utils/amadeusService';

export default function APIDemo() {
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [pois, setPois] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isApiConfigured, setIsApiConfigured] = useState(() => {
    const apiKey = process.env.REACT_APP_AMADEUS_API_KEY;
    const apiSecret = process.env.REACT_APP_AMADEUS_API_SECRET;
    return !!(apiKey && apiSecret && apiKey !== 'xP2dAmjE75k0RX4V0Iqy5ZXUFc0RXKYf' && apiSecret !== '2z8uoirGMbY1efEi');
  });

  // Flight search
  const searchFlights = async () => {
    setLoading(true);
    setError(null);
    try {
      const flightData = await amadeusService.getFlightOffers('NYC', 'LON', '2024-12-01', '2024-12-15', 1);
      setFlights(flightData.data || []);
    } catch (err) {
      setError('Failed to fetch flights: ' + err.message);
    }
    setLoading(false);
  };

  // Hotel search
  const searchHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      const hotelData = await amadeusService.getHotels('PAR', '2024-12-01', '2024-12-05', 2);
      setHotels(hotelData);
    } catch (err) {
      setError('Failed to fetch hotels: ' + err.message);
    }
    setLoading(false);
  };

  // Points of Interest search
  const searchPOIs = async () => {
    setLoading(true);
    setError(null);
    try {
      const poiData = await amadeusService.getPointsOfInterest(48.8566, 2.3522, 5);
      setPois(poiData);
    } catch (err) {
      setError('Failed to fetch points of interest: ' + err.message);
    }
    setLoading(false);
  };

  // Airport/City search
  const searchAirports = async (keyword) => {
    if (!keyword.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const results = await amadeusService.getAirportCitySearch(keyword);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search airports/cities: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors mb-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Amadeus API Demo</h1>
          <p className="text-gray-600">Test various Amadeus travel API endpoints</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* API Configuration Warning */}
        {!isApiConfigured && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-6">
            <strong>API Not Configured:</strong> Please set your Amadeus API credentials in the .env file to test the live API endpoints.
          </div>
        )}

        {/* API Test Buttons */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={searchFlights}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Search Flights'}
          </button>

          <button
            onClick={searchHotels}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Search Hotels'}
          </button>

          <button
            onClick={searchPOIs}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Search POIs'}
          </button>

          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Search airports/cities..."
              onChange={(e) => searchAirports(e.target.value)}
              className="px-3 py-2 border rounded-lg mb-2"
            />
            <button
              onClick={() => searchAirports('London')}
              disabled={loading}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Quick Search'}
            </button>
          </div>
        </div>

        {/* Results Display */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Flights */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Flight Results</h2>
            {flights.length > 0 ? (
              <div className="space-y-3">
                {flights.slice(0, 3).map((flight, index) => (
                  <div key={index} className="border rounded p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {flight.itineraries[0].segments[0].departure.iataCode} → {flight.itineraries[0].segments[0].arrival.iataCode}
                      </span>
                      <span className="text-green-600 font-bold">
                        ${flight.price.total}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Duration: {flight.itineraries[0].duration.replace('PT', '')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No flights found. Click "Search Flights" to test.</p>
            )}
          </div>

          {/* Hotels */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Hotel Results</h2>
            {hotels.length > 0 ? (
              <div className="space-y-3">
                {hotels.slice(0, 3).map((hotel, index) => (
                  <div key={index} className="border rounded p-3">
                    <div className="font-medium">{hotel.hotel.name}</div>
                    <div className="text-sm text-gray-600">
                      Rating: {hotel.hotel.rating || 'N/A'}
                    </div>
                    <div className="text-green-600 font-bold">
                      ${hotel.offers[0]?.price?.total || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hotels found. Click "Search Hotels" to test.</p>
            )}
          </div>

          {/* Points of Interest */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Points of Interest</h2>
            {pois.length > 0 ? (
              <div className="space-y-3">
                {pois.slice(0, 5).map((poi, index) => (
                  <div key={index} className="border rounded p-3">
                    <div className="font-medium">{poi.name}</div>
                    <div className="text-sm text-gray-600">
                      Category: {poi.category}
                    </div>
                    <div className="text-sm text-gray-500">
                      {poi.tags?.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No POIs found. Click "Search POIs" to test.</p>
            )}
          </div>

          {/* Airport/City Search */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Airport/City Search</h2>
            {searchResults.length > 0 ? (
              <div className="space-y-3">
                {searchResults.map((result, index) => (
                  <div key={index} className="border rounded p-3">
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm text-gray-600">
                      {result.iataCode} - {result.subType}
                    </div>
                    <div className="text-sm text-gray-500">
                      {result.address?.cityName}, {result.address?.countryName}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No results found. Type in the search box above.</p>
            )}
          </div>
        </div>

        {/* API Info */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">API Integration Info</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p><strong>Environment Variables Required:</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li>REACT_APP_AMADEUS_API_KEY</li>
              <li>REACT_APP_AMADEUS_API_SECRET</li>
            </ul>
            <p><strong>Available Methods:</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li>getFlightOffers(origin, destination, departureDate, returnDate, adults)</li>
              <li>getHotels(cityCode, checkInDate, checkOutDate, adults)</li>
              <li>getPointsOfInterest(latitude, longitude, radius)</li>
              <li>getAirportCitySearch(keyword)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
