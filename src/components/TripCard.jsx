export default function TripCard({ trip, onDelete }) {
  return (
    <div className="p-4 bg-white rounded shadow mb-4 w-72 flex justify-between items-center">
      <div>
        <h2 className="text-xl font-bold">{trip.destination}</h2>
        <p className="text-gray-600">{trip.date}</p>
      </div>
      <button
        onClick={onDelete}
        className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );
}
