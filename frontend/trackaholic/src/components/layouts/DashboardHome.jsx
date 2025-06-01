import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function ProjectDashboard({ projectId }) {
  const [phases, setPhases] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchData() {
      try {
        const [phasesRes, expensesRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/v1/projects/${projectId}/phases`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          axios.get(`http://localhost:8000/api/v1/projects/${projectId}/expenses`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
        ]);
        setPhases(phasesRes.data);
        setExpenses(expensesRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [projectId]);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  const totalAllocated = phases.reduce((sum, p) => sum + Number(p.amountReceived || 0), 0);
  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const remainingBudget = totalAllocated - totalSpent;

  const phasesWithSpending = phases.map(phase => {
    const start = phase.startDate ? new Date(phase.startDate) : null;
    const end = phase.endDate ? new Date(phase.endDate) : null;

    const spent = expenses
      .filter(exp => {
        const expDate = exp.date ? new Date(exp.date) : null;
        return start && end && expDate ? expDate >= start && expDate <= end : false;
      })
      .reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

    return {
      ...phase,
      name: `Phase ${phase.phaseNumber || phases.indexOf(phase) + 1}`,
      allocated: Number(phase.amountReceived || 0),
      spent,
      remaining: Number(phase.amountReceived || 0) - spent,
      percentSpent: Number(phase.amountReceived || 0) > 0 
        ? (spent / Number(phase.amountReceived || 0)) * 100 
        : 0
    };
  });

  
  const expensesByCategory = expenses.reduce((acc, exp) => {
    const cat = exp.category || 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + Number(exp.amount || 0);
    return acc;
  }, {});

  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="dashboard">
      <h1>Project Financial Dashboard</h1>
      
      <div className="summary-cards">
        <div className="card">
          <h3>Total Allocated</h3>
          <p>${totalAllocated.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Total Spent</h3>
          <p>${totalSpent.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Remaining</h3>
          <p className={remainingBudget < 0 ? 'negative' : ''}>
            ${remainingBudget.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="chart-table-pair">
        <div className="chart-container">
          <h2>Phase Budget Utilization</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={phasesWithSpending}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="allocated" fill="#8884d8" name="Allocated" />
              <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="table-container">
          <h2>Phase Details</h2>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Phase</th>
                  <th>Allocated</th>
                  <th>Spent</th>
                  <th>Remaining</th>
                  <th>% Used</th>
                </tr>
              </thead>
              <tbody>
                {phasesWithSpending.map((phase, i) => (
                  <tr key={i}>
                    <td>{phase.name}</td>
                    <td>${phase.allocated.toFixed(2)}</td>
                    <td>${phase.spent.toFixed(2)}</td>
                    <td className={phase.remaining < 0 ? 'negative' : ''}>
                      ${phase.remaining.toFixed(2)}
                    </td>
                    <td>
                      <div className="progress-container">
                        <div 
                          className="progress-bar" 
                          style={{ 
                            width: `${Math.min(phase.percentSpent, 100)}%`,
                            backgroundColor: phase.percentSpent > 100 ? '#ff6b6b' : '#82ca9d'
                          }}
                        />
                        <span>{phase.percentSpent.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="chart-table-pair">
        <div className="chart-container">
          <h2>Expenses by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="table-container">
          <h2>Category Breakdown</h2>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>% of Total</th>
                </tr>
              </thead>
              <tbody>
                {pieData.map((category, i) => (
                  <tr key={i}>
                    <td>{category.name}</td>
                    <td>${category.value.toFixed(2)}</td>
                    <td>
                      {((category.value / totalSpent) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="chart-table-pair">
        <div className="chart-container">
          <h2>Spending Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={expenses
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((exp, i, arr) => ({
                  date: exp.date ? new Date(exp.date).toLocaleDateString() : 'N/A',
                  amount: Number(exp.amount || 0),
                  cumulative: arr.slice(0, i + 1).reduce((sum, e) => sum + Number(e.amount || 0), 0)
                }))
              }
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Line 
                type="monotone" 
                dataKey="cumulative" 
                stroke="#ff8042" 
                name="Cumulative" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="table-container">
          <h2>Recent Expenses</h2>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Purpose</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 5)
                  .map((exp, i) => (
                    <tr key={i}>
                      <td>{exp.date ? new Date(exp.date).toLocaleDateString() : 'N/A'}</td>
                      <td>{exp.purpose || 'N/A'}</td>
                      <td>${Number(exp.amount || 0).toFixed(2)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .loading {
          text-align: center;
          padding: 50px;
          font-size: 1.2rem;
        }
        
        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          text-align: center;
        }
        
        .card h3 {
          margin: 0 0 10px;
          color: #555;
        }
        
        .card p {
          font-size: 1.8rem;
          font-weight: bold;
          margin: 0;
        }
        
        .negative {
          color: #d32f2f;
        }
        
        .chart-table-pair {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .chart-container, .table-container {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .chart-container h2, .table-container h2 {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 1.2rem;
        }
        
        .table-scroll {
          overflow-x: auto;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        th, td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        
        th {
          background-color: #f8f9fa;
          font-weight: 600;
        }
        
        .progress-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .progress-bar {
          height: 8px;
          border-radius: 4px;
          min-width: 50px;
        }
        
        @media (max-width: 1000px) {
          .chart-table-pair {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 600px) {
          .summary-cards {
            grid-template-columns: 1fr;
          }
          
          th, td {
            padding: 8px 10px;
          }
        }
      `}</style>
    </div>
  );
}