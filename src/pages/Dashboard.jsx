
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin, Calendar, Eye } from "lucide-react";

export default function Dashboard({ trips = [], onDelete }) {
  const navigate = useNavigate();

  const defaultTrips = [
    {
      id: 1,
      name: "Summer Vacation",
      destination: "Santorini, Greece",
      startDate: "2024-07-15",
      endDate: "2024-07-22",
      notes: "Don't forget sunscreen and camera!",
      itinerary: ["Day 1: Arrival and beach relaxation", "Day 2: Island exploration", "Day 3: Wine tasting"]
    },
    {
      id: 2,
      name: "Business Trip",
      destination: "Tokyo, Japan",
      startDate: "2024-09-10",
      endDate: "2024-09-14",
      notes: "Meetings at headquarters",
      itinerary: ["Day 1: Flight and hotel check-in", "Day 2-4: Business meetings", "Day 5: Return flight"]
    },
    {
      id: 3,
      name: "Weekend Getaway",
      destination: "Napa Valley, California",
      startDate: "2024-10-05",
      endDate: "2024-10-07",
      notes: "Wine tasting and relaxation",
      itinerary: ["Day 1: Drive to Napa", "Day 2: Wine tours", "Day 3: Return home"]
    },
  ];

  const displayTrips = trips.length > 0 ? trips : defaultTrips;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link
              to="/"
              className="inline-flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold">My Trips</h1>
            <p className="text-gray-500">
              Manage and explore your travel adventures
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/Addtrip")}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition"
            >
              + Add New Trip
            </button>
            <Link
              to="/api-demo"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              🔗 API Demo
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {displayTrips.map((trip) => (
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
                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
              </div>
              <p className="text-gray-600 mb-2">
                {Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1} days
              </p>
              <p className="text-gray-500 text-sm mb-4">{trip.notes}</p>
              <Link to={`/trip/${trip.id}`}>
                <button className="flex items-center px-4 py-2 border border-teal-500 text-teal-600 rounded-lg hover:bg-teal-50 transition">
                  <Eye size={16} className="mr-2" /> View Details
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
