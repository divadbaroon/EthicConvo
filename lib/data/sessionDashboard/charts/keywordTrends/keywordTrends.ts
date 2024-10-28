import { TimeSeriesData, TopicData } from '@/types/graphTypes';

// Question 1: Problem Understanding
export const keywordTrendsQ1: TopicData[] = [
  {
    topic: "Q1 Keyword 1",
    topicText: "Copyright Infringement",
    groups: [
      { groupId: "group 1", timestamp: 10 },
      { groupId: "group 4", timestamp: 25 },
      { groupId: "group 8", timestamp: 40 }
    ],
    counts: [
      { timestamp: 10, count: 1 },
      { timestamp: 25, count: 2 },
      { timestamp: 40, count: 3 }
    ]
  },
  {
    topic: "Q1 Keyword 2",
    topicText: "Content Rights",
    groups: [
      { groupId: "group 13", timestamp: 55 },
      { groupId: "group 16", timestamp: 70 },
      { groupId: "group 19", timestamp: 85 }
    ],
    counts: [
      { timestamp: 55, count: 1 },
      { timestamp: 70, count: 2 },
      { timestamp: 85, count: 3 }
    ]
  },
  {
    topic: "Q1 Keyword 3",
    topicText: "Unauthorized Use",
    groups: [
      { groupId: "group 5", timestamp: 100 },
      { groupId: "group 11", timestamp: 115 }
    ],
    counts: [
      { timestamp: 100, count: 1 },
      { timestamp: 115, count: 2 }
    ]
  },
  {
    topic: "Q1 Keyword 4",
    topicText: "Creative Ownership",
    groups: [
      { groupId: "group 25", timestamp: 130 },
      { groupId: "group 26", timestamp: 145 },
      { groupId: "group 27", timestamp: 160 }
    ],
    counts: [
      { timestamp: 130, count: 1 },
      { timestamp: 145, count: 2 },
      { timestamp: 160, count: 3 }
    ]
  },
  {
    topic: "Q1 Keyword 5",
    topicText: "Intellectual Property",
    groups: [
      { groupId: "group 28", timestamp: 175 },
      { groupId: "group 29", timestamp: 190 },
      { groupId: "group 30", timestamp: 205 }
    ],
    counts: [
      { timestamp: 175, count: 1 },
      { timestamp: 190, count: 2 },
      { timestamp: 205, count: 3 }
    ]
  }
];

// Question 2: Technical Analysis
export const keywordTrendsQ2: TopicData[] = [
  {
    topic: "Q2 Keyword 1",
    topicText: "Training Data",
    groups: [
      { groupId: "group 3", timestamp: 220 },
      { groupId: "group 7", timestamp: 235 },
      { groupId: "group 10", timestamp: 250 },
      { groupId: "group 15", timestamp: 265 }
    ],
    counts: [
      { timestamp: 220, count: 1 },
      { timestamp: 235, count: 2 },
      { timestamp: 250, count: 3 },
      { timestamp: 265, count: 4 }
    ]
  },
  {
    topic: "Q2 Keyword 2",
    topicText: "Data Scraping",
    groups: [
      { groupId: "group 2", timestamp: 280 },
      { groupId: "group 6", timestamp: 295 },
      { groupId: "group 9", timestamp: 310 }
    ],
    counts: [
      { timestamp: 280, count: 1 },
      { timestamp: 295, count: 2 },
      { timestamp: 310, count: 3 }
    ]
  },
  {
    topic: "Q2 Keyword 3",
    topicText: "Model Architecture",
    groups: [
      { groupId: "group 12", timestamp: 325 }
    ],
    counts: [
      { timestamp: 325, count: 1 }
    ]
  },
  {
    topic: "Q2 Keyword 4",
    topicText: "Data Attribution",
    groups: [
      { groupId: "group 31", timestamp: 340 },
      { groupId: "group 32", timestamp: 355 },
      { groupId: "group 33", timestamp: 370 }
    ],
    counts: [
      { timestamp: 340, count: 1 },
      { timestamp: 355, count: 2 },
      { timestamp: 370, count: 3 }
    ]
  },
  {
    topic: "Q2 Keyword 5",
    topicText: "Content Filtering",
    groups: [
      { groupId: "group 34", timestamp: 385 },
      { groupId: "group 35", timestamp: 400 },
      { groupId: "group 36", timestamp: 415 }
    ],
    counts: [
      { timestamp: 385, count: 1 },
      { timestamp: 400, count: 2 },
      { timestamp: 415, count: 3 }
    ]
  }
];

// Question 3: Solution Development
export const keywordTrendsQ3: TopicData[] = [
  {
    topic: "Q3 Keyword 1",
    topicText: "Fair Use",
    groups: [
      { groupId: "group 2", timestamp: 430 },
      { groupId: "group 6", timestamp: 445 },
      { groupId: "group 9", timestamp: 460 }
    ],
    counts: [
      { timestamp: 430, count: 1 },
      { timestamp: 445, count: 2 },
      { timestamp: 460, count: 3 }
    ]
  },
  {
    topic: "Q3 Keyword 2",
    topicText: "Compensation",
    groups: [
      { groupId: "group 11", timestamp: 475 },
      { groupId: "group 14", timestamp: 490 }
    ],
    counts: [
      { timestamp: 475, count: 1 },
      { timestamp: 490, count: 2 }
    ]
  },
  {
    topic: "Q3 Keyword 3",
    topicText: "Licensing",
    groups: [
      { groupId: "group 13", timestamp: 505 },
      { groupId: "group 16", timestamp: 520 },
      { groupId: "group 22", timestamp: 535 }
    ],
    counts: [
      { timestamp: 505, count: 1 },
      { timestamp: 520, count: 2 },
      { timestamp: 535, count: 3 }
    ]
  },
  {
    topic: "Q3 Keyword 4",
    topicText: "Legal Framework",
    groups: [
      { groupId: "group 19", timestamp: 550 },
      { groupId: "group 22", timestamp: 565 }
    ],
    counts: [
      { timestamp: 550, count: 1 },
      { timestamp: 565, count: 2 }
    ]
  },
  {
    topic: "Q3 Keyword 5",
    topicText: "Compliance Standards",
    groups: [
      { groupId: "group 37", timestamp: 580 },
      { groupId: "group 38", timestamp: 595 },
      { groupId: "group 39", timestamp: 610 }
    ],
    counts: [
      { timestamp: 580, count: 1 },
      { timestamp: 595, count: 2 },
      { timestamp: 610, count: 3 }
    ]
  }
];

// Combined export for all keyword trends
export const keywordTrendsData = {
  1: keywordTrendsQ1,
  2: keywordTrendsQ2,
  3: keywordTrendsQ3
};

export const KEYWORD_TRENDS_CONFIG = {
  id: 'keywordTrends',
  title: 'Keyword Trends',
  dataKey: 'keywordTrends',
  type: 'percentage' as const,
  visible: false,
  description: {
    1: 'Key terms in copyright problem discussion',
    2: 'Technical terminology trends',
    3: 'Solution-related terminology'
  }
};
