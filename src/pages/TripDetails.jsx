import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  ArrowLeft,
  Edit3,
  Plus,
  Check,
  X,
  CloudSun,
  MapPin,
  Calendar,
  Loader2,
  Plane,
  Hotel,
  Star,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  RefreshCw
} from "lucide-react";

// Import API functions
import {
  searchFlights,
  searchHotels,
  getWeatherData,
  getDestinationPhoto,
  formatFlightData
} from "../utils/api";

// Badge component
const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

// Extracted WeatherCard component
const WeatherCard = React.memo(({ weather, loadingWeather, errorWeather, onRetry }) => {
  if (loadingWeather) {
    return (
      <Card className="lg:col-span-2 shadow-md bg-gradient-to-br from-sky-100 to-teal-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudSun className="h-5 w-5 text-orange-500" />
            Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-6 text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading weather...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (errorWeather) {
    return (
      <Card className="lg:col-span-2 shadow-md bg-gradient-to-br from-sky-100 to-teal-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudSun className="h-5 w-5 text-orange-500" />
            Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-red-500 mb-4">{errorWeather}</p>
            <Button onClick={onRetry} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" /> Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="lg:col-span-2 shadow-md bg-gradient-to-br from-sky-100 to-teal-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudSun className="h-5 w-5 text-orange-500" />
            Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-6">No weather data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 shadow-md bg-gradient-to-br from-sky-100 to-teal-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudSun className="h-5 w-5 text-orange-500" />
          Weather
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <div className="text-center mb-4">
            <img
              src={`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`}
              alt={weather.current.weather[0].description}
              className="mx-auto"
            />
            <div className="text-xl text-gray-900 mb-1">{Math.round(weather.current.main.temp)}°C</div>
            <div className="text-sm text-gray-600 capitalize">{weather.current.weather[0].description}</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {weather.forecast.map((day, i) => (
              <div key={i} className="bg-white/70 rounded-lg p-2 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-600 mb-1">{day.date}</div>
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                  alt={day.description}
                  className="mx-auto w-10 h-10"
                />
                <div className="text-sm font-semibold text-gray-800">{Math.round(day.temp)}°C</div>
                <div className="text-xs text-gray-500 capitalize">{day.description}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// Extracted FlightCard component
const FlightCard = React.memo(({ flight }) => (
  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-semibold">{flight.airline}</h3>
        <p className="text-sm text-gray-600">{flight.flightNumber}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-lg">{flight.currency} {flight.price}</p>
        <p className="text-sm text-gray-600">per person</p>
      </div>
    </div>
    
    <div className="flex justify-between items-center mt-4">
      <div>
        <p className="font-semibold">{new Date(flight.departure.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <p className="text-sm text-gray-600">{flight.departure.airport}</p>
      </div>
      
      <div className="text-center mx-4">
        <p className="text-sm text-gray-600">{flight.duration.replace('PT', '').toLowerCase()}</p>
        <div className="w-16 h-0.5 bg-teal-500 my-1"></div>
        <p className="text-xs text-gray-500">Direct</p>
      </div>
      
      <div className="text-right">
        <p className="font-semibold">{new Date(flight.arrival.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <p className="text-sm text-gray-600">{flight.arrival.airport}</p>
      </div>
    </div>
  </div>
));

// Extracted HotelCard component
const HotelCard = React.memo(({ hotel, getAmenityIcon }) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
    <div className="flex flex-col sm:flex-row">
      <div className="sm:w-1/3">
        <img 
          src={hotel.image} 
          alt={hotel.name}
          className="w-full h-48 sm:h-full object-cover"
        />
      </div>
      <div className="sm:w-2/3 p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{hotel.name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="ml-1">{hotel.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mt-1">{hotel.address}</p>
        
        <div className="flex items-center mt-3">
          <span className="font-bold text-lg">${hotel.price}</span>
          <span className="text-sm text-gray-600 ml-1">/ night</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {hotel.amenities.slice(0, 3).map((amenity, index) => (
            <div key={index} className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {getAmenityIcon(amenity)}
              <span className="ml-1">{amenity}</span>
            </div>
          ))}
          {hotel.amenities.length > 3 && (
            <div className="text-xs text-gray-500">
              +{hotel.amenities.length - 3} more
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
));

export default function TripDetails({ trip, onBack, onUpdate }) {
  const navigate = useNavigate();

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isEditingItinerary, setIsEditingItinerary] = useState(false);
  const [editedNotes, setEditedNotes] = useState(trip.notes || "");
  const [editedItinerary, setEditedItinerary] = useState(trip.itinerary || []);
  const [newItineraryItem, setNewItineraryItem] = useState("");

  // Weather state
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [errorWeather, setErrorWeather] = useState(null);

  // Flight and Hotel state
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loadingFlights, setLoadingFlights] = useState(false);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [errorFlights, setErrorFlights] = useState(null);
  const [errorHotels, setErrorHotels] = useState(null);

  // Dynamic photo
  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState(false);

  // Memoized utility functions
  const formatDate = useCallback((dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }), []);

  const getDaysBetween = useCallback((startDate, endDate) =>
    Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1, []);

  // Fetch weather
  const fetchWeather = useCallback(async () => {
    if (!trip.destination) return;
    
    setLoadingWeather(true);
    setErrorWeather(null);
    
    try {
      const weatherData = await getWeatherData(trip.destination);
      setWeather(weatherData);
    } catch (error) {
      setErrorWeather("Weather information is currently unavailable");
    } finally {
      setLoadingWeather(false);
    }
  }, [trip.destination]);

  // Fetch destination photo
  const fetchPhoto = useCallback(async () => {
    if (!trip.destination) return;
    
    setPhotoError(false);
    try {
      const photoUrl = await getDestinationPhoto(trip.destination);
      setPhoto(photoUrl);
    } catch (err) {
      console.error("Error fetching photo:", err);
      setPhotoError(true);
    }
  }, [trip.destination]);

  // Fetch flight and hotel data
  const fetchFlights = useCallback(async () => {
    setLoadingFlights(true);
    setErrorFlights(null);
    try {
      const flightData = await searchFlights("JFK", trip.destination, trip.startDate);
      const formattedFlights = formatFlightData(flightData);
      setFlights(formattedFlights);
    } catch (error) {
      setErrorFlights("Flight information is currently unavailable. Please try again later.");
    } finally {
      setLoadingFlights(false);
    }
  }, [trip.destination, trip.startDate]);

  const fetchHotels = useCallback(async () => {
    setLoadingHotels(true);
    setErrorHotels(null);
    try {
      const hotelData = await searchHotels(trip.destination, trip.startDate, trip.endDate);
      setHotels(hotelData);
    } catch (error) {
      setErrorHotels("Hotel information is currently unavailable. Please try again later.");
    } finally {
      setLoadingHotels(false);
    }
  }, [trip.destination, trip.startDate, trip.endDate]);

  // Initial data fetching
  useEffect(() => {
    if (trip) {
      fetchWeather();
      fetchPhoto();
      fetchFlights();
      fetchHotels();
    }
  }, [trip, fetchWeather, fetchPhoto, fetchFlights, fetchHotels]);

  // Handlers
  const handleSaveNotes = useCallback(() => {
    onUpdate({ ...trip, notes: editedNotes.trim() || undefined });
    setIsEditingNotes(false);
  }, [onUpdate, trip, editedNotes]);

  const handleCancelNotes = useCallback(() => {
    setEditedNotes(trip.notes || "");
    setIsEditingNotes(false);
  }, [trip.notes]);

  const handleAddItinerary = useCallback(() => {
    if (newItineraryItem.trim()) {
      setEditedItinerary([...editedItinerary, newItineraryItem.trim()]);
      setNewItineraryItem("");
    }
  }, [newItineraryItem, editedItinerary]);

  const handleRemoveItinerary = useCallback((index) => {
    setEditedItinerary(editedItinerary.filter((_, i) => i !== index));
  }, [editedItinerary]);

  const handleSaveItinerary = useCallback(() => {
    onUpdate({ ...trip, itinerary: editedItinerary });
    setIsEditingItinerary(false);
  }, [onUpdate, trip, editedItinerary]);

  const handleCancelItinerary = useCallback(() => {
    setEditedItinerary(trip.itinerary || []);
    setNewItineraryItem("");
    setIsEditingItinerary(false);
  }, [trip.itinerary]);

  const getAmenityIcon = useCallback((amenity) => {
    switch (amenity) {
      case "Free WiFi": return <Wifi size={14} />;
      case "Parking": return <Car size={14} />;
      case "Breakfast": return <Coffee size={14} />;
      case "Gym": return <Dumbbell size={14} />;
      default: return <Star size={14} />;
    }
  }, []);

  // Memoized formatted flights
  const formattedFlights = useMemo(() => flights, [flights]);

  return (
    <div className="min-h-screen p-4 lg:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            onClick={onBack} 
            variant="outline" 
            size="sm" 
            className="text-gray-600 border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Trips
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-2xl md:text-3xl text-gray-900 mb-4">{trip.name}</h1>

          <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-teal-600" />
              {trip.destination}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-teal-600" />
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </div>
          </div>

          <Badge className="bg-teal-100 text-teal-700">
            {getDaysBetween(trip.startDate, trip.endDate)} days
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notes */}
          <Card className="bg-teal-50 shadow-md">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditingNotes ? (
                <>
                  <Textarea
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    rows={4}
                    className="mb-2"
                    placeholder="Add notes about your trip..."
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveNotes} size="sm">
                      <Check className="mr-1 w-4 h-4" /> Save
                    </Button>
                    <Button onClick={handleCancelNotes} variant="outline" size="sm">
                      <X className="mr-1 w-4 h-4" /> Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <div>
                  <p className="mb-2 min-h-[6rem]">{trip.notes || "No notes added."}</p>
                  <Button onClick={() => setIsEditingNotes(true)} size="sm">
                    <Edit3 className="mr-1 w-4 h-4" /> Edit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Itinerary */}
          <Card className="bg-teal-50 shadow-md">
            <CardHeader>
              <CardTitle>Itinerary</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditingItinerary ? (
                <>
                  {editedItinerary.length > 0 && (
                    <div className="mb-3 space-y-1">
                      {editedItinerary.map((item, i) => (
                        <div key={i} className="flex justify-between items-center p-2 bg-white rounded">
                          <span className="text-sm">{item}</span>
                          <Button 
                            onClick={() => handleRemoveItinerary(i)} 
                            variant="ghost" 
                            size="sm"
                            aria-label="Remove item"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="New itinerary item"
                      value={newItineraryItem}
                      onChange={(e) => setNewItineraryItem(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddItinerary()}
                      className="flex-1"
                    />
                    <Button onClick={handleAddItinerary} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveItinerary} size="sm">
                      <Check className="mr-1 w-4 h-4" /> Save
                    </Button>
                    <Button onClick={handleCancelItinerary} variant="outline" size="sm">
                      <X className="mr-1 w-4 h-4" /> Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <div>
                  {trip.itinerary && trip.itinerary.length > 0 ? (
                    <ul className="list-disc pl-5 mb-3 space-y-1">
                      {trip.itinerary.map((item, i) => (
                        <li key={i} className="text-sm">{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mb-3">No itinerary added.</p>
                  )}
                  <Button onClick={() => setIsEditingItinerary(true)} size="sm">
                    <Edit3 className="mr-1 w-4 h-4" /> Edit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Destination Photo */}
          <Card className="lg:col-span-2 shadow-md overflow-hidden">
            <CardHeader>
              <CardTitle>Destination</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {photo ? (
                <img 
                  src={photo} 
                  alt={trip.destination} 
                  className="w-full h-64 object-cover" 
                  onError={() => setPhotoError(true)}
                />
              ) : photoError ? (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center flex-col">
                  <MapPin className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500">No photo available for {trip.destination}</p>
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weather */}
          <WeatherCard 
            weather={weather} 
            loadingWeather={loadingWeather} 
            errorWeather={errorWeather} 
            onRetry={fetchWeather}
          />

          {/* Flight Information */}
          <Card className="lg:col-span-2 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-teal-500" /> Flight Options
              </CardTitle>
              <Button 
                onClick={fetchFlights} 
                variant="outline" 
                size="sm"
                disabled={loadingFlights}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${loadingFlights ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {loadingFlights ? (
                <div className="text-center py-4">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-500 mt-2">Loading flight options...</p>
                </div>
              ) : errorFlights ? (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-800">{errorFlights}</p>
                  <Button
                    onClick={fetchFlights}
                    className="mt-2"
                    variant="outline"
                    size="sm"
                  >
                    Try Again
                  </Button>
                </div>
              ) : formattedFlights.length > 0 ? (
                <div className="space-y-4">
                  {formattedFlights.map((flight) => (
                    <FlightCard key={flight.id} flight={flight} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No flights available for this destination.</p>
              )}
            </CardContent>
          </Card>

          {/* Hotel Information */}
          <Card className="lg:col-span-2 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Hotel className="h-5 w-5 text-teal-500" /> Hotel Options
              </CardTitle>
              <Button 
                onClick={fetchHotels} 
                variant="outline" 
                size="sm"
                disabled={loadingHotels}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${loadingHotels ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {loadingHotels ? (
                <div className="text-center py-4">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-500 mt-2">Loading hotel options...</p>
                </div>
              ) : errorHotels ? (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-800">{errorHotels}</p>
                  <Button
                    onClick={fetchHotels}
                    className="mt-2"
                    variant="outline"
                    size="sm"
                  >
                    Try Again
                  </Button>
                </div>
              ) : hotels.length > 0 ? (
                <div className="space-y-4">
                  {hotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} getAmenityIcon={getAmenityIcon} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No hotels available for this destination.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}