import { FiMapPin, FiCalendar, FiCamera } from "react-icons/fi";

export default function HeroSection() {
  return (
    <section className="text-center mt-10">
      <h1 className="text-5xl font-bold mb-4">Plan Your Perfect Trip</h1>
      <p className="text-gray-600 max-w-2xl mx-auto mb-6">
        Organize your travel adventures with ease. Keep track of destinations, dates,
        and memories all in one beautiful place.
      </p>
      <button className="bg-teal-500 text-white px-6 py-3 rounded-full hover:bg-teal-600 transition">
        Get Started
      </button>

      {/* Features icons */}
      <div className="flex justify-center gap-10 mt-12">
        <FeatureItem icon={<FiMapPin size={24} />} label="Destinations" />
        <FeatureItem icon={<FiCalendar size={24} />} label="Scheduling" />
        <FeatureItem icon={<FiCamera size={24} />} label="Memories" />
      </div>

      {/* Bottom Hero Image */}
      <img
        src="/src/assets/hero-photo.jpg"  // <--- place your real image name here
        alt="Travel"
        className="mt-12 rounded-xl shadow-lg w-[80%] mx-auto"
      />
    </section>
  );
}

function FeatureItem({ icon, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-teal-100 p-4 rounded-full mb-2 text-2xl text-teal-600">
        {icon}
      </div>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
