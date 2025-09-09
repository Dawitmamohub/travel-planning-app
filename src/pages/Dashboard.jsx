import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin, Calendar, Eye, Edit3, Plane, Hotel, X } from "lucide-react";
import { getWeatherData, getDestinationPhoto } from "../utils/api";

export default function Dashboard({ trips = [], onDelete }) {
  const navigate = useNavigate();
  const [tripExtras, setTripExtras] = useState({});
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, tripId: null, tripName: "" });

  const handleDelete = (id, name) => {
    setDeleteModal({ isOpen: true, tripId: id, tripName: name });
  };

  const confirmDelete = () => {
    if (deleteModal.tripId) {
      onDelete(deleteModal.tripId);
      setDeleteModal({ isOpen: false, tripId: null, tripName: "" });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, tripId: null, tripName: "" });
  };

  // Fetch weather & photo for each trip
  useEffect(() => {
    trips.forEach(async (trip) => {
      if (!tripExtras[trip.id]) {
        try {
          const [weather, photo] = await Promise.all([
            getWeatherData(trip.destination),
            getDestinationPhoto(trip.destination),
          ]);

          setTripExtras((prev) => ({
            ...prev,
            [trip.id]: { weather, photo },
          }));
        } catch (error) {
          console.error("Error fetching trip extras:", error);
        }
      }
    });
  }, [trips]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Confirm Deletion</h3>
              <button
                onClick={cancelDelete}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the trip "{deleteModal.tripName}"? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete Trip
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link
              to="/"
              className="inline-flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold mt-2">My Trips</h1>
            <p className="text-gray-500">Manage and explore your travel adventures</p>
          </div>
          <div>
            <button
              onClick={() => navigate("/addtrip")}
              className="px-3 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition"
            >
              + Add New Trip
            </button>
          </div>
        </div>

        {/* Trips Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {trips.map((trip) => {
            const extras = tripExtras[trip.id] || {};
            const weather = extras.weather?.current;
            const photo = extras.photo;

            return (
              <div
                key={trip.id}
                className="bg-teal-100 p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                {/* Destination photo */}
                {photo && (
                  <img
                    src={photo}
                    alt={trip.destination}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}

                <h2 className="text-xl font-semibold mb-2">{trip.name}</h2>

                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin size={16} className="mr-2 text-teal-500" />
                  {trip.destination}
                </div>

                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar size={16} className="mr-2 text-teal-500" />
                  {new Date(trip.startDate).toLocaleDateString()} -{" "}
                  {new Date(trip.endDate).toLocaleDateString()}
                </div>

                <p className="text-gray-600 mb-2">
                  {Math.ceil(
                    (new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)
                  ) + 1}{" "}
                  days
                </p>

                <p className="text-gray-500 text-sm mb-4">{trip.notes}</p>

                {/* Flight info */}
                {trip.flight && (
                  <div className="flex items-center text-gray-600 mb-2">
                    <Plane size={16} className="mr-2 text-teal-500" />
                    {trip.flight.airline} {trip.flight.flightNumber}: {trip.flight.departure.airport} →{" "}
                    {trip.flight.arrival.airport} (${trip.flight.price})
                  </div>
                )}

                {/* Hotel info */}
                {trip.hotel && (
                  <div className="flex items-center text-gray-600 mb-4">
                    <Hotel size={16} className="mr-2 text-teal-500" />
                    {trip.hotel.name} - ${trip.hotel.price}/night, Rating: {trip.hotel.rating}/5
                  </div>
                )}

                {/* Weather info */}
                {weather && (
                  <div className="flex items-center text-gray-600 mb-4">
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                      alt={weather.weather[0].description}
                      className="w-6 h-6 mr-2"
                    />
                    {weather.temp}°C - {weather.weather[0].description}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <Link to={`/trip/${trip.id}`}>
                    <button className="flex items-center px-3 py-1 border border-teal-500 text-teal-600 rounded-lg hover:bg-teal-50 transition">
                      <Eye size={16} className="mr-2" /> View Details
                    </button>
                  </Link>

                  <button
                    onClick={() => navigate(`/addtrip/${trip.id}`)}
                    className="flex items-center px-3 py-1 border border-teal-500 text-teal-600 rounded-lg hover:bg-teal-50 transition"
                  >
                    <Edit3 size={16} className="mr-2" /> Edit
                  </button>

                  <button
                    onClick={() => handleDelete(trip.id, trip.name)}
                    className="flex items-center px-3 py-1 bg-teal-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}