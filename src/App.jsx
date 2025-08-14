import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="min-h-screen bg-blue-100">
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-10">
        <h1 className="text-4xl font-bold text-blue-700">Travel Planning App</h1>
      </div>
    </div>
  );
}
