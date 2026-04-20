"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Database, FileDown, Trash2, AlertTriangle, Flame, Thermometer, Users } from "lucide-react";

export interface LogEntry {
  status: string;
  gas: number;
  suhu: number;
  orang: number;
  waktu: string;
}

interface EventLogsProps {
  logs: LogEntry[];
  onDownloadPDF: () => void;
  onClearDatabase: () => void;
}

export function EventLogs({ logs, onDownloadPDF, onClearDatabase }: EventLogsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Database className="h-5 w-5 text-primary" />
            Event Logs
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onDownloadPDF}
              className="gap-1.5"
            >
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">PDF</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onClearDatabase}
              className="gap-1.5"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Clear Database</span>
              <span className="sm:hidden">Clear</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Database className="h-10 w-10 mb-2 opacity-50" />
              <p className="text-sm">No data available</p>
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index}>
                <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="destructive" className="text-xs">
                        {log.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {log.waktu}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Flame className="h-3.5 w-3.5" />
                        Gas: <span className="font-medium text-foreground">{log.gas}</span>
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Thermometer className="h-3.5 w-3.5" />
                        Temp: <span className="font-medium text-foreground">{log.suhu}°C</span>
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        People: <span className="font-medium text-foreground">{log.orang}</span>
                      </span>
                    </div>
                  </div>
                </div>
                {index < logs.length - 1 && <Separator className="my-2" />}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
