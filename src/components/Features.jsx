import React from 'react';
import { Link } from 'react-router-dom';

const Features = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white p-8">
      <nav className="flex justify-between items-center mb-12">
        <Link to="/" className="font-bold text-xl text-teal-600">TripPlanner</Link>
        <div className="space-x-6">
          <Link to="/" className="text-gray-700 hover:text-teal-600">Home</Link>
          <Link to="/dashboard" className="text-gray-700 hover:text-teal-600">My Trips</Link>
        </div>
      </nav>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-teal-600">App Features</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Trip Management', desc: 'Create and organize all your travel plans' },
            { title: 'Destination Tracking', desc: 'Keep track of all your travel destinations' },
            { title: 'Date Planning', desc: 'Plan your travel dates with ease' },
            { title: 'Notes & Reminders', desc: 'Add important notes for each trip' },
            { title: 'Responsive Design', desc: 'Access your trips on any device' },
            { title: 'Easy Navigation', desc: 'Simple and intuitive interface' },
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-teal-700">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
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

export default Features;