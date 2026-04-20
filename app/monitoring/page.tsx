"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { YOLOStream } from "@/components/dashboard/yolo-stream";
import { GasChart } from "@/components/dashboard/gas-chart";
import { useSensorData } from "@/hooks/use-sensor-data";

export default function MonitoringPage() {
  const { connectionStatus, chartData } = useSensorData();

  return (
    <DashboardLayout connectionStatus={connectionStatus}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Monitoring</h1>
          <p className="text-muted-foreground">Real-time system monitoring</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <YOLOStream />
          <GasChart data={chartData} />
        </div>
      </div>
    </DashboardLayout>
  );
}
