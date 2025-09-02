import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { ArrowLeft, Edit3, Plus, Check, X, CloudSun, MapPin, Calendar } from "lucide-react";

const Badge = ({ children, variant = "secondary", className = "" }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
};

export default function TripDetails({ trip, onBack, onUpdate }) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isEditingItinerary, setIsEditingItinerary] = useState(false);
  const [editedNotes, setEditedNotes] = useState(trip.notes || '');
  const [editedItinerary, setEditedItinerary] = useState(trip.itinerary || []);
  const [newItineraryItem, setNewItineraryItem] = useState('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const getDaysBetween = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return dayDiff + 1;
  };

  const handleSaveNotes = () => {
    onUpdate({ ...trip, notes: editedNotes.trim() || undefined });
    setIsEditingNotes(false);
  };

  const handleCancelNotesEdit = () => {
    setEditedNotes(trip.notes || '');
    setIsEditingNotes(false);
  };

  const handleAddItineraryItem = () => {
    if (newItineraryItem.trim()) {
      const updatedItinerary = [...editedItinerary, newItineraryItem.trim()];
      setEditedItinerary(updatedItinerary);
      setNewItineraryItem('');
    }
  };

  const handleRemoveItineraryItem = (index) => {
    const updatedItinerary = editedItinerary.filter((_, i) => i !== index);
    setEditedItinerary(updatedItinerary);
  };

  const handleSaveItinerary = () => {
    onUpdate({ ...trip, itinerary: editedItinerary });
    setIsEditingItinerary(false);
  };

  const handleCancelItineraryEdit = () => {
    setEditedItinerary(trip.itinerary || []);
    setNewItineraryItem('');
    setIsEditingItinerary(false);
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
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

        {/* Trip Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl md:text-4xl text-gray-900 mb-4">{trip.name}</h1>
            <div className="flex flex-wrap gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-teal-600" />
                <span>{trip.destination}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-teal-600" />
                <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
              </div>
            </div>
            <Badge variant="secondary" className="mt-4 bg-teal-100 text-teal-700">
              {getDaysBetween(trip.startDate, trip.endDate)} days
            </Badge>
          </div>

          {/* Weather Widget Placeholder */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-sky-100 to-teal-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CloudSun className="h-5 w-5 text-orange-500" />
                Weather
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl mb-2">☀️</div>
                <div className="text-xl text-gray-900 mb-1">24°C</div>
                <div className="text-sm text-gray-600">Mostly Sunny</div>
                <div className="text-xs text-gray-500 mt-2">Weather data placeholder</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Itinerary Section */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-gray-900">Itinerary</CardTitle>
              <Button
                onClick={() => setIsEditingItinerary(!isEditingItinerary)}
                variant="outline"
                size="sm"
                className="text-teal-600 border-teal-200 hover:bg-teal-50"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                {isEditingItinerary ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditingItinerary ? (
              <div className="space-y-4">
                {/* Add New Item */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new itinerary item..."
                    value={newItineraryItem}
                    onChange={(e) => setNewItineraryItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddItineraryItem()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAddItineraryItem}
                    size="sm"
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Editable Items */}
                {editedItinerary.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 text-gray-900">{item}</div>
                    <Button
                      onClick={() => handleRemoveItineraryItem(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {/* Save/Cancel Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSaveItinerary}
                    size="sm"
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    onClick={handleCancelItineraryEdit}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {(trip.itinerary && trip.itinerary.length > 0) ? (
                  trip.itinerary.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-teal-50 to-sky-50 rounded-lg">
                      <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-900 flex-1">{item}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="h-6 w-6 text-gray-400" />
                    </div>
                    <p>No itinerary items yet</p>
                    <p className="text-sm">Click Edit to add activities</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes & Photo Section */}
        <div className="space-y-6">
          {/* Notes Card */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-gray-900">Notes</CardTitle>
                <Button
                  onClick={() => setIsEditingNotes(!isEditingNotes)}
                  variant="outline"
                  size="sm"
                  className="text-teal-600 border-teal-200 hover:bg-teal-50"
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  {isEditingNotes ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditingNotes ? (
                <div className="space-y-4">
                  <Textarea
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    placeholder="Add your trip notes, memories, or reminders..."
                    className="min-h-24 resize-none"
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveNotes}
                      size="sm"
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button
                      onClick={handleCancelNotesEdit}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {trip.notes ? (
                    <p className="text-gray-900 whitespace-pre-wrap">{trip.notes}</p>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Edit3 className="h-6 w-6 text-gray-400" />
                      </div>
                      <p>No notes yet</p>
                      <p className="text-sm">Click Edit to add notes</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Destination Photo */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Destination</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt={`Beautiful view of ${trip.destination}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white text-lg">{trip.destination}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
