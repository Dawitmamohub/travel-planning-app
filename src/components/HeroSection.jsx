import React from 'react';
import { Button } from './ui/button';
import { Plane, MapPin, Calendar, Camera } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Home({ onGetStarted }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 lg:px-8">
        <div className="flex items-center gap-2 text-teal-600">
          <Plane className="h-8 w-8" />
          <span className="text-xl text-gray-900">TripPlanner</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-gray-600 hover:text-teal-600 transition-colors">Features</a>
          <a href="#about" className="text-gray-600 hover:text-teal-600 transition-colors">About</a>
          <a href="#contact" className="text-gray-600 hover:text-teal-600 transition-colors">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6 lg:px-16">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col justify-center text-center lg:text-left gap-6">
            <h1 className="text-5xl lg:text-6xl text-gray-900">
              Plan Your Perfect Trip
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-md">
              Organize your travel adventures with ease. Keep track of destinations, dates, and memories all in one beautiful place.
            </p>
            <Button 
              onClick={onGetStarted}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Get Started
            </Button>

            {/* Feature Icons Under Button */}
            <div className="flex justify-center lg:justify-start gap-8 mt-6">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center shadow">
                  <MapPin className="h-6 w-6 text-teal-600" />
                </div>
                <span className="text-sm text-gray-600">Destinations</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center shadow">
                  <Calendar className="h-6 w-6 text-teal-600" />
                </div>
                <span className="text-sm text-gray-600">Scheduling</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center shadow">
                  <Camera className="h-6 w-6 text-teal-600" />
                </div>
                <span className="text-sm text-gray-600">Memories</span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="w-full">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80"
              alt="Beautiful travel destination with mountains and lake"
              className="w-full h-[600px] lg:h-[700px] object-cover rounded-2xl shadow-2xl"
            />
          </div>

        </div>
      </main>
    </div>
  );
}
