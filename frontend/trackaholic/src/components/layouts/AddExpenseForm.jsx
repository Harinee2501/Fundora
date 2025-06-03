import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddExpenseForm({ projectId }) {
  const [expense, setExpense] = useState({
    purpose: '',
    amount: '',
    category: '',
    date: '',
    receipt: null
  });

  const [expenses, setExpenses] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/projects/${projectId}/expenses`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setExpenses(response.data);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [projectId]);

  const handleChange = (e) => {
    if (e.target.name === 'receipt') {
      setExpense({ ...expense, receipt: e.target.files[0] });
    } else {
      setExpense({ ...expense, [e.target.name]: e.target.value });
    }
  };

  const resetForm = () => {
    setExpense({
      purpose: '',
      amount: '',
      category: '',
      date: '',
      receipt: null
    });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("purpose", expense.purpose);
    formData.append("amount", expense.amount);
    formData.append("category", expense.category);
    formData.append("date", expense.date);
    if (expense.receipt) {
      formData.append("receipt", expense.receipt);
    }

    try {
      const url = editId
        ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/projects/${projectId}/expenses/${editId}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/v1/projects/${projectId}/expenses`;

      const method = editId ? axios.put : axios.post;

      const response = await method(url, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        },
      });

      alert(editId ? "Expense updated!" : "Expense added!");
      setExpenses(response.data);
      resetForm();
    } catch (err) {
      console.error("Error submitting expense", err);
      alert("Failed to submit expense");
    }
  };

  const handleEdit = (expense) => {
    setExpense({
      purpose: expense.purpose,
      amount: expense.amount,
      category: expense.category,
      date: expense.date.slice(0, 10),
      receipt: null,
    });
    setEditId(expense._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/projects/${projectId}/expenses/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Expense deleted!");
      setExpenses(response.data);
      if (editId === id) resetForm();
    } catch (err) {
      console.error("Failed to delete expense", err);
      alert("Delete failed");
    }
  };

  
  const isImageFile = (url) => /\.(jpg|jpeg|png)$/i.test(url);

  
  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#F4E9DC", // Cream Beige
      padding: "20px",
      borderRadius: "12px",
      maxWidth: "800px",
      margin: "auto",
      boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
      color: "#5E3F2F", 
    },
    form: {
      backgroundColor: "#EEDDD0", 
      padding: "25px 30px",
      borderRadius: "12px",
      boxShadow: "inset 0 0 15px #CBB7A1",
      marginBottom: "30px",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
      alignItems: "center",
    },
    heading: {
      gridColumn: "span 2",
      fontSize: "1.6rem",
      fontWeight: "700",
      marginBottom: "10px",
      color: "#5E3F2F",
    },
    input: {
      padding: "12px 16px",
      borderRadius: "9px",
      border: "2px solid #CBB7A1",
      fontSize: "1rem",
      color: "#5E3F2F",
      outline: "none",
      transition: "border-color 0.3s ease",
      width: "100%",
      boxSizing: "border-box",
    },
    inputFocus: {
      borderColor: "#A97B55",
      boxShadow: "0 0 6px #A97B55",
    },
    fileInputWrapper: {
      gridColumn: "span 2",
    },
    buttonsWrapper: {
      gridColumn: "span 2",
      display: "flex",
      gap: "15px",
      justifyContent: "start",
      marginTop: "10px",
    },
    button: {
      backgroundColor: "#A97B55", 
      color: "#F4E9DC", 
      border: "none",
      padding: "14px 30px",
      borderRadius: "12px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      minWidth: "120px",
    },
    buttonCancel: {
      backgroundColor: "#5E3F2F", 
    },
    buttonHover: {
      backgroundColor: "#7D5B3A",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0 14px",
      fontSize: "1rem",
    },
    th: {
      backgroundColor: "#A97B55",
      color: "#F4E9DC",
      padding: "12px 15px",
      borderRadius: "12px",
      textAlign: "left",
      fontWeight: "700",
    },
    td: {
      backgroundColor: "#EEDDD0",
      padding: "14px 15px",
      borderRadius: "12px",
      color: "#5E3F2F",
      verticalAlign: "middle",
    },
    actionsCell: {
      display: "flex",
      gap: "12px",
    },
    actionButton: {
      backgroundColor: "#CBB7A1",
      border: "none",
      borderRadius: "9px",
      padding: "8px 16px",
      cursor: "pointer",
      fontWeight: "600",
      color: "#5E3F2F",
      transition: "background-color 0.3s ease",
    },
    actionButtonHover: {
      backgroundColor: "#A97B55",
      color: "#F4E9DC",
    },
    receiptImg: {
      maxWidth: "100px",
      marginTop: "6px",
      display: "block",
      borderRadius: "8px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
    },
    noData: {
      fontStyle: "italic",
      color: "#7A5E42",
      marginTop: "15px",
    },
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = styles.inputFocus.borderColor;
    e.target.style.boxShadow = styles.inputFocus.boxShadow;
  };
  const handleBlur = (e) => {
    e.target.style.borderColor = styles.input.borderColor;
    e.target.style.boxShadow = "none";
  };

  return (
    <div style={styles.container}>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        style={styles.form}
        noValidate
      >
        <h3 style={styles.heading}>{editId ? "Edit Expense" : "Add Expense"}</h3>

        <input
          name="purpose"
          placeholder="Purpose"
          value={expense.purpose}
          onChange={handleChange}
          required
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={expense.amount}
          onChange={handleChange}
          required
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <input
          name="category"
          placeholder="Category"
          value={expense.category}
          onChange={handleChange}
          required
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <input
          name="date"
          type="date"
          value={expense.date}
          onChange={handleChange}
          required
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <div style={styles.fileInputWrapper}>
          <input
            name="receipt"
            type="file"
            onChange={handleChange}
            style={{ cursor: "pointer" }}
            accept="image/jpeg,image/png,image/jpg,.pdf,.doc,.docx"
          />
        </div>

        <div style={styles.buttonsWrapper}>
          <button
            type="submit"
            style={styles.button}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
          >
            {editId ? "Update" : "Add"} Expense
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              style={{ ...styles.button, ...styles.buttonCancel }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#3F2E1F")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = styles.buttonCancel.backgroundColor)}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h4 style={{ color: "#5E3F2F" }}>Expenses</h4>

      {expenses.length === 0 ? (
        <p style={styles.noData}>No expenses added yet.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Purpose</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Receipt</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp._id}>
                <td style={styles.td}>{exp.purpose}</td>
                <td style={styles.td}>{exp.amount}</td>
                <td style={styles.td}>{exp.category}</td>
                <td style={styles.td}>{new Date(exp.date).toLocaleDateString()}</td>
                <td style={styles.td}>
                  {exp.receiptUrl ? (
                    <>
                      <a
                        href={`${import.meta.env.VITE_BACKEND_URL}${exp.receiptUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginRight: "10px", color: "#5E3F2F", fontWeight: "600" }}
                      >
                        View
                      </a>
                      <a
                        href={`${import.meta.env.VITE_BACKEND_URL}${exp.receiptUrl}`}
                        download
                        style={{ color: "#5E3F2F", fontWeight: "600" }}
                      >
                        Download
                      </a>
                      {isImageFile(exp.receiptUrl) && (
                        <div>
                          <img
                            src={`${import.meta.env.VITE_BACKEND_URL}${exp.receiptUrl}`}
                            alt="Receipt thumbnail"
                            style={styles.receiptImg}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <span>No Receipt</span>
                  )}
                </td>
                <td style={{ ...styles.td, ...styles.actionsCell }}>
                  <button
                    onClick={() => handleEdit(exp)}
                    style={styles.actionButton}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = styles.actionButtonHover.backgroundColor;
                      e.currentTarget.style.color = styles.actionButtonHover.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = styles.actionButton.backgroundColor;
                      e.currentTarget.style.color = styles.actionButton.color;
                    }}
                    title="Edit Expense"
                  >
                    Edit
                  </button>{' '}
                  <button
                    onClick={() => handleDelete(exp._id)}
                    style={styles.actionButton}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = styles.actionButtonHover.backgroundColor;
                      e.currentTarget.style.color = styles.actionButtonHover.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = styles.actionButton.backgroundColor;
                      e.currentTarget.style.color = styles.actionButton.color;
                    }}
                    title="Delete Expense"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}