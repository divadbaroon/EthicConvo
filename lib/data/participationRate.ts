export const discussionTasks: { [key: number]: DiscussionTask } = {
  1: {
    title: "Problem Understanding",
    subtitle: "What specific privacy vulnerabilities arise from facial recognition technology's ability to detect intimate traits with accuracy exceeding human capabilities?"
  },
  2: {
    title: "Technical Analysis",
    subtitle: "How does the widespread deployment of facial recognition systems in everyday settings (social media, public spaces, government surveillance) amplify these privacy risks?"
  },
  3: {
    title: "Proposed solutions",
    subtitle: "What policy changes or technological safeguards should be implemented to protect sensitive personal attributes from automated detection?"
  }
};

export interface DroppedItem {
  chartId: string;
  originalTitle: string;
  chartType: ChartType;
  timeSeriesData: TimeSeriesData[];
  currentTime: number; 
  position: {
    x: number;
    y: number;
  };
  isInCanvas?: boolean;  
}

export interface DiscussionTask {
  title: string;
  subtitle: string;
}

export interface DiscussionPointSettings {
  chartType: ChartType;
  visibleCharts: {[key: string]: boolean};
}


export type ChartType = 'line' | 'bar';

export interface ParticipationDataPoint {
  groupId: string;
  participants: number;
}

export interface DiscussionChartProps {
  title: string;
  timeSeriesData: TimeSeriesData[];
  id: string;
  isDropped: boolean;
  currentTime: number;
  chartType: ChartType;
  discussionPoint: number;
  style?: React.CSSProperties;
  groupAnswers: TopicData[];
  getParticipationData?: () => ParticipationDataPoint[];
  getEthicalPerspectives?: () => TopicData[];
  getPopularOpinions?: () => TopicData[];
  getKeywordTrends?: () => TopicData[];
  dialogFunc?: (text: string, point: number, numGroups: number) => void; 
  isFrozen?: boolean;
  onToggleFreeze?: (id: string) => void;
  isInCanvas?: boolean;
  onMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

// If you have a types file, you might also want to add these interfaces
export interface ParticipationDataPoint {
  groupId: string;
  participants: number;
}

export interface TopicData {
  topic: string;
  topicText: string;
  groups: GroupData[];
  counts: CountData[];
}

export interface GroupData {
  groupId: string;
  timestamp: number;
}

export interface CountData {
  timestamp: number;
  count: number;
}


export  interface ChartDataPoint {
  name: string
  time: number
  value?: number
  placeholder?: number
  answers?: Answer[]
  groups?: number
  participants?: number
}

export interface TopicData {
  topic: string
  topicText: string
  groups: {
    groupId: string
    "timestamp":number  
  }[]
  counts: {
    "timestamp":number  
    count: number
  }[]
}

export type GroupAnswersData = { name: string; groups: number; }[];

export interface GroupDataPoint {
  groupId: string;
  groupNumber: number; 
  value: number;       
  answers?: Answer[];  
  timestamp?: number  
}

export interface ChartConfig {
  id: string;
  title: string;
  dataKey: string;
  type: 'percentage' | 'count';
  visible: boolean;
}

export const AVAILABLE_CHARTS: ChartConfig[] = [
  {
    id: 'participationRate',
    title: 'Participation Rate',
    dataKey: 'participationRate',
    type: 'percentage',
    visible: true
  },
  {
    id: 'questionCoverage',
    title: 'Question Coverage',
    dataKey: 'questionCoverage',
    type: 'percentage',
    visible: true
  },
  {
    id: 'groupAnswers',
    title: 'Group Answers',
    dataKey: 'groupAnswers',
    type: 'count',
    visible: true
  },
  {
    id: 'ethicalPerspectives',
    title: 'Ethical Perspectives',
    dataKey: 'ethicalPerspectives',
    type: 'percentage',
    visible: false
  },
  {
    id: 'popularOpinions',
    title: 'Popular Opinions',
    dataKey: 'popularOpinions',
    type: 'percentage',
    visible: false
  },
  {
    id: 'keywordTrends',
    title: 'Keyword Trends',
    dataKey: 'keywordTrends',
    type: 'percentage',
    visible: false
  }
];

export interface Answer {
  text: string;
  count: number;
}

export interface TimeSeriesData {
  "timestamp":number;
  value: number;
  answers?: Answer[];  
  elapsedMinutes?: number;
}

  export interface MetricData {
    [metric: string]: TimeSeriesData[]
  }
  
  export interface DiscussionData {
    [discussionPoint: string]: MetricData
  }
  
  export const sampleGraphData: DiscussionData = {
    "discussionPoint1": {
      "participationRate": [
        { "timestamp": 0, "value": 0 },
        { "timestamp": 30, "value": 82 },
        { "timestamp": 60, "value": 78 },
        { "timestamp": 100, "value": 85 }
      ],
      "questionCoverage": [
        { "timestamp": 0, "value": 0 },
        { "timestamp": 60, "value": 70 },
        { "timestamp": 100, "value": 75 },
        { "timestamp": 200, "value": 80 }
      ],
      "classSentiment": [
        { "timestamp": 0, "value": 0 },
        { "timestamp": 60, "value": 75 },
        { "timestamp": 100, "value": 85 },
        { "timestamp": 200, "value": 78 }
      ],
      "ethicalPerspectives": [
        { "timestamp": 0, "value": 0 },
        { "timestamp": 30, "value": 45 },
        { "timestamp": 60, "value": 65 },
        { "timestamp": 90, "value": 75 },
        { "timestamp": 120, "value": 85 }
      ],
      "popularOpinions": [
        { "timestamp": 0, "value": 0 },
        { "timestamp": 30, "value": 30 },
        { "timestamp": 60, "value": 55 },
        { "timestamp": 90, "value": 70 },
        { "timestamp": 120, "value": 85 }
      ],
      "keywordTrends": [
        { "timestamp": 0, "value": 0 },
        { "timestamp": 30, "value": 40 },
        { "timestamp": 60, "value": 60 },
        { "timestamp": 90, "value": 80 },
        { "timestamp": 120, "value": 95 }
      ]
    },
    "discussionPoint2": {
      "participationRate": [
        { "timestamp": 0, "value": 0 },
        { "timestamp": 60, "value": 75 },
        { "timestamp": 100, "value": 85 }
      ],
      "questionCoverage": [
        { "timestamp": 0, "value": 0 },
        { "timestamp": 60, "value": 75 },
        { "timestamp": 100, "value": 80 },
        { "timestamp": 200, "value": 85 }
      ],
      "classSentiment": [
        { "timestamp": 0, "value": 0 },
        { "timestamp": 60, "value": 80 },
        { "timestamp": 100, "value": 70 },
        { "timestamp": 200, "value": 85 }
      ],
      "ethicalPerspectives": [
        { "timestamp": 0, "value": 0 },
        { "timestamp": 30, "value": 35 },
        { "timestamp": 60, "value": 55 },
        { "timestamp": 90, "value": 75 },
        { "timestamp": 120, "value": 90 }
      ],
      "popularOpinions": [
        { "timestamp": 0, "value": 0 },
        { "timestamp": 30, "value": 40 },
        { "timestamp": 60, "value": 65 },
        { "timestamp": 90, "value": 80 },
        { "timestamp": 120, "value": 95 }
      ],
      "keywordTrends": [
        { "timestamp": 0, "value": 0 },
        { "timestamp": 30, "value": 45 },
        { "timestamp": 60, "value": 70 },
        { "timestamp": 90, "value": 85 },
        { "timestamp": 120, "value": 95 }
      ]
    },
    "discussionPoint3": {
      "participationRate": [
        { "timestamp": 0, "value": 0 },
        { "timestamp": 60, "value": 75 },
        { "timestamp": 100, "value": 85 },
        { "timestamp": 200, "value": 80 }
      ],
      "questionCoverage": [
        { "timestamp": 0, "value": 0 },
        { "timestamp": 60, "value": 80 },
        { "timestamp": 100, "value": 70 },
        { "timestamp": 200, "value": 85 }
      ],
      "classSentiment": [
        { "timestamp": 0, "value": 0 },
        { "timestamp": 60, "value": 75 },
        { "timestamp": 100, "value": 85 },
        { "timestamp": 200, "value": 90 }
      ],
      "ethicalPerspectives": [
        { "timestamp": 0, "value": 0 },
        { "timestamp": 30, "value": 40 },
        { "timestamp": 60, "value": 60 },
        { "timestamp": 90, "value": 80 },
        { "timestamp": 120, "value": 95 }
      ],
      "popularOpinions": [
        { "timestamp": 0, "value": 0 },
        { "timestamp": 30, "value": 35 },
        { "timestamp": 60, "value": 55 },
        { "timestamp": 90, "value": 75 },
        { "timestamp": 120, "value": 90 }
      ],
      "keywordTrends": [
        { "timestamp": 0, "value": 0 },
        { "timestamp": 30, "value": 50 },
        { "timestamp": 60, "value": 70 },
        { "timestamp": 90, "value": 85 },
        { "timestamp": 120, "value": 95 }
      ]
    }
  };