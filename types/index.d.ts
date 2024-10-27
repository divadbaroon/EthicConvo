// ====== NAVBAR
export interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
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

// User Types
export interface IUser {
  _id: Types.ObjectId;
  sessions: Types.ObjectId[];
  role: 'instructor' | 'student';
  clerkId: string;
  username: string;
  participatedSessions: Types.ObjectId[];
  isActive?: boolean;
}
