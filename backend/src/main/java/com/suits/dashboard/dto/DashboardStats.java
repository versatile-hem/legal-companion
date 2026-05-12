package com.suits.dashboard.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record DashboardStats(
    long totalClients,
    long totalEntities,
    long totalDirectors,
    long activeJobs,
    long overdueJobs,
    long completedJobs,
    BigDecimal revenueCollected,
    BigDecimal revenueOutstanding,
    long kycPending,
    long kycOverdue,
    Map<String, Long> jobsByStatus,
    List<RecentActivityItem> recentActivity
) {
    public record RecentActivityItem(String type, String title, String entity, String timestamp, String status) {}
}
