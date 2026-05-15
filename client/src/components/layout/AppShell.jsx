import React from 'react';
import Sidebar from './Sidebar';

const AppShell = ({ children }) => {
  return (
    <div className="min-h-screen bg-(--bg-primary)">
      <Sidebar />
      <main className="px-4 md:px-6 py-6 md:py-10 pl-0 md:pl-(--sidebar-width) min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppShell;
