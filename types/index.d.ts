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
  session_id: string | null;
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