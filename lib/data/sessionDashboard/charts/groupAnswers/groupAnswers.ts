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
    "topicText": "AI can figure out super personal stuff like politics and orientation just from photos",
    "groups": [
      { "groupId": "group 13", "timestamp": 15 },
      { "groupId": "group 16", "timestamp": 30 }
    ],
    "counts": [
      { "timestamp": 15, count: 1 },
      { "timestamp": 30, count: 2 }
    ]
  },
  {
    "topic": "Q1 Answer 2",
    "topicText": "The tech is more accurate than humans at guessing personal traits from faces",
    "groups": [
      { "groupId": "group 1", "timestamp": 45 }
    ],
    "counts": [
      { "timestamp": 45, count: 1 }
    ]
  },
  {
    "topic": "Q1 Answer 3", 
    "topicText": "People don't know their social media photos could reveal private info about them",
    "groups": [
      { "groupId": "group 21", "timestamp": 60 },
      { "groupId": "group 22", "timestamp": 75 }
    ],
    "counts": [
      { "timestamp": 60, count: 1 },
      { "timestamp": 75, count: 2 }
    ]
  }
];

export const groupAnswersQ2: TopicData[] = [
  {
    "topic": "Q2 Answer 1",
    "topicText": "Cameras are everywhere now - stores, streets, phones - collecting face data",
    "groups": [
      { "groupId": "group 5", "timestamp": 90 },
      { "groupId": "group 10", "timestamp": 105 }
    ],
    "counts": [
      { "timestamp": 90, count: 1 },
      { "timestamp": 105, count: 2 }
    ]
  },
  {
    "topic": "Q2 Answer 2", 
    "topicText": "Companies could use this to discriminate based on predicted traits",
    "groups": [
      { "groupId": "group 11", "timestamp": 120 },
      { "groupId": "group 12", "timestamp": 135 }
    ],
    "counts": [
      { "timestamp": 120, count: 1 },
      { "timestamp": 135, count: 2 }
    ]
  },
  {
    "topic": "Q2 Answer 3",
    "topicText": "Government could use face recognition to profile and track people",
    "groups": [
      { "groupId": "group 24", "timestamp": 150 }
    ],
    "counts": [
      { "timestamp": 150, count: 1 }
    ]
  }
];

export const groupAnswersQ3: TopicData[] = [
  {
    "topic": "Q3 Answer 1",
    "topicText": "Need laws to stop companies from analyzing faces without permission",
    "groups": [
      { "groupId": "group 19", "timestamp": 165 }
    ],
    "counts": [
      { "timestamp": 165, count: 1 }
    ]
  },
  {
    "topic": "Q3 Answer 2",
    "topicText": "Maybe add filters that mess up AI face recognition but look normal to humans",
    "groups": [
      { "groupId": "group 2", "timestamp": 180 },
      { "groupId": "group 3", "timestamp": 195 },
      { "groupId": "group 18", "timestamp": 210 },
      { "groupId": "group 20", "timestamp": 225 }
    ],
    "counts": [
      { "timestamp": 180, count: 1 },
      { "timestamp": 195, count: 2 },
      { "timestamp": 210, count: 3 },
      { "timestamp": 225, count: 4 }
    ]
  },
  {
    "topic": "Q3 Answer 3",
    "topicText": "People should get warnings about AI analysis before posting photos online",
    "groups": [
      { "groupId": "group 21", "timestamp": 240 },
      { "groupId": "group 22", "timestamp": 255 }
    ],
    "counts": [
      { "timestamp": 240, count: 1 },
      { "timestamp": 255, count: 2 }
    ]
  }
];

export const GROUP_ANSWERS_CONFIG = {
  id: 'groupAnswers',
  title: 'Group Answers',
  dataKey: 'groupAnswers', 
  type: 'count' as const,
  visible: true,
  description: {
    1: 'Understanding privacy risks',
    2: 'Real-world implications',
    3: 'Potential solutions'
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