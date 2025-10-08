import React, { ReactNode } from 'react';
import NavbarUser from '@/components/shared/Navbaruser/NavbarUser'
interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div>
        <NavbarUser/>
      <main style={{ padding: '1rem' }}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;