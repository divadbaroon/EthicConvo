import { useState, useEffect, useRef } from 'react';
import { 
  DashboardStats, 
  TopicMention, 
  KeywordTrend, 
  GroupInfo, 
  IUser,
  IAnalysis,
  ICountEntry,
  ISession
} from '@/types';
import { getAllGroupTranscripts } from "@/lib/actions/group.actions";

import { getSessionById } from "@/lib/actions/session.actions"

const NO_CHANGE_THRESHOLD = 5; // Number of consecutive updates with no changes before stopping

export function useDashboardData(sessionId: string) {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [hotTopics, setHotTopics] = useState<TopicMention[]>([]);
  const [keywordTrends, setKeywordTrends] = useState<KeywordTrend[]>([]);
  const [groups, setGroups] = useState<GroupInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [analysis, setAnalysis] = useState<IAnalysis | null>(null);

  const [sessionData, setSessionData] = useState<ISession | null>(null);

  useEffect(() => {
      if (sessionId) {
          fetchSessionData();
      }
  }, [sessionId]);

  const fetchSessionData = async () => {
      try {
          const response = await getSessionById(sessionId);
          setSessionData(response || null);
      } catch (error) {
          console.error("Error fetching session data:", error);
          setSessionData(null);
      }
  };

  const noChangeCount = useRef(0);
  const prevDataRef = useRef<string>('');

  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout;

    async function fetchData() {
      if (!isMounted) return;

      setIsLoading(true);
      try {

        // If status is "salutation" or "simulation", fetch data once and don't set up interval
        if (sessionData?.status === "concluded" || sessionData?.status === "simulation") {
          await fetchAndProcessData();
          setIsSessionActive(false);
          return;
        }

        // For other statuses, proceed with regular interval updates
        if (isSessionActive) {
          await fetchAndProcessData();
          intervalId = setInterval(fetchAndProcessData, 10000);
        }
      } catch (error) {
        console.error('Error fetching session status:', error);
        setError('Failed to fetch session status. Please try again later.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setHasAttemptedLoad(true);
        }
      }
    }

    async function fetchAndProcessData() {
      if (!isMounted || !isSessionActive) return;

      try {
        // Fetch users
        const usersResponse = await fetch(`/api/users/${sessionId}`);
        const usersData = await usersResponse.json();
        const users: IUser[] = usersData.data;

        // Fetch analytics
        const analyticsResponse = await fetch(`/api/analytics/${sessionId}`);
        const analyticsData = await analyticsResponse.json();
        const analysis: IAnalysis = analyticsData.data;

        // Fetch all group transcripts
        const transcriptsResult = await getAllGroupTranscripts(sessionId);
        const combinedTranscript = transcriptsResult.data.join('\n\n');

        if (isMounted) {
          const newData = JSON.stringify({
            users,
            analysis,
            combinedTranscript
          });

          if (newData === prevDataRef.current) {
            noChangeCount.current += 1;
            if (noChangeCount.current >= NO_CHANGE_THRESHOLD) {
              setIsSessionActive(false);
              return;
            }
          } else {
            noChangeCount.current = 0;
            prevDataRef.current = newData;
          }

          // Process data only if it exists
          if (users.length > 0 && analysis) {
            setAnalysis(analysis);

            // Process user data
            const activeUsers = users.filter(user => user.isActive).length;
            setDashboardStats({
              activeStudents: activeUsers,
              participationRate: Math.round((activeUsers / users.length) * 100),
              topicCoverage: {
                "Infringement Concerns": 0,
                "Tech & Copyright": 0,
                "Legal Strategies": 0
              },
              averageTopicCoverage: 0,
              averageSentiment: calculateAverageSentiment(analysis.sentimentCounts),
            });

            // Process hot topics
            setHotTopics(
              analysis.topics
                .sort((a, b) => getLatestCount(b.counts) - getLatestCount(a.counts))
                .slice(0, 5)
                .map(topic => ({
                  topic: topic.topic,
                  mentions: getLatestCount(topic.counts)
                }))
            );

            // Process keyword trends
            setKeywordTrends(
              analysis.keywords
                .sort((a, b) => getLatestCount(b.counts) - getLatestCount(a.counts))
                .slice(0, 3)
                .map(keyword => ({
                  keyword: keyword.word,
                  data: generateTrendData(keyword.counts)
                }))
            );

            // Process group info
            setGroups(
              analysis.topics.map((topic, index) => ({
                id: index + 1,
                name: `Group ${index + 1}`,
                topics: [topic.topic]
              }))
            );
          }

          setError(null);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (isMounted && !hasAttemptedLoad) {
          setError('Failed to fetch dashboard data. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setHasAttemptedLoad(true);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [sessionId, hasAttemptedLoad, isSessionActive]);

  return { 
    dashboardStats, 
    hotTopics, 
    keywordTrends, 
    groups, 
    isLoading, 
    error, 
    hasAttemptedLoad,
    isSessionActive,
    analysis
  };
}

// Helper functions (calculateAverageSentiment, getLatestCount, generateTrendData) remain unchanged
// Helper function to calculate average sentiment
function calculateAverageSentiment(sentimentCounts: IAnalysis['sentimentCounts']): string {
  const latestCounts = {
    Positive: getLatestCount(sentimentCounts.Positive),
    Neutral: getLatestCount(sentimentCounts.Neutral),
    Negative: getLatestCount(sentimentCounts.Negative)
  };
  
  const total = latestCounts.Positive + latestCounts.Neutral + latestCounts.Negative;
  const averageScore = (latestCounts.Positive * 1 + latestCounts.Neutral * 0 + latestCounts.Negative * -1) / total;
  
  if (averageScore > 0.3) return 'Positive';
  if (averageScore < -0.3) return 'Negative';
  return 'Neutral';
}

// Helper function to get the latest count from a CountEntry array
function getLatestCount(counts: ICountEntry[]): number {
  if (counts.length === 0) return 0;
  
  const sortedCounts = [...counts].sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    
    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
      return 0; // Keep original order if dates are invalid
    }
    
    return dateB.getTime() - dateA.getTime();
  });
  
  return sortedCounts[0].count;
}

// Helper function to generate trend data
function generateTrendData(counts: ICountEntry[]): { time: string; mentions: number }[] {
  // Sort counts by timestamp in descending order
  const sortedCounts = [...counts].sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    
    // Check if dates are valid
    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
      console.error('Invalid timestamp encountered:', a.timestamp, b.timestamp);
      return 0; // Keep original order if dates are invalid
    }
    
    return dateB.getTime() - dateA.getTime();
  });
  
  // Take the last 5 entries or pad with zeros if less than 5
  const lastFiveCounts = sortedCounts.slice(0, 5);
  while (lastFiveCounts.length < 5) {
    lastFiveCounts.push({ count: 0, timestamp: new Date(0) });
  }

  return lastFiveCounts.map((entry, index) => {
    const date = new Date(entry.timestamp);
    const timeString = isNaN(date.getTime()) 
      ? `${index} min ago` 
      : `${Math.floor((Date.now() - date.getTime()) / 60000)} min ago`;
    
    return {
      time: timeString,
      mentions: entry.count
    };
  }).reverse();
}