import { TimeSeriesData, TopicData, GroupDataPoint } from '@/lib/data/participationRate';

export const getValueAtTime = (data: TimeSeriesData[], currentTime: number): number => {
  if (!data.length) return 0;
  if (currentTime <= data[0].timestamp) return data[0].value;
  if (currentTime >= data[data.length - 1].timestamp) return data[data.length - 1].value;

  for (let i = 0; i < data.length - 1; i++) {
    if (currentTime >= data[i].timestamp && currentTime <= data[i + 1].timestamp) {
      const timeRatio = (currentTime - data[i].timestamp) / (data[i + 1].timestamp - data[i].timestamp);
      return data[i].value + (data[i + 1].value - data[i].value) * timeRatio;
    }
  }
  return data[data.length - 1].value;
};

export const getAnswerGroupData = (groupAnswers: TopicData[]): GroupDataPoint[] => {
  const data: GroupDataPoint[] = [];

  groupAnswers.forEach((topic) => {
    topic.groups.forEach((group) => {
      const groupNumber = parseInt(group.groupId.replace('group ', ''), 10);

      let dataPoint = data.find(d => d.groupId === group.groupId);

      if (!dataPoint) {
        dataPoint = {
          groupId: group.groupId,
          groupNumber,
          value: 0,
          answers: [],
        };
        data.push(dataPoint);
      }

      dataPoint.value += 1;
      dataPoint.answers?.push({
        text: topic.topicText,
        count: 1,
      });
    });
  });

  return data.sort((a, b) => a.groupNumber - b.groupNumber);
};

export const getChartColor = (value: number): string => {
  const intensity = Math.floor((value / 100) * 255);
  return `rgb(${255 - intensity}, ${255 - intensity}, 255)`;
};