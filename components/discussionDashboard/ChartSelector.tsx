import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AVAILABLE_CHARTS } from '@/lib/data/participationRate';

interface ChartSelectorProps {
  discussionPoint: number;
  onSelect: (chartIds: string[]) => void;
  currentSelection: {[key: string]: boolean};
}

export const ChartSelector: React.FC<ChartSelectorProps> = ({ 
  discussionPoint, 
  onSelect, 
  currentSelection 
}) => {
  // Changed default selections to make 'all' the default
  const defaultSelections = {
    default: AVAILABLE_CHARTS.map(chart => chart.id), // Changed to show all charts
    all: AVAILABLE_CHARTS.map(chart => chart.id),
    minimal: AVAILABLE_CHARTS.slice(0, 3).map(chart => chart.id)
  };

  const getCurrentValue = () => {
    const selectedIds = Object.entries(currentSelection)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);
    
    if (selectedIds.length === AVAILABLE_CHARTS.length) return 'all';
    if (selectedIds.length === 0) return 'none';
    if (arraysEqual(selectedIds.sort(), defaultSelections.minimal.sort())) return 'minimal';
    if (arraysEqual(selectedIds.sort(), defaultSelections.all.sort())) return 'all';
    return selectedIds.join(',');
  };

  const arraysEqual = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        defaultValue="all" 
        value={getCurrentValue()}
        onValueChange={(value) => {
          let selectedCharts: string[];
          
          switch (value) {
            case 'all':
              selectedCharts = defaultSelections.all;
              break;
            case 'minimal':
              selectedCharts = defaultSelections.minimal;
              break;
            case 'default':
              selectedCharts = defaultSelections.default;
              break;
            default:
              selectedCharts = value.split(',');
          }
          
          onSelect(selectedCharts);
        }}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select charts" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <div className="flex items-center gap-2">
              <span>Show All</span>
            </div>
          </SelectItem>
          <SelectItem value="minimal">
            <div className="flex items-center gap-2">
              <span>Minimal Set</span>
            </div>
          </SelectItem>
          {AVAILABLE_CHARTS.map(chart => (
            <SelectItem key={chart.id} value={chart.id}>
              <div className="flex items-center gap-2">
                <span>{chart.title}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};