import React, { useState, useEffect } from "react";

export default function AddTrip({ trip, onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [itinerary, setItinerary] = useState([]);
  const [newItineraryItem, setNewItineraryItem] = useState("");

  // Pre-fill form if editing
  useEffect(() => {
    if (trip) {
      setName(trip.name || "");
      setDestination(trip.destination || "");
      setStartDate(trip.startDate || "");
      setEndDate(trip.endDate || "");
      setNotes(trip.notes || "");
      setItinerary(trip.itinerary || []);
    }
  }, [trip]);

  const handleAddItineraryItem = () => {
    if (newItineraryItem.trim()) {
      setItinerary([...itinerary, newItineraryItem.trim()]);
      setNewItineraryItem("");
    }
  };

  const handleRemoveItineraryItem = (index) => {
    setItinerary(itinerary.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !destination || !startDate || !endDate) {
      alert("Please fill in all required fields.");
      return;
    }

    const tripData = {
      id: trip ? trip.id : undefined, // keep id if editing
      name,
      destination,
      startDate,
      endDate,
      notes,
      itinerary,
    };

    onSubmit(tripData);
  };

  return (
    <div className="min-h-screen flex justify-center items-start p-8 bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-6 text-teal-600">
          {trip ? "Edit Trip" : "Add New Trip"}
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Trip Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-3 border rounded-md"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 border rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full p-3 border rounded-md"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Itinerary</label>
            <div className="flex mb-2">
              <input
                type="text"
                value={newItineraryItem}
                onChange={(e) => setNewItineraryItem(e.target.value)}
                className="w-full p-3 border rounded-l-md"
              />
              <button
                type="button"
                onClick={handleAddItineraryItem}
                className="bg-teal-600 text-white px-4 rounded-r-md"
              >
                Add
              </button>
            </div>
            <ul className="list-disc pl-5 space-y-1">
              {itinerary.map((item, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItineraryItem(index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              {trip ? "Save Changes" : "Add Trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
