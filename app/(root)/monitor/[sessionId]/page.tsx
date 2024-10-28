"use client";

import React, { useState, useCallback, SyntheticEvent } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  MeasuringStrategy,
  UniqueIdentifier
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { BarChart as BarChartIcon, LineChart as LineChartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogPortal, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { DiscussionChart } from "@/components/discussionDashboard/DiscussionChart";
import { DropZone } from "@/components/discussionDashboard/DropZone";
import { ChartSelector } from "@/components/discussionDashboard/ChartSelector";
import { TimeControls } from "@/components/discussionDashboard/TimeControls";
import { useTimeControl } from "@/lib/hooks/discussionDashboard/useTimeControl";
import { useChartData } from "@/lib/hooks/discussionDashboard/useChartData";
import { 
  AVAILABLE_CHARTS, 
  discussionTasks, 
  DroppedItem, 
  DiscussionPointSettings, 
  ChartType,
  TopicData, 
  TimeSeriesData
} from '@/lib/data/participationRate';
import { TextBox } from "@/components/discussionDashboard/TextBox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ArrowCanvas  from "@/components/discussionDashboard/ArrowCanvas"
import axios from 'axios';

const defaultChartTitle = ["Participation Rate", "Question Coverage", "Group Answers", "Ethical Perspectives", "Popular Opinions", "Keyword Trends"]

const gptService = {
  getGraphLegends: async (discussionPointIndex: number, highLevelIdea: string) => {
    try {
      const response = await axios.post('/api/gpt/gptService', {
        discussionPointIndex,
        highLevelIdea
      });
      return response.data.data;
    } catch (error) {
      console.error('Error getting graph legends:', error);
      throw error;
    }
  },

  getNewQuestionsForClass: async (discussionPointIndex: number, highLevelIdea: string) => {
    try {
      const response = await axios.post('/api/gpt/gptService2', {
        discussionPointIndex,
        highLevelIdea
      });
      return response.data.data;
    } catch (error) {
      console.error('Error getting questions:', error);
      throw error;
    }
  }
};

const DiscussionDashboard = () => {
  // Time Control State
  const [duration] = useState(600); // 10 minutes
  const { currentTime, isPlaying, togglePlay, handleTimeChange } = useTimeControl(duration);
  const [genGraphTopic, setGenGraphTopic] = useState("");
  const [focusedDiscussionPoint, setFocusedDiscussionPoint] = useState(1);
  const [focusedNumGroups, setFocusedNumGroups] = useState(0);
  const [genSummaries, setGenSummaries] = useState([]);
  const [genTalkingPoints, setGenTalkingPoints] = useState([]);

  const [frozenCharts, setFrozenCharts] = useState<string[]>([]);

  const [highestZIndex, setHighestZIndex] = useState(1);
  const [zIndices, setZIndices] = useState<{[key: string]: number}>({});

  const [arrows, setArrows] = useState<{
    [slideId: string]: Array<{
      id: string;
      start: { x: number; y: number };
      end: { x: number; y: number };
    }>;
  }>({});
  
  const handleArrowComplete = (arrow: { start: { x: number; y: number }; end: { x: number; y: number }; slideId: string }) => {
    setArrows(prev => ({
      ...prev,
      [arrow.slideId]: [
        ...(prev[arrow.slideId] || []),
        {
          id: `arrow-${Date.now()}`,
          start: arrow.start,
          end: arrow.end,
        },
      ],
    }));
  };

  const [isDrawing, setIsDrawing] = useState(false);

const toggleDrawing = () => {
  setIsDrawing(!isDrawing);
};


  const getNextZIndex = () => {
    setHighestZIndex(prev => prev + 1);
    return highestZIndex + 1;
  };

  const handleToggleFreeze = useCallback((chartId: string) => {
    setFrozenCharts(prev => {
      if (prev.includes(chartId)) {
        return prev.filter(id => id !== chartId);
      } else {
        return [...prev, chartId];
      }
    });
  }, []);

  const [textBoxes, setTextBoxes] = useState<{
    [slideId: string]: {
      [textBoxId: string]: { text: string; position: { x: number; y: number }; size: { width: number; height: number } };
    };
  }>({});
  
  const addTextBox = (slideId: string, initText: string) => {
    const id = `text-${Object.keys(textBoxes[slideId] || {}).length + 1}`;
    let displayText = initText || 'New Text';
    if (typeof displayText !== 'string') {
      displayText = 'New Text';
    }
    const newZIndex = getNextZIndex();
    setZIndices(prev => ({
      ...prev,
      [id]: newZIndex
    }));
    setTextBoxes((prev) => ({
      ...prev,
      [slideId]: {
        ...(prev[slideId] || {}),
        [id]: { 
          text: displayText, 
          position: { x: 100, y: 100 }, 
          size: { width: 200, height: 100 }
        },
      },
    }));
  };
  
  const updateTextBoxPosition = (slideId: string, id: string, newPosition: { x: number; y: number }) => {
    setTextBoxes((prev) => ({
      ...prev,
      [slideId]: {
        ...prev[slideId],
        [id]: { ...prev[slideId][id], position: newPosition },
      },
    }));
  };
  
  const updateTextBoxSize = (slideId: string, id: string, newSize: { width: number; height: number }) => {
    setTextBoxes((prev) => ({
      ...prev,
      [slideId]: {
        ...prev[slideId],
        [id]: { ...prev[slideId][id], size: newSize },
      },
    }));
  };
  
  const handleTextChange = (slideId: string, id: string, newText: string) => {
    setTextBoxes((prev) => ({
      ...prev,
      [slideId]: {
        ...prev[slideId],
        [id]: { ...prev[slideId][id], text: newText },
      },
    }));
  };
  
  const deleteTextBox = (slideId: string, id: string) => {
    setTextBoxes((prev) => {
      const updatedSlideTextBoxes = { ...prev[slideId] };
      delete updatedSlideTextBoxes[id];
      return {
        ...prev,
        [slideId]: updatedSlideTextBoxes,
      };
    });
  };


   // storing generated charts here
  // quick solution
  // Structure of this mapping
  // [
  //    {
  //        dataId: string
  //        groupNum: number of groups aka the overall count
  //        discussionPoint: number, e.g., 1
  //        distribution: [{
  //          index: number, e.g., 0,
  //          fullText: string. Basically the x-axis legend
  //          frequency: number e.g., 14  
  //        }]
  //    }
  // ]
  interface Distribution {
    index: string;
    fullText: string;
    frequency: number;
  }
  
  interface ChartData {
    dataId: string;
    groupNum: number;
    discussionPoint: number;
    distribution: Distribution[];
  }
  const [genChartDataList, setGenChartDataList] = useState<ChartData[]>([])

  const populateAndOpenDialog = (prefilledText: string, focusedDiscussionPoint: number, focusedNumGroups: number) => {
    setGenGraphTopic(prefilledText)
    setFocusedDiscussionPoint(focusedDiscussionPoint)
    setFocusedNumGroups(focusedNumGroups)
    document.getElementById("discussionPoint1")?.click()
  };

  const populateNewGraph = (dataId: string, groupNum: number, questionNum: number, legends: string[]): void => {
    // randomize with respect to the number of groups
    const categoryNum = legends.length

    const assignedItems = assignItemsToCategories(groupNum, legends)
    let assignedDistribution = []
    for (const [index, [key, value]] of Object.entries(Object.entries(assignedItems))) {
      assignedDistribution.push({
        index: index,
        fullText: key,
        frequency: value
      })
    }

    const groupInfoValue = {
      "dataId": dataId,
      "groupNum": groupNum,
      "discussionPoint": questionNum,
      "distribution": assignedDistribution
     }

     setGenChartDataList((prevData) => [...prevData, groupInfoValue]);
  }

  const getGenGraph = (discussionPoint: number, chartType: string): TimeSeriesData[] => {
    const chartData = genChartDataList.find(item => item.dataId === chartType+discussionPoint)
    if (!chartData) {
      return []
    }
    const transformedData: { topic: string; topicText: string; counts: { timestamp: number; count: number; }[]; }[] = []
    const distribution = chartData?.distribution
    const distLength = distribution?.length || 0
    for (let i = 0; i < distLength; i++) {
      const dist = distribution[i]
      let obj = {
        topic: "Answer " + (i+1),
        topicText: dist.fullText,
        counts: [{
          timestamp: 60,
          count: dist.frequency
        }]
      }
      transformedData.push(obj)
    }

    // Copied from getAnswerTimeSeriesData
    const allTimestamps = transformedData
      .flatMap(topic => topic.counts.map(count => count.timestamp))
      .sort((a, b) => a - b);

    if (allTimestamps.length === 0) return [];

    const uniqueTimestamps = Array.from(new Set(allTimestamps)).sort((a, b) => a - b);

    const finalAnswer = uniqueTimestamps.map(timestamp => {
      const answersAtTime = transformedData.map(topic => {
        const relevantCounts = topic.counts.filter(count => count.timestamp <= timestamp);
        const currentCount = relevantCounts.length > 0 
          ? relevantCounts[relevantCounts.length - 1].count 
          : 0;

        return {
          text: topic.topicText,
          count: currentCount
        };
      }).filter(answer => answer.count > 0);

      const totalGroups = answersAtTime.reduce((sum, a) => sum + a.count, 0);

      return {
        timestamp: 60,
        value: totalGroups,
        answers: answersAtTime
      };
    });
    
    return finalAnswer;
  }

  const assignItemsToCategories = (count: number, categories: string[]) => {
    const numCategories = categories.length;

    if (count < numCategories) {
        throw new Error("Count must be at least the number of categories.");
    }

    // Step 1: Give each category at least 1 item
    const categoryCounts: number[] = Array(numCategories).fill(1);
    let remainingItems = count - numCategories; // Remaining items to distribute

    // Step 2: Randomly distribute remaining items
    while (remainingItems > 0) {
        const randomIndex = Math.floor(Math.random() * numCategories);
        categoryCounts[randomIndex]++;
        remainingItems--;
    }

    // Step 3: Create result map from categories to counts
    const result: Record<string, number> = {};
    categories.forEach((category, index) => {
        result[category] = categoryCounts[index];
    });

    return result;
  }
  
  const submitNewGraphRequest = async () => {
    if (genGraphTopic.length === 0) {
      return;
    }
    try {
      // send genGraphTopic to ChatGPT
      const graphLegendList = await gptService.getGraphLegends(focusedDiscussionPoint, genGraphTopic);
  
      // This works but it is being added to all questions
      AVAILABLE_CHARTS.push({
        id: genGraphTopic + focusedDiscussionPoint,
        title: genGraphTopic,
        dataKey: genGraphTopic + focusedDiscussionPoint,
        type: 'count',
        visible: true
      });
      populateNewGraph(genGraphTopic + focusedDiscussionPoint, focusedNumGroups, focusedDiscussionPoint, graphLegendList);
  
      setGenGraphTopic("");
    } catch (error) {
      console.error('Error in submitNewGraphRequest:', error);
    }
  };

  // same API as new graph, but use only the labels
  const submitNewSummaryRequest = async () => {
    if (genGraphTopic.length === 0) {
      return;
    }
    // send genGraphTopic to ChatGPT
    const graphLegendList = await gptService.getGraphLegends(focusedDiscussionPoint, genGraphTopic);
    setGenSummaries(graphLegendList)
  }

  const submitNewTalkingPointRequest = async () => {
    if (genGraphTopic.length === 0) {
      return;
    }
    try {
      const questionList = await gptService.getNewQuestionsForClass(focusedDiscussionPoint, genGraphTopic);
      setGenTalkingPoints(questionList);
    } catch (error) {
      console.error('Error in submitNewTalkingPointRequest:', error);
    }
  };
  // Chart and Layout State
  const [droppedItems, setDroppedItems] = useState<{[key: string]: DroppedItem[]}>({
    'drop-1': [],
    'drop-2': [],
    'drop-3': []
  });

  const [pointSettings, setPointSettings] = useState<{[key: number]: DiscussionPointSettings}>({
    1: {
      chartType: 'bar' as ChartType,
      // Set all charts to visible initially
      visibleCharts: Object.fromEntries(
        AVAILABLE_CHARTS.map(chart => [chart.id, true])
      )
    },
    2: {
      chartType: 'bar' as ChartType,
      visibleCharts: Object.fromEntries(
        AVAILABLE_CHARTS.map(chart => [chart.id, true])
      )
    },
    3: {
      chartType: 'bar' as ChartType,
      visibleCharts: Object.fromEntries(
        AVAILABLE_CHARTS.map(chart => [chart.id, true])
      )
    }
  });

  // Drag and Drop State
  const [previousState, setPreviousState] = useState<{
    droppedItems: typeof droppedItems;
    usedCharts: typeof usedCharts;
    textBoxes: typeof textBoxes;
    arrows: typeof arrows;
  } | null>(null);

  const [usedCharts, setUsedCharts] = useState<{ [key: number]: string[] }>({
    1: [],
    2: [],
    3: []
  });

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  // Sample group answers data
  const [groupAnswers] = useState<TopicData[]>([
    {
      "topic": "Answer 1",
      "topicText": "Generative AI's use of copyrighted datasets without permission contributes to copyright infringement",
      "groups": [
        { "groupId": "group 13", "timestamp": 10 },
        { "groupId": "group 16", "timestamp": 25 }
      ],
      "counts": [
        { "timestamp": 10, "count": 1 },
        { "timestamp": 35, "count": 2 }
      ]
    },
    {
      "topic": "Answer 2",
      "topicText": "Implementing robust tracking mechanisms for data sourcing",
      "groups": [
        { "groupId": "group 5", "timestamp": 15 },
        { "groupId": "group 10", "timestamp": 30 },
        { "groupId": "group 11", "timestamp": 45 },
        { "groupId": "group 12", "timestamp": 60 },
        { "groupId": "group 19", "timestamp": 75 }
      ],
      "counts": [
        { "timestamp": 45, "count": 1 },
        { "timestamp": 50, "count": 2 },
        { "timestamp": 75, "count": 3 },
        { "timestamp": 85, "count": 4 },
        { "timestamp": 90, "count": 5 }
      ]
    },
    {
      "topic": "Answer 3",
      "topicText": "Intellectual property might be improperly used in creating ML training datasets",
      "groups": [
        { "groupId": "group 21", "timestamp": 50 },
        { "groupId": "group 22", "timestamp": 40 },
        { "groupId": "group 24", "timestamp": 65 }
      ],
      "counts": [
        { "timestamp": 20, "count": 1 },
        { "timestamp": 40, "count": 2 },
        { "timestamp": 65, "count": 3 }
      ]
    },
    {
      "topic": "Answer 4",
      "topicText": "AI can be trained on protected work without permission",
      "groups": [
        { "groupId": "group 1", "timestamp": 35 }
      ],
      "counts": [
        { "timestamp": 35, "count": 1 }
      ]
    },
    {
      "topic": "Answer 5",
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
    }
  ]);

  const q1Data = useChartData(1, currentTime);
  const q2Data = useChartData(2, currentTime);
  const q3Data = useChartData(3, currentTime);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const determineAndGetTimeSeriesData = (point: number, chartTitle: string) => {
    const questionData = {
      1: q1Data,
      2: q2Data,
      3: q3Data
    }[point];
  
    if (!questionData) return [];
  
    if (defaultChartTitle.includes(chartTitle)) {
      return questionData.getTimeSeriesData(chartTitle);
    } else {
      return getGenGraph(point, chartTitle);
    }
  };

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    if (!over) return;

    // Increase z-index when element is dragged
    const newZIndex = getNextZIndex();
    setZIndices(prev => ({
      ...prev,
      [active.id]: newZIndex
    }));

    if (active.id.startsWith('text-')) {
      // Handle text box drag end
      const id = active.id;
      const slideId = over.id.replace('drop-', 'slide-');
      const dropZoneElement = document.getElementById(over.id);
      if (!dropZoneElement) return;

      const dropZoneRect = dropZoneElement.getBoundingClientRect();
      const initialRect = active.rect.current.initial;

      const translatedX = initialRect.left + event.delta.x;
      const translatedY = initialRect.top + event.delta.y;

      const relativeX = translatedX - dropZoneRect.left;
      const relativeY = translatedY - dropZoneRect.top;

      updateTextBoxPosition(slideId, id, { x: relativeX, y: relativeY });
      return;
    }

    const sourceId = active.id as string;
    const targetId = over.id as string;

    const chartInfo = AVAILABLE_CHARTS.find(chart => 
      chart.id === sourceId.split('-')[2] || chart.title === sourceId.split('-')[2]
    );

    if (!chartInfo) return;

    const point = parseInt(sourceId.split('-')[1], 10);
    const currentChartType = pointSettings[point].chartType;
    const currentTimeSeriesData = determineAndGetTimeSeriesData(point, chartInfo.title);
    const droppedAtTime = currentTime;

    setPreviousState({
      droppedItems: { ...droppedItems },
      usedCharts: { ...usedCharts },
      textBoxes: { ...textBoxes },
      arrows: { ...arrows },
    });

    setDroppedItems(prevDroppedItems => {
      const newItems = { ...prevDroppedItems };
      const targetItems = newItems[targetId] || [];
      const dropZoneElement = document.getElementById(targetId);
      if (!dropZoneElement) return prevDroppedItems;

      const dropZoneRect = dropZoneElement.getBoundingClientRect();
      const initialRect = active.rect.current.initial;
      
      const translatedX = initialRect.left + event.delta.x;
      const translatedY = initialRect.top + event.delta.y;

      const relativeX = translatedX - dropZoneRect.left;
      const relativeY = translatedY - dropZoneRect.top;

      if (!targetItems.some(existing => existing.originalTitle === chartInfo.title)) {
        newItems[targetId] = [
          ...targetItems,
          {
            chartId: sourceId,
            originalTitle: chartInfo.title,
            chartType: currentChartType,
            timeSeriesData: currentTimeSeriesData,
            currentTime: droppedAtTime,
            position: { x: relativeX, y: relativeY }
          }
        ];
      } else {
        newItems[targetId] = targetItems.map(existing => 
          existing.originalTitle === chartInfo.title 
            ? {
                ...existing,
                position: {
                  x: existing.position.x + event.delta.x,
                  y: existing.position.y + event.delta.y
                }
              }
            : existing
        );
      }

      return newItems;
    });

    setUsedCharts(prevUsedCharts => ({
      ...prevUsedCharts,
      [point]: [...(prevUsedCharts[point] || []), chartInfo.title]
    }));
  }, [droppedItems, usedCharts, pointSettings, currentTime, determineAndGetTimeSeriesData, updateTextBoxPosition]);

  const handleUndo = () => {
    setArrows(prev => {
      const updatedArrows: typeof arrows = {};
      Object.keys(prev).forEach(slideId => {
        updatedArrows[slideId] = prev[slideId].slice(0, -1);
      });
      return updatedArrows;
    });
  
    if (previousState) {
      setDroppedItems(previousState.droppedItems);
      setUsedCharts(previousState.usedCharts);
      setTextBoxes(previousState.textBoxes);
      setPreviousState(null);
    }
  };
  
  const addTextToCanvas = (e: React.MouseEvent<HTMLElement>, slideId: string) => {
    const targetId = e.currentTarget.id;
    let text = 'New Text';
    if (targetId.startsWith('summaryButton')) {
      const index = targetId.substring('summaryButton'.length);
      text = document.getElementById('summaryParagraph' + index)?.textContent || text;
    } else {
      const index = targetId.substring('talkingButton'.length);
      text = document.getElementById('talkingParagraph' + index)?.textContent || text;
    }
    addTextBox(slideId, text);
  };

  const genMenuButtonClicked = (e: React.MouseEvent<HTMLElement>) => {
    const targetId = e.currentTarget.id;
    if (targetId.startsWith("genButton")) {
      const discussionPoint = targetId.substring("genButton".length);
      setFocusedDiscussionPoint(Number(discussionPoint))
      document.getElementById("discussionPoint1")?.click()
    }
  };
  

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => {
        setActiveId(active.id);
        // Bring dragged element to front
        const newZIndex = getNextZIndex();
        setZIndices(prev => ({
          ...prev,
          [active.id]: newZIndex
        }));
      }}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always
        }
      }}
    >
      <div className="space-y-4 p-6">
        {[1, 2, 3].map((point) => (
          <div key={point} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left Column: Source Charts for this point */}
            <div>
              {/* Content for discussion point */}
              <section 
                key={`left-${point}`} 
                className={`border-t border-border pt-6 first:border-t-0 first:pt-0 transition-all duration-300 ${
                  'mb-6'
                }`}
              >
                <div className={`mb-6 scale-95`}>
                  <div className="flex flex-col gap-1 mb-4">
                    <div className="flex items-center justify-between">
                      <Dialog>
                        <DialogTrigger>
                          <h2 id={`discussionPoint${point}`} className="text-2xl font-semibold">
                            Q{point}: {discussionTasks[point].title}
                          </h2>
                        </DialogTrigger>
                        <DialogPortal>
                          <DialogContent>
                            <DialogTitle>
                              Menu
                            </DialogTitle>
                            <Accordion type="single" defaultValue={"item1"} collapsible>
                              <AccordionItem value="item1">
                                <AccordionTrigger>Generating New Graph</AccordionTrigger>
                                <AccordionContent>
                                  <fieldset className="Fieldset" style={{display: 'grid'}}>
                                    <label className="Label" htmlFor="name">
                                      Graph Topic on Discussion Point {focusedDiscussionPoint}
                                    </label>
                                    <textarea id="name" defaultValue={genGraphTopic} style={{backgroundColor: "#f2f0ef"}}/>
                                  </fieldset>
                                  <Button style={{width: "100%"}} onClick={submitNewGraphRequest}>Generate New Graph 📈</Button>
                                </AccordionContent>
                              </AccordionItem>
                              <AccordionItem value="item2">
                                <AccordionTrigger>Browse Summaries from Groups 💬</AccordionTrigger>
                                <AccordionContent>
                                  <div style={{backgroundColor: "#e8f4f8", marginBottom: '3px'}}>
                                    <p>"Ethical implications of using AI to create copyrighted content" by Group 5, 12</p>
                                    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                                    <Button onClick={() => addTextBox(`slide-${point}`, '"Ethical implications of using AI to create copyrighted content" by Group 5, 12')}>
                                      Add to Canvas
                                    </Button>
                                    </div>
                                  </div>
                                  <div style={{backgroundColor: "#e8f4f8", marginBottom: '3px'}}>
                                    <p>"Impact of generative AI on the originality and creativity of human artists" by Group 21</p>
                                    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                                    <Button onClick={() => addTextBox(`slide-${point}`, '"Impact of generative AI on the originality and creativity of human artists" by Group 21')}>
                                      Add to Canvas
                                    </Button>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                              <AccordionItem value="item3">
                                <AccordionTrigger>Generating Talking Points</AccordionTrigger>
                                <AccordionContent>
                                  <fieldset className="Fieldset" style={{display: 'grid'}}>
                                    <label className="Label" htmlFor="name">
                                      Questions for the Class on Discussion Point {focusedDiscussionPoint}
                                    </label>
                                    <textarea id="name" defaultValue={genGraphTopic} style={{backgroundColor: "#f2f0ef"}}/>
                                  </fieldset>
                                  <Button style={{width: "100%"}} onClick={submitNewTalkingPointRequest}>
                                    Generate New Talking Points 🤔
                                  </Button>
                                  {genTalkingPoints.map((talkingPoint, index) => (
                                    <div key={index} style={{ backgroundColor: "#e8f4f8", marginBottom: '3px' }}>
                                      <p>{talkingPoint}</p>
                                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button onClick={() => addTextBox(`slide-${point}`, talkingPoint)}>
                                          Add to Canvas
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </DialogContent>
                        </DialogPortal>
                      </Dialog>
                    </div>
                    <p className={`text-muted-foreground transition-all duration-300 ${
                      'line-clamp-2'
                    }`}>
                      {discussionTasks[point].subtitle}
                    </p>
                  </div>
                  <div className={`transition-all duration-300 ${
                    'opacity-100'
                  }`}>
                    <div className="flex items-center justify-end gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Chart Type:</span>
                        <Select 
                          value={pointSettings[point].chartType} 
                          onValueChange={(value: ChartType) => {
                            setPointSettings(prev => ({
                              ...prev,
                              [point]: {
                                ...prev[point],
                                chartType: value
                              }
                            }));
                          }}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bar">
                              <div className="flex items-center gap-2">
                                <BarChartIcon className="w-4 h-4" />
                                <span>Bar Chart</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="line">
                              <div className="flex items-center gap-2">
                                <LineChartIcon className="w-4 h-4" />
                                <span>Line Chart</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium whitespace-nowrap">Show Graphs:</span>
                        <ChartSelector 
                          discussionPoint={point}
                          onSelect={(chartIds) => {
                            setPointSettings(prev => ({
                              ...prev,
                              [point]: {
                                ...prev[point],
                                visibleCharts: Object.fromEntries(
                                  AVAILABLE_CHARTS.map(chart => [
                                    chart.id, 
                                    chartIds.includes(chart.id)
                                  ])
                                )
                              }
                            }));
                          }}
                          currentSelection={pointSettings[point].visibleCharts}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 w-full transition-all duration-300 ${
                  'scale-95 opacity-100'
                }`}>
                  {AVAILABLE_CHARTS
                    .filter(chart => 
                      pointSettings[point].visibleCharts[chart.id] && 
                      !usedCharts[point].includes(chart.title)
                    )
                    .map((chart) => {
                      const questionData = {
                        1: q1Data,
                        2: q2Data,
                        3: q3Data
                      }[point];

                      return (
                        <DiscussionChart 
                          key={`chart-${point}-${chart.title}`}
                          title={chart.title}
                          timeSeriesData={determineAndGetTimeSeriesData(point, chart.title)}
                          id={`chart-${point}-${chart.title}`}
                          isDropped={false}
                          currentTime={currentTime}
                          chartType={chart.title === "Participation Rate" ? "line" : pointSettings[point].chartType}
                          discussionPoint={point}
                          groupAnswers={groupAnswers}
                          getParticipationData={questionData?.getParticipationData}
                          dialogFunc={populateAndOpenDialog}
                          getEthicalPerspectives={questionData?.getEthicalPerspectives}
                          getPopularOpinions={questionData?.getPopularOpinions}
                          getKeywordTrends={questionData?.getKeywordTrends}
                        />
                      );
                    })}
                </div>
              </section>
            </div>
            {/* Right Column: Drop Zone for this point */}
            <div>
              {/* Content for slide */}
              <section key={`right-${point}`} className="border-t border-border pt-8 first:border-t-0 first:pt-0">
                <div className="mb-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold">Slide {point}</h2>
                      <p className="text-muted-foreground mt-2">
                        {discussionTasks[point].subtitle}
                      </p>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <Button onClick={handleUndo} size="sm">
                        Undo
                      </Button>
                      <Button onClick={() => setIsDrawing(!isDrawing)} size="sm">
                        {isDrawing ? "Stop Drawing" : "Draw Arrow"}
                      </Button>
                      <Button 
                        onClick={() => addTextBox(`slide-${point}`, "Add Text")} 
                        size="sm"
                      >
                        Add Text Box
                      </Button>     
                    </div>
                  </div>
                </div>

                <DropZone
                  id={`drop-${point}`}
                  onArrowComplete={handleArrowComplete}
                  isDrawing={isDrawing}
                  setIsDrawing={setIsDrawing}
                >

                {/* Render existing arrows */}
                <svg 
                  className="absolute top-0 left-0 w-full h-full pointer-events-none" 
                  style={{ zIndex: 999 }}
                >
                  {arrows[`slide-${point}`]?.map((arrow, index) => (
                    <g key={arrow.id}>
                      <line
                        x1={arrow.start.x}
                        y1={arrow.start.y}
                        x2={arrow.end.x}
                        y2={arrow.end.y}
                        stroke="black"
                        strokeWidth="2"
                      />
                      {/* Arrow head */}
                      <polygon
                        points={`
                          ${arrow.end.x},${arrow.end.y}
                          ${arrow.end.x - 10},${arrow.end.y - 5}
                          ${arrow.end.x - 10},${arrow.end.y + 5}
                        `}
                        fill="black"
                        transform={`rotate(${
                          Math.atan2(
                            arrow.end.y - arrow.start.y,
                            arrow.end.x - arrow.start.x
                          ) * (180 / Math.PI)
                        }, ${arrow.end.x}, ${arrow.end.y})`}
                      />
                    </g>
                  ))}
                </svg>

                {droppedItems[`drop-${point}`]?.map((item) => {
                      const questionData = {
                        1: q1Data,
                        2: q2Data,
                        3: q3Data
                      }[point];

                      return (
                        <DiscussionChart
                          key={item.chartId}
                          title={item.originalTitle}
                          timeSeriesData={item.timeSeriesData}
                          id={item.chartId}
                          isDropped={false}
                          currentTime={currentTime}
                          chartType={item.chartType}
                          discussionPoint={point}
                          style={{
                            position: 'absolute',
                            left: `${item.position.x}px`,
                            top: `${item.position.y}px`,
                            width: '30%',
                            zIndex: zIndices[item.chartId] || 1
                          }}
                          groupAnswers={groupAnswers}
                          getParticipationData={questionData?.getParticipationData}
                          dialogFunc={populateAndOpenDialog}
                          isInCanvas={true}
                          onToggleFreeze={handleToggleFreeze}
                          isFrozen={frozenCharts.includes(item.chartId)}
                          getEthicalPerspectives={questionData?.getEthicalPerspectives}
                          getPopularOpinions={questionData?.getPopularOpinions}
                          getKeywordTrends={questionData?.getKeywordTrends}
                        />
                      );
                    })}
                    {Object.entries(textBoxes[`slide-${point}`] || {}).map(([id, { text, position, size }]) => (
                    <TextBox
                      key={id}
                      id={id}
                      slideId={`slide-${point}`}
                      initialText={text}
                      position={position}
                      onTextChange={handleTextChange}
                      onPositionChange={updateTextBoxPosition}
                      onSizeChange={updateTextBoxSize}
                      onDelete={deleteTextBox}
                      style={{
                        position: 'absolute',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '8px',
                        zIndex: zIndices[id] || 1
                      }}
                    />
                  ))}
                </DropZone>
              </section>
            </div>
          </div>
        ))}
        {/* Time Controls */}
        <TimeControls
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          onTimeChange={handleTimeChange}
          onPlayPause={togglePlay}
        />
      </div>
      {/* DragOverlay */}
      <DragOverlay>
          {activeId ? (() => {
            const activeIdComponents = activeId.toString().split('-');
            const point = parseInt(activeIdComponents[1], 10);
            const chartTitle = activeIdComponents.slice(2).join('-');
            const chartInfo = AVAILABLE_CHARTS.find(chart => chart.title === chartTitle);

            if (!chartInfo) return null;

            const questionData = {
              1: q1Data,
              2: q2Data,
              3: q3Data
            }[point];

            return (
              <DiscussionChart
                id={activeId.toString()}
                title={chartTitle}
                timeSeriesData={determineAndGetTimeSeriesData(point, chartTitle)}
                isDropped={false}
                currentTime={currentTime}
                chartType={pointSettings[point].chartType}
                discussionPoint={point}
                groupAnswers={groupAnswers}
                getParticipationData={questionData?.getParticipationData}
                dialogFunc={populateAndOpenDialog}
                getEthicalPerspectives={questionData?.getEthicalPerspectives}
                getPopularOpinions={questionData?.getPopularOpinions}
                getKeywordTrends={questionData?.getKeywordTrends}
              />
            );
          })() : null}
        </DragOverlay>
    </DndContext>
  );
}
export default DiscussionDashboard