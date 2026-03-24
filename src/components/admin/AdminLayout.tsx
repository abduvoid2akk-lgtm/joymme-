import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <AdminSidebar />
      <main className="flex-1 p-12 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
