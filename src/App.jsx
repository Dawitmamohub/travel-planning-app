import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import DestinationForm from "./components/DestinationForm";
import TripCard from "./components/TripCard";

export default function App() {
  // Initialize trips from localStorage if available
  const [trips, setTrips] = useState(() => {
    const savedTrips = localStorage.getItem("trips");
    return savedTrips ? JSON.parse(savedTrips) : [];
  });

  // Save trips to localStorage whenever trips state changes
  useEffect(() => {
    localStorage.setItem("trips", JSON.stringify(trips));
  }, [trips]);

  const addTrip = (trip) => {
    setTrips([trip, ...trips]);
  };

  const deleteTrip = (indexToDelete) => {
    const updatedTrips = trips.filter((_, index) => index !== indexToDelete);
    setTrips(updatedTrips);
  };

  return (
    <div className="min-h-screen bg-blue-100">
      <Navbar />
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-4xl font-bold text-blue-700 mb-6">
          Travel Planning App
        </h1>

        <DestinationForm onAddTrip={addTrip} />

        <div className="flex flex-col items-center">
          {trips.map((trip, index) => (
            <TripCard key={index} trip={trip} onDelete={() => deleteTrip(index)} />
          ))}
        </div>
      </div>
    </div>
  );
}
