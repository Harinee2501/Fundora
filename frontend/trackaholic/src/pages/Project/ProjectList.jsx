import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/v1/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/v1/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects((prev) => prev.filter((proj) => proj._id !== id));
    } catch (err) {
      alert("Failed to delete project");
      console.error(err);
    }
  };

  const goToDashboard = (projectId) => {
    navigate(`/dashboard/${projectId}`);
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '25px',
      backgroundColor: '#F4E9DC', // Cream Beige background
      borderRadius: '12px',
      boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
      color: '#5E3F2F', // Dark Chocolate Brown text
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '2px solid #CBB7A1', // Warm Taupe outline
        paddingBottom: '15px'
      }}>
        <h2 style={{
          fontSize: '1.6rem',
          fontWeight: '700',
          color: '#5E3F2F', // Dark Chocolate Brown
          margin: 0
        }}>My Projects</h2>
        <button
          onClick={() => navigate("/projects/add")}
          style={{
            backgroundColor: '#A97B55', // Coffee Brown
            color: '#F4E9DC', // Cream Beige text
            border: 'none',
            padding: '12px 25px',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#7D5B3A'; // Darker Coffee Brown on hover
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#A97B55';
          }}
        >
          Add New Project
        </button>
      </div>

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
      
      {!error && projects.length === 0 && (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#EEDDD0', // Soft Blush Pink
          borderRadius: '8px',
          color: '#5E3F2F'
        }}>
          No projects found.
        </div>
      )}

      {projects.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#A97B55', // Coffee Brown
                color: '#F4E9DC' // Cream Beige text
              }}>
                <th style={{
                  padding: '12px 15px',
                  textAlign: 'left',
                  fontWeight: '600',
                  borderBottom: '2px solid #CBB7A1' // Warm Taupe
                }}>Title</th>
                <th style={{
                  padding: '12px 15px',
                  textAlign: 'left',
                  fontWeight: '600',
                  borderBottom: '2px solid #CBB7A1'
                }}>Funding</th>
                <th style={{
                  padding: '12px 15px',
                  textAlign: 'left',
                  fontWeight: '600',
                  borderBottom: '2px solid #CBB7A1'
                }}>Funder</th>
                <th style={{
                  padding: '12px 15px',
                  textAlign: 'left',
                  fontWeight: '600',
                  borderBottom: '2px solid #CBB7A1'
                }}>Dates</th>
                <th style={{
                  padding: '12px 15px',
                  textAlign: 'left',
                  fontWeight: '600',
                  borderBottom: '2px solid #CBB7A1'
                }}>Status</th>
                <th style={{
                  padding: '12px 15px',
                  textAlign: 'left',
                  fontWeight: '600',
                  borderBottom: '2px solid #CBB7A1'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id} style={{
                  backgroundColor: '#EEDDD0', // Soft Blush Pink
                  transition: 'background-color 0.2s ease',
                  ':hover': {
                    backgroundColor: '#E0D0C0' // Slightly darker on hover
                  }
                }}>
                  <td style={{
                    padding: '12px 15px',
                    borderBottom: '1px solid #CBB7A1'
                  }}>{p.title}</td>
                  <td style={{
                    padding: '12px 15px',
                    borderBottom: '1px solid #CBB7A1'
                  }}>₹ {p.fundingAmount}</td>
                  <td style={{
                    padding: '12px 15px',
                    borderBottom: '1px solid #CBB7A1'
                  }}>{p.funderName}</td>
                  <td style={{
                    padding: '12px 15px',
                    borderBottom: '1px solid #CBB7A1'
                  }}>
                    {new Date(p.startDate).toLocaleDateString()} -{" "}
                    {new Date(p.endDate).toLocaleDateString()}
                  </td>
                  <td style={{
                    padding: '12px 15px',
                    borderBottom: '1px solid #CBB7A1'
                  }}>{p.status}</td>
                  <td style={{
                    padding: '12px 15px',
                    borderBottom: '1px solid #CBB7A1',
                    display: 'flex',
                    gap: '10px'
                  }}>
                    <button
                      onClick={() => goToDashboard(p._id)}
                      style={{
                        backgroundColor: '#5E3F2F', // Dark Chocolate Brown
                        color: '#F4E9DC',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#3F2E1F'; // Darker on hover
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#5E3F2F';
                      }}
                    >
                      📊 Dashboard
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      style={{
                        backgroundColor: '#D32F2F',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#B71C1C';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#D32F2F';
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectList;