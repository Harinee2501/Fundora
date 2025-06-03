import React, { useState } from "react";
import axios from "axios";

const AddProject = () => {
  const [title, setTitle] = useState("");
  const [fundingAmount, setFundingAmount] = useState("");
  const [funderName, setFunderName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !fundingAmount || !funderName || !startDate || !endDate) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

const response = await axios.post(
  `${baseUrl}/api/v1/projects`,
  {
    title,
    fundingAmount,
    funderName,
    startDate,
    endDate,
    description,
  },
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);


      setSuccess("Project added successfully!");
      setError(null);
      // Reset form fields
      setTitle("");
      setFundingAmount("");
      setFunderName("");
      setStartDate("");
      setEndDate("");
      setDescription("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add project");
      setSuccess(null);
    }
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '25px',
      backgroundColor: '#F4E9DC', // Cream Beige background
      borderRadius: '12px',
      boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
      color: '#5E3F2F', // Dark Chocolate Brown text
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '700',
        marginBottom: '20px',
        color: '#5E3F2F', // Dark Chocolate Brown
        borderBottom: '2px solid #CBB7A1', // Warm Taupe outline
        paddingBottom: '10px'
      }}>Add New Project</h2>
      
      {error && (
        <div style={{
          padding: '12px',
          marginBottom: '20px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '8px',
          borderLeft: '4px solid #c62828'
        }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{
          padding: '12px',
          marginBottom: '20px',
          backgroundColor: '#e8f5e9',
          color: '#2e7d32',
          borderRadius: '8px',
          borderLeft: '4px solid #2e7d32'
        }}>
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Project Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '9px',
              border: '2px solid #CBB7A1', // Warm Taupe
              fontSize: '1rem',
              color: '#5E3F2F',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              backgroundColor: '#EEDDD0' // Soft Blush Pink form background
            }}
            required
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Funding Amount *</label>
          <input
            type="number"
            value={fundingAmount}
            onChange={(e) => setFundingAmount(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '9px',
              border: '2px solid #CBB7A1',
              fontSize: '1rem',
              color: '#5E3F2F',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              backgroundColor: '#EEDDD0'
            }}
            required
            min="0"
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Funder Name *</label>
          <input
            type="text"
            value={funderName}
            onChange={(e) => setFunderName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '9px',
              border: '2px solid #CBB7A1',
              fontSize: '1rem',
              color: '#5E3F2F',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              backgroundColor: '#EEDDD0'
            }}
            required
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Start Date *</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '9px',
              border: '2px solid #CBB7A1',
              fontSize: '1rem',
              color: '#5E3F2F',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              backgroundColor: '#EEDDD0'
            }}
            required
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>End Date *</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '9px',
              border: '2px solid #CBB7A1',
              fontSize: '1rem',
              color: '#5E3F2F',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              backgroundColor: '#EEDDD0'
            }}
            required
          />
        </div>
        
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Description / Notes</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '9px',
              border: '2px solid #CBB7A1',
              fontSize: '1rem',
              color: '#5E3F2F',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              backgroundColor: '#EEDDD0',
              minHeight: '100px'
            }}
            rows={3}
          />
        </div>

        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            style={{
              backgroundColor: '#A97B55', // Coffee Brown
              color: '#F4E9DC', // Cream Beige text
              border: 'none',
              padding: '14px 30px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              minWidth: '120px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#7D5B3A'; // Darker Coffee Brown on hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#A97B55';
            }}
          >
            Add Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProject;