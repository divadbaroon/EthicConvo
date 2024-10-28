import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart as BarChartIcon, LineChart as LineChartIcon } from "lucide-react";
import { DiscussionChart } from "./DiscussionChart";
import { ChartSelector } from "./ChartSelector";
import { AVAILABLE_CHARTS, DiscussionTask, DiscussionPointSettings, ChartType, TopicData } from '@/lib/data/participationRate';

interface DiscussionPointProps {
  point: number;
  task: DiscussionTask;
  isExpanded: boolean;
  onExpand: (point: number) => void;
  settings: DiscussionPointSettings;
  onSettingsChange: (settings: Partial<DiscussionPointSettings>) => void;
  usedCharts: string[];
  currentTime: number;
  getTimeSeriesData: (point: number, chartType: string) => any[];
  groupAnswers: TopicData[];
  getParticipationData: () => any;
}

export const DiscussionPoint: React.FC<DiscussionPointProps> = ({
  point,
  task,
  isExpanded,
  onExpand,
  settings,
  onSettingsChange,
  usedCharts,
  currentTime,
  getTimeSeriesData,
  groupAnswers,
  getParticipationData
}) => {
  return (
    <section 
      className={`border-t border-border pt-6 first:border-t-0 first:pt-0 transition-all duration-300 ${
        isExpanded ? 'mb-12' : 'mb-6'
      }`}
    >
      {/* Header Section */}
      <div className={`mb-6 ${isExpanded ? 'scale-100' : 'scale-95'}`}>
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Discussion Point {point}: {task.title}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onExpand(point)}
              className={isExpanded ? 'bg-secondary' : ''}
            >
              {isExpanded ? 'UnSelect' : 'Select'}
            </Button>
          </div>
          <p className={`text-muted-foreground transition-all duration-300 ${
            isExpanded ? 'line-clamp-none' : 'line-clamp-2'
          }`}>
            {task.subtitle}
          </p>
        </div>

        {/* Settings Section */}
        <div className={`transition-all duration-300 ${
          isExpanded ? 'opacity-100' : 'opacity-70'
        }`}>
          <div className="flex items-center justify-end gap-4">
            {/* Chart Type Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Chart Type:</span>
              <Select 
                value={settings.chartType} 
                onValueChange={(value: ChartType) => {
                  onSettingsChange({ chartType: value });
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

            {/* Chart Visibility Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium whitespace-nowrap">Show Graphs:</span>
              <ChartSelector 
                discussionPoint={point}
                onSelect={(chartIds) => {
                  const newVisibleCharts = Object.fromEntries(
                    AVAILABLE_CHARTS.map(chart => [
                      chart.id, 
                      chartIds.includes(chart.id)
                    ])
                  );
                  onSettingsChange({ visibleCharts: newVisibleCharts });
                }}
                currentSelection={settings.visibleCharts}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 w-full transition-all duration-300 ${
        isExpanded ? 'scale-100 opacity-100' : 'scale-95 opacity-70'
      }`}>
        {AVAILABLE_CHARTS
          .filter(chart => 
            settings.visibleCharts[chart.id] && 
            !usedCharts.includes(chart.title)
          )
          .map((chart) => (
            <DiscussionChart 
              key={`chart-${point}-${chart.title}`}
              title={chart.title}
              timeSeriesData={getTimeSeriesData(point, chart.title)}
              id={`chart-${point}-${chart.title}`}
              isDropped={false}
              currentTime={currentTime}
              chartType={settings.chartType}
              discussionPoint={point}
              groupAnswers={groupAnswers}
              getParticipationData={getParticipationData}
            />
          ))}
      </div>
    </section>
  );
};

// Add prop types for better type checking and documentation
DiscussionPoint.displayName = 'DiscussionPoint';

export type { DiscussionPointProps };