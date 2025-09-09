import React from "react";

export default function FlightCard({ flight, selected, onSelect }) {
  return (
    <div
      className={`border rounded-md p-3 cursor-pointer hover:bg-gray-50 ${
        selected ? "bg-teal-50 border-teal-500" : ""
      }`}
      onClick={() => onSelect(flight)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold">{flight.airline} {flight.flightNumber}</h4>
          <p className="text-sm text-gray-600">{flight.departure.airport} → {flight.arrival.airport}</p>
          <p className="text-sm">{new Date(flight.departure.time).toLocaleDateString()} at {new Date(flight.departure.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div className="text-right">
          <p className="font-bold">{flight.currency} {flight.price}</p>
          <p className="text-sm text-gray-600">{flight.duration}</p>
        </div>
      </div>
    </div>
  );
}
