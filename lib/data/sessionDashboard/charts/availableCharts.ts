import { ETHICAL_PERSPECTIVES_CONFIG } from './ethicalPerspectives/ethicalPerspectives';
import { PARTICIPATION_RATE_CONFIG } from './participationRate/participationRate';
import { QUESTION_COVERAGE_CONFIG } from './questionCoverage/questionCoverage';
import { POPULAR_OPINIONS_CONFIG } from './popularOpinions/popularOpinions';
import { KEYWORD_TRENDS_CONFIG } from './keywordTrends/keywordTrends';
import { GROUP_ANSWERS_CONFIG } from './groupAnswers/groupAnswers';

export interface ChartConfig {
  id: string;
  title: string;
  dataKey: string;
  type: 'percentage' | 'count';
  visible: boolean;
}

export const AVAILABLE_CHARTS: ChartConfig[] = [
  PARTICIPATION_RATE_CONFIG,
  QUESTION_COVERAGE_CONFIG,
  GROUP_ANSWERS_CONFIG,
  ETHICAL_PERSPECTIVES_CONFIG,
  POPULAR_OPINIONS_CONFIG,
  KEYWORD_TRENDS_CONFIG
];