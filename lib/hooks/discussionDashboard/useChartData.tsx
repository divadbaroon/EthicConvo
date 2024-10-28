import { useCallback, useState } from 'react';
import { TimeSeriesData, TopicData } from '@/types';

// Import data from individual files
import { participationRateData } from '@/lib/data/sessionDashboard/charts/participationRate/participationRate';
import { questionCoverageData } from '@/lib/data/sessionDashboard/charts/questionCoverage/questionCoverage';
import { ethicalPerspectivesData } from '@/lib/data/sessionDashboard/charts/ethicalPerspectives/ethicalPerspectives';
import { popularOpinionsData } from '@/lib/data/sessionDashboard/charts/popularOpinions/popularOpinions';
import { keywordTrendsData } from '@/lib/data/sessionDashboard/charts/keywordTrends/keywordTrends';
import { groupParticipantCountsMap } from '@/lib/data/sessionDashboard/charts/groupAnswers/groupAnswers';

const DISCUSSION_POINT_DELAY = 100;

// Type definitions
type QuestionNumber = 1 | 2 | 3;

interface QuestionData<T> {
  1: T[];
  2: T[];
  3: T[];
}

interface DistributionItem {
  index: number;
  fullText: string;
  frequency: number;
}

interface GeneratedChartData {
  groupNum: number;
  discussionPoint: number;
  distribution: DistributionItem[];
}

interface ChartDataMap {
  [key: string]: GeneratedChartData;
}

interface ParticipationDataPoint {
  groupId: string;
  participants: number;
}

interface GroupData {
  groupId: string;
  timestamp: number;
}

interface CountData {
  timestamp: number;
  count: number;
}

interface TopicAnswer {
  text: string;
  count: number;
}

// Define types for the data sources
const participationRateDataTyped: QuestionData<TimeSeriesData> = participationRateData;
const questionCoverageDataTyped: QuestionData<TimeSeriesData> = questionCoverageData;
const ethicalPerspectivesDataTyped: QuestionData<TopicData> = ethicalPerspectivesData;
const popularOpinionsDataTyped: QuestionData<TopicData> = {
    1: popularOpinionsData[1],
    2: popularOpinionsData[2],
    3: popularOpinionsData[3]
};
const keywordTrendsDataTyped: QuestionData<TopicData> = keywordTrendsData;


export const useChartData = (questionNumber: QuestionNumber, currentTime: number) => {
    const [genChartDataMap, setGenChartDataMap] = useState<ChartDataMap>({});
  
    const processTopicData = useCallback((data: TopicData[]): TopicData[] => {
      return data.map(topic => ({
        ...topic,
        groups: topic.groups.filter(group => group.timestamp <= currentTime),
        counts: topic.counts.filter(count => count.timestamp <= currentTime)
      }));
    }, [currentTime]);
  
    const getParticipationData = useCallback((): ParticipationDataPoint[] => {
      const currentQuestionAnswers = popularOpinionsDataTyped[questionNumber];
      
      let data = currentQuestionAnswers
        .flatMap(topic => 
          topic.groups
            .filter((group: GroupData) => group.timestamp <= currentTime)
            .map((group: GroupData) => ({
              groupId: group.groupId,
              participants: groupParticipantCountsMap[group.groupId] || 0
            }))
        )
        .filter((group: ParticipationDataPoint, index: number, self: ParticipationDataPoint[]) => 
          index === self.findIndex((g: ParticipationDataPoint) => g.groupId === group.groupId)
        );
  
      const hasGroupZero = data.some(group => group.groupId === 'group 0');
      if (!hasGroupZero) {
        data.unshift({
          groupId: 'group 0',
          participants: 0
        });
      }
  
      data.sort((a: ParticipationDataPoint, b: ParticipationDataPoint) => {
        const aNum = parseInt(a.groupId.replace('group ', ''), 10);
        const bNum = parseInt(b.groupId.replace('group ', ''), 10);
        return aNum - bNum;
      });
  
      return data;
    }, [questionNumber, currentTime]);
  
    const getEthicalPerspectives = useCallback((): TopicData[] => {
      return processTopicData(ethicalPerspectivesDataTyped[questionNumber]);
    }, [processTopicData, questionNumber]);
  
    const getPopularOpinions = useCallback((): TopicData[] => {
      return processTopicData(popularOpinionsDataTyped[questionNumber]);
    }, [processTopicData, questionNumber]);
  
    const getKeywordTrends = useCallback((): TopicData[] => {
      return processTopicData(keywordTrendsDataTyped[questionNumber]);
    }, [processTopicData, questionNumber]);
  
    const getTimeSeriesData = useCallback((chartType: string): TimeSeriesData[] => {
      const startDelay = (questionNumber - 1) * DISCUSSION_POINT_DELAY;
  
      // Handle standard time series charts
      if (chartType === 'Participation Rate' || chartType === 'Question Coverage') {
        const dataSource = chartType === 'Participation Rate' 
          ? participationRateDataTyped 
          : questionCoverageDataTyped;
  
        const data = dataSource[questionNumber];
        return data.map((point: TimeSeriesData) => ({
          ...point,
          timestamp: point.timestamp + startDelay
        }));
      }
  
      // Handle generated charts
      if (genChartDataMap[chartType + questionNumber]) {
        const chartData = genChartDataMap[chartType + questionNumber];
        return [{
          timestamp: currentTime,
          value: chartData.groupNum,
          answers: chartData.distribution.map((item: DistributionItem) => ({
            text: item.fullText,
            count: item.frequency
          }))
        }];
      }
  
      return [];
    }, [questionNumber, currentTime, genChartDataMap]);
  
    return {
      getParticipationData,
      getTimeSeriesData,
      getEthicalPerspectives,
      getPopularOpinions,
      getKeywordTrends
    };
  };