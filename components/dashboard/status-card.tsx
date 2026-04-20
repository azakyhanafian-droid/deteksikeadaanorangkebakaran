"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert } from "lucide-react";

interface StatusCardProps {
  status: "safe" | "danger";
}

export function StatusCard({ status }: StatusCardProps) {
  const isSafe = status === "safe";

  return (
    <Card
      className={cn(
        "transition-all duration-300",
        !isSafe && "border-destructive bg-destructive/5 danger-pulse"
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              System Status
            </p>
            <div className="mt-2">
              <Badge
                variant={isSafe ? "success" : "destructive"}
                className="text-base px-3 py-1"
              >
                {isSafe ? "SAFE" : "DANGER!"}
              </Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {isSafe
                ? "All sensors normal"
                : "Fire or hazard detected!"}
            </p>
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl",
              isSafe
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {isSafe ? (
              <ShieldCheck className="h-6 w-6" />
            ) : (
              <ShieldAlert className="h-6 w-6" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
