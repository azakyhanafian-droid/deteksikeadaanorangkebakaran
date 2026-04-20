"use client";

import { Wind, Thermometer, Gauge } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SensorCard } from "@/components/dashboard/sensor-card";
import { StatusCard } from "@/components/dashboard/status-card";
import { GasChart } from "@/components/dashboard/gas-chart";
import { useSensorData } from "@/hooks/use-sensor-data";

export default function SensorPage() {
  const { sensorData, connectionStatus, chartData } = useSensorData();
  const isDanger = sensorData.buzzer;

  return (
    <DashboardLayout connectionStatus={connectionStatus}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sensor Data</h1>
          <p className="text-muted-foreground">
            Real-time sensor readings from IoT devices
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SensorCard
            title="Air Quality"
            value={sensorData.gas}
            icon={Wind}
            variant="default"
            isDanger={isDanger}
          />
          <SensorCard
            title="Temperature"
            value={sensorData.temp.toFixed(1)}
            unit="°C"
            icon={Thermometer}
            variant="warning"
            isDanger={isDanger}
          />
          <SensorCard
            title="Gas Level"
            value={sensorData.gas > 500 ? "High" : sensorData.gas > 200 ? "Medium" : "Low"}
            icon={Gauge}
            variant={sensorData.gas > 500 ? "danger" : sensorData.gas > 200 ? "warning" : "success"}
            isDanger={isDanger}
          />
          <StatusCard status={isDanger ? "danger" : "safe"} />
        </div>

        <GasChart data={chartData} />
      </div>
    </DashboardLayout>
  );
}
