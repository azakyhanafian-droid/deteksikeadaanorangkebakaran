"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Radio } from "lucide-react";
import { CONFIG } from "@/lib/config";

export function YOLOStream() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Video className="h-5 w-5 text-primary" />
            LIVE AI Vision - YOLOv8
          </CardTitle>
          <Badge variant="destructive" className="gap-1.5 animate-pulse">
            <Radio className="h-3 w-3" />
            LIVE
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CONFIG.VIDEO_STREAM}
            alt="YOLO Detection Stream"
            className="h-full w-full object-cover"
          />
          {/* Overlay for when stream is loading */}
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 opacity-0 transition-opacity">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
              <p className="mt-2 text-sm text-muted-foreground">
                Connecting to stream...
              </p>
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground text-center">
          Real-time object detection powered by YOLOv8
        </p>
      </CardContent>
    </Card>
  );
}
