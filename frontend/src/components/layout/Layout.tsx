//@ts-ignore
import Navbar from './Navbar'
import React from 'react'; 

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;