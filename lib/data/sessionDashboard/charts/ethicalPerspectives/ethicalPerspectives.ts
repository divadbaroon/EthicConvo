import { TimeSeriesData, TopicData } from '@/types/graphTypes';

// Question 1: Problem Understanding
export const ethicalPerspectivesQ1: TopicData[] = [
  {
    topic: "Q1 Ethics 1",
    topicText: "Utilitarian Perspective: Unauthorized data use harms collective creative incentives",
    groups: [
      { groupId: "group 13", timestamp: 10 },
      { groupId: "group 16", timestamp: 25 },
      { groupId: "group 17", timestamp: 40 }
    ],
    counts: [
      { timestamp: 10, count: 1 },
      { timestamp: 25, count: 2 },
      { timestamp: 40, count: 3 }
    ]
  },
  {
    topic: "Q1 Ethics 2",
    topicText: "Deontological View: Using copyrighted data without consent violates moral duty",
    groups: [
      { groupId: "group 5", timestamp: 55 },
      { groupId: "group 10", timestamp: 70 },
      { groupId: "group 14", timestamp: 85 }
    ],
    counts: [
      { timestamp: 55, count: 1 },
      { timestamp: 70, count: 2 },
      { timestamp: 85, count: 3 }
    ]
  },
  {
    topic: "Q1 Ethics 3",
    topicText: "Rights-based Approach: Creative works deserve protection as intellectual property",
    groups: [
      { groupId: "group 11", timestamp: 100 },
      { groupId: "group 12", timestamp: 115 }
    ],
    counts: [
      { timestamp: 100, count: 1 },
      { timestamp: 115, count: 2 }
    ]
  },
  {
    topic: "Q1 Ethics 4",
    topicText: "Virtue Ethics: Respecting creativity and originality in AI development",
    groups: [
      { groupId: "group 18", timestamp: 130 },
      { groupId: "group 20", timestamp: 145 },
      { groupId: "group 10", timestamp: 160 },
      { groupId: "group 12", timestamp: 175 }
    ],
    counts: [
      { timestamp: 130, count: 1 },
      { timestamp: 145, count: 2 },
      { timestamp: 160, count: 3 },
      { timestamp: 175, count: 4 }
    ]
  },
  {
    topic: "Q1 Ethics 5",
    topicText: "Social Justice: Impact on marginalized creators and artists",
    groups: [
      { groupId: "group 22", timestamp: 190 },
      { groupId: "group 23", timestamp: 205 }
    ],
    counts: [
      { timestamp: 190, count: 1 },
      { timestamp: 205, count: 2 }
    ]
  }
];

// Question 2: Technical Analysis
export const ethicalPerspectivesQ2: TopicData[] = [
  {
    topic: "Q2 Ethics 1",
    topicText: "Utilitarian Analysis: Balancing innovation benefits against creator rights",
    groups: [
      { groupId: "group 5", timestamp: 75 },
      { groupId: "group 10", timestamp: 90 },
      { groupId: "group 11", timestamp: 105 }
    ],
    counts: [
      { timestamp: 75, count: 1 },
      { timestamp: 90, count: 2 },
      { timestamp: 105, count: 3 }
    ]
  },
  {
    topic: "Q2 Ethics 2",
    topicText: "Transparency Principle: Ethical requirement for data provenance tracking",
    groups: [
      { groupId: "group 12", timestamp: 120 },
      { groupId: "group 19", timestamp: 135 }
    ],
    counts: [
      { timestamp: 120, count: 1 },
      { timestamp: 135, count: 2 }
    ]
  },
  {
    topic: "Q2 Ethics 3",
    topicText: "Justice Framework: Fair distribution of AI technology benefits",
    groups: [
      { groupId: "group 13", timestamp: 140 },
      { groupId: "group 16", timestamp: 155 }
    ],
    counts: [
      { timestamp: 140, count: 1 },
      { timestamp: 155, count: 2 }
    ]
  },
  {
    topic: "Q2 Ethics 4",
    topicText: "Care Ethics: Protecting creative communities and relationships",
    groups: [
      { groupId: "group 24", timestamp: 170 },
      { groupId: "group 25", timestamp: 185 },
      { groupId: "group 10", timestamp: 200 },
      { groupId: "group 13", timestamp: 215 }
    ],
    counts: [
      { timestamp: 170, count: 1 },
      { timestamp: 185, count: 2 },
      { timestamp: 200, count: 3 },
      { timestamp: 215, count: 4 }
    ]
  },
  {
    topic: "Q2 Ethics 5",
    topicText: "Virtue-based: Promoting responsible innovation practices",
    groups: [
      { groupId: "group 26", timestamp: 230 },
      { groupId: "group 27", timestamp: 245 }
    ],
    counts: [
      { timestamp: 230, count: 1 },
      { timestamp: 245, count: 2 }
    ]
  }
];

// Question 3: Solution Development
export const ethicalPerspectivesQ3: TopicData[] = [
  {
    topic: "Q3 Ethics 1",
    topicText: "Rights-based Framework: Implementing consent mechanisms for data use",
    groups: [
      { groupId: "group 5", timestamp: 260 },
      { groupId: "group 10", timestamp: 275 },
      { groupId: "group 11", timestamp: 290 },
      { groupId: "group 12", timestamp: 305 }
    ],
    counts: [
      { timestamp: 260, count: 1 },
      { timestamp: 275, count: 2 },
      { timestamp: 290, count: 3 },
      { timestamp: 305, count: 4 }
    ]
  },
  {
    topic: "Q3 Ethics 2",
    topicText: "Distributive Justice: Fair compensation models for content creators",
    groups: [
      { groupId: "group 13", timestamp: 320 },
      { groupId: "group 16", timestamp: 335 },
      { groupId: "group 19", timestamp: 350 }
    ],
    counts: [
      { timestamp: 320, count: 1 },
      { timestamp: 335, count: 2 },
      { timestamp: 350, count: 3 }
    ]
  },
  {
    topic: "Q3 Ethics 3",
    topicText: "Virtue Ethics: Guidelines for ethical AI development practices",
    groups: [
      { groupId: "group 5", timestamp: 365 },
      { groupId: "group 10", timestamp: 380 },
      { groupId: "group 12", timestamp: 395 }
    ],
    counts: [
      { timestamp: 365, count: 1 },
      { timestamp: 380, count: 2 },
      { timestamp: 395, count: 3 }
    ]
  },
  {
    topic: "Q3 Ethics 4",
    topicText: "Utilitarian Approach: Maximizing benefits while minimizing harm",
    groups: [
      { groupId: "group 28", timestamp: 410 },
      { groupId: "group 29", timestamp: 425 }
    ],
    counts: [
      { timestamp: 410, count: 1 },
      { timestamp: 425, count: 2 }
    ]
  },
  {
    topic: "Q3 Ethics 5",
    topicText: "Social Contract Theory: Establishing new norms for AI data usage",
    groups: [
      { groupId: "group 30", timestamp: 440 },
      { groupId: "group 31", timestamp: 455 }
    ],
    counts: [
      { timestamp: 440, count: 1 },
      { timestamp: 455, count: 2 }
    ]
  }
];

// Combined export for all ethical perspectives
export const ethicalPerspectivesData = {
  1: ethicalPerspectivesQ1,
  2: ethicalPerspectivesQ2,
  3: ethicalPerspectivesQ3
};

export const ETHICAL_PERSPECTIVES_CONFIG = {
  id: 'ethicalPerspectives',
  title: 'Ethical Perspectives',
  dataKey: 'ethicalPerspectives',
  type: 'percentage' as const,
  visible: false,
  description: {
    1: 'Ethical frameworks for understanding copyright issues',
    2: 'Ethical analysis of technical implications',
    3: 'Ethical approaches to solution development'
  }
};
