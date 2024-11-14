// Types for better structure
interface OpinionData {
    opinion: string;
    group1: number;
    group2: number;
    group3: number;
    group4: number;
    group5: number;
    group6: number;
    group7: number;
    group8: number;
    group9: number;
    group10: number;
    description: string;
  }

  interface TimeSeriesDataPoint {
    timestamp: number;
    value: number;
  }
  
  interface TimeSeriesData {
    timestamp: number;
    value: number;
  }
  
  interface TopicData {
    topic: string;
    value: number;
    description: string;
  }
  
  // Participation Rate - Time series data showing increasing engagement
  export const participationRateData: TimeSeriesDataPoint[] = [
    { timestamp: 1, value: 8 },    
    { timestamp: 2, value: 12 },    
    { timestamp: 3, value: 15 },    
    { timestamp: 4, value: 20 }    
  ]

  interface GroupResponse {
    timestamp: number;
    groupId: string;
    response: number;
  }
  
  interface OpinionData {
    opinion: string;
    description: string;
    responses: GroupResponse[];
  }
  
  // Group Answers
export const groupAnswersData = [
    { 
      opinion: "Generative AI's use of copyrighted datasets without permission contributes to copyright infringement",
      group1: 12,
      group2: 18,
      group3: 15,
      group4: 15,
      group5: 15,
      group6: 15,
      group7: 15,
      group8: 15,
      group9: 15,
      group10: 15,
      group11: 15,
      group12: 15,
      group13: 15,
      description: 'Level of technical comprehension demonstrated'
    },
    { 
      opinion: "AI can be trained on protected work without permission",
      group1: 12,
      group2: 18,
      group3: 15,
      group4: 15,
      group5: 15,
      group6: 15,
      group7: 15,
      group8: 15,
      group9: 15,
      group10: 15,
      group11: 15,
      description: 'Understanding of ethical implications'
    },
    { 
      opinion: "Intellectual property might be improperly used in creating ML training datasets",
      group1: 12,
      group2: 18,
      group3: 15,
      group4: 15,
      group5: 15,
      group6: 15,
      group7: 15,
      group8: 15,
      description: 'Quality of proposed solutions'
    },
    { 
      opinion: "Technical mechanisms of AI models processing copyrighted content",
      group1: 12,
      group2: 18,
      group3: 15,
      group4: 15,
      group5: 15,
      group6: 15,
      description: 'Depth of analytical thinking'
    }
  ];
  
  // Update the ethical perspectives data
  export const ethicalPerspectivesData = [
    { 
      opinion: "Utilitarian Perspective: Unauthorized data use harms collective creative incentives",
      group1: 12,
      group2: 18,
      group3: 15,
      group4: 15,
      group5: 15,
      group6: 15,
      group7: 15,
      group8: 15,
      group9: 15,
      group10: 15,
      description: 'Concerns about data privacy and protection'
    },
    { 
      opinion: "Deontological View: Using copyrighted data without consent violates moral duty",
      group1: 12,
      group2: 18,
      group3: 15,
      group4: 15,
      group5: 15,
      group6: 15,
      group7: 15,
      group8: 15,
      description: 'Effects on society and communities'
    },
    { 
      opinion: "Rights-based Approach: Creative works deserve protection as intellectual property",
      group1: 12,
      group2: 18,
      group3: 15,
      group4: 15,
      group5: 15,
      group6: 15,
      description: 'Responsibility for AI actions'
    },
    { 
      opinion: "Virtue Ethics: Respecting creativity and originality in AI development",
      group1: 12,
      group2: 18,
      group3: 15,
      group4: 15,
      description: 'Need for explainable AI systems'
    }
  ];
  
  // Popular Opinions (keeping your original data)
  export const popularOpinionsData = [
    { 
      opinion: "Unauthorized use of copyrighted material in training datasets",
      group1: 12,
      group2: 18,
      group3: 15,
      group4: 15,
      group5: 15,
      group6: 15,
      group7: 15,
      group8: 15,
      group9: 15,
      group10: 15,
      group11: 15,
      group12: 15,
      description: 'Unauthorized use of copyrighted material in training datasets'
    },
    { 
      opinion: "Lack of compensation for original content creators",
      group1: 12,
      group2: 18,
      group3: 15,
      group4: 15,
      group5: 15,
      group6: 15,
      group7: 15,
      group8: 15,
      group9: 15,
      group10: 15,
      description: 'Lack of compensation for original content creators'
    },
    { 
      opinion: "Unclear boundaries between fair use and infringement",
      group1: 12,
      group2: 18,
      group3: 15,
      group4: 15,
      group5: 15,
      group6: 15,
      group7: 15,
      group8: 15,
      group9: 15,
      description: 'Unclear boundaries between fair use and infringement'
    },
    { 
      opinion: "Impact on creative industries and future content creation",
      group1: 12,
      group2: 18,
      group3: 15,
      group4: 15,
      group5: 15,
      group6: 15,
      group7: 15,
      description: 'Impact on creative industries and future content creation'
    }
  ];
  
  // Keyword Trends
  export const keywordTrendsData = [
    { 
      opinion: 'Copyright Infringement"',
      group1: 12,
      group2: 18,
      group3: 15,
      group4: 15,
      group5: 15,
      group6: 15,
      group7: 15,
      group8: 15,
      group9: 15,
      group10: 15,
      group11: 15,
      group12: 15,
      group13: 15,
      group14: 15,
      group15: 15,
      description: 'Frequency of ethical considerations in discussion'
    },
    { 
      opinion: 'Content Rights',
      group1: 12,
      group2: 18,
      group3: 15,
      group4: 15,
      group5: 15,
      group6: 15,
      group7: 15,
      group8: 15,
      group9: 15,
      group10: 15,
      group11: 15,
      group12: 15,
      group13: 15,
      description: 'References to technological advancement'
    },
    { 
      opinion: 'Unauthorized Use',
      group1: 12,
      group2: 18,
      group3: 15,
      group4: 15,
      group5: 15,
      group6: 15,
      group7: 15,
      group8: 15,
      group9: 15,
      group10: 15,
      description: 'Discussion of regulatory frameworks'
    },
    { 
      opinion: 'Creative Ownership',
      group1: 12,
      group2: 18,
      group3: 15,
      group4: 15,
      group5: 15,
      group6: 15,
      group7: 15,
      group8: 15,
      group9: 15,
      description: 'Practical application considerations'
    }
  ];
  
  // Summary content (keeping your original structure and extending it)
  export const summaryContent = {
    overview: [
      { 
        text: "Fair Use has the highest priority from Group 1 with 5 points",
        highlights: ["Fair Use", "group1"]
      },
      { 
        text: "Industry Impact is most valued by Group 2 management",
        highlights: ["Industry Impact", "group2"]
      },
      { 
        text: "Creator Rights shows strong support from Group 3",
        highlights: ["Creator Rights", "group3"]
      }
    ],
    insights: [
      {
        text: "Creator Rights shows the most balanced distribution across all groups",
        highlights: ["Creator Rights"]
      },
      {
        text: "Group 1 prioritizes fair use concerns over industry impact",
        highlights: ["group1", "Fair Use"]
      },
      {
        text: "Copyright Material receives decreasing support from Group 1 to Group 3",
        highlights: ["Copyright Material"]
      }
    ],
    relations: [
      {
        text: "Fair Use and Creator Rights show strong positive correlation",
        highlights: ["Fair Use", "Creator Rights"]
      },
      {
        text: "Creator Rights and Industry Impact are closely aligned in Group 3",
        highlights: ["Creator Rights", "Industry Impact", "group3"]
      },
      {
        text: "Copyright Material concerns impact Fair Use metrics",
        highlights: ["Copyright Material", "Fair Use"]
      }
    ]
  };

// First, let's define the types for our different data structures
interface TimeSeriesDataPoint {
  timestamp: number;
  value: number;
}

interface GroupDataPoint {
  opinion: string;
  group1: number;
  group2: number;
  group3: number;
  description: string;
}


  // Helper function to get the appropriate data based on chart type
  export const getChartData = (chartType: string): TimeSeriesDataPoint[] | GroupDataPoint[] => {
    switch (chartType.toLowerCase()) {
      case 'participation rate':
        return participationRateData;
      case 'group answers':
        return groupAnswersData;
      case 'ethical perspectives':
        return ethicalPerspectivesData;
      case 'popular opinions':
        return popularOpinionsData;
      case 'keyword trends':
        return keywordTrendsData;
      default:
        return [];
    }
  };