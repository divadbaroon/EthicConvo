import { TimeSeriesData } from '@/types';

// Question 1: Problem Understanding
export const participationRateQ1: TimeSeriesData[] = [
  { "timestamp": 0, "value": 0 },
  { "timestamp": 5, "value": 10 },
  { "timestamp": 10, "value": 25 },
  { "timestamp": 15, "value": 40 },
  { "timestamp": 20, "value": 55 },
  { "timestamp": 25, "value": 70 },
  { "timestamp": 30, "value": 82 },
  { "timestamp": 35, "value": 81 },
  { "timestamp": 40, "value": 80 },
  { "timestamp": 45, "value": 80 },
  { "timestamp": 50, "value": 79 },
  { "timestamp": 55, "value": 78 },
  { "timestamp": 60, "value": 78 },
  { "timestamp": 70, "value": 79 },
  { "timestamp": 75, "value": 80 },
  { "timestamp": 85, "value": 81 },
  { "timestamp": 90, "value": 82 },
  { "timestamp": 100, "value": 83 },
  { "timestamp": 120, "value": 84 },
  { "timestamp": 150, "value": 85 },
  { "timestamp": 180, "value": 85 },
  { "timestamp": 210, "value": 84 },
  { "timestamp": 240, "value": 83 },
  { "timestamp": 270, "value": 82 },
  { "timestamp": 300, "value": 81 },
  { "timestamp": 330, "value": 81 },
  { "timestamp": 360, "value": 80 },
  { "timestamp": 400, "value": 80 },
  { "timestamp": 450, "value": 79 },
  { "timestamp": 500, "value": 78 },
  { "timestamp": 550, "value": 77 },
  { "timestamp": 610, "value": 76 }
];

// Question 2: Technical Analysis
export const participationRateQ2: TimeSeriesData[] = [
  { "timestamp": 0, "value": 0 },
  { "timestamp": 5, "value": 8 },
  { "timestamp": 10, "value": 18 },
  { "timestamp": 15, "value": 35 },
  { "timestamp": 20, "value": 48 },
  { "timestamp": 25, "value": 58 },
  { "timestamp": 30, "value": 65 },
  { "timestamp": 40, "value": 70 },
  { "timestamp": 50, "value": 72 },
  { "timestamp": 60, "value": 74 },
  { "timestamp": 75, "value": 75 },
  { "timestamp": 90, "value": 77 },
  { "timestamp": 120, "value": 78 },
  { "timestamp": 150, "value": 80 },
  { "timestamp": 180, "value": 81 },
  { "timestamp": 210, "value": 82 },
  { "timestamp": 240, "value": 83 },
  { "timestamp": 270, "value": 83 },
  { "timestamp": 300, "value": 84 },
  { "timestamp": 330, "value": 84 },
  { "timestamp": 360, "value": 85 },
  { "timestamp": 400, "value": 84 },
  { "timestamp": 450, "value": 83 },
  { "timestamp": 500, "value": 82 },
  { "timestamp": 550, "value": 81 },
  { "timestamp": 610, "value": 80 }
];

// Question 3: Solution Development
export const participationRateQ3: TimeSeriesData[] = [
  { "timestamp": 0, "value": 0 },
  { "timestamp": 10, "value": 15 },
  { "timestamp": 20, "value": 30 },
  { "timestamp": 30, "value": 55 },
  { "timestamp": 50, "value": 65 },
  { "timestamp": 75, "value": 70 },
  { "timestamp": 100, "value": 75 },
  { "timestamp": 130, "value": 78 },
  { "timestamp": 160, "value": 80 },
  { "timestamp": 200, "value": 82 },
  { "timestamp": 240, "value": 83 },
  { "timestamp": 270, "value": 84 },
  { "timestamp": 300, "value": 84 },
  { "timestamp": 350, "value": 85 },
  { "timestamp": 400, "value": 85 },
  { "timestamp": 450, "value": 84 },
  { "timestamp": 500, "value": 83 },
  { "timestamp": 550, "value": 82 },
  { "timestamp": 600, "value": 81 },
  { "timestamp": 610, "value": 80 }
];

// Combined export with more granular data points
export const participationRateData = {
  1: participationRateQ1,
  2: participationRateQ2,
  3: participationRateQ3
};

// Alternative format if needed for backwards compatibility
export const participationRateDataLegacy = {
  "discussionPoint1": participationRateQ1,
  "discussionPoint2": participationRateQ2,
  "discussionPoint3": participationRateQ3
};

export const PARTICIPATION_RATE_CONFIG = {
  id: 'participationRate',
  title: 'Participation Rate',
  dataKey: 'participationRate',
  type: 'percentage' as const,
  visible: true,
  yAxisLabel: 'Participation %',
  xAxisLabel: 'Time (minutes)'
};
