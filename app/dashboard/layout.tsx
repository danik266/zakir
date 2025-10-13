"use client";

import React, { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import NavbarUser from "@/components/shared/Navbaruser/NavbarUser";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <NavbarUser />
        <main className="p-4">{children}</main>
      </div>
    </ThemeProvider>
  );
};

export default MainLayout;
