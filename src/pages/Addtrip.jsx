import React, { useState, useEffect, useCallback } from "react";
import { 
  X, 
  Plus, 
  Calendar, 
  MapPin, 
  FileText, 
  List, 
  Plane, 
  Hotel,
  ChevronDown,
  ChevronUp,
  Star,
  Search,
  Loader2
} from "lucide-react";

// Import API functions
import { searchFlights, searchHotels } from "../utils/api";

export default function AddTrip({ trip, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    notes: "",
    itinerary: [],
    flight: null,
    hotel: null
  });
  const [newItineraryItem, setNewItineraryItem] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showFlightSearch, setShowFlightSearch] = useState(false);
  const [showHotelSearch, setShowHotelSearch] = useState(false);
  
  // Flight search state
  const [flightSearchParams, setFlightSearchParams] = useState({
    origin: "",
    destination: "",
    date: ""
  });
  const [flightResults, setFlightResults] = useState([]);
  const [loadingFlights, setLoadingFlights] = useState(false);
  const [flightError, setFlightError] = useState("");
  
  // Hotel search state
  const [hotelSearchParams, setHotelSearchParams] = useState({
    location: "",
    checkIn: "",
    checkOut: ""
  });
  const [hotelResults, setHotelResults] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [hotelError, setHotelError] = useState("");

  // Pre-fill form if editing
  useEffect(() => {
    if (trip) {
      setFormData({
        name: trip.name || "",
        destination: trip.destination || "",
        startDate: trip.startDate || "",
        endDate: trip.endDate || "",
        notes: trip.notes || "",
        itinerary: trip.itinerary || [],
        flight: trip.flight || null,
        hotel: trip.hotel || null
      });
      setShowFlightSearch(!!trip.flight);
      setShowHotelSearch(!!trip.hotel);
    }
  }, [trip]);

  // Auto-fill flight search params when destination or dates change
  useEffect(() => {
    if (formData.destination && formData.startDate) {
      setFlightSearchParams(prev => ({
        ...prev,
        destination: formData.destination,
        date: formData.startDate
      }));
    }
  }, [formData.destination, formData.startDate]);

  // Auto-fill hotel search params when destination or dates change
  useEffect(() => {
    if (formData.destination && formData.startDate && formData.endDate) {
      setHotelSearchParams(prev => ({
        ...prev,
        location: formData.destination,
        checkIn: formData.startDate,
        checkOut: formData.endDate
      }));
    }
  }, [formData.destination, formData.startDate, formData.endDate]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Trip name is required";
    if (!formData.destination.trim()) newErrors.destination = "Destination is required";
    
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    } else if (new Date(formData.startDate) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.startDate = "Start date cannot be in the past";
    }
    
    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = "End date cannot be before start date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  }, [errors]);

  const handleBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateForm();
  }, [validateForm]);

  const handleAddItineraryItem = useCallback(() => {
    if (newItineraryItem.trim()) {
      // Check for duplicates
      if (!formData.itinerary.includes(newItineraryItem.trim())) {
        setFormData(prev => ({
          ...prev,
          itinerary: [...prev.itinerary, newItineraryItem.trim()]
        }));
        setNewItineraryItem("");
      } else {
        // Show duplicate error
        setErrors(prev => ({ 
          ...prev, 
          itinerary: "This item is already in your itinerary" 
        }));
        setTimeout(() => setErrors(prev => ({ ...prev, itinerary: "" })), 3000);
      }
    }
  }, [newItineraryItem, formData.itinerary]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItineraryItem();
    }
  }, [handleAddItineraryItem]);

  const handleRemoveItineraryItem = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index)
    }));
  }, []);

  // Flight search functions
  const handleFlightSearch = useCallback(async () => {
    if (!flightSearchParams.origin || !flightSearchParams.destination || !flightSearchParams.date) {
      setFlightError("Please fill in all flight search fields");
      return;
    }
    
    setLoadingFlights(true);
    setFlightError("");
    
    try {
      const results = await searchFlights(
        flightSearchParams.origin,
        flightSearchParams.destination,
        flightSearchParams.date
      );
      setFlightResults(results);
    } catch (error) {
      setFlightError("Failed to search for flights. Please try again.");
      console.error("Flight search error:", error);
    } finally {
      setLoadingFlights(false);
    }
  }, [flightSearchParams]);

  const handleSelectFlight = useCallback((flight) => {
    setFormData(prev => ({ ...prev, flight }));
    setShowFlightSearch(false);
  }, []);

  // Hotel search functions
  const handleHotelSearch = useCallback(async () => {
    if (!hotelSearchParams.location || !hotelSearchParams.checkIn || !hotelSearchParams.checkOut) {
      setHotelError("Please fill in all hotel search fields");
      return;
    }
    
    setLoadingHotels(true);
    setHotelError("");
    
    try {
      const results = await searchHotels(
        hotelSearchParams.location,
        hotelSearchParams.checkIn,
        hotelSearchParams.checkOut
      );
      setHotelResults(results);
    } catch (error) {
      setHotelError("Failed to search for hotels. Please try again.");
      console.error("Hotel search error:", error);
    } finally {
      setLoadingHotels(false);
    }
  }, [hotelSearchParams]);

  const handleSelectHotel = useCallback((hotel) => {
    setFormData(prev => ({ ...prev, hotel }));
    setShowHotelSearch(false);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Mark all fields as touched to show errors
      setTouched({
        name: true,
        destination: true,
        startDate: true,
        endDate: true,
      });
      return;
    }

    const tripData = {
      id: trip ? trip.id : undefined,
      ...formData,
      notes: formData.notes.trim() || undefined,
    };

    onSubmit(tripData);
  }, [formData, trip, onSubmit, validateForm]);

  // Calculate trip duration
  const tripDuration = formData.startDate && formData.endDate 
    ? Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)) + 1
    : 0;

  return (
    <div className="min-h-screen flex justify-center items-start p-4 md:p-8 bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-teal-600 flex items-center gap-2">
          {trip ? (
            <>
              <FileText className="h-7 w-7" /> Edit Trip
            </>
          ) : (
            <>
              <Plus className="h-7 w-7" /> Add New Trip
            </>
          )}
        </h1>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Trip Name */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Trip Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                errors.name && touched.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., Summer Vacation 2023"
            />
            {errors.name && touched.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Destination */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Destination
            </label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => handleInputChange("destination", e.target.value)}
              onBlur={() => handleBlur("destination")}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                errors.destination && touched.destination ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., Paris, France"
            />
            {errors.destination && touched.destination && (
              <p className="mt-1 text-sm text-red-500">{errors.destination}</p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                onBlur={() => handleBlur("startDate")}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  errors.startDate && touched.startDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.startDate && touched.startDate && (
                <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4" /> End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                onBlur={() => handleBlur("endDate")}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  errors.endDate && touched.endDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.endDate && touched.endDate && (
                <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Trip Duration */}
          {tripDuration > 0 && (
            <div className="bg-teal-50 p-3 rounded-md">
              <p className="text-teal-700 font-medium">
                Trip Duration: {tripDuration} day{tripDuration !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          {/* Flight Search & Selection */}
          <div className="border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setShowFlightSearch(!showFlightSearch)}
              className="w-full p-4 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-teal-600" />
                <span className="font-medium">Flight Options</span>
                {formData.flight && (
                  <span className="text-sm text-teal-600 ml-2">✓ Selected</span>
                )}
              </div>
              {showFlightSearch ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            
            {showFlightSearch && (
              <div className="p-4 space-y-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">From</label>
                    <input
                      type="text"
                      value={flightSearchParams.origin}
                      onChange={(e) => setFlightSearchParams(prev => ({
                        ...prev,
                        origin: e.target.value
                      }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., JFK"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">To</label>
                    <input
                      type="text"
                      value={flightSearchParams.destination}
                      onChange={(e) => setFlightSearchParams(prev => ({
                        ...prev,
                        destination: e.target.value
                      }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., CDG"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      value={flightSearchParams.date}
                      onChange={(e) => setFlightSearchParams(prev => ({
                        ...prev,
                        date: e.target.value
                      }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={handleFlightSearch}
                  disabled={loadingFlights}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  {loadingFlights ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Search Flights
                </button>
                
                {flightError && (
                  <p className="text-sm text-red-500">{flightError}</p>
                )}
                
                {flightResults.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h3 className="font-medium text-gray-700">Available Flights</h3>
                    {flightResults.map((flight) => (
                      <div 
                        key={flight.id} 
                        className="border border-gray-200 rounded-md p-3 hover:bg-white cursor-pointer transition-colors"
                        onClick={() => handleSelectFlight(flight)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{flight.airline}</p>
                            <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                          </div>
                          <p className="font-bold text-lg">${flight.price}</p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div>
                            <p className="font-medium">{flight.departureTime}</p>
                            <p className="text-sm text-gray-600">{flight.origin}</p>
                          </div>
                          <div className="text-center mx-2">
                            <div className="w-16 h-0.5 bg-teal-500 my-1"></div>
                            <p className="text-xs text-gray-500">{flight.duration}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{flight.arrivalTime}</p>
                            <p className="text-sm text-gray-600">{flight.destination}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {formData.flight && (
                  <div className="mt-4 p-3 bg-teal-50 rounded-md">
                    <h3 className="font-medium text-teal-700">Selected Flight</h3>
                    <p className="text-sm">{formData.flight.airline} {formData.flight.flightNumber}</p>
                    <p className="text-sm">${formData.flight.price} • {formData.flight.departureTime} - {formData.flight.arrivalTime}</p>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, flight: null }))}
                      className="text-red-500 text-sm mt-2 hover:text-red-700"
                    >
                      Remove Selection
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hotel Search & Selection */}
          <div className="border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setShowHotelSearch(!showHotelSearch)}
              className="w-full p-4 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <Hotel className="h-5 w-5 text-teal-600" />
                <span className="font-medium">Hotel Options</span>
                {formData.hotel && (
                  <span className="text-sm text-teal-600 ml-2">✓ Selected</span>
                )}
              </div>
              {showHotelSearch ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            
            {showHotelSearch && (
              <div className="p-4 space-y-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={hotelSearchParams.location}
                      onChange={(e) => setHotelSearchParams(prev => ({
                        ...prev,
                        location: e.target.value
                      }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., Paris, France"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Check-in</label>
                    <input
                      type="date"
                      value={hotelSearchParams.checkIn}
                      onChange={(e) => setHotelSearchParams(prev => ({
                        ...prev,
                        checkIn: e.target.value
                      }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Check-out</label>
                    <input
                      type="date"
                      value={hotelSearchParams.checkOut}
                      onChange={(e) => setHotelSearchParams(prev => ({
                        ...prev,
                        checkOut: e.target.value
                      }))}
                      min={hotelSearchParams.checkIn || new Date().toISOString().split('T')[0]}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={handleHotelSearch}
                  disabled={loadingHotels}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  {loadingHotels ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Search Hotels
                </button>
                
                {hotelError && (
                  <p className="text-sm text-red-500">{hotelError}</p>
                )}
                
                {hotelResults.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h3 className="font-medium text-gray-700">Available Hotels</h3>
                    {hotelResults.map((hotel) => (
                      <div 
                        key={hotel.id} 
                        className="border border-gray-200 rounded-md p-3 hover:bg-white cursor-pointer transition-colors"
                        onClick={() => handleSelectHotel(hotel)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{hotel.name}</p>
                            <p className="text-sm text-gray-600">{hotel.location}</p>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="ml-1">{hotel.rating}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm">{hotel.amenities.slice(0, 3).join(" • ")}</p>
                          <p className="font-bold text-lg">${hotel.price}/night</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {formData.hotel && (
                  <div className="mt-4 p-3 bg-teal-50 rounded-md">
                    <h3 className="font-medium text-teal-700">Selected Hotel</h3>
                    <p className="text-sm">{formData.hotel.name}</p>
                    <p className="text-sm">${formData.hotel.price}/night • Rating: {formData.hotel.rating}/5</p>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, hotel: null }))}
                      className="text-red-500 text-sm mt-2 hover:text-red-700"
                    >
                      Remove Selection
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Add any additional notes about your trip..."
            />
          </div>

          {/* Itinerary */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
              <List className="h-4 w-4" /> Itinerary
            </label>
            <div className="flex mb-2">
              <input
                type="text"
                value={newItineraryItem}
                onChange={(e) => setNewItineraryItem(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full p-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Add an activity or place to visit"
              />
              <button
                type="button"
                onClick={handleAddItineraryItem}
                className="bg-teal-600 text-white px-4 rounded-r-md hover:bg-teal-700 transition-colors flex items-center"
                disabled={!newItineraryItem.trim()}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {errors.itinerary && (
              <p className="mt-1 text-sm text-red-500">{errors.itinerary}</p>
            )}
            
            {formData.itinerary.length > 0 ? (
              <ul className="space-y-2 mt-3">
                {formData.itinerary.map((item, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItineraryItem(index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                      aria-label="Remove item"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm mt-2">No itinerary items added yet.</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
            >
              {trip ? "Save Changes" : "Add Trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}