"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EventLogs } from "@/components/dashboard/event-logs";
import { useSensorData } from "@/hooks/use-sensor-data";

export default function HistoryPage() {
  const { connectionStatus, logs, downloadPDF, clearDatabase } = useSensorData();

  return (
    <DashboardLayout connectionStatus={connectionStatus}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">History / Logs</h1>
          <p className="text-muted-foreground">
            View all recorded fire detection events
          </p>
        </div>

        <EventLogs
          logs={logs}
          onDownloadPDF={downloadPDF}
          onClearDatabase={clearDatabase}
        />
      </div>
    </DashboardLayout>
  );
}
