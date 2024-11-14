import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Button } from "@/components/ui/button";
import { Play, Pause, Info, LineChart as LineChartIcon, Network, X, Lightbulb, Plus, AlertTriangle } from 'lucide-react';
import { getChartData } from "@/components/charts/chartData";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip as TooltipPrimitive,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Keeping all existing interfaces
interface TimeSeriesPoint {
  timestamp: number;
  value: number;
  answers?: Array<{ text: string; count: number }>;
}

interface ChartUpdate {
  oldData: TimeSeriesDataPoint[] | ProcessedGroupData[];
  newData: TimeSeriesDataPoint[] | ProcessedGroupData[];
  timestamp: number;
}

// Type guard to check if data is GroupDataPoint[]
function isGroupDataArray(data: any[]): data is GroupDataPoint[] {
  return data.length > 0 && 'opinion' in data[0];
}

interface TopicData {
  topic: string;
  topicText: string;
  groups: Array<{ groupId: string; timestamp: number }>;
  counts: Array<{ timestamp: number; count: number }>;
}

interface TimeSeriesDataPoint {
  timestamp: number;
  value: number;
}

interface GroupDataPoint {
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

interface DiscussionChartProps {
  title: string;
  timeSeriesData: TimeSeriesPoint[];
  id: string;
  isDropped: boolean;
  currentTime: number;
  chartType: 'bar' | 'line';
  discussionPoint: number;
  style?: React.CSSProperties;
  groupAnswers?: TopicData[];
  getParticipationData?: () => any;
  dialogFunc?: (title: string, point: number, groups: any) => void;
  isInCanvas?: boolean;
  onToggleFreeze?: (id: string) => void;
  isFrozen?: boolean;
  getEthicalPerspectives?: () => TopicData[];
  getPopularOpinions?: () => TopicData[];
  getKeywordTrends?: () => TopicData[];
  addToCanvas?: (text: string) => void;
  onUpdateAccepted?: () => void;
  onUpdateDenied?: () => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  title?: string;
}

// Type guard functions
function isTimeSeriesData(data: any[]): data is TimeSeriesDataPoint[] {
  return Array.isArray(data) && data.length > 0 && 
    'timestamp' in data[0] && 'value' in data[0];
}
function isGroupData(data: any[]): data is ProcessedGroupData[] {
  return data.length > 0 && 'opinion' in data[0] && 'group1' in data[0];
}

const updatedGroupAnswersData = [
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
    description: 'Level of technical comprehension demonstrated',
    mentioningGroups: 11  // Increased from original
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
    description: 'Understanding of ethical implications',
    mentioningGroups: 12  // Increased from original
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
    description: 'Quality of proposed solutions',
    mentioningGroups: 14  // Increased from original
  },
  { 
    opinion: "Technical mechanisms of AI models processing copyrighted content",
    group1: 12,
    group2: 18,
    group3: 15,
    group4: 15,
    group5: 15,
    group6: 15,
    description: 'Depth of analytical thinking',
    mentioningGroups: 19  // Increased from original
  }
];

const CHART_TYPE_COLORS = {
  popularOpinions: [
    '#82C782', // Sage Green
    '#82C782',
    '#82C782',
    '#82C782'
  ],
  ethicalPerspectives: [
    '#FFB347', // Golden Orange
    '#FFB347',
    '#FFB347',
    '#FFB347'
  ],
  keywordTrends: [
    '#A78BFA', // Purple
    '#A78BFA',
    '#A78BFA',
    '#A78BFA'
  ],
  participation: [
    '#F472B6', // Rose Pink
    '#F472B6',
    '#F472B6',
    '#F472B6'
  ],
  default: [
    '#4EA8DE', // Ocean Blue
    '#4EA8DE',
    '#4EA8DE',
    '#4EA8DE'
  ]
} as const;

const summaryContent = {
  overview: [
    {
      text: "Students identified three aspects of AI copyright infringement concerns",
      highlights: ["AI copyright infringement"], 
      targetBar: "Generative AI's use of copyrighted datasets without permission contributes to copyright infringement" 
    },
    {
      text: "Groups focused on unauthorized data usage, training permissions, and IP protection",
      highlights: ["unauthorized", "permissions", "protection"]
    }
  ],
  insights: [
    {
      text: "Multiple groups (13, 16) highlighted generative AI's unauthorized use of copyrighted data",
      highlights: ["generative AI", "unauthorized use"]
    },
    {
      text: "Groups 21 and 22 emphasized broader IP protection issues in ML datasets",
      highlights: ["IP protection", "ML datasets"]
    }
  ],
  talkingPoints: [
    {
      text: "What's the distinction between Groups 13/16's focus on 'unauthorized use' versus Group 1's emphasis on 'training without permission'?",
      highlights: ["unauthorized use", "training without permission"]
    },
    {
      text: "How do Groups 21/22's concerns about ML datasets relate to the specific copyright issues raised by other groups?",
      highlights: ["ML datasets", "copyright issues"]
    }
  ],
  summary: {
    mainPoints: [
      "Students recognized that generative AI models are being trained on copyrighted materials without proper authorization",
      "They identified that AI training processes may not require explicit permission for using protected works",
      "Several groups raised concerns about improper use of intellectual property in machine learning datasets"
    ],
    keyObservations: [
      "Groups 13 and 16 specifically focused on generative AI's role in copyright infringement",
      "Group 1 highlighted the permission-less training capability of AI systems",
      "Groups 21 and 22 took a broader view, examining intellectual property issues in ML training data"
    ],
  },
  suggestions: [
    {
      text: "Groups 5, 8, and 13 had an interesting take on AI training without permission - can you elaborate on why this might be different from other copyright concerns?",
      highlights: ["Group 1", "AI training", "copyright concerns"],
      relatedAnswer: "Q1 Answer 1" 
    },
    {
      text: "Missing discussion about fair use exceptions - how might these apply to AI training on copyrighted works?",
      highlights: ["fair use exceptions", "AI training", "copyrighted works"],
      relatedAnswers: ["Q1 Answer 2", "Q1 Answer 3"] 
    }
  ]
};

interface ProcessedGroupData extends GroupDataPoint {
  mentioningGroups: number;
  index?: string;
}

// Update the generateUpdatedData function with proper type handling
const generateUpdatedData = (
  originalData: TimeSeriesDataPoint[] | ProcessedGroupData[]
): typeof originalData => {
  if (isTimeSeriesData(originalData)) {
    return originalData.map(point => ({
      ...point,
      value: Math.min(24, point.value + Math.floor(Math.random() * 5))
    }));
  }

  if (isGroupData(originalData)) {
    // Return our hardcoded updated data instead of generating random changes
    return updatedGroupAnswersData as ProcessedGroupData[];
  }

  return originalData;
};

export const DiscussionChart: React.FC<DiscussionChartProps> = ({ 
  title, 
  id, 
  isDropped,
  currentTime,
  chartType,
  discussionPoint,
  style = {},
  groupAnswers,
  getParticipationData,
  dialogFunc,
  isInCanvas = false,
  onToggleFreeze,
  isFrozen = false,
  getEthicalPerspectives,
  getPopularOpinions,
  getKeywordTrends,
  timeSeriesData,
  addToCanvas,
  onUpdateAccepted,
  onUpdateDenied,
}) => {

  const [activeSection, setActiveSection] = useState<'overview' | 'insights' | 'talkingPoints' | 'suggestions' | null>(
    isDropped ? 'suggestions' : null  // Changed from 'overview' to 'suggestions'
  );
    const [highlightedItems, setHighlightedItems] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(isDropped);

  const [hasUpdate, setHasUpdate] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updateData, setUpdateData] = useState<ChartUpdate | null>(null);
  const updateTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [currentChartData, setCurrentChartData] = useState<TimeSeriesDataPoint[] | ProcessedGroupData[]>([]);

  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [highlightedOpinion, setHighlightedOpinion] = useState<string | null>(null);

  type AnimatedDataPoint = TimeSeriesDataPoint | ProcessedGroupData;

  const [currentDataIndex, setCurrentDataIndex] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);

  const [animationComplete, setAnimationComplete] = useState(false);
  const [finalValues, setFinalValues] = useState<{[key: string]: number}>({});
  const hasInitializedRef = useRef(false);
  
  const [isFirstRender, setIsFirstRender] = useState(true);
const [animatedData, setAnimatedData] = useState<AnimatedDataPoint[]>([]);

useEffect(() => {
  // Get the target data
  let targetData = title.toLowerCase().includes('participation rate') 
    ? PARTICIPATION_DATA
    : getChartData(title);

  if (!targetData || targetData.length === 0) return;

  // If it's not the first render and the chart is being dropped,
  // maintain the current animated data
  if (!isFirstRender && isDropped) {
    return;
  }

  // Calculate final target values
  const targetValues = targetData.map((point, index) => {
    if (isGroupData(targetData)) {
      return Object.entries(point)
        .filter(([key]) => key.startsWith('group'))
        .filter(([_, value]) => value > 0)
        .length;
    } else {
      return (point as TimeSeriesDataPoint).value;
    }
  });

  // If it's the first render, initialize the animation
  if (isFirstRender) {
    // Set initial state with zeros
    if (isGroupData(targetData)) {
      setAnimatedData(targetData.map(point => ({
        ...point,
        mentioningGroups: 0
      })));
    } else if (isTimeSeriesData(targetData)) {
      setAnimatedData(targetData.map(point => ({
        timestamp: point.timestamp,
        value: 0
      })));
    }

    // Start animation after initial state is set
    const timeoutId = setTimeout(() => {
      if (isGroupData(targetData)) {
        setAnimatedData(targetData.map((point, index) => ({
          ...point,
          mentioningGroups: targetValues[index]
        })));
      } else if (isTimeSeriesData(targetData)) {
        setAnimatedData(targetData.map((point, index) => ({
          timestamp: point.timestamp,
          value: targetValues[index]
        })));
      }
      setIsFirstRender(false);
    }, 100);

    return () => clearTimeout(timeoutId);
  }
}, [title, isDropped, isFirstRender]);
  
  // Add useEffect to handle drop state
  useEffect(() => {
    if (isDropped && animationComplete) {
      let targetData = title.toLowerCase().includes('participation rate') 
        ? PARTICIPATION_DATA
        : getChartData(title);
  
      if (!targetData || targetData.length === 0) return;
  
      if (isGroupData(targetData)) {
        setAnimatedData(targetData.map((point, index) => ({
          ...point,
          mentioningGroups: finalValues[`group-${index}`] || 0
        })));
      } else if (isTimeSeriesData(targetData)) {
        setAnimatedData(targetData.map((point, index) => ({
          timestamp: point.timestamp,
          value: finalValues[`time-${index}`] || 0
        })));
      }
    }
  }, [isDropped]);

  const handleHighlight = (word: string, item: any) => {
    // Update highlighted items
    setHighlightedItems(item.highlights);
    
    // Check if we're highlighting our specific phrase and have a target bar
    if (item.highlights.includes("AI copyright infringement") && item.targetBar) {
      setHighlightedOpinion(item.targetBar);
    } else {
      setHighlightedOpinion(null);
    }
  };
  

  useEffect(() => {
    if (isDropped) {
      setActiveSection('suggestions');
      setSidebarVisible(true);
    }
  }, [isDropped]);

  const handleSectionClick = (section: 'overview' | 'insights' | 'talkingPoints' | 'suggestions') => {
    console.log('Button clicked:', section);
    console.log('Current active section:', activeSection);
    
    if (activeSection === section) {
      console.log('Closing section');
      setActiveSection(null);
      setSidebarVisible(false);
    } else {
      console.log('Opening section');
      setActiveSection(section);
      setSidebarVisible(true);
    }
  };

  const [highlightedAnswers, setHighlightedAnswers] = useState<string[]>([]);
  const chartRef = useRef(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  });

  const dragStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0 : 1,
    transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease'
  } : undefined;

  // Calculate summary and distribution data
  const chartData = useMemo(() => {
    // Special handling for participation rate
    if (title.toLowerCase().includes('participation rate')) {
      return timeSeriesData
        .filter(point => point.timestamp <= currentTime)
        .map(point => ({
          timestamp: point.timestamp,
          value: point.value
        }));
    }
    
    // Keep existing logic for other chart types
    const data = getChartData(title);
    
    if (Array.isArray(data)) {
      if (isTimeSeriesData(data)) {
        return data.filter(point => point.timestamp <= currentTime);
      }
      if (isGroupData(data)) {
        const processedData = data.map(item => {
          const mentioningGroups = Object.entries(item)
            .filter(([key, value]) => key.startsWith('group') && value > 0)
            .length;
          
          return {
            ...item,
            mentioningGroups,
          };
        });
        setCurrentChartData(processedData);
        return processedData;
      }
    }
    return [];
  }, [title, currentTime, timeSeriesData]);

  const compareDataChanges = (
    oldData: TimeSeriesDataPoint[] | ProcessedGroupData[],
    newData: TimeSeriesDataPoint[] | ProcessedGroupData[]
  ): string[] => {
    const changes: string[] = [];
  
    if (isGroupData(oldData) && isGroupData(newData)) {
      newData.forEach((newItem, index) => {
        const oldItem = oldData[index];
        const oldGroups = Object.entries(oldItem)
          .filter(([key]) => key.startsWith('group'))
          .filter(([_, value]) => value > 0)
          .length;
        const newGroups = Object.entries(newItem)
          .filter(([key]) => key.startsWith('group'))
          .filter(([_, value]) => value > 0)
          .length;
  
        if (newGroups > oldGroups) {
          changes.push(`More groups engaged with "${newItem.opinion}"`);
        }
      });
    }
  
    if (isTimeSeriesData(oldData) && isTimeSeriesData(newData)) {
      newData.forEach((newItem, index) => {
        const oldItem = oldData[index];
        if (newItem.value > oldItem.value) {
          changes.push(`Participation increased at timestamp ${newItem.timestamp}`);
        }
      });
    }
  
    return changes;
  };

  useEffect(() => {
    if (title.toLowerCase().includes('group answers')) {
      console.log('Starting update timer...');
      updateTimerRef.current = setTimeout(() => {
        console.log('Timer triggered, updating data...');
        
        if (Array.isArray(chartData)) {
          const newData = generateUpdatedData(chartData as (TimeSeriesDataPoint[] | ProcessedGroupData[]));
          
          const changes = compareDataChanges(chartData, newData);
          
          const newUpdateData: ChartUpdate = {
            oldData: chartData,
            newData,
            timestamp: Date.now()
          };
          console.log('Setting new update data:', newUpdateData);
          setUpdateData(newUpdateData);
          setHasUpdate(true);
        }
      }, 60000);
    }
  
    return () => {
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }
    };
  }, [title, chartData]);

  // Handle update actions
  const handleAcceptUpdate = () => {
    if (updateData) {
      setCurrentChartData(updateData.newData);
      onUpdateAccepted?.();
    }
    setShowUpdateDialog(false);
    setHasUpdate(false);
  };


  const handleDenyUpdate = () => {
    onUpdateDenied?.();
    setShowUpdateDialog(false);
    setHasUpdate(false);
  };

  interface DistributionItem {
    group: string;
    mentions: number;
  }
  
  const getDistributionData = (topic: string): DistributionItem[] => {
    // Type guard to ensure we have GroupDataPoint data
    if (!isGroupData(chartData)) return [];
    
    const topicData = chartData.find(item => item.opinion === topic);
    if (!topicData) return [];
  
    // First filter for valid group entries and ensure numeric values
    const validEntries = Object.entries(topicData)
      .filter((entry): entry is [string, number] => {
        const [key, value] = entry;
        return key.startsWith('group') && typeof value === 'number';
      });
  
    // Then transform to DistributionItem array
    const distribution = validEntries
      .map(([group, value]): DistributionItem => ({
        group: `Group ${group.replace('group', '')}`,
        mentions: value
      }))
      .filter(item => item.mentions > 0)
      .sort((a, b) => b.mentions - a.mentions);
  
    return distribution;
  };
  
  const getChartColors = (title: string): readonly string[] => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('popular opinions')) {
      return CHART_TYPE_COLORS.popularOpinions;
    } else if (titleLower.includes('ethical perspectives')) {
      return CHART_TYPE_COLORS.ethicalPerspectives;
    } else if (titleLower.includes('keyword trends')) {
      return CHART_TYPE_COLORS.keywordTrends;
    } else if (titleLower.includes('participation') || titleLower.includes('participation rate')) {
      return CHART_TYPE_COLORS.participation;
    }
    return CHART_TYPE_COLORS.default;
  };
  
  // And add this helper function to process participation data:
  const processParticipationData = (data: TimeSeriesPoint[]): TimeSeriesDataPoint[] => {
    return data.map(point => ({
      timestamp: point.timestamp,
      value: point.value
    }));
  };

const getXAxisLabel = (title: string): string => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('popular opinions')) {
    return 'Opinion';
  } else if (titleLower.includes('ethical perspectives')) {
    return 'Perspective';
  } else if (titleLower.includes('keyword trends')) {
    return 'Keyword';
  }
  return 'Answer';
};

const PARTICIPATION_DATA = [
  { timestamp: 1, value: 4 },    
  { timestamp: 2, value: 5 },    
  { timestamp: 3, value: 6 },    
  { timestamp: 4, value: 8 }    
];


const renderChart = (inputData?: typeof chartData): React.ReactElement => {
  const chartColors = getChartColors(title);
  const data = animatedData.length > 0 ? animatedData : (inputData || currentChartData || chartData);

  const commonProps = {
    width: 320,
    height: 180,
    margin: { top: 10, right: 30, left: 40, bottom: 20 },
  };

  const commonAxisProps = {
    tick: { fontSize: 12 },
    tickLine: { strokeWidth: 1 },
    axisLine: { strokeWidth: 1 },
  };

  // Handle participation rate
if (title.toLowerCase().includes('participation') || title.toLowerCase().includes('participation rate')) {
  // Use animatedData instead of filtering PARTICIPATION_DATA
  return (
    <BarChart 
      data={animatedData} // Changed from filteredData to animatedData
      width={320}
      height={180}
      margin={{ top: 10, right: 30, left: 40, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
      <XAxis 
        dataKey="timestamp"
        label={{ 
          value: 'Participant',
          position: 'bottom',
          offset: 0
        }}
        domain={[1, 4]}
        ticks={[1, 2, 3, 4]}
        tick={{ fontSize: 12 }}
      />
      <YAxis 
        label={{ 
          value: 'Group Number',
          angle: -90,
          position: 'insideLeft',
          offset: 10,
          dy: 40
        }}
        domain={[0, 24]}
        tickFormatter={(value) => value === 24 ? '23' : `${value}`}
        tick={{ fontSize: 12 }}
      />
      <Tooltip
        content={({ active, payload, label }) => {
          if (active && payload && payload.length) {
            return (
              <div className="bg-background p-4 rounded shadow-lg border border-border">
                <p className="font-medium">
                  Active Groups: {payload[0].value}
                </p>
                <p className="text-sm text-muted-foreground">
                  Time Period: {label}
                </p>
              </div>
            );
          }
          return null;
        }}
      />
      <Bar 
        dataKey="value"
        fill={chartColors[0]}
        maxBarSize={40}
      >
        {animatedData.map((_, index) => (  // Changed from filteredData to animatedData
          <Cell 
            key={`cell-${index}`}
            fill={chartColors[index % chartColors.length]}
          />
        ))}
      </Bar>
    </BarChart>
  );
}

  // Distribution view for selected topic
  if (selectedTopic && isGroupData(data)) {
    const distributionData = getDistributionData(selectedTopic);
    
    return (
      <div className="relative h-full w-full" style={{ marginLeft: '-65px', marginTop: '-17px' }}>
        <div className="absolute top-15 -right-12 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedTopic(null)}
          >
            <X className="h-4 w-4"/>
          </Button>
        </div>
        <div style={{ width: '320px', height: '180px' }}>
          <BarChart 
            width={320}
            height={180}
            data={distributionData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis 
              type="number"
              label={{ 
                value: 'Number of Mentions',
                position: 'bottom',
                offset: 0
              }}
            />
            <YAxis 
              type="category" 
              dataKey="group" 
              width={80}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background p-4 rounded shadow-lg border border-border">
                      <p className="font-bold mb-2">{label}</p>
                      <p className="font-medium">
                        {payload[0].value} mentions
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="mentions" 
              fill={chartColors[0]}
              background={{ fill: 'hsl(var(--muted))' }}
            />
          </BarChart>
        </div>
      </div>
    );
  }

  // Empty state
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <BarChart data={[]} {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis {...commonAxisProps} />
        <YAxis {...commonAxisProps} />
        <Tooltip />
        <Bar dataKey="value" fill="hsl(var(--primary))" />
      </BarChart>
    );
  }

  // Main view with colored bars
  if (isGroupData(data)) {
    const processedData = data.map((item, index) => ({
      ...item,
      index: (index + 1).toString(),
    }));

    return (
      <BarChart 
        data={processedData}
        {...commonProps}
        onClick={(data) => {
          if (!inputData && data && data.activePayload && data.activePayload[0]) {
            const clickedData = processedData[Number(data.activeLabel) - 1];
            if (clickedData) {
              setSelectedTopic(clickedData.opinion);
            }
          }
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          {...commonAxisProps} 
          dataKey="index"
          label={{ 
            value: getXAxisLabel(title),
            position: 'bottom',
            dx: -10,
          }}
        />
        <YAxis
          {...commonAxisProps}
          label={{ 
            value: 'Number of Groups',
            angle: -90,
            position: 'insideLeft',
            offset: 10,
            dy: 50 
          }}
          domain={[0, 24]}
          ticks={[0, 5, 10, 15, 20, 24]}
          tickFormatter={(value) => value === 24 ? '23' : `${value}`}
          interval={0}
          allowDecimals={false}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const currentItem = processedData[Number(label) - 1];
              if (!currentItem) return null;

              return (
                <div className="bg-background p-4 rounded shadow-lg border border-border">
                  <p className="font-bold mb-2">{currentItem.opinion}</p>
                  {!inputData && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Click to see distribution
                    </p>
                  )}
                </div>
              );
            }
            return null;
          }}
          offset={25}
          wrapperStyle={{ 
            zIndex: 100,
            transform: 'translate(60px, 140px)'
          }}
        />
        <Bar
          dataKey="mentioningGroups"
          cursor={!inputData ? 'pointer' : undefined}
          maxBarSize={50}
        >
          {processedData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.opinion === highlightedOpinion 
                ? "hsl(220, 79%, 48%)"
                : chartColors[index % chartColors.length]
              }
              opacity={highlightedOpinion && entry.opinion !== highlightedOpinion ? 1 : 1}
            />
          ))}
        </Bar>
      </BarChart>
    );
  }

  // Time series data
  if (isTimeSeriesData(data)) {
    return (
      <LineChart data={data} {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          {...commonAxisProps} 
          dataKey="timestamp"
          label={{ 
            value: 'Time',
            position: 'bottom',
            offset: 0
          }}
        />
        <YAxis
          {...commonAxisProps}
          label={{ 
            value: 'Value',
            angle: -90,
            position: 'insideLeft',
            offset: 10
          }}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke={chartColors[0]}
          strokeWidth={2}
          dot={{ fill: chartColors[0] }}
        />
      </LineChart>
    );
  }

  // Fallback empty state
  return (
    <BarChart data={[]} {...commonProps}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis {...commonAxisProps} />
      <YAxis {...commonAxisProps} />
      <Tooltip />
      <Bar dataKey="value" fill="hsl(var(--primary))" />
    </BarChart>
  );
};

const renderSideContent = () => (
  <AnimatePresence mode="wait">
    {activeSection && (
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        className="space-y-2" // Reduced spacing
      >
        <h3 className="text-sm font-semibold capitalize">
          {activeSection === 'overview' && 'Chart Overview'}
          {activeSection === 'insights' && 'Key Insights'}
          {activeSection === 'talkingPoints' && 'Talking Points'}
          {activeSection === 'suggestions' && 'Suggestions'}
        </h3>
        <div className="space-y-2"> {/* Reduced spacing */}
          {summaryContent[activeSection].map((item, index) => (
            <div 
              key={index}
              className="p-2 rounded-lg bg-muted/50 transition-colors duration-200 relative group" // Added relative and group
            >
              {/* Add button */}
              {addToCanvas && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-background border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => addToCanvas(item.text)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
              {item.text.split(' ').map((word, wordIndex, wordsArray) => {
                // Check if this word starts a highlight phrase
                const highlightPhrase = item.highlights.find(phrase => 
                  phrase.startsWith(word) && 
                  wordsArray.slice(wordIndex, wordIndex + phrase.split(' ').length).join(' ') === phrase
                );
                
                if (highlightPhrase) {
                  // Create the highlighted phrase span
                  const phraseLength = highlightPhrase.split(' ').length;
                  const fullPhrase = wordsArray.slice(wordIndex, wordIndex + phraseLength).join(' ');
                  
                  if (word === fullPhrase.split(' ')[0]) {
                    return (
                      <span
                        key={wordIndex}
                        className="inline-block rounded text-primary underline decoration-primary/30 hover:decoration-primary cursor-pointer font-medium px-0.5"
                        onMouseEnter={() => handleHighlight(highlightPhrase, item)}
                        onMouseLeave={() => {
                          setHighlightedItems([]);
                          setHighlightedOpinion(null);
                        }}
                      >
                        {fullPhrase}{' '}
                      </span>
                    );
                  }
                  // Skip words that are part of an already rendered phrase
                  return null;
                }
                
                // Render non-highlighted words normally
                return (
                  <span key={wordIndex} className="px-0.5">
                    {word}{' '}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

return (
  <div className="relative flex flex-col md:flex-row gap-8">
    <Card 
      className={`w-full border rounded-md bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow duration-200 ${sidebarVisible ? 'md:w-1/2' : 'w-full'}`}
      ref={setNodeRef} 
      style={{
        ...dragStyle,
        ...style,
        position: isDropped ? 'absolute' : 'relative',
        background: 'hsl(var(--background))',
        width: '350px',
        height: '250px',
        transition: 'all 0.3s ease-in-out',
        border: hasUpdate ? '2px solid rgb(239, 68, 68)' : undefined
      }}
    >
      {hasUpdate && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-4 right-4 z-10"
        >
          <Button
            variant="destructive"
            size="sm"
            className="rounded-full p-2"
            onClick={() => setShowUpdateDialog(true)}
          >
            <AlertTriangle className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
      <CardHeader className="p-3 pb-2">
        <div
          className="flex justify-between items-center"
          {...attributes}
          {...listeners}
          style={{ cursor: isDropped ? 'default' : 'move' }}
        >
          <div className="flex items-center gap-2">
            <CardTitle className="text-xs font-medium">
              {selectedTopic ? `${title}: ${selectedTopic}` : title}
            </CardTitle>
            {isInCanvas && onToggleFreeze && (
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-muted/60 ml-1"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFreeze(id);
                }}
              >
                {isFrozen ? (
                  <Play className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <Pause className="h-3 w-3 text-muted-foreground" />
                )}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              {[
                { section: 'overview' as const, icon: <Info className="h-3 w-3" />, tooltip: 'Chart Overview' },
                { section: 'insights' as const, icon: <LineChartIcon className="h-3 w-3" />, tooltip: 'Key Insights' },
                { section: 'talkingPoints' as const, icon: <Network className="h-3 w-3" />, tooltip: 'Talking Points' },
                { section: 'suggestions' as const, icon: <Lightbulb className="h-3 w-3" />, tooltip: 'View Suggestions' }
              ].map(({ section, icon, tooltip }) => (
                <TooltipPrimitive key={section}>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className={`h-6 w-6 ${activeSection === section ? 'bg-primary text-primary-foreground' : ''}`}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSectionClick(section);
                      }}
                    >
                      {icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">{tooltip}</p>
                  </TooltipContent>
                </TooltipPrimitive>
              ))}
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <ChartContainer
          config={{
            mentioningGroups: {
              label: "Groups Mentioning Topic",
              color: "hsl(var(--primary))",
            },
            mentions: {
              label: "Number of Mentions",
              color: "hsl(var(--primary))",
            },
          }}
          className="h-[180px]" 
          style={{ marginLeft: '-37px', marginTop: '15px' }}
        >
          <div style={{ width: '320px', height: '180px' }}>
            {renderChart()}
          </div>
        </ChartContainer>
      </CardContent>
    </Card>

    {/* Update Dialog */}
    <AlertDialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
  <AlertDialogContent className="sm:max-w-[800px]">
    <AlertDialogHeader>
      <AlertDialogTitle>Chart Update Available</AlertDialogTitle>
      <AlertDialogDescription className="space-y-2">
        <p>New data has been received for this chart. Compare the versions below:</p>
       
      </AlertDialogDescription>
    </AlertDialogHeader>
    
    <div className="grid grid-cols-2 gap-4 py-4">
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Current Version</h4>
        <div className="border rounded-lg p-4">
          <ChartContainer
            config={{
              mentioningGroups: {
                label: "Groups Mentioning Topic",
                color: "hsl(var(--primary))",
              },
              mentions: {
                label: "Number of Mentions",
                color: "hsl(var(--primary))",
              },
            }}
            className="h-[180px]"
          >
            <div style={{ width: '320px', height: '180px' }}>
              {updateData && renderChart(updateData.oldData)}
            </div>
          </ChartContainer>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium text-sm">New Version</h4>
        <div className="border rounded-lg p-4">
          <ChartContainer
            config={{
              mentioningGroups: {
                label: "Groups Mentioning Topic",
                color: "hsl(var(--primary))",
              },
              mentions: {
                label: "Number of Mentions",
                color: "hsl(var(--primary))",
              },
            }}
            className="h-[180px]"
          >
            <div style={{ width: '320px', height: '180px' }}>
              {updateData && renderChart(updateData.newData)}
            </div>
          </ChartContainer>
        </div>
      </div>
    </div>

    <AlertDialogFooter>
      <AlertDialogCancel onClick={handleDenyUpdate}>
        Keep Current Version
      </AlertDialogCancel>
      <AlertDialogAction onClick={handleAcceptUpdate}>
        Accept New Version
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

    {/* Sidebar */}
    {(sidebarVisible && activeSection) && (
      <div 
        className="fixed md:relative md:w-1/2 h-full transition-transform duration-300 left-[370px] top-20"
        style={{
          zIndex: 50,
          transform: sidebarVisible ? 'translateX(0)' : 'translateX(100%)'
        }}
      >
        <Card className="h-full w-full relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={() => {
              setActiveSection(null);
              setSidebarVisible(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardContent className="p-6">
            {renderSideContent()}
          </CardContent>
        </Card>
      </div>
    )}
  </div>
);
}
export default DiscussionChart;