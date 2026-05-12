export interface DashboardStats {
  totalClients: number;
  totalEntities: number;
  totalDirectors: number;
  activeJobs: number;
  overdueJobs: number;
  completedJobs: number;
  revenueCollected: number;
  revenueOutstanding: number;
  kycPending: number;
  kycOverdue: number;
  jobsByStatus: Record<string, number>;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  type: string;
  title: string;
  entity: string;
  timestamp: string;
  status: string;
}
