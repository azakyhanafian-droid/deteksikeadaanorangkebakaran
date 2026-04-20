"use client";

import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  connectionStatus: "online" | "offline" | "connecting";
}

export function DashboardLayout({ children, connectionStatus }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Main Content */}
      <div className="lg:pl-64">
        <Navbar connectionStatus={connectionStatus} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
