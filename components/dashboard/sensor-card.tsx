"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface SensorCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "danger" | "warning";
  isDanger?: boolean;
}

export function SensorCard({
  title,
  value,
  unit,
  icon: Icon,
  variant = "default",
  isDanger = false,
}: SensorCardProps) {
  const variantStyles = {
    default: "text-primary",
    success: "text-success",
    danger: "text-destructive",
    warning: "text-warning",
  };

  return (
    <Card
      className={cn(
        "transition-all duration-300",
        isDanger && "border-destructive bg-destructive/5 danger-pulse"
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span
                className={cn(
                  "text-3xl font-bold tracking-tight",
                  isDanger ? "text-destructive" : variantStyles[variant]
                )}
              >
                {value}
              </span>
              {unit && (
                <span className="text-sm text-muted-foreground">{unit}</span>
              )}
            </div>
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl",
              isDanger
                ? "bg-destructive/10 text-destructive"
                : variant === "success"
                ? "bg-success/10 text-success"
                : variant === "warning"
                ? "bg-warning/10 text-warning"
                : "bg-primary/10 text-primary"
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
