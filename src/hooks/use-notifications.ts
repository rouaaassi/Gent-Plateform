import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

export interface Notification {
  id: string;
  type: 'push' | 'pull_request' | 'issue' | 'branch_created' | 'tag_created' | 'repository_created';
  title: string;
  message: string;
  repository?: {
    id: number;
    name: string;
    owner: string;
  };
  actor?: {
    name: string;
    email: string;
  };
  created_at: string;
  read: boolean;
  url?: string;
}

// Get notifications for the current user
// DISABLED: API endpoint not available yet
export const useNotifications = () => {
  return useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      // Return empty array until backend implements this endpoint
      return [];
    },
    enabled: false, // Disable API call
    initialData: [] // Always return empty array
  });
};

// Get unread notifications count
// DISABLED: API endpoint not available yet
export const useUnreadNotificationsCount = () => {
  return useQuery<{ count: number }>({
    queryKey: ['notifications', 'unread'],
    queryFn: async () => {
      // Return zero count until backend implements this endpoint
      return { count: 0 };
    },
    enabled: false, // Disable API call
    initialData: { count: 0 } // Always return 0
  });
};