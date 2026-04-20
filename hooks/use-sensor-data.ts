"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CONFIG } from "@/lib/config";
import type { LogEntry } from "@/components/dashboard/event-logs";

interface SensorData {
  gas: number;
  temp: number;
  buzzer: boolean;
}

interface UseSensorDataReturn {
  sensorData: SensorData;
  connectionStatus: "online" | "offline" | "connecting";
  logs: LogEntry[];
  chartData: Array<{ time: string; value: number }>;
  downloadPDF: () => Promise<void>;
  clearDatabase: () => Promise<void>;
}

let lastBuzzerStatus: string | null = null;

export function useSensorData(): UseSensorDataReturn {
  const [sensorData, setSensorData] = useState<SensorData>({
    gas: 0,
    temp: 0,
    buzzer: false,
  });
  const [connectionStatus, setConnectionStatus] = useState<
    "online" | "offline" | "connecting"
  >("connecting");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [chartData, setChartData] = useState<Array<{ time: string; value: number }>>([]);
  
  const chartDataRef = useRef(chartData);
  chartDataRef.current = chartData;

  // Fetch sensor data from ESP32
  const fetchSensorData = useCallback(async () => {
    try {
      const response = await fetch(CONFIG.IP_ESP);
      const data = await response.json();

      setSensorData({
        gas: data.gas,
        temp: data.temp,
        buzzer: data.buzzer === true || data.buzzer === "true",
      });

      setConnectionStatus("online");

      // Update chart data
      const now = new Date().toLocaleTimeString();
      setChartData((prev) => {
        const newData = [...prev, { time: now, value: data.gas }];
        if (newData.length > 15) newData.shift();
        return newData;
      });

      // Update Python status
      const isDanger = data.buzzer === true || data.buzzer === "true";
      const statusValue = isDanger ? "BAHAYA" : "AMAN";
      
      if (statusValue !== lastBuzzerStatus) {
        try {
          await fetch(`${CONFIG.IP_PYTHON}?value=${statusValue}`);
          lastBuzzerStatus = statusValue;
        } catch (err) {
          console.error("Failed to send status to AI:", err);
        }
      }
    } catch (error) {
      console.error("ESP32 Error:", error);
      setConnectionStatus("offline");
    }
  }, []);

  // Fetch logs from database
  const fetchLogs = useCallback(async () => {
    try {
      const response = await fetch(CONFIG.IP_LOG);
      const result = await response.json();
      setLogs(result.data || []);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    }
  }, []);

  // Download PDF
  const downloadPDF = useCallback(async () => {
    try {
      const response = await fetch(CONFIG.IP_PDF);
      if (!response.ok) throw new Error("Failed to download PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "laporan_kebakaran.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to download PDF. Make sure the Python server is running.");
      console.error(error);
    }
  }, []);

  // Clear database
  const clearDatabase = useCallback(async () => {
    const confirmClear = window.confirm("Are you sure you want to delete all data?");
    if (!confirmClear) return;

    try {
      await fetch(CONFIG.IP_CLEAR_DB);
      alert("Database cleared successfully!");
      fetchLogs();
    } catch (error) {
      alert("Failed to clear database");
      console.error(error);
    }
  }, [fetchLogs]);

  // Set up intervals
  useEffect(() => {
    fetchSensorData();
    fetchLogs();

    const sensorInterval = setInterval(fetchSensorData, CONFIG.UPDATE_INTERVAL);
    const logInterval = setInterval(fetchLogs, CONFIG.LOG_INTERVAL);

    return () => {
      clearInterval(sensorInterval);
      clearInterval(logInterval);
    };
  }, [fetchSensorData, fetchLogs]);

  return {
    sensorData,
    connectionStatus,
    logs,
    chartData,
    downloadPDF,
    clearDatabase,
  };
}
