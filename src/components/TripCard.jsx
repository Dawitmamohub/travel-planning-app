import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function TripCard({ trip, onDelete }) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <h2 className="text-xl font-semibold">{trip.title}</h2>
      <p className="text-gray-600">{trip.destination}</p>
      <p className="text-gray-500 text-sm">
        {trip.startDate} - {trip.endDate}
      </p>
      <div className="mt-4 flex gap-2">
        <Link to={`/trip/${trip.id}`}>
          <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
            View Details
          </Button>
        </Link>
        <Button size="sm" onClick={onDelete} className="bg-red-500 hover:bg-red-600">
          Delete
        </Button>
      </div>
    </div>
  );
}
