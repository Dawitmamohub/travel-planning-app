import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Plane, Hotel, Search, Loader2, ClipboardList } from "lucide-react";
import { searchFlights, searchHotels, getCityCode } from "../utils/api";
import FlightCard from "../components/FlightCard";
import HotelCard from "../components/HotelCard";

const AddTrip = ({ onSubmit }) => {
  const navigate = useNavigate();

  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [origin, setOrigin] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");

  // Flight & Hotel
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [searchingFlights, setSearchingFlights] = useState(false);
  const [searchingHotels, setSearchingHotels] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tripName || !destination || !startDate || !endDate) {
      alert("Please fill in all required fields");
      return;
    }

    const newTrip = {
      id: Date.now(),
      name: tripName,
      destination,
      origin,
      startDate,
      endDate,
      notes,
      flight: selectedFlight || null, // ✅ store flight
      hotel: selectedHotel || null,   // ✅ store hotel
    };

    onSubmit(newTrip);
    navigate("/dashboard");
  };

  const handleSearchFlights = async () => {
    if (!origin || !destination || !startDate) {
      alert("Enter origin, destination & start date");
      return;
    }
    setSearchingFlights(true);
    try {
      let originCode = origin.length > 3 ? await getCityCode(origin) : origin;
      let destinationCode =
        destination.length > 3 ? await getCityCode(destination) : destination;

      const data = await searchFlights(originCode, destinationCode, startDate);
      setFlights(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearchingFlights(false);
    }
  };

  const handleSearchHotels = async () => {
    if (!destination || !startDate || !endDate) {
      alert("Enter destination & dates");
      return;
    }
    setSearchingHotels(true);
    try {
      let cityCode =
        destination.length > 3 ? await getCityCode(destination) : destination;

      const data = await searchHotels(cityCode, startDate, endDate);
      setHotels(
        data.map((h) => ({
          ...h,
          image: `https://source.unsplash.com/400x300/?hotel,${encodeURIComponent(
            destination
          )}`,
        }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setSearchingHotels(false);
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-10 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Plan New Trip</h1>

        <Card className="shadow-xl rounded-2xl border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Trip Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Trip Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Trip Name *
                  </label>
                  <Input
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    placeholder="e.g., Summer Vacation"
                    className="h-12 text-base"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Destination *
                  </label>
                  <Input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g., Paris, France"
                    className="h-12 text-base"
                  />
                </div>
              </div>

              {/* Origin */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Departure City
                </label>
                <Input
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g., New York or JFK"
                  className="h-12 text-base"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Start Date *
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    End Date *
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Notes (Optional)
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add reminders or details..."
                  rows={4}
                  className="text-base"
                />
              </div>

              {/* Flights */}
              <div className="pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Plane className="h-5 w-5 mr-2 text-teal-600" /> Flights
                  </h3>
                  <Button
                    type="button"
                    onClick={handleSearchFlights}
                    disabled={searchingFlights}
                    className="flex items-center"
                  >
                    {searchingFlights ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4 mr-1" />
                    )}
                    Search Flights
                  </Button>
                </div>

                {flights.length > 0 ? (
                  <div className="space-y-4">
                    {flights.slice(0, 3).map((f, i) => (
                      <FlightCard
                        key={i}
                        flight={f}
                        selected={selectedFlight === f}
                        onSelect={setSelectedFlight}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Enter cities & date, then search for flights.
                  </p>
                )}
              </div>

              {/* Hotels */}
              <div className="pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Hotel className="h-5 w-5 mr-2 text-teal-600" /> Hotels
                  </h3>
                  <Button
                    type="button"
                    onClick={handleSearchHotels}
                    disabled={searchingHotels}
                    className="flex items-center"
                  >
                    {searchingHotels ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4 mr-1" />
                    )}
                    Search Hotels
                  </Button>
                </div>

                {hotels.length > 0 ? (
                  <div className="space-y-4">
                    {hotels.slice(0, 3).map((h, i) => (
                      <HotelCard
                        key={i}
                        hotel={h}
                        selected={selectedHotel === h}
                        onSelect={setSelectedHotel}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Enter destination & dates, then search for hotels.
                  </p>
                )}
              </div>

              {/* Summary */}
              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold flex items-center mb-3">
                  <ClipboardList className="h-5 w-5 mr-2 text-indigo-600" /> Trip Summary
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Trip Name:</strong> {tripName || "Not set"}
                  </p>
                  <p>
                    <strong>Destination:</strong> {destination || "Not set"}
                  </p>
                  <p>
                    <strong>Dates:</strong>{" "}
                    {startDate && endDate
                      ? `${startDate} → ${endDate}`
                      : "Not set"}
                  </p>
                  <p>
                    <strong>Flight:</strong>{" "}
                    {selectedFlight
                      ? `${selectedFlight.itineraries[0].segments[0].departure.iataCode} → ${selectedFlight.itineraries[0].segments[0].arrival.iataCode}`
                      : "No flight selected"}
                  </p>
                  <p>
                    <strong>Hotel:</strong>{" "}
                    {selectedHotel ? selectedHotel.name : "No hotel selected"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="h-12 px-6"
                >
                  Cancel
                </Button>
                <Button type="submit" className="h-12 px-8">
                  Save Trip
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddTrip;
