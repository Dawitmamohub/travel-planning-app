import { useState ,useEffect }from "react";
import DestinationForm from"../components/DestinationForm";
import TripCard from "../components/TripCard";

export default function Dashboard() {

    const [trips , setTrips] = useState (()=>{
        const savedTrips= localStorage.getItem("trips");
        return savedTrips ? JSON.parse(savedTrips): [];
    });

    useEffect(() => {
        localStorage.setItem("trips", JSON.stringify(trips));

    },[trips]);

    const addTrip = (trip) => {
        setTrips ([trip, ...trips]);   
    };

    const deleteTrip = (index) => {
        const updated = trips.filter((_, idx) => idx !== index);
        setTrips(updated);
    };

    return (
        <div className="min-h-screen p-6">
            <h2 className="text-3xl font-bold mb-4">Dashboard overview</h2>
            <p className="mb-4">Total trips:<strong>{trips.length}</strong></p>

            <DestinationForm onAddTrip={addTrip}/>

            <div className="flex flexcol items-center">
                {trips.map((trip , idx)=> (
                    <TripCard key={idx} trip={trip} onDelete={() => deleteTrip(idx)} />
                ))}
            </div>
        </div>
    );

}