import React, { useState } from "react";

export default function Contact () {
    const [formData , setFormData] = useState({
        name: "",
        email: "",
        message:"",
    });

    const handlechange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({ ...perv, [name]: value}));
    };

    const handlesubmit = (e) => {
        e.preventDefault();
        alert(`Thank you ${formdata.name}! your massage has been sent.`);
        setFormData({ name:"", email:"", message:""});
    };

return (
    <div className="min-h-screen p-6 bg-teal-50 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-teal-600">Contact Us</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md flex flex-col gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          rows="4"
          required
        ></textarea>
        <button
          type="submit"
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}