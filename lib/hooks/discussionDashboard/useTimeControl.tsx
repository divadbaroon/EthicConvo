import { useState, useEffect, useCallback } from 'react';

export const useTimeControl = (duration: number) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      const updateInterval = 50;
      interval = setInterval(() => {
        setCurrentTime(prevTime => {
          const newTime = prevTime + (updateInterval / 1000);
          return newTime >= duration ? duration : newTime;
        });
      }, updateInterval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleTimeChange = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  return {
    currentTime,
    isPlaying,
    togglePlay,
    handleTimeChange,
    setCurrentTime
  };
};