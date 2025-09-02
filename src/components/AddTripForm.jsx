import React, { useState } from "react";

const AddTripForm = ({ onSubmit }) => {
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!tripName || !destination || !startDate || !endDate) {
      alert("Please fill in all required fields");
      return;
    }
    
    // Create trip object
    const newTrip = {
      id: Date.now(), // Simple ID generation
      title: tripName,
      destination: destination,
      startDate: new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      endDate: new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      duration: calculateDuration(startDate, endDate),
      description: notes,
      details: `Notes: ${notes || 'No additional notes'}`,
    };
    
    onSubmit(newTrip);
    
    // Reset form
    setTripName("");
    setDestination("");
    setStartDate("");
    setEndDate("");
    setNotes("");
  };

  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end days
    return `${daysDiff} days`;
  };

  return (
    <form onSubmit={handleSubmit} className="add-trip-form">
      <h2 className="form-title">Trip Details</h2>
      
      <div className="form-group">
        <label htmlFor="tripName" className="form-label">
          Trip Name *
        </label>
        <input
          type="text"
          id="tripName"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          placeholder="e.g., Summer Vacation, Business Trip"
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="destination" className="form-label">
          Destination *
        </label>
        <input
          type="text"
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="e.g., Paris, France"
          className="form-input"
        />
      </div>
      
      <div className="divider"></div>
      
      <div className="date-section">
        <h3 className="section-title">Start Date *</h3>
        <div className="date-inputs">
          <div className="date-group">
            <label className="date-label">Start Date *</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
            />
          </div>
          
          <div className="date-group">
            <label className="date-label">End Date *</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
            />
          </div>
        </div>
      </div>
      
      <div className="divider"></div>
      
      <div className="form-group">
        <label htmlFor="notes" className="form-label">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any special notes, reminders, or details about your trip..."
          className="form-textarea"
          rows="4"
        />
      </div>
      
      <div className="divider"></div>
      
      <div className="form-actions">
        <button type="button" className="cancel-button">
          Cancel
        </button>
        <button type="submit" className="submit-button">
          Save Trip
        </button>
      </div>

      <style jsx>{`
        .add-trip-form {
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
        }
        
        .form-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #2d3748;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          color: #2d3748;
        }
        
        .form-input, .form-textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #cbd5e0;
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.2s;
        }
        
        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }
        
        .divider {
          height: 1px;
          background-color: #e2e8f0;
          margin: 25px 0;
        }
        
        .date-section {
          margin-bottom: 20px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
          color: #2d3748;
        }
        
        .date-inputs {
          display: flex;
          gap: 15px;
        }
        
        .date-group {
          flex: 1;
        }
        
        .date-label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          color: #2d3748;
          font-size: 14px;
        }
        
        .date-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #cbd5e0;
          border-radius: 6px;
          font-size: 16px;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 20px;
        }
        
        .cancel-button {
          padding: 10px 20px;
          background-color: #fff;
          color: #4a5568;
          border: 1px solid #cbd5e0;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .cancel-button:hover {
          background-color: #f7fafc;
        }
        
        .submit-button {
          padding: 10px 20px;
          background-color: #0d9488;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .submit-button:hover {
          background-color: #0f766e;
        }
      `}</style>
    </form>
  );
};

export default AddTripForm;