export default function Navbar() {
  return (
    <nav className="bg-blue-700 text-white p-4 flex justify-between items-center">
      <h1 className="font-bold text-xl">Travel Planner</h1>
      <ul className="flex gap-4">
        <li className="hover:text-blue-300 cursor-pointer">Home</li>
        <li className="hover:text-blue-300 cursor-pointer">Trips</li>
        <li className="hover:text-blue-300 cursor-pointer">About</li>
      </ul>
    </nav>
  );
}
