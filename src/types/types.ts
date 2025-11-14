// Types
interface User {
  id: string;
  email: string;
  name: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: Member[];
  currentTurnIndex: number;
  createdBy: string;
}

interface Notification {
  id: string;
  groupId: string;
  groupName: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export type { User, Member, Group, Notification };
