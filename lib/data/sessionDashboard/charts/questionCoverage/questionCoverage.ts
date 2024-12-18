import { TimeSeriesData } from '@/types'

// Function to generate faster-rising timestamps up to 610
const generateFasterRisingData = (values: number[], maxTimestamp: number): TimeSeriesData[] => {
 const length = values.length;
 const fasterRiseFactor = 0.6; // Factor for faster initial rise (adjustable)
 const initialInterval = (maxTimestamp * fasterRiseFactor) / (length - 1);
 const remainingInterval = (maxTimestamp * (1 - fasterRiseFactor)) / (length - 1);

 return values.map((value, index) => {
   const timestamp = index < length / 2
     ? Math.round(index * initialInterval) // Faster rise in the first half
     : Math.round((length / 2 - 1) * initialInterval + (index - length / 2 + 1) * remainingInterval);
   return { timestamp, value };
 });
};

// Question 1: Problem Understanding - Fast early rise
export const questionCoverageQ1 = generateFasterRisingData(
 [0, 25, 45, 65, 80, 90, 85, 80],
 610
);

// Question 2: Technical Analysis - Steady middle rise
export const questionCoverageQ2 = generateFasterRisingData(
 [55, 35, 45, 60, 75, 85, 80, 75],
 610
);

// Question 3: Solution Development - Later rise
export const questionCoverageQ3 = generateFasterRisingData(
 [20, 30, 40, 50, 65, 75, 85, 80],
 610
);

// Combined export with more granular data points
export const questionCoverageData = {
 1: questionCoverageQ1,
 2: questionCoverageQ2,
 3: questionCoverageQ3
};

// Alternative format if needed for backwards compatibility
export const questionCoverageDataLegacy = {
 "discussionPoint1": questionCoverageQ1,
 "discussionPoint2": questionCoverageQ2,
 "discussionPoint3": questionCoverageQ3
};

export const QUESTION_COVERAGE_CONFIG = {
 id: 'questionCoverage',
 title: 'Discussion Coverage: Facial Recognition Privacy',
 dataKey: 'questionCoverage',
 type: 'percentage' as const,
 visible: true,
 yAxisLabel: 'Coverage %',
 xAxisLabel: 'Time (minutes)',
 description: {
   1: 'Coverage of facial recognition privacy vulnerabilities',
   2: 'Coverage of AI detection capabilities analysis',
   3: 'Coverage of privacy protection solutions'
 }
};