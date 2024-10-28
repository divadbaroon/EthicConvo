export interface TopicData {
  topic: string;
  topicText: string;
  groups: {
    groupId: string;
    timestamp: number;
  }[];
  counts: {
    timestamp: number;
    count: number;
  }[];
}

// Question 1: Problem Understanding
export const groupAnswersQ1: TopicData[] = [
  {
    "topic": "Q1 Answer 1",
    "topicText": "Generative AI's use of copyrighted datasets without permission contributes to copyright infringement",
    "groups": [
      { "groupId": "group 13", "timestamp": 10 },
      { "groupId": "group 16", "timestamp": 25 }
    ],
    "counts": [
      { "timestamp": 10, "count": 1 },
      { "timestamp": 25, "count": 2 }
    ]
  },
  {
    "topic": "Q1 Answer 2",
    "topicText": "AI can be trained on protected work without permission",
    "groups": [
      { "groupId": "group 1", "timestamp": 35 }
    ],
    "counts": [
      { "timestamp": 35, "count": 1 }
    ]
  },
  {
    "topic": "Q1 Answer 3",
    "topicText": "Intellectual property might be improperly used in creating ML training datasets",
    "groups": [
      { "groupId": "group 21", "timestamp": 50 },
      { "groupId": "group 22", "timestamp": 40 }
    ],
    "counts": [
      { "timestamp": 40, "count": 1 },
      { "timestamp": 50, "count": 2 }
    ]
  }
];

// Question 2: Technical Analysis
export const groupAnswersQ2: TopicData[] = [
  {
    "topic": "Q2 Answer 1",
    "topicText": "Technical mechanisms of AI models processing copyrighted content",
    "groups": [
      { "groupId": "group 5", "timestamp": 15 },
      { "groupId": "group 10", "timestamp": 30 }
    ],
    "counts": [
      { "timestamp": 15, "count": 1 },
      { "timestamp": 30, "count": 2 }
    ]
  },
  {
    "topic": "Q2 Answer 2",
    "topicText": "Data processing and storage implications for copyright",
    "groups": [
      { "groupId": "group 11", "timestamp": 45 },
      { "groupId": "group 12", "timestamp": 60 }
    ],
    "counts": [
      { "timestamp": 45, "count": 1 },
      { "timestamp": 60, "count": 2 }
    ]
  },
  {
    "topic": "Q2 Answer 3",
    "topicText": "Impact of model architecture on content reproduction",
    "groups": [
      { "groupId": "group 24", "timestamp": 65 }
    ],
    "counts": [
      { "timestamp": 65, "count": 1 }
    ]
  }
];

// Question 3: Solution Development
export const groupAnswersQ3: TopicData[] = [
  {
    "topic": "Q3 Answer 1",
    "topicText": "Implementing robust tracking mechanisms for data sourcing",
    "groups": [
      { "groupId": "group 19", "timestamp": 75 }
    ],
    "counts": [
      { "timestamp": 75, "count": 1 }
    ]
  },
  {
    "topic": "Q3 Answer 2",
    "topicText": "Using copyrighted datasets for AI training is fair use",
    "groups": [
      { "groupId": "group 2", "timestamp": 45 },
      { "groupId": "group 3", "timestamp": 60 },
      { "groupId": "group 18", "timestamp": 75 },
      { "groupId": "group 20", "timestamp": 90 }
    ],
    "counts": [
      { "timestamp": 45, "count": 1 },
      { "timestamp": 60, "count": 2 },
      { "timestamp": 75, "count": 3 },
      { "timestamp": 90, "count": 4 }
    ]
  },
  {
    "topic": "Q3 Answer 3",
    "topicText": "Developing legal frameworks for AI training data use",
    "groups": [
      { "groupId": "group 21", "timestamp": 50 },
      { "groupId": "group 22", "timestamp": 40 }
    ],
    "counts": [
      { "timestamp": 40, "count": 1 },
      { "timestamp": 50, "count": 2 }
    ]
  }
];

// Combined export for all group answers
export const groupAnswersData = {
  1: groupAnswersQ1,
  2: groupAnswersQ2,
  3: groupAnswersQ3
};

export const GROUP_ANSWERS_CONFIG = {
  id: 'groupAnswers',
  title: 'Group Answers',
  dataKey: 'groupAnswers',
  type: 'count' as const,
  visible: true,
  description: {
    1: 'Understanding of copyright problems',
    2: 'Technical analysis of AI systems',
    3: 'Proposed solutions and frameworks'
  }
};

// Participant count mapping for groups remains the same
export const groupParticipantCountsMap: { [groupId: string]: number } = {
  'group 1': 4, 'group 2': 6, 'group 3': 2, 'group 4': 5,
  'group 5': 3, 'group 6': 4, 'group 7': 6, 'group 8': 2,
  'group 9': 5, 'group 10': 3, 'group 11': 4, 'group 12': 6,
  'group 13': 2, 'group 14': 5, 'group 15': 3, 'group 16': 3,
  'group 17': 4, 'group 18': 6, 'group 19': 2, 'group 20': 5,
  'group 21': 3,
};