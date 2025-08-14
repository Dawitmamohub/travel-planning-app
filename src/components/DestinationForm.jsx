import { useState } from "react";

export default function DestinationForm({ onAddTrip }) {
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!destination || !date) return;
    onAddTrip({ destination, date });
    setDestination("");
    setDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
      <input
        type="text"
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="p-2 border rounded"
      />
      <button type="submit" className="bg-blue-700 text-white p-2 rounded hover:bg-blue-800">
        Add Trip
      </button>
    </form>
  );
}
