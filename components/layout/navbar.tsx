"use client";

import { Menu, Bell, Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MobileSidebarContent } from "./sidebar";

interface NavbarProps {
  connectionStatus: "online" | "offline" | "connecting";
}

export function Navbar({ connectionStatus }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <MobileSidebarContent />
        </SheetContent>
      </Sheet>

      {/* Page Title - Desktop */}
      <div className="hidden lg:block">
        <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Real-time monitoring system</p>
      </div>

      {/* Mobile Title */}
      <div className="lg:hidden flex-1">
        <h2 className="text-base font-semibold text-foreground">AI Smart Monitor</h2>
      </div>

      {/* Right Side */}
      <div className="ml-auto flex items-center gap-3">
        {/* Connection Status */}
        <Badge
          variant={
            connectionStatus === "online"
              ? "success"
              : connectionStatus === "offline"
              ? "destructive"
              : "secondary"
          }
          className="gap-1.5"
        >
          {connectionStatus === "online" ? (
            <Wifi className="h-3 w-3" />
          ) : connectionStatus === "offline" ? (
            <WifiOff className="h-3 w-3" />
          ) : (
            <div className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
          )}
          {connectionStatus === "online"
            ? "Online"
            : connectionStatus === "offline"
            ? "Offline"
            : "Connecting..."}
        </Badge>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  );
}
