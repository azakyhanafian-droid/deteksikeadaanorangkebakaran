"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { YOLOStream } from "@/components/dashboard/yolo-stream";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScanEye, Cpu, Zap, Target } from "lucide-react";
import { useSensorData } from "@/hooks/use-sensor-data";

export default function DetectionPage() {
  const { connectionStatus, sensorData } = useSensorData();

  return (
    <DashboardLayout connectionStatus={connectionStatus}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">YOLO Detection</h1>
          <p className="text-muted-foreground">
            AI-powered object detection using YOLOv8
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <YOLOStream />
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ScanEye className="h-5 w-5 text-primary" />
                  Detection Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Model</span>
                  <Badge variant="secondary">YOLOv8</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={sensorData.buzzer ? "destructive" : "success"}>
                    {sensorData.buzzer ? "Alert" : "Normal"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Cpu className="h-5 w-5 text-primary" />
                  System Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Real-time Processing</p>
                    <p className="text-xs text-muted-foreground">
                      Live video stream analysis
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                    <Target className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Person Detection</p>
                    <p className="text-xs text-muted-foreground">
                      Detecting people in fire zones
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
