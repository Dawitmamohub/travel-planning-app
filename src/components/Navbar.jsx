import { TbPlane } from "react-icons/tb";

export default function Header() {
  return (
    <header className="flex justify-between items-center py-4 px-8">
      <div className="flex items-center gap-2">
        <TbPlane size={28} className="text-teal-600" />
        <span className="font-bold text-xl">TripPlanner</span>
      </div>

      <nav className="flex gap-6 text-gray-700">
        <a href="#" className="hover:text-teal-600">Features</a>
        <a href="#" className="hover:text-teal-600">About</a>
        <a href="#" className="hover:text-teal-600">Contact</a>
      </nav>
    </header>
  );
}
