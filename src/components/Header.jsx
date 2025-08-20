import { TbPlane } from "react-icons/tb";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="flex justify-between items-center py-4 px-8">
      <div className="flex items-center gap-2">
        <TbPlane size={28} className="text-teal-600" />
        <span className="font-bold text-xl">TripPlanner</span>
      </div>

      <nav className="flex gap-6 text-gray-700">
        <Link to="/" className="hover:text-teal-600">Home</Link>
        <Link to="/dashboard" className="hover:text-teal-600">Dashboard</Link>
        <Link to="/about">About</Link> 
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
}
