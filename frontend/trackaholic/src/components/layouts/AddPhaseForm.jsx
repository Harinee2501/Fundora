import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AddPhaseForm({ projectId, onPhaseAdded }) {
  const [phaseData, setPhaseData] = useState({
    phaseNumber: "",
    amountReceived: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [phases, setPhases] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/projects/${projectId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        const project = response.data;
        setPhases(project.phases || []);
      } catch (error) {
        console.error("Failed to fetch project phases", error);
      }
    };
    fetchProject();
  }, [projectId]);

  const handleChange = (e) => {
    setPhaseData({ ...phaseData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setPhaseData({
      phaseNumber: "",
      amountReceived: "",
      startDate: "",
      endDate: "",
    });
    setEditIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editIndex !== null) {
        const response = await axios.put(
          `http://localhost:8000/api/v1/projects/${projectId}/phases/${editIndex}`,
          {
            ...phaseData,
            amountReceived: parseFloat(phaseData.amountReceived),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        alert("Phase updated!");
        setPhases(response.data.phases);
        resetForm();
        if (onPhaseAdded) onPhaseAdded(response.data);
      } else {
        const response = await axios.post(
          `http://localhost:8000/api/v1/projects/${projectId}/phases`,
          {
            ...phaseData,
            amountReceived: parseFloat(phaseData.amountReceived),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        alert("Phase added!");
        setPhases(response.data.phases);
        resetForm();
        if (onPhaseAdded) onPhaseAdded(response.data);
      }
    } catch (err) {
      console.error("Error adding/updating phase:", err);
      alert("Failed to add/update phase");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    const phase = phases[index];
    setPhaseData({
      phaseNumber: phase.phaseNumber,
      amountReceived: phase.amountReceived,
      startDate: phase.startDate.slice(0, 10),
      endDate: phase.endDate.slice(0, 10),
    });
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Are you sure you want to delete this phase?")) return;

    try {
      const response = await axios.delete(
        `http://localhost:8000/api/v1/projects/${projectId}/phases/${index}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Phase deleted!");
      setPhases(response.data.phases);
      if (onPhaseAdded) onPhaseAdded(response.data);
      if (editIndex === index) resetForm();
    } catch (err) {
      console.error("Error deleting phase:", err);
      alert("Failed to delete phase");
    }
  };

  // Styles
  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#F4E9DC", // Cream Beige background
      padding: "20px",
      borderRadius: "10px",
      maxWidth: "700px",
      margin: "auto",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      color: "#5E3F2F", // Dark Chocolate Brown text
    },
    form: {
      backgroundColor: "#EEDDD0", // Soft Blush Pink
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "inset 0 0 10px #CBB7A1", // Warm Taupe shadow inside
      marginBottom: "30px",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "15px",
      alignItems: "center",
    },
    input: {
      padding: "10px 15px",
      borderRadius: "8px",
      border: "2px solid #CBB7A1", // Warm Taupe border
      fontSize: "1rem",
      color: "#5E3F2F",
      outline: "none",
      transition: "border-color 0.3s ease",
    },
    inputFocus: {
      borderColor: "#A97B55", // Coffee Brown on focus
      boxShadow: "0 0 5px #A97B55",
    },
    labelFullWidth: {
      gridColumn: "span 2",
      fontWeight: "600",
      fontSize: "1.4rem",
      marginBottom: "10px",
      color: "#5E3F2F",
    },
    button: {
      backgroundColor: "#A97B55", // Coffee Brown
      color: "#F4E9DC", // Cream Beige text
      border: "none",
      padding: "12px 25px",
      borderRadius: "10px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      gridColumn: "span 1",
      justifySelf: "start",
    },
    buttonCancel: {
      backgroundColor: "#5E3F2F", // Dark Chocolate Brown
      marginLeft: "10px",
      gridColumn: "span 1",
      justifySelf: "start",
    },
    buttonHover: {
      backgroundColor: "#7D5B3A", // darker coffee brown for hover
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0 12px",
      fontSize: "1rem",
    },
    th: {
      backgroundColor: "#A97B55", // Coffee Brown
      color: "#F4E9DC", // Cream Beige text
      padding: "10px",
      borderRadius: "10px",
      textAlign: "left",
      fontWeight: "700",
    },
    td: {
      backgroundColor: "#EEDDD0", // Soft Blush Pink
      padding: "12px",
      borderRadius: "10px",
      color: "#5E3F2F",
    },
    actionsCell: {
      display: "flex",
      gap: "10px",
    },
    actionButton: {
      backgroundColor: "#CBB7A1", // Warm Taupe
      border: "none",
      borderRadius: "8px",
      padding: "6px 12px",
      cursor: "pointer",
      fontWeight: "600",
      color: "#5E3F2F",
      transition: "background-color 0.3s ease",
    },
    actionButtonHover: {
      backgroundColor: "#A97B55",
      color: "#F4E9DC",
    },
    noData: {
      fontStyle: "italic",
      color: "#7A5E42",
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <form
        onSubmit={handleSubmit}
        style={styles.form}
        autoComplete="off"
        noValidate
      >
        <label htmlFor="phaseNumber" style={styles.labelFullWidth}>
          {editIndex !== null ? "Edit Phase" : "Add Phase"}
        </label>

        <input
          id="phaseNumber"
          name="phaseNumber"
          placeholder="Phase Number"
          value={phaseData.phaseNumber}
          onChange={handleChange}
          required
          style={styles.input}
          onFocus={(e) =>
            (e.target.style.borderColor = styles.inputFocus.borderColor)
          }
          onBlur={(e) =>
            (e.target.style.borderColor = styles.input.borderColor)
          }
        />

        <input
          name="amountReceived"
          type="number"
          placeholder="Amount Received"
          value={phaseData.amountReceived}
          onChange={handleChange}
          required
          style={styles.input}
          onFocus={(e) =>
            (e.target.style.borderColor = styles.inputFocus.borderColor)
          }
          onBlur={(e) =>
            (e.target.style.borderColor = styles.input.borderColor)
          }
        />

        <input
          name="startDate"
          type="date"
          value={phaseData.startDate}
          onChange={handleChange}
          required
          style={styles.input}
          onFocus={(e) =>
            (e.target.style.borderColor = styles.inputFocus.borderColor)
          }
          onBlur={(e) =>
            (e.target.style.borderColor = styles.input.borderColor)
          }
        />

        <input
          name="endDate"
          type="date"
          value={phaseData.endDate}
          onChange={handleChange}
          required
          style={styles.input}
          onFocus={(e) =>
            (e.target.style.borderColor = styles.inputFocus.borderColor)
          }
          onBlur={(e) =>
            (e.target.style.borderColor = styles.input.borderColor)
          }
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading
            ? editIndex !== null
              ? "Updating..."
              : "Adding..."
            : editIndex !== null
            ? "Update Phase"
            : "Add Phase"}
        </button>

        {editIndex !== null && (
          <button
            type="button"
            onClick={resetForm}
            style={{ ...styles.button, ...styles.buttonCancel }}
          >
            Cancel
          </button>
        )}
      </form>

      {phases.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Phase Number</th>
              <th style={styles.th}>Amount Received</th>
              <th style={styles.th}>Start Date</th>
              <th style={styles.th}>End Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {phases.map((phase, index) => (
              <tr key={index}>
                <td style={styles.td}>{phase.phaseNumber}</td>
                <td style={styles.td}>{phase.amountReceived}</td>
                <td style={styles.td}>
                  {new Date(phase.startDate).toLocaleDateString()}
                </td>
                <td style={styles.td}>
                  {new Date(phase.endDate).toLocaleDateString()}
                </td>
                <td style={{ ...styles.td, ...styles.actionsCell }}>
                  <button
                    onClick={() => handleEdit(index)}
                    style={styles.actionButton}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#A97B55")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#CBB7A1")
                    }
                    title="Edit Phase"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    style={styles.actionButton}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#A97B55")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#CBB7A1")
                    }
                    title="Delete Phase"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={styles.noData}>No phases added yet.</p>
      )}
    </div>
  );
}
