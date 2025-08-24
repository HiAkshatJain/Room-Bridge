import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isAuthenticated } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (!isAuthenticated) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header with sidebar toggle */}
        <div className="flex items-center h-14 px-4 border-b border-border bg-background/80">
          <button
            className="mr-4 p-2 rounded hover:bg-muted focus:outline-none focus:ring"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          {/* You can add a title or other header content here */}
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
};