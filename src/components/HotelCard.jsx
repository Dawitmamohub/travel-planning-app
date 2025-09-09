import React from "react";

export default function HotelCard({ hotel, selected, onSelect }) {
  return (
    <div
      className={`border rounded-md p-3 cursor-pointer hover:bg-gray-50 flex gap-3 ${
        selected ? "bg-teal-50 border-teal-500" : ""
      }`}
      onClick={() => onSelect(hotel)}
    >
      <img
        src={hotel.image || `https://source.unsplash.com/120x120/?hotel,${hotel.name}`}
        alt={hotel.name}
        className="w-24 h-24 object-cover rounded-md"
      />
      <div className="flex-1">
        <h4 className="font-semibold">{hotel.name}</h4>
        <p className="text-sm text-gray-600">{hotel.address}</p>
        <p className="text-sm">Rating: {hotel.rating}/5</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {hotel.amenities?.slice(0, 3).map((a, i) => (
            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">{a}</span>
          ))}
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold">${hotel.price}/night</p>
      </div>
    </div>
  );
}
