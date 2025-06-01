import React, { useState } from 'react';
import AddPhaseForm from './AddPhaseForm';
import AddExpenseForm from './AddExpenseForm';
import DashboardHome from './DashboardHome';
import { useNavigate } from 'react-router-dom';

export default function DashboardLayout({ projectId }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleBackToProjects = () => {
    navigate('/projects');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome projectId={projectId} />;
      case 'add-phase':
        return <AddPhaseForm projectId={projectId} />;
      case 'add-expense':
        return <AddExpenseForm projectId={projectId} />;
      default:
        return <div>Select an option</div>;
    }
  };

  const buttonStyle = (tab) => ({
    background: activeTab === tab ? '#A97B55' : 'transparent',
    color: activeTab === tab ? '#F4E9DC' : '#5E3F2F',
    border: `1.5px solid ${activeTab === tab ? '#A97B55' : 'transparent'}`,
    padding: '10px 15px',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    borderRadius: '6px',
    marginBottom: '12px',
    transition: 'all 0.3s ease',
    fontWeight: activeTab === tab ? '600' : '400',
  });

  const actionButtonStyle = {
    background: 'transparent',
    border: `1.5px solid #A97B55`,
    borderRadius: '8px',
    padding: '10px 15px',
    color: '#5E3F2F',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '600',
    width: '100%',
    marginBottom: '12px',
    textAlign: 'center'
  };

  const actionButtonHover = (e) => {
    e.currentTarget.style.backgroundColor = '#A97B55';
    e.currentTarget.style.color = '#F4E9DC';
    e.currentTarget.style.borderColor = '#A97B55';
  };

  const actionButtonLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.color = '#5E3F2F';
    e.currentTarget.style.borderColor = '#A97B55';
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        backgroundColor: '#F4E9DC',
        color: '#5E3F2F',
      }}
    >
      <aside
        style={{
          width: '220px',
          background: '#EEDDD0',
          color: '#5E3F2F',
          padding: '20px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '2px solid #CBB7A1',
        }}
      >
        <div>
          <h2 style={{ marginBottom: '20px' }}>Project Menu</h2>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={buttonStyle('dashboard')}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('add-phase')}
            style={buttonStyle('add-phase')}
          >
            Add Phase Amount
          </button>
          <button
            onClick={() => setActiveTab('add-expense')}
            style={buttonStyle('add-expense')}
          >
            Add Expenses
          </button>
        </div>

        <div>
          <button
            onClick={handleBackToProjects}
            style={actionButtonStyle}
            onMouseEnter={actionButtonHover}
            onMouseLeave={actionButtonLeave}
          >
            Back to Projects
          </button>
          <button
            onClick={handleLogout}
            style={actionButtonStyle}
            onMouseEnter={actionButtonHover}
            onMouseLeave={actionButtonLeave}
          >
            Logout
          </button>
        </div>
      </aside>

      <main
        style={{
          flex: 1,
          padding: '25px',
          backgroundColor: '#F4E9DC',
          overflowY: 'auto',
        }}
      >
        {renderContent()}
      </main>
    </div>
  );
}