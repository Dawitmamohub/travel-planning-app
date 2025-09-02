import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white p-8">
      <nav className="flex justify-between items-center mb-12">
        <Link to="/" className="font-bold text-xl text-teal-600">TripPlanner</Link>
        <div className="space-x-6">
          <Link to="/" className="text-gray-700 hover:text-teal-600">Home</Link>
          <Link to="/features" className="text-gray-700 hover:text-teal-600">Features</Link>
          <Link to="/contact" className="text-gray-700 hover:text-teal-600">Contact</Link>
        </div>
      </nav>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-teal-600">About TripPlanner</h1>
        
        <div className="bg-white p-8 rounded-xl shadow-md">
          <p className="text-lg text-gray-700 mb-6">
            TripPlanner is your ultimate travel companion, designed to make trip planning effortless and organized.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Our mission is to help travelers like you create memorable journeys without the stress of planning.
          </p>
          <p className="text-lg text-gray-700">
            Whether you're planning a weekend getaway or a month-long adventure, TripPlanner has you covered.
          </p>
        </div>
        
        <div className="text-center mt-12">
          <Link to="/">
            <button className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;