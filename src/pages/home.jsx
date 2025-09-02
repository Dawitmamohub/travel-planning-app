import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Plane, MapPin, Calendar, Camera } from "lucide-react"; 
import travelHero from "../assets/hero-photo.jpg";
import { useNavigate } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-teal-50 to-white">
      {/* Navbar */}
        <nav className="flex items-center justify-between p-6 lg:px-8">
        <div className="flex items-center gap-2 text-teal-600">
          <Plane className="h-8 w-8" />
          <span className="text-xl text-gray-900">TripPlanner</span>
        </div>
       <div className="hidden md:flex items-center gap-6">
  <Link to="/features" className="text-gray-600 hover:text-teal-600 transition-colors">Features</Link>
  <Link to="/about" className="text-gray-600 hover:text-teal-600 transition-colors">About</Link>
  <Link to="/contact" className="text-gray-600 hover:text-teal-600 transition-colors">Contact</Link>
</div>
      </nav>


      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between flex-1 px-8 md:px-16 mt-8 gap-8">
        {/* Left Text */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6">
            Plan Your Perfect <span className="text-teal-600">Journey</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
            Discover, organize, and track all your trips in one place. Start your next adventure today!
          </p>
          <Link to="/Dashboard">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              Get Started
            </Button>
          </Link>

          {/* Feature Icons Under Button */}
          <div className="flex justify-center md:justify-start gap-8 mt-12">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-teal-600" />
              </div>
              <span className="text-sm text-gray-600">Destinations</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-teal-600" />
              </div>
              <span className="text-sm text-gray-600">Scheduling</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                <Camera className="h-6 w-6 text-teal-600" />
              </div>
              <span className="text-sm text-gray-600">Memories</span>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="mt-10 md:mt-0 md:w-2/3 flex justify-center">
          <img
            src={travelHero}
            alt="Travel illustration"
            className="w-3/4 drop-shadow-lg rounded-2xl"
          />
        </div>
      </section>
      <div className="w-full h-24 bg-gradient-to-r from-sky-100 to-teal-100 rounded-t-[3rem]"></div>
    </div>
  );
}
