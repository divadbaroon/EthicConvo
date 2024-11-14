export const data = [
    { 
      opinion: 'Copyright Material',
      group1: 4,
      group2: 3,
      group3: 2,
      description: 'Unauthorized use of copyrighted material in training datasets'
    },
    { 
      opinion: 'Creator Rights',
      group1: 3,
      group2: 4,
      group3: 3,
      description: 'Lack of compensation for original content creators'
    },
    { 
      opinion: 'Fair Use',
      group1: 5,
      group2: 2,
      group3: 4,
      description: 'Unclear boundaries between fair use and infringement'
    },
    { 
      opinion: 'Industry Impact',
      group1: 3,
      group2: 5,
      group3: 3,
      description: 'Impact on creative industries and future content creation'
    },
  ]
  
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
  }