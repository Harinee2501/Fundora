import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';

export default function ProjectDashboard() {
  const { projectId } = useParams();

  return (
    <div>
      <DashboardLayout projectId={projectId} />
    </div>
  );
}
