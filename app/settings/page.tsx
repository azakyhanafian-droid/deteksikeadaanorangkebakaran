"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, Server, Wifi, Database, Video } from "lucide-react";
import { CONFIG } from "@/lib/config";
import { useSensorData } from "@/hooks/use-sensor-data";

export default function SettingsPage() {
  const { connectionStatus } = useSensorData();

  const endpoints = [
    { name: "ESP32 Sensor", url: CONFIG.IP_ESP, icon: Wifi },
    { name: "Python Server", url: CONFIG.IP_PYTHON, icon: Server },
    { name: "Database Logs", url: CONFIG.IP_LOG, icon: Database },
    { name: "Video Stream", url: CONFIG.VIDEO_STREAM, icon: Video },
  ];

  return (
    <DashboardLayout connectionStatus={connectionStatus}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">System configuration and endpoints</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                API Endpoints
              </CardTitle>
              <CardDescription>
                Configure your IoT and AI server connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {endpoints.map((endpoint, index) => (
                <div key={endpoint.name}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                        <endpoint.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{endpoint.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {endpoint.url}
                        </p>
                      </div>
                    </div>
                  </div>
                  {index < endpoints.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                System Status
              </CardTitle>
              <CardDescription>
                Current system configuration and status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Connection</span>
                <Badge
                  variant={connectionStatus === "online" ? "success" : "destructive"}
                >
                  {connectionStatus}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Update Interval</span>
                <span className="text-sm font-medium">{CONFIG.UPDATE_INTERVAL}ms</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Log Interval</span>
                <span className="text-sm font-medium">{CONFIG.LOG_INTERVAL}ms</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">AI Model</span>
                <Badge variant="secondary">YOLOv8</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline">Refresh Connections</Button>
              <Button variant="outline">Test ESP32</Button>
              <Button variant="outline">Test Python Server</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
