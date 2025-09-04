export default function DestinationList({ destinations, onSelect }) {
  if (destinations.length === 0) {
    return <p className="text-gray-500">No destinations found.</p>;
  }

  return (
    <div className="grid md:grid-cols-3 gap-4 mt-4">
      {destinations.map((d) => (
        <div
          key={d.id}
          className="border p-4 rounded shadow cursor-pointer hover:shadow-lg transition"
          onClick={() => onSelect(d)}
        >
          <img
            src={`https://source.unsplash.com/400x250/?${d.name}`}
            alt={d.name}
            className="rounded mb-2"
          />
          <h2 className="font-bold text-lg">{d.name}</h2>
          <p>{d.address.countryName}</p>
        </div>
      ))}
    </div>
  );
}