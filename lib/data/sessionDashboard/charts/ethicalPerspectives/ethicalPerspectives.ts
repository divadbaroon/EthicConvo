import { TimeSeriesData, TopicData } from '@/types'

// Question 1: Problem Understanding
export const ethicalPerspectivesQ1: TopicData[] = [
 {
   topic: "Q1 Ethics 1",
   topicText: "AI facial analysis risks individual privacy",
   groups: [
     { groupId: "group 3", timestamp: 15 },
     { groupId: "group 7", timestamp: 30 },
     { groupId: "group 12", timestamp: 15 },
     { groupId: "group 12", timestamp: 55 },
     { groupId: "group 12", timestamp: 75 },
   ],
   counts: [
     { timestamp: 15, count: 1 },
     { timestamp: 30, count: 2 }, 
     { timestamp: 45, count: 3 }
   ]
 },
 {
   topic: "Q1 Ethics 2",
   topicText: "Analyzing intimate traits without consent is unethical",
   groups: [
     { groupId: "group 1", timestamp: 30 },
     { groupId: "group 5", timestamp: 75 },
     { groupId: "group 15", timestamp: 90 },
     { groupId: "group 35", timestamp: 90 },
     { groupId: "group 45", timestamp: 90 },
   ],
   counts: [
     { timestamp: 60, count: 1 },
     { timestamp: 75, count: 2 },
     { timestamp: 90, count: 3 }
   ]
 },
 {
   topic: "Q1 Ethics 3",
   topicText: "People have a right to control their facial data",
   groups: [
     { groupId: "group 2", timestamp: 40 },
     { groupId: "group 8", timestamp: 120 },
     { groupId: "group 19", timestamp: 135 }
   ],
   counts: [
     { timestamp: 105, count: 1 },
     { timestamp: 120, count: 2 },
     { timestamp: 135, count: 3 }
   ]
 },
 {
   topic: "Q1 Ethics 4",
   topicText: "Tech companies should respect personal privacy",
   groups: [
     { groupId: "group 4", timestamp: 30 },
     { groupId: "group 10", timestamp: 45 },
     { groupId: "group 17", timestamp: 180 },
     { groupId: "group 18", timestamp: 180 },
   ],
   counts: [
     { timestamp: 150, count: 1 },
     { timestamp: 165, count: 2 },
     { timestamp: 180, count: 3 }
   ]
 },
 {
   topic: "Q1 Ethics 5", 
   topicText: "Marginalized groups face greater risks from facial profiling",
   groups: [
     { groupId: "group 6", timestamp: 25 },
     { groupId: "group 11", timestamp: 35 },
   ],
   counts: [
     { timestamp: 195, count: 1 },
     { timestamp: 210, count: 2 },
     { timestamp: 225, count: 3 }
   ]
 },
 {
   topic: "Q1 Ethics 6",
   topicText: "Companies ignore duty to protect users from privacy harms",
   groups: [
     { groupId: "group 9", timestamp: 240 },
     { groupId: "group 13", timestamp: 255 },
     { groupId: "group 18", timestamp: 270 }
   ],
   counts: [
     { timestamp: 240, count: 1 },
     { timestamp: 255, count: 2 },
     { timestamp: 270, count: 3 }
   ]
 }
]

export const ethicalPerspectivesQ2: TopicData[] = [
 {
   topic: "Q2 Ethics 1",
   topicText: "Social benefits vs privacy risks of facial recognition",
   groups: [
     { groupId: "group 3", timestamp: 285 },
     { groupId: "group 7", timestamp: 300 },
     { groupId: "group 14", timestamp: 315 }
   ],
   counts: [
     { timestamp: 285, count: 1 },
     { timestamp: 300, count: 2 },
     { timestamp: 315, count: 3 }
   ]
 },
 {
   topic: "Q2 Ethics 2",
   topicText: "Users unaware their faces reveal intimate traits",
   groups: [
     { groupId: "group 1", timestamp: 330 },
     { groupId: "group 5", timestamp: 345 },
     { groupId: "group 15", timestamp: 360 }
   ],
   counts: [
     { timestamp: 330, count: 1 },
     { timestamp: 345, count: 2 },
     { timestamp: 360, count: 3 }
   ]
 },
 {
   topic: "Q2 Ethics 3",
   topicText: "Facial analysis creates unfair discrimination risks",
   groups: [
     { groupId: "group 2", timestamp: 375 },
     { groupId: "group 8", timestamp: 390 },
     { groupId: "group 19", timestamp: 405 }
   ],
   counts: [
     { timestamp: 375, count: 1 },
     { timestamp: 390, count: 2 },
     { timestamp: 405, count: 3 }
   ]
 },
 {
   topic: "Q2 Ethics 4", 
   topicText: "Companies overlook potential harms to user wellbeing",
   groups: [
     { groupId: "group 4", timestamp: 420 },
     { groupId: "group 10", timestamp: 435 },
     { groupId: "group 17", timestamp: 450 }
   ],
   counts: [
     { timestamp: 420, count: 1 },
     { timestamp: 435, count: 2 },
     { timestamp: 450, count: 3 }
   ]
 },
 {
   topic: "Q2 Ethics 5",
   topicText: "Tech advancement prioritized over privacy protection",
   groups: [
     { groupId: "group 6", timestamp: 465 },
     { groupId: "group 11", timestamp: 480 },
     { groupId: "group 16", timestamp: 495 }
   ],
   counts: [
     { timestamp: 465, count: 1 },
     { timestamp: 480, count: 2 },
     { timestamp: 495, count: 3 }
   ]
 },
 {
   topic: "Q2 Ethics 6",
   topicText: "Public spaces now analyze faces without consent",
   groups: [
     { groupId: "group 9", timestamp: 510 },
     { groupId: "group 13", timestamp: 525 },
     { groupId: "group 18", timestamp: 540 }
   ],
   counts: [
     { timestamp: 510, count: 1 },
     { timestamp: 525, count: 2 },
     { timestamp: 540, count: 3 }
   ]
 }
]

export const ethicalPerspectivesQ3: TopicData[] = [
 {
   topic: "Q3 Ethics 1",
   topicText: "Require explicit consent for facial analysis",
   groups: [
     { groupId: "group 3", timestamp: 555 },
     { groupId: "group 7", timestamp: 560 },
     { groupId: "group 14", timestamp: 565 }
   ],
   counts: [
     { timestamp: 555, count: 1 },
     { timestamp: 560, count: 2 },
     { timestamp: 565, count: 3 }
   ]
 },
 {
   topic: "Q3 Ethics 2",
   topicText: "Protect vulnerable groups from facial profiling",
   groups: [
     { groupId: "group 1", timestamp: 570 },
     { groupId: "group 5", timestamp: 575 },
     { groupId: "group 15", timestamp: 580 }
   ],
   counts: [
     { timestamp: 570, count: 1 },
     { timestamp: 575, count: 2 },
     { timestamp: 580, count: 3 }
   ]
 },
 {
   topic: "Q3 Ethics 3",
   topicText: "Build privacy protection into core company values",
   groups: [
     { groupId: "group 2", timestamp: 582 },
     { groupId: "group 8", timestamp: 584 },
     { groupId: "group 19", timestamp: 586 }
   ],
   counts: [
     { timestamp: 582, count: 1 },
     { timestamp: 584, count: 2 },
     { timestamp: 586, count: 3 }
   ]
 },
 {
   topic: "Q3 Ethics 4",
   topicText: "Balance innovation with strong privacy safeguards",
   groups: [
     { groupId: "group 4", timestamp: 588 },
     { groupId: "group 10", timestamp: 590 },
     { groupId: "group 17", timestamp: 592 }
   ],
   counts: [
     { timestamp: 588, count: 1 },
     { timestamp: 590, count: 2 },
     { timestamp: 592, count: 3 }
   ]
 },
 {
   topic: "Q3 Ethics 5",
   topicText: "Prioritize protecting users from privacy harms",
   groups: [
     { groupId: "group 6", timestamp: 594 },
     { groupId: "group 11", timestamp: 596 },
     { groupId: "group 16", timestamp: 598 }
   ],
   counts: [
     { timestamp: 594, count: 1 },
     { timestamp: 596, count: 2 },
     { timestamp: 598, count: 3 }
   ]
 },
 {
   topic: "Q3 Ethics 6",
   topicText: "Rebuild trust through transparent facial analysis policies",
   groups: [
     { groupId: "group 9", timestamp: 598 },
     { groupId: "group 13", timestamp: 599 },
     { groupId: "group 18", timestamp: 600 }
   ],
   counts: [
     { timestamp: 598, count: 1 },
     { timestamp: 599, count: 2 },
     { timestamp: 600, count: 3 }
   ]
 }
]

export const ethicalPerspectivesData = {
 1: ethicalPerspectivesQ1,
 2: ethicalPerspectivesQ2,
 3: ethicalPerspectivesQ3
}

export const ETHICAL_PERSPECTIVES_CONFIG = {
 id: 'ethicalPerspectives',
 title: 'Ethical Perspectives',
 dataKey: 'ethicalPerspectives',
 type: 'percentage' as const,
 visible: false,
 description: {
   1: 'Ethical frameworks for facial recognition privacy',
   2: 'Ethical analysis of AI facial analysis',
   3: 'Ethical approaches to protecting facial privacy'
 }
}