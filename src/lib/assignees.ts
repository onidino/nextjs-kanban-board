export interface Assignee {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export const assignees: Assignee[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4",
  },
  {
    id: "2",
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=d1d4f9",
  },
  {
    id: "3",
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria&backgroundColor=c0aede",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=ffdfbf",
  },
  {
    id: "5",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=ffd5dc",
  }
]; 