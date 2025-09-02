import React from "react";

export default function DestinationForm({ destination, setDestination }) {
  return (
    <input
      type="text"
      placeholder="Destination"
      value={destination}
      onChange={(e) => setDestination(e.target.value)}
      className="border p-3 rounded-md w-full"
    />
  );
}
