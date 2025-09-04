import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "lucide-react";

// Badge component
const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

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

  // Dynamic photo
  const [photo, setPhoto] = useState(null);

  const WEATHER_API_KEY = "bd172694d69510e89d0b8f0418565adb"; // your key
  const UNSPLASH_ACCESS_KEY = "5fTHzdMK5YQ9iyCRWCu6y9LwBNw6xf9UniYwgvDN5P4"; // your key

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getDaysBetween = (startDate, endDate) =>
    Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;

  // Fetch weather
  useEffect(() => {
    if (!trip.destination) return;
    const city = trip.destination.split(",")[0].trim();
    setLoadingWeather(true);

    const fetchWeather = async () => {
      try {
        const currentRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
        );
        const forecastRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
        );

        const dailyForecast = [];
        const seenDates = new Set();
        forecastRes.data.list.forEach((entry) => {
          const [date, time] = entry.dt_txt.split(" ");
          if (time === "12:00:00" && !seenDates.has(date)) {
            seenDates.add(date);
            dailyForecast.push({
              date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
              temp: entry.main.temp,
              icon: entry.weather[0].icon,
              description: entry.weather[0].description,
            });
          }
        });

        setWeather({ current: currentRes.data, forecast: dailyForecast.slice(0, 5) });
        setErrorWeather(null);
      } catch {
        setErrorWeather("Unable to fetch weather.");
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather();
  }, [trip]);

  // Fetch destination photo
  useEffect(() => {
    if (!trip.destination) return;

    const fetchPhoto = async () => {
      try {
        const res = await axios.get(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
            trip.destination
          )}&client_id=${UNSPLASH_ACCESS_KEY}&orientation=landscape`
        );
        if (res.data.results.length > 0) setPhoto(res.data.results[0].urls.regular);
      } catch (err) {
        console.error("Unsplash fetch error:", err);
      }
    };

    fetchPhoto();
  }, [trip]);

  // Handlers
  const handleSaveNotes = () => {
    onUpdate({ ...trip, notes: editedNotes.trim() || undefined });
    setIsEditingNotes(false);
  };
  const handleCancelNotes = () => {
    setEditedNotes(trip.notes || "");
    setIsEditingNotes(false);
  };
  const handleAddItinerary = () => {
    if (newItineraryItem.trim()) {
      setEditedItinerary([...editedItinerary, newItineraryItem.trim()]);
      setNewItineraryItem("");
    }
  };
  const handleRemoveItinerary = (index) => {
    setEditedItinerary(editedItinerary.filter((_, i) => i !== index));
  };
  const handleSaveItinerary = () => {
    onUpdate({ ...trip, itinerary: editedItinerary });
    setIsEditingItinerary(false);
  };
  const handleCancelItinerary = () => {
    setEditedItinerary(trip.itinerary || []);
    setNewItineraryItem("");
    setIsEditingItinerary(false);
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={onBack} variant="outline" size="sm" className="text-gray-600 border-gray-300 hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Trips
          </Button>
        </div>

        <h1 className="text-3xl md:text-4xl text-gray-900 mb-4">{trip.name}</h1>

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

        <Badge className="bg-teal-100 text-teal-700 mb-6">{getDaysBetween(trip.startDate, trip.endDate)} days</Badge>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notes */}
          <Card className="bg-teal-100 shadow-md">
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
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveNotes}><Check className="mr-1 w-4 h-4" /> Save</Button>
                    <Button onClick={handleCancelNotes} variant="outline"><X className="mr-1 w-4 h-4" /> Cancel</Button>
                  </div>
                </>
              ) : (
                <div>
                  <p className="mb-2">{trip.notes || "No notes added."}</p>
                  <Button onClick={() => setIsEditingNotes(true)} size="sm">
                    <Edit3 className="mr-1 w-4 h-4" /> Edit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Itinerary */}
          <Card className="bg-teal-100 shadow-md">
            <CardHeader>
              <CardTitle>Itinerary</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditingItinerary ? (
                <>
                  {editedItinerary.map((item, i) => (
                    <div key={i} className="flex justify-between items-center mb-1">
                      <span>{item}</span>
                      <Button onClick={() => handleRemoveItinerary(i)} variant="outline" size="sm"><X className="w-3 h-3" /></Button>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="New itinerary item"
                      value={newItineraryItem}
                      onChange={(e) => setNewItineraryItem(e.target.value)}
                    />
                    <Button onClick={handleAddItinerary}><Plus className="w-4 h-4" /></Button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button onClick={handleSaveItinerary}><Check className="mr-1 w-4 h-4" /> Save</Button>
                    <Button onClick={handleCancelItinerary} variant="outline"><X className="mr-1 w-4 h-4" /> Cancel</Button>
                  </div>
                </>
              ) : (
                <div>
                  {trip.itinerary.length === 0 ? (
                    <p>No itinerary added.</p>
                  ) : (
                    <ul className="list-disc pl-5 mb-2">
                      {trip.itinerary.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
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
                <img src={photo} alt={trip.destination} className="w-full h-64 object-cover" />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Loading photo...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weather */}
          <Card className="lg:col-span-2 shadow-md bg-gradient-to-br from-sky-100 to-teal-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudSun className="h-5 w-5 text-orange-500" />
                Weather
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingWeather ? (
                <div className="flex justify-center items-center py-6 text-gray-500">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading weather...
                </div>
              ) : errorWeather ? (
                <p className="text-sm text-red-500">{errorWeather}</p>
              ) : weather ? (
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
              ) : (
                <p className="text-sm text-gray-500">No weather data</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
