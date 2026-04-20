"use client";

import { Wind, Thermometer } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SensorCard } from "@/components/dashboard/sensor-card";
import { StatusCard } from "@/components/dashboard/status-card";
import { YOLOStream } from "@/components/dashboard/yolo-stream";
import { GasChart } from "@/components/dashboard/gas-chart";
import { EventLogs } from "@/components/dashboard/event-logs";
import { useSensorData } from "@/hooks/use-sensor-data";

export default function DashboardPage() {
  const {
    sensorData,
    connectionStatus,
    logs,
    chartData,
    downloadPDF,
    clearDatabase,
  } = useSensorData();

  const isDanger = sensorData.buzzer;

  return (
    <DashboardLayout connectionStatus={connectionStatus}>
      <div className="space-y-6">
        {/* Sensor Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <StatusCard status={isDanger ? "danger" : "safe"} />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* YOLO Stream */}
          <YOLOStream />

          {/* Gas Chart */}
          <GasChart data={chartData} />
        </div>

        {/* Event Logs */}
        <EventLogs
          logs={logs}
          onDownloadPDF={downloadPDF}
          onClearDatabase={clearDatabase}
        />
      </div>
    </DashboardLayout>
  );
}
