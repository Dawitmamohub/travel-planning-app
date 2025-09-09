import React from "react";

const TripSummary = ({ flight, hotel, onConfirm }) => {
  if (!flight || !hotel) {
    return (
      <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center">
        <p className="text-gray-600">Please select a flight and a hotel first.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Your Trip Summary</h2>

      {/* Flight Summary */}
      <div className="mb-6 border-b pb-4">
        <h3 className="text-xl font-semibold mb-2">✈️ Flight</h3>
        <p>
          {flight.departure.city} ({flight.departure.airport}) →{" "}
          {flight.arrival.city} ({flight.arrival.airport})
        </p>
        <p>
          Departure: {new Date(flight.departure.time).toLocaleString()} <br />
          Arrival: {new Date(flight.arrival.time).toLocaleString()}
        </p>
        <p>Airline: {flight.airline}</p>
        <p className="font-bold text-blue-600">
          Price: {flight.price} {flight.currency}
        </p>
      </div>

      {/* Hotel Summary */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">🏨 Hotel</h3>
        <p className="font-bold">{hotel.name}</p>
        <p>{hotel.address}</p>
        <p>Rating: ⭐ {hotel.rating}</p>
        <p className="font-bold text-green-600">
          Price: {hotel.price} {hotel.currency} / night
        </p>
      </div>

      {/* Confirm Button */}
      <button
        onClick={onConfirm}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Confirm Booking
      </button>
    </div>
  );
};

export default TripSummary;
