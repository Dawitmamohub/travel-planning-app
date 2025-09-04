import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AddTrip from "./pages/Addtrip";
import TripDetails from "./pages/TripDetails";
import Features from "./components/Features";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Default demo trips
const defaultTrips = [
  {
    id: 1,
    name: "Summer Vacation",
    destination: "Santorini, Greece",
    startDate: "2024-07-15",
    endDate: "2024-07-22",
    notes: "Don't forget sunscreen and camera!",
    itinerary: [
      "Day 1: Arrival and beach relaxation",
      "Day 2: Island exploration",
      "Day 3: Wine tasting",
    ],
  },
  {
    id: 2,
    name: "Business Trip",
    destination: "Tokyo, Japan",
    startDate: "2024-09-10",
    endDate: "2024-09-14",
    notes: "Meetings at headquarters",
    itinerary: [
      "Day 1: Flight and hotel check-in",
      "Day 2-4: Business meetings",
      "Day 5: Return flight",
    ],
  },
  {
    id: 3,
    name: "Weekend Getaway",
    destination: "Napa Valley, California",
    startDate: "2024-10-05",
    endDate: "2024-10-07",
    notes: "Wine tasting and relaxation",
    itinerary: ["Day 1: Drive to Napa", "Day 2: Wine tours", "Day 3: Return home"],
  },
];

// TripDetails wrapper
const TripDetailsWrapper = ({ trips, onUpdate, onDelete }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const trip = trips.find((t) => t.id === parseInt(id));
  if (!trip) return <div className="p-6 text-red-600">Trip not found</div>;

  return (
    <TripDetails 
      trip={trip} 
      onBack={() => navigate("/dashboard")} 
      onUpdate={onUpdate}
      onDelete={onDelete}
    />
  );
};

// Add/Edit Trip wrapper
const TripFormWrapper = ({ trips, onSubmit }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const tripToEdit = id ? trips.find((t) => t.id === parseInt(id)) : null;

  return (
    <AddTrip
      trip={tripToEdit}
      onSubmit={(trip) => {
        onSubmit(trip);
        navigate("/dashboard");
      }}
      onCancel={() => navigate("/dashboard")}
    />
  );
};

const AppContent = () => {
  // Load trips from localStorage or use default trips
  const [trips, setTrips] = useState(() => {
    const savedTrips = localStorage.getItem('travelTrips');
    return savedTrips ? JSON.parse(savedTrips) : defaultTrips;
  });

  // Save trips to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('travelTrips', JSON.stringify(trips));
  }, [trips]);

  const deleteTrip = (id) => setTrips((prev) => prev.filter((t) => t.id !== id));

  const addOrUpdateTrip = (trip) => {
    if (trip.id) {
      // Editing existing trip
      setTrips((prev) => prev.map((t) => (t.id === trip.id ? trip : t)));
    } else {
      // Adding new trip
      setTrips((prev) => [...prev, { ...trip, id: Date.now() }]);
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route 
        path="/dashboard" 
        element={<Dashboard trips={trips} onDelete={deleteTrip} />} 
      />
      <Route 
        path="/addtrip" 
        element={<TripFormWrapper trips={trips} onSubmit={addOrUpdateTrip} />} 
      />
      <Route 
        path="/addtrip/:id" 
        element={<TripFormWrapper trips={trips} onSubmit={addOrUpdateTrip} />} 
      />
      <Route 
        path="/trip/:id" 
        element={
          <TripDetailsWrapper 
            trips={trips} 
            onUpdate={addOrUpdateTrip} 
            onDelete={deleteTrip} 
          />
        } 
      />
      <Route path="/features" element={<Features />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}