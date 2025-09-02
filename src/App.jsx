import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AddTrip from "./pages/Addtrip";
import TripDetails from "./pages/TripDetails";
import APIDemo from "./pages/APIDemo";
import Features from "./components/Features";
import About from  "./pages/About";
import Contact from "./pages/Contact";

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

const TripDetailsWrapper = ({ trips, onUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const displayTrips = trips.length > 0 ? trips : defaultTrips;
  const trip = displayTrips.find(t => t.id == parseInt(id));

  if (!trip) {
    return <div>Trip not found</div>;
  }

  return (
    <TripDetails
      trip={trip}
      onBack={() => navigate('/dashboard')}
      onUpdate={onUpdate}
    />
  );
};

const AppContent = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);

  const deleteTrip = (id) => {
    setTrips(trips.filter(trip => trip.id !== id));
  };

  const updateTrip = (updatedTrip) => {
    setTrips(trips.map(trip => trip.id === updatedTrip.id ? updatedTrip : trip));
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard trips={trips} onDelete={deleteTrip} />} />
      <Route path="/Addtrip" element={<AddTrip onSubmit={(trip) => setTrips([...trips, trip])} onCancel={() => navigate('/dashboard')} />} />
      <Route path="/api-demo" element={<APIDemo />} />
      <Route path="/trip/:id" element={<TripDetailsWrapper trips={trips} onUpdate={updateTrip} />} />
      <Route path="/Features" element={<Features />} />
      <Route path="/About" element={<About />} />
      <Route path="/Contact" element={<Contact />} />
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
