import React, { useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "emailjs-com";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        "service_so2lihu", //My service ID
        "template_t7ox27o", //My EmailJS template ID
        formData,
        "Y71Yq-CRN_FexFYoT" //My EmailJS public key
      )
      .then(
        () => {
          alert("✅ Thank you! Your message has been sent.");
          setFormData({ name: "", email: "", message: "" });
          setLoading(false);
        },
        (error) => {
          console.error("EmailJS Error:", error);
          alert("❌ Failed to send message. Please try again later.");
          setLoading(false);
        }
      );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white p-8">
      <nav className="flex justify-between items-center mb-12">
        <Link to="/" className="font-bold text-xl text-teal-600">TripPlanner</Link>
        <div className="space-x-6">
          <Link to="/" className="text-gray-700 hover:text-teal-600">Home</Link>
          <Link to="/features" className="text-gray-700 hover:text-teal-600">Features</Link>
          <Link to="/about" className="text-gray-700 hover:text-teal-600">About</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-teal-600">Contact Us</h1>

        <div className="bg-white p-8 rounded-xl shadow-md">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-teal-700">Get in Touch</h2>
            <p className="text-lg text-gray-700 mb-2">Email: Dawitmamoyou@gmail.com</p>
            <p className="text-lg text-gray-700 mb-2">Phone: +251 934 401 984</p>
            <p className="text-lg text-gray-700">Address: Addis Ababa, Ethiopia</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-teal-700">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  rows="4"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors w-full"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
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

export default Contact;
