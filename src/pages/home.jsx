import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Plane, MapPin, Calendar, Camera } from "lucide-react"; 
import travelHero from "../assets/hero-photo.jpg";

// Extracted Navbar component for better structure
const Navbar = () => {
  const location = useLocation();
  
  const navLinks = [
    { to: "/features", text: "Features" },
    { to: "/about", text: "About" },
    { to: "/contact", text: "Contact" }
  ];
  
  return (
    <nav className="flex items-center justify-between p-6 lg:px-8">
      <Link to="/" className="flex items-center gap-2 text-teal-600 hover:opacity-80 transition-opacity">
        <Plane className="h-8 w-8" aria-hidden="true" />
        <span className="text-xl font-semibold text-gray-900">TripPlanner</span>
      </Link>
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map(link => (
          <Link 
            key={link.to}
            to={link.to} 
            className={`transition-colors ${
              location.pathname === link.to 
                ? "text-teal-600 font-medium" 
                : "text-gray-600 hover:text-teal-600"
            }`}
            aria-current={location.pathname === link.to ? "page" : undefined}
          >
            {link.text}
          </Link>
        ))}
      </div>
    </nav>
  );
};

// Extracted FeatureIcon component for reusability
const FeatureIcon = ({ icon: Icon, text }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center" aria-hidden="true">
      <Icon className="h-6 w-6 text-teal-600" />
    </div>
    <span className="text-sm text-gray-600">{text}</span>
  </div>
);

export default function Home() {
  const features = [
    { icon: MapPin, text: "Destinations" },
    { icon: Calendar, text: "Scheduling" },
    { icon: Camera, text: "Memories" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-teal-50 to-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between flex-1 px-6 md:px-16 mt-8 gap-8">
        {/* Left Text */}
        <div className="text-center lg:text-left max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6">
            Plan Your Perfect <span className="text-teal-600">Journey</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Discover, organize, and track all your trips in one place. Start your next adventure today!
          </p>
          <Link to="/dashboard">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
              Get Started
            </Button>
          </Link>

          {/* Feature Icons Under Button */}
          <div className="flex justify-center lg:justify-start gap-6 md:gap-8 mt-12">
            {features.map((feature, index) => (
              <FeatureIcon 
                key={index} 
                icon={feature.icon} 
                text={feature.text} 
              />
            ))}
          </div>
        </div>

        {/* Right Image */}
        <div className="mt-10 md:mt-0 flex justify-center flex-1">
          <img
            src={travelHero}
            alt="Woman enjoying a scenic travel destination with mountains in the background"
            className="w-full max-w-2xl drop-shadow-lg rounded-2xl"
            loading="eager"
          />
        </div>
      </section>
      
      {/* Decorative element */}
      <div className="w-full h-24 bg-gradient-to-r from-sky-100 to-teal-100 rounded-t-[3rem] mt-auto" aria-hidden="true"></div>
    </div>
  );
}