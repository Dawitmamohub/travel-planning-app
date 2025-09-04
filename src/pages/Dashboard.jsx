import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin, Calendar, Eye, Edit3 } from "lucide-react";

export default function Dashboard({ trips = [], onDelete }) {
  const navigate = useNavigate();

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      onDelete(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
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
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
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

              {/* Buttons */}
              <div className="flex gap-2">
                <Link to={`/trip/${trip.id}`}>
                  <button className="flex items-center px-4 py-2 border border-teal-500 text-teal-600 rounded-lg hover:bg-teal-50 transition">
                    <Eye size={16} className="mr-2" /> View Details
                  </button>
                </Link>

                <button
                  onClick={() => navigate(`/addtrip/${trip.id}`)}
                  className="flex items-center px-4 py-2 border border-teal-500 text-teal-600 rounded-lg hover:bg-teal-50 transition"
                >
                  <Edit3 size={16} className="mr-2" /> Edit
                </button>

                <button
                  onClick={() => handleDelete(trip.id)}
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
