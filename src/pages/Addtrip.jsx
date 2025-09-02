import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/lable";
import { ArrowLeft, MapPin } from "lucide-react";
import amadeusService from "../utils/amadeusService";

export default function AddTrip({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));

    // Handle destination autocomplete
    if (field === "destination") {
      if (searchTimeout) clearTimeout(searchTimeout);

      if (value.length >= 2) {
        const timeout = setTimeout(async () => {
          try {
            const results = await amadeusService.getAirportCitySearch(value);
            setDestinationSuggestions(results);
            setShowSuggestions(true);
          } catch (error) {
            console.error("Search error:", error);
            setDestinationSuggestions([]);
            setShowSuggestions(false);
          }
        }, 300);
        setSearchTimeout(timeout);
      } else {
        setDestinationSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  const selectDestination = (suggestion) => {
    const destinationText = `${suggestion.name}${suggestion.iataCode ? ` (${suggestion.iataCode})` : ''}`;
    setFormData((prev) => ({ ...prev, destination: destinationText }));
    setShowSuggestions(false);
    setDestinationSuggestions([]);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Trip name is required";
    if (!formData.destination.trim()) newErrors.destination = "Destination is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    else if (formData.endDate < formData.startDate) newErrors.endDate = "End date cannot be before start date";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newTrip = {
      id: Date.now(),
      name: formData.name,
      destination: formData.destination,
      startDate: formData.startDate,
      endDate: formData.endDate,
      notes: formData.notes,
      itinerary: [],
    };

    onSubmit(newTrip);
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={onCancel}
            variant="outline"
            size="sm"
            className="text-gray-600 border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-teal-600" />
          </div>
          <h1 className="text-3xl md:text-4xl text-gray-900 mb-2">
            Plan New Trip
          </h1>
          <p className="text-gray-600">
            Fill in the details for your upcoming adventure
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-center text-gray-900">
              Trip Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Trip Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-900">
                  Trip Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Summer Vacation, Business Trip"
                  value={formData.name}
                  onChange={(e) =>
                    handleInputChange("name", e.target.value)
                  }
                  className={`h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <Label
                  htmlFor="destination"
                  className="text-gray-900"
                >
                  Destination *
                </Label>
                <div className="relative">
                  <Input
                    id="destination"
                    type="text"
                    placeholder="e.g., Paris, France"
                    value={formData.destination}
                    onChange={(e) =>
                      handleInputChange(
                        "destination",
                        e.target.value,
                      )
                    }
                    className={`h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500 ${
                      errors.destination ? "border-red-500" : ""
                    }`}
                  />

                  {/* Autocomplete Suggestions */}
                  {showSuggestions && destinationSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {destinationSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          onClick={() => selectDestination(suggestion)}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">
                                {suggestion.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {suggestion.subType} • {suggestion.iataCode || 'N/A'}
                              </div>
                              {suggestion.address && (
                                <div className="text-xs text-gray-400">
                                  {suggestion.address.cityName}, {suggestion.address.countryName}
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-gray-400 uppercase">
                              {suggestion.subType}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.destination && (
                  <p className="text-sm text-red-600">
                    {errors.destination}
                  </p>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="startDate"
                    className="text-gray-900"
                  >
                    Start Date *
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      handleInputChange(
                        "startDate",
                        e.target.value,
                      )
                    }
                    className={`h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500 ${
                      errors.startDate ? "border-red-500" : ""
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-600">
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="endDate"
                    className="text-gray-900"
                  >
                    End Date *
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      handleInputChange(
                        "endDate",
                        e.target.value,
                      )
                    }
                    className={`h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500 ${
                      errors.endDate ? "border-red-500" : ""
                    }`}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-red-600">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label
                  htmlFor="notes"
                  className="text-gray-900"
                >
                  Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Add any special notes, reminders, or details about your trip..."
                  value={formData.notes}
                  onChange={(e) =>
                    handleInputChange("notes", e.target.value)
                  }
                  className="min-h-20 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500 resize-none"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  onClick={onCancel}
                  variant="outline"
                  className="flex-1 h-12 text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Save Trip
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
