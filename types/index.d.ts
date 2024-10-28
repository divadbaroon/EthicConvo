// ====== NAVBAR
export interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
  }

// ====== SESSIONS PAGE
export interface SessionPageProps {
  params: {
    sessionId: string;
  }
}

// ====== DISCUSSION GUIDE
export interface DiscussionGuideProps {
  session: Session | null;
}

// ====== WAITING-ROOM PAGE
export interface WaitingRoomProps {
  params: {
    sessionId: string;
    groupId: string;
  }
}

// ====== DISCUSSION PAGE
export interface DiscussionProps {
  params: {
    sessionId: string;
    groupId: string;
  }
}

// ====== CHAT-WINDOW PAGE
interface ChatWindowProps {
  groupId: string;
  sessionId: string;
}

// ====== MESSAGE TYPE
interface Message {
  id: string;
  group_id: string | null;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
}

// ====== USER PARAMS
declare type CreateUserParams = {
  username: string;
  clerkId: string;
};

declare type UpdateUserParams = {
  firstName?: first_name,
  lastName?: last_name,
  username?: username!,
  photo?: image_url,
  sessionId?: string
  };

export interface IUser {
  _id: Types.ObjectId;
  sessions: Types.ObjectId[];
  role: 'instructor' | 'student';
  clerkId: string;
  username: string;
  participatedSessions: Types.ObjectId[];
  isActive?: boolean;
}

// Session Types
export type CreateSessionParams = {
  title: string;
  task: string | null;
  scenario: string | null;
  discussion_points: string[];
  created_by: string;  
  time_left: number;
  status: 'draft' | 'active' | 'completed' | 'waiting';
  end_date: Date;
  total_perspective_participants: number;
  preferred_group_size: number;
}

export type UpdateSessionParams = Partial<CreateSessionParams> & {
  status?: string
  time_left?: number
  participant_count?: number
  end_date?: string
}

export type Session = {
  id: string;
  title: string;
  task: string | null;
  scenario: string | null;
  discussion_points: string[];
  created_by: string;
  time_left: number;
  status: 'draft' | 'active' | 'completed' | 'waiting';
  end_date: string;
  created_at: string;
  total_perspective_participants: number;
  preferred_group_size: number;
  participant_count: number;
  groups?: Group[];
}

// Groups Types
export type Group = {
  id: string;
  name: string;
  session_id: string;
  created_at: string;
  number: number;
  max_occupancy: number;
  current_occupancy: number;
  user_list: string[];
}

export type CreateGroupParams = {
  number: number;
  session_id: string;
  max_occupancy: number;
  name?: string;
}

export interface TopicData {
  topic: string;
  topicText: string;
  groups: GroupData[];
  counts: CountData[];
}

export interface TimeSeriesData {
  "timestamp":number;
  value: number;
  answers?: Answer[];  
  elapsedMinutes?: number;
}

export interface TimeSeriesData {
  timestamp: number;
  value: number;
  answers?: Answer[];
  elapsedMinutes?: number;
  text?: string;
}

export interface Answer {
  text: string;
  count: number;
}

export interface MetricData {
  [metric: string]: TimeSeriesData[];
}

export interface DiscussionData {
  [discussionPoint: string]: MetricData;
}

export interface TopicData {
  topic: string;
  topicText: string;
  groups: GroupData[];
  counts: CountData[];
}

export interface GroupData {
  groupId: string;
  timestamp: number;
}

export interface CountData {
  timestamp: number;
  count: number;
}

// Types (you might want to move these to a separate types file)
interface DashboardStats {
  activeStudents: number;
  participationRate: number;
  topicCoverage: {
    "Infringement Concerns": number;
    "Tech & Copyright": number;
    "Legal Strategies": number;
  };
  averageTopicCoverage: number;
  averageSentiment: string;
}

interface TopicMention {
  topic: string;
  mentions: number;
}

interface KeywordTrend {
  keyword: string;
  data: { time: string; mentions: number }[];
}

interface GroupInfo {
  id: number;
  name: string;
  topics: string[];
}

interface GroupNeedingAttention {
  id: number;
  name: string;
  issues: string[];
}

interface SessionSummary {
  title: string;
  keyConcepts: string[];
  topicIdeas: string[];
}


export interface ICountEntry {
  count: number;
  timestamp: Date;
}

export interface IGroupEntry {
  groupId: string;
  timestamp: Date;
}

export interface IMessageEntry {
  content: string;
  groupId: string;
  timestamp: Date;
}

export interface ITopicSchema {
  topic: string;
  normalized: string;
  counts: ICountEntry[];
  groups: IGroupEntry[];
  messages: IMessageEntry[];
}

export interface IKeyword {
  word: string;
  normalized: string;
  counts: ICountEntry[];
  groups: IGroupEntry[];
  messages: IMessageEntry[];
}

export interface ITopic {
  topic: string;
  normalized: string;
  counts: ICountEntry[];
  groups: IGroupEntry[];
  messages: IMessageEntry[];
}

export interface ISentimentCounts {
  Positive: ICountEntry[];
  Neutral: ICountEntry[];
  Negative: ICountEntry[];
}

export interface IAnalysis extends Document {
  sessionId: mongoose.Types.ObjectId;
  sentimentCounts: ISentimentCounts;
  keywords: IKeyword[];
  topics: ITopic[];
}

export interface Slide {
  id: string;
  title: string;
  content: ReactNode;
  insight: string;
  background: string;
  speakerNotes: string;
  graphData?: { name: string; value: number }[];
}

export interface TopOpinion {
  opposingId?: string;
  id: string;
  content: string;
  supportingArguments: string[];
  Groups: number[];
  slideId: string;
}

export interface OpposingOpinion {
  id: string;
  content: string;
  rationale: string;
  Groups: number[];
  slideId: string;
}

export interface UniqueOpinion {
  id: string;
  content: string;
  uniquenessScore: number;
  rationale: string;
  Groups: number[];
}

export interface GraphDataItem {
  id: string;
  title: string;
  data: { name: string; value: number }[];
}

export type DraggedItemType = TopOpinion | OpposingOpinion | UniqueOpinion | GraphDataItem | null;

export type PanelType = 'Top Opinions' | 'Opposing Opinions' | 'Unique Opinions' | 'Graphs';