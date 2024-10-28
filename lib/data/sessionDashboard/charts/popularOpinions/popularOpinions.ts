import { TimeSeriesData, TopicData } from '@/types';

// Define popular opinions data for each question with progressing counts
export const popularOpinionsQ1: TopicData[] = [
  {
    topic: "Q1 Answer 1",
    topicText: "AI can detect personal traits like orientation and politics with high accuracy",
    groups: [
      { groupId: "group 2", timestamp: 10 },
      { groupId: "group 3", timestamp: 30 },
      { groupId: "group 3", timestamp: 30 },
      { groupId: "group 18", timestamp: 55 },
      { groupId: "group 20", timestamp: 300 },
      { groupId: "group 25", timestamp: 400 },
      { groupId: "group 32", timestamp: 500 },
      { groupId: "group 36", timestamp: 599 }
    ],
    counts: [
      { timestamp: 10, count: 1 },
      { timestamp: 100, count: 3 },
      { timestamp: 200, count: 5 },
      { timestamp: 300, count: 8 },
      { timestamp: 400, count: 10 },
      { timestamp: 500, count: 12 },
      { timestamp: 599, count: 14 }
    ]
  },
  {
    topic: "Q1 Answer 2", 
    topicText: "Marginalized groups could face discrimination based on AI facial analysis",
    groups: [
      { groupId: "group 5", timestamp: 15 },
      { groupId: "group 10", timestamp: 30 },
      { groupId: "group 10", timestamp: 30 },
      { groupId: "group 12", timestamp: 240 },
      { groupId: "group 26", timestamp: 360 },
      { groupId: "group 29", timestamp: 480 },
      { groupId: "group 34", timestamp: 550 },
      { groupId: "group 39", timestamp: 599 }
    ],
    counts: [
      { timestamp: 15, count: 1 },
      { timestamp: 120, count: 3 },
      { timestamp: 240, count: 6 },
      { timestamp: 360, count: 8 },
      { timestamp: 480, count: 10 },
      { timestamp: 550, count: 13 },
      { timestamp: 599, count: 15 }
    ]
  },
  {
    topic: "Q1 Answer 3",
    topicText: "People's social media photos could reveal traits they want to keep private",
    groups: [
      { groupId: "group 21", timestamp: 20 },
      { groupId: "group 27", timestamp: 45 },
      { groupId: "group 27", timestamp: 45 },
      { groupId: "group 33", timestamp: 250 },
      { groupId: "group 38", timestamp: 370 },
      { groupId: "group 40", timestamp: 490 },
      { groupId: "group 42", timestamp: 550 },
      { groupId: "group 44", timestamp: 599 }
    ],
    counts: [
      { timestamp: 20, count: 1 },
      { timestamp: 130, count: 2 },
      { timestamp: 250, count: 4 },
      { timestamp: 370, count: 6 },
      { timestamp: 490, count: 8 },
      { timestamp: 550, count: 10 },
      { timestamp: 599, count: 11 }
    ]
  },
  {
    topic: "Q1 Answer 4",
    topicText: "Companies could secretly screen employees or customers using facial analysis",
    groups: [
      { groupId: "group 25", timestamp: 25 },
      { groupId: "group 26", timestamp: 55 },
      { groupId: "group 30", timestamp: 280 },
      { groupId: "group 35", timestamp: 400 },
    ],
    counts: [
      { timestamp: 25, count: 1 },
      { timestamp: 140, count: 3 },
      { timestamp: 280, count: 5 },
      { timestamp: 400, count: 7 },
      { timestamp: 500, count: 9 },
      { timestamp: 580, count: 11 },
      { timestamp: 599, count: 12 }
    ]
  },
  {
    topic: "Q1 Answer 5",
    topicText: "Government surveillance could profile citizens based on predicted characteristics",
    groups: [
      { groupId: "group 28", timestamp: 30 },
      { groupId: "group 29", timestamp: 50 },
      { groupId: "group 31", timestamp: 70 },
      { groupId: "group 37", timestamp: 410 },
      { groupId: "group 40", timestamp: 510 },
      { groupId: "group 46", timestamp: 590 },
      { groupId: "group 50", timestamp: 599 }
    ],
    counts: [
      { timestamp: 30, count: 1 },
      { timestamp: 150, count: 3 },
      { timestamp: 290, count: 6 },
      { timestamp: 410, count: 8 },
      { timestamp: 510, count: 10 },
      { timestamp: 590, count: 12 },
      { timestamp: 599, count: 14 }
    ]
  }
];
 
export const popularOpinionsQ2: TopicData[] = [
  {
    topic: "Q2 Answer 1",
    topicText: "Face recognition is being used everywhere without people knowing",
    groups: [
      { groupId: "group 1", timestamp: 35 },
      { groupId: "group 14", timestamp: 140 },
      { groupId: "group 22", timestamp: 270 },
      { groupId: "group 28", timestamp: 380 },
      { groupId: "group 33", timestamp: 480 },
      { groupId: "group 36", timestamp: 560 },
      { groupId: "group 43", timestamp: 599 }
    ],
    counts: [
      { timestamp: 35, count: 1 },
      { timestamp: 140, count: 3 },
      { timestamp: 270, count: 6 },
      { timestamp: 380, count: 8 },
      { timestamp: 480, count: 9 },
      { timestamp: 560, count: 11 },
      { timestamp: 599, count: 12 }
    ]
  },
  {
    topic: "Q2 Answer 2",
    topicText: "Social media makes it easy to collect massive amounts of face data",
    groups: [
      { groupId: "group 13", timestamp: 25 },
      { groupId: "group 19", timestamp: 150 },
      { groupId: "group 27", timestamp: 285 },
      { groupId: "group 31", timestamp: 400 },
      { groupId: "group 35", timestamp: 510 },
      { groupId: "group 38", timestamp: 580 },
      { groupId: "group 46", timestamp: 599 }
    ],
    counts: [
      { timestamp: 25, count: 1 },
      { timestamp: 150, count: 3 },
      { timestamp: 285, count: 5 },
      { timestamp: 400, count: 7 },
      { timestamp: 510, count: 9 },
      { timestamp: 580, count: 10 },
      { timestamp: 599, count: 12 }
    ]
  },
  {
    topic: "Q2 Answer 3",
    topicText: "AI systems can analyze faces faster and more accurately than humans",
    groups: [
      { groupId: "group 24", timestamp: 70 },
      { groupId: "group 26", timestamp: 170 },
      { groupId: "group 32", timestamp: 290 },
      { groupId: "group 37", timestamp: 390 },
      { groupId: "group 40", timestamp: 520 },
      { groupId: "group 44", timestamp: 570 },
      { groupId: "group 47", timestamp: 599 }
    ],
    counts: [
      { timestamp: 70, count: 1 },
      { timestamp: 170, count: 3 },
      { timestamp: 290, count: 5 },
      { timestamp: 390, count: 6 },
      { timestamp: 520, count: 8 },
      { timestamp: 570, count: 9 },
      { timestamp: 599, count: 11 }
    ]
  },
  {
    topic: "Q2 Answer 4",
    topicText: "No way to opt out of having your face analyzed in public spaces",
    groups: [
      { groupId: "group 31", timestamp: 30 },
      { groupId: "group 32", timestamp: 150 },
      { groupId: "group 33", timestamp: 270 },
      { groupId: "group 35", timestamp: 360 },
      { groupId: "group 38", timestamp: 480 },
      { groupId: "group 41", timestamp: 550 },
      { groupId: "group 45", timestamp: 599 }
    ],
    counts: [
      { timestamp: 30, count: 1 },
      { timestamp: 150, count: 3 },
      { timestamp: 270, count: 5 },
      { timestamp: 360, count: 7 },
      { timestamp: 480, count: 9 },
      { timestamp: 550, count: 10 },
      { timestamp: 599, count: 12 }
    ]
  },
  {
    topic: "Q2 Answer 5",
    topicText: "Current systems don't need permission to analyze personal traits",
    groups: [
      { groupId: "group 34", timestamp: 35 },
      { groupId: "group 35", timestamp: 160 },
      { groupId: "group 36", timestamp: 290 },
      { groupId: "group 37", timestamp: 410 },
      { groupId: "group 39", timestamp: 490 },
      { groupId: "group 44", timestamp: 580 },
      { groupId: "group 48", timestamp: 599 }
    ],
    counts: [
      { timestamp: 35, count: 1 },
      { timestamp: 160, count: 3 },
      { timestamp: 290, count: 5 },
      { timestamp: 410, count: 7 },
      { timestamp: 490, count: 8 },
      { timestamp: 580, count: 10 },
      { timestamp: 599, count: 12 }
    ]
  }
];

export const popularOpinionsQ3: TopicData[] = [
  {
    topic: "Q3 Answer 1",
    topicText: "Require explicit consent before analyzing anyone's facial data",
    groups: [
      { groupId: "group 5", timestamp: 15 },
      { groupId: "group 16", timestamp: 160 },
      { groupId: "group 24", timestamp: 300 },
      { groupId: "group 28", timestamp: 420 },
      { groupId: "group 34", timestamp: 540 },
      { groupId: "group 38", timestamp: 590 },
      { groupId: "group 40", timestamp: 599 }
    ],
    counts: [
      { timestamp: 15, count: 1 },
      { timestamp: 160, count: 4 },
      { timestamp: 300, count: 6 },
      { timestamp: 420, count: 8 },
      { timestamp: 540, count: 10 },
      { timestamp: 590, count: 11 },
      { timestamp: 599, count: 12 }
    ]
  },
  {
    topic: "Q3 Answer 2",
    topicText: "Ban using facial analysis to detect sensitive personal traits",
    groups: [
      { groupId: "group 21", timestamp: 50 },
      { groupId: "group 29", timestamp: 210 },
      { groupId: "group 37", timestamp: 370 },
      { groupId: "group 42", timestamp: 460 },
      { groupId: "group 45", timestamp: 530 },
      { groupId: "group 49", timestamp: 580 },
      { groupId: "group 51", timestamp: 599 }
    ],
    counts: [
      { timestamp: 50, count: 1 },
      { timestamp: 210, count: 3 },
      { timestamp: 370, count: 5 },
      { timestamp: 460, count: 7 },
      { timestamp: 530, count: 9 },
      { timestamp: 580, count: 10 },
      { timestamp: 599, count: 12 }
    ]
  },
  {
    topic: "Q3 Answer 3",
    topicText: "Develop AI-resistant filters that protect privacy in photos",
    groups: [
      { groupId: "group 13", timestamp: 25 },
      { groupId: "group 19", timestamp: 150 },
      { groupId: "group 23", timestamp: 280 },
      { groupId: "group 31", timestamp: 390 },
      { groupId: "group 38", timestamp: 490 },
      { groupId: "group 41", timestamp: 560 },
      { groupId: "group 44", timestamp: 599 }
    ],
    counts: [
      { timestamp: 25, count: 1 },
      { timestamp: 150, count: 3 },
      { timestamp: 280, count: 5 },
      { timestamp: 390, count: 6 },
      { timestamp: 490, count: 8 },
      { timestamp: 560, count: 10 },
      { timestamp: 599, count: 12 }
    ]
  },
  {
    topic: "Q3 Answer 4",
    topicText: "Create strict laws about how facial data can be collected and used",
    groups: [
      { groupId: "group 1", timestamp: 35 },
      { groupId: "group 7", timestamp: 160 },
      { groupId: "group 15", timestamp: 290 },
      { groupId: "group 26", timestamp: 410 },
      { groupId: "group 29", timestamp: 500 },
      { groupId: "group 33", timestamp: 580 },
      { groupId: "group 46", timestamp: 599 }
    ],
    counts: [
      { timestamp: 35, count: 1 },
      { timestamp: 160, count: 3 },
      { timestamp: 290, count: 5 },
      { timestamp: 410, count: 7 },
      { timestamp: 500, count: 9 },
      { timestamp: 580, count: 11 },
      { timestamp: 599, count: 12 }
    ]
  },
  {
    topic: "Q3 Answer 5",
    topicText: "Make companies clearly warn users about facial recognition capabilities",
    groups: [
      { groupId: "group 37", timestamp: 20 },
      { groupId: "group 38", timestamp: 150 },
      { groupId: "group 40", timestamp: 280 },
      { groupId: "group 44", timestamp: 380 },
      { groupId: "group 46", timestamp: 470 },
      { groupId: "group 50", timestamp: 550 },
      { groupId: "group 52", timestamp: 599 }
    ],
    counts: [
      { timestamp: 20, count: 1 },
      { timestamp: 150, count: 3 },
      { timestamp: 280, count: 5 },
      { timestamp: 380, count: 7 },
      { timestamp: 470, count: 9 },
      { timestamp: 550, count: 11 },
      { timestamp: 610, count: 12 }
    ]
  }
];


// Combined export for all popular opinions
export const popularOpinionsData: Record<number, TopicData[]> = {
  1: popularOpinionsQ1,
  2: popularOpinionsQ2,
  3: popularOpinionsQ3
};

export const POPULAR_OPINIONS_CONFIG = {
  id: 'popularOpinions',
  title: 'Popular Opinions',
  dataKey: 'popularOpinions',
  type: 'percentage' as const,
  visible: false,
  description: {
    1: 'Key perspectives on copyright problems',
    2: 'Technical challenges and implications',
    3: 'Proposed solutions and frameworks'
  }
};