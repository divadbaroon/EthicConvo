import React, { useMemo, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DiscussionChartProps, GroupAnswersData } from '@/lib/data/participationRate';
import { getValueAtTime } from '@/utils/chartUtils';
import { Pause, Play } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { TopicData } from '@/types';

export const DiscussionChart: React.FC<DiscussionChartProps> = ({ 
  title, 
  timeSeriesData, 
  id, 
  isDropped,
  currentTime, 
  chartType,
  style = {},
  discussionPoint,
  dialogFunc,
  groupAnswers,
  getParticipationData,
  getEthicalPerspectives,
  getPopularOpinions,
  getKeywordTrends,
  isFrozen = false,
  onToggleFreeze,
  isInCanvas = false,
  onMouseUp,
}) => {
  const defaultGraphs = ['Participation Rate', 'Question Coverage', 'Group Answers', 'Ethical Perspectives', 'Popular Opinions', 'Keyword Trends']
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    disabled: isDropped,
  });

  const dragStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0 : 1, // Make original element invisible while dragging
    transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease'
  } : undefined;

  const currentValue = useMemo(
    () => getValueAtTime(timeSeriesData, currentTime),
    [timeSeriesData, currentTime]
  );

  const handleBarClicked = (data: any) => {
    if (!dialogFunc) return;
    
    let opinionFull = data.name;
    let groups = data.rawGroups || data.groups; // Use raw groups if available
    
    dialogFunc(opinionFull, discussionPoint, groups);
  };

// Add a ref to store the last computed data
const lastComputedData = useRef<any>(null);

const chartData = useMemo(() => {
  // If frozen, return the last computed data
  if (isFrozen) {
    return lastComputedData.current;
  }

  let newData;
  
   // Handle topic-based charts
   if (title === 'Group Answers' || 
    title === 'Ethical Perspectives' || 
    title === 'Popular Opinions' || 
    title === 'Keyword Trends') {
  let sourceData: TopicData[] = [];
  
  switch (title) {
    case 'Group Answers':
      sourceData = groupAnswers || [];
      break;
    case 'Ethical Perspectives':
      sourceData = getEthicalPerspectives ? getEthicalPerspectives() : [];
      break;
    case 'Popular Opinions':
      sourceData = getPopularOpinions ? getPopularOpinions() : [];
      break;
    case 'Keyword Trends':
      sourceData = getKeywordTrends ? getKeywordTrends() : [];
      break;
  }

  newData = sourceData.map((topic) => ({
    name: topic.topicText,
    groups: topic.groups.filter(group => group.timestamp <= currentTime).length,
    rawGroups: topic.groups.filter(group => group.timestamp <= currentTime) // Keep raw groups for click handling
  }));
}
// Handle generated charts
else if (!defaultGraphs.includes(title)) {
  if (timeSeriesData.length === 0) {
    return;
  }
  const series = timeSeriesData[0];
  newData = series['answers']?.map(topic => ({
    name: topic.text,
    groups: topic.count
  }));
}
// Handle participation rate
else if (title === 'Participation Rate') {
  newData = getParticipationData ? getParticipationData() : [];
}
// Handle standard time series data
else {
  const visualData = timeSeriesData
    .filter((point) => point.timestamp <= currentTime)
    .map((point, index) => ({  
      name: `${index}`, 
      time: point.timestamp,
      value: point.value,
    }));

  if (currentTime > 0 && (!visualData.length || visualData[visualData.length - 1].time !== currentTime)) {
    visualData.push({
      name: `${visualData.length}`,  
      time: currentTime,
      value: currentValue,
    });
  }

  const futurePoints = timeSeriesData
    .filter((point) => point.timestamp > currentTime)
    .map((point, index) => ({  
      name: `${visualData.length + index}`,  
      time: point.timestamp,
      placeholder: point.value,
    }));

  newData = [...visualData, ...futurePoints].sort((a, b) => a.time - b.time);
}

// Store the newly computed data
lastComputedData.current = newData;
return newData;
}, [
title,
groupAnswers,
getParticipationData,
getEthicalPerspectives,
getPopularOpinions,
getKeywordTrends,
timeSeriesData,
currentTime,
currentValue,
isFrozen
]);

  const renderChart = () => {
    const commonProps = {
      margin: { top: 10, right: 10, left: 0, bottom: 20 },
    };

    const commonAxisProps = {
      XAxis: {
        dataKey: 'name',
        angle: 0,
        textAnchor: 'middle',
        height: 50,
        interval: 0,
        fontSize: 12,
        label: { 
          value: 'Time', 
          position: 'bottom',
          offset: -24,
          style: { fill: 'hsl(var(--foreground))' },
        }
      },
      YAxis: {
        domain: [0, 100],
        ticks: [0, 25, 50, 75, 100],
        fontSize: 12,
        label: { 
          value: 'Coverage %', 
          position: 'center',
          dx: -9, 
          angle: -90,
          style: { fill: 'hsl(var(--foreground))' }
        }
      },
    };

    const tooltipStyle = {
      contentStyle: {
        background: 'hsl(var(--background))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '6px',
        padding: '8px',
      },
      wrapperStyle: {
        zIndex: 1000, 
      },
    };

    if (title === 'Group Answers' || 
      title === 'Ethical Perspectives' || 
      title === 'Popular Opinions' || 
      title === 'Keyword Trends' || 
      !defaultGraphs.includes(title)) {
    const maxValue = Math.max(...(chartData?.map((d: any) => d.groups) || [0]), 0);
    return chartType === 'line' ? (
      <LineChart data={chartData} {...commonProps}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="hsl(var(--muted))"
          opacity={0.3}
        />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11 }}
          angle={0}
          textAnchor="middle"
          height={50}
          interval={0}
          // Modified to always show index + 1
          tickFormatter={(value: string, index: number) => `${index + 1}`}
          label={{ 
            value: 'Answer', 
            position: 'bottom',
            offset: -24,  
            style: { fill: 'hsl(var(--foreground))' }
          }}
        />
        <YAxis
          type="number"
          domain={[0, maxValue > 6 ? maxValue : 6]}
          allowDecimals={false}
          tick={{ fontSize: 11 }}
          label={{ 
            value: 'Number of Groups',
            position: 'center',
            dx: -9, 
            angle: -90,
            style: { fill: 'hsl(var(--foreground))' }
          }}
        />
        <Tooltip
          {...tooltipStyle}
          formatter={(value: number, name: string, item: any) => [
            `${value} ${value === 1 ? 'group' : 'groups'} selected "${item.payload.name}"`
          ]}
          labelFormatter={() => ''}
        />
        <Line
          type="monotone"
          dataKey="groups"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={true}
          name="Groups"
        />
      </LineChart>
    ) : (
      <BarChart data={chartData} {...commonProps}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="hsl(var(--muted))"
          opacity={0.3}
        />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11 }}
          angle={0}
          textAnchor="middle"
          height={50}
          interval={0}
          // Modified to always show index + 1
          tickFormatter={(value: string, index: number) => `${index + 1}`}
          label={{ 
            value: 'Answer', 
            position: 'bottom',
            offset: -24,  
            style: { fill: 'hsl(var(--foreground))' }
          }}
        />
        <YAxis
          type="number"
          domain={[0, maxValue > 6 ? maxValue : 6]}
          allowDecimals={false}
          tick={{ fontSize: 11 }}
          label={{ 
            value: 'Number of Groups',
            position: 'center',
            dx: -9, 
            angle: -90,
            style: { fill: 'hsl(var(--foreground))' }
          }}
        />
        <Tooltip
          {...tooltipStyle}
          formatter={(value: number, name: string, item: any) => [
            `${value} ${value === 1 ? 'group' : 'groups'} said "${item.payload.name}"`
          ]}
          labelFormatter={() => ''}
        />
        <Bar
          dataKey="groups"
          fill="hsl(var(--primary))"
          name="Groups"
          radius={[4, 4, 0, 0]}
          onClick={(data, index, event) => {
            event.stopPropagation();
            handleBarClicked(data);
          }}
          style={{ cursor: 'pointer' }}
        />
      </BarChart>
    );
  }

    if (title === 'Participation Rate') {
      const maxValue = Math.max(...chartData.map((d: any) => d.participants), 0);
      return chartType === 'line' ? (
        <LineChart data={chartData} {...commonProps}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--muted))"
            opacity={0.3}
          />
          <XAxis
            dataKey="groupId"
            tick={{ fontSize: 12 }}
            angle={0}
            textAnchor="end"
            height={60}
            interval={0}
            tickFormatter={(value: string) => value.replace('group ', '')} 
            label={{ 
              value: 'Group', 
              offset: -30,  
              position: 'bottom',
              style: { fill: 'hsl(var(--foreground))' }
            }}
          />
          <YAxis
            type="number"
            domain={[0, 4]}
            allowDecimals={false}
            tick={{ fontSize: 12 }}
            label={{ 
              value: 'Participants', 
              position: 'center',
              dx: -5,
              angle: -90,
              style: { fill: 'hsl(var(--foreground))' }
            }}
          />
          <Tooltip
            {...tooltipStyle}
            formatter={(value: number, name: string, item: any) => [
              `${item.payload.groupId.replace('group', 'Group')} currently has ${value} active ${value === 1 ? 'participant' : 'participants'}`
            ]}
            labelFormatter={() => ''}
          />
          <Line
            type="monotone"
            dataKey="participants"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={true}
            name="Participants"
          />
        </LineChart>
      ) : (
        <BarChart data={chartData} {...commonProps}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--muted))"
            opacity={0.3}
          />
          <XAxis
            dataKey="groupId"
            tick={{ fontSize: 12 }}
            angle={0}
            textAnchor="end"
            height={60}
            interval={0}
            tickFormatter={(value: string) => value.replace('group ', '')} 
            label={{ 
              value: 'Group', 
              offset: -30,  
              position: 'bottom',
              style: { fill: 'hsl(var(--foreground))' }
            }}
          />
          <YAxis
            type="number"
            domain={[0, 4]}
            allowDecimals={false}
            tick={{ fontSize: 12 }}
            label={{ 
              value: 'Participants', 
              position: 'center',
              dx: -5,
              angle: -90,
              style: { fill: 'hsl(var(--foreground))' }
            }}
          />
          <Tooltip
            {...tooltipStyle}
            formatter={(value: number, name: string, item: any) => [
              `${item.payload.groupId.replace('group', 'Group')} currently has ${value} active ${value === 1 ? 'participant' : 'participants'}`
            ]}
            labelFormatter={() => ''}
          />
          <Bar
            dataKey="participants"
            fill="hsl(var(--primary))"
            name="Participants"
            radius={[4, 4, 0, 0]}
            onClick={(data, index, event) => {
              event.stopPropagation();
              handleBarClicked(data);
            }}
            style={{ cursor: 'pointer' }}
          />
      </BarChart>
      );
    }

    // Default time series chart
    return chartType === 'line' ? (
      <LineChart data={chartData} {...commonProps}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="hsl(var(--muted))"
          opacity={0.3}
        />
        <XAxis {...commonAxisProps.XAxis} />
        <YAxis {...commonAxisProps.YAxis} />
        <Tooltip
          {...tooltipStyle}
          formatter={(value: any, name: string, item: any) => [
            name === 'value' ? 
              `${value.toFixed(1)}% coverage after ${item.payload.name} ${item.payload.name === '1' ? 'minute' : 'minutes'}` :
              `${value.toFixed(1)}% coverage after ${item.payload.name} ${item.payload.name === '1' ? 'minute' : 'minutes'}`
          ]}
          labelFormatter={() => ''}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={true}
          name="Current"
        />
      </LineChart>
    ) : (
      <BarChart data={chartData} {...commonProps}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="hsl(var(--muted))"
          opacity={0.3}
        />
        <XAxis {...commonAxisProps.XAxis} />
        <YAxis {...commonAxisProps.YAxis} />
        <Tooltip
            {...tooltipStyle}
            formatter={(value: any, name: string, item: any) => [
              name === 'value' ? 
                `${value.toFixed(1)}% coverage after ${item.payload.name} ${item.payload.name === '1' ? 'minute' : 'minutes'}` :
                `${value.toFixed(1)}% coverage after ${item.payload.name} ${item.payload.name === '1' ? 'minute' : 'minutes'}`
            ]}
            labelFormatter={() => ''}
          />
        <Bar
          dataKey="value"
          fill="hsl(var(--primary))"
          name="Current"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    );
  };

  return (
    <Card 
      className="h-full border rounded-md bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow duration-200"
      ref={setNodeRef} 
      style={{
        ...dragStyle,
        ...style,
        position: isDropped ? 'absolute' : 'relative',
        background: 'hsl(var(--background))',
        minHeight: '310px',
      }}
    >
      <CardHeader className="p-6 pb-2">
        <div
        onMouseUp={(e) => {
          e.stopPropagation();
          if (onMouseUp) {
            onMouseUp(e);
          }
        }}
          className="flex justify-between items-center"
          {...attributes}
          {...listeners}
          style={{ cursor: 'move' }}
        >
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm">{title}</CardTitle>
            {isInCanvas && onToggleFreeze && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-1 hover:bg-muted/60 ml-2"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFreeze(id);
                }}
              >
                {isFrozen ? (
                  <Play className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <Pause className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </Button>
            )}
          </div>
          {title !== 'Group Answers' && (
            <span className="text-sm font-medium">{Math.round(currentValue)}%</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};