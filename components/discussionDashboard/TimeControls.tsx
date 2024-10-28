import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, SkipForward, SkipBack, Pause } from "lucide-react";

interface TimeControlsProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onTimeChange: (time: number) => void;
  onPlayPause: () => void;
}

export const TimeControls: React.FC<TimeControlsProps> = ({
  currentTime,
  duration,
  isPlaying,
  onTimeChange,
  onPlayPause,
}) => {
  // Track whether the 600-second threshold has been reached
  const [hasReachedThreshold, setHasReachedThreshold] = useState(false);

  // Check if threshold is reached whenever currentTime changes
  useEffect(() => {
    if (currentTime >= 600 && !hasReachedThreshold) {
      setHasReachedThreshold(true);
    }
  }, [currentTime, hasReachedThreshold]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
      <div className="max-w-3xl mx-auto flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={onPlayPause}>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <div className="flex-grow flex items-center space-x-4">
          <span className="text-sm tabular-nums">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={(value) => onTimeChange(value[0])}
            className="flex-grow"
            disabled={false}
          />
          <span className="text-sm tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};