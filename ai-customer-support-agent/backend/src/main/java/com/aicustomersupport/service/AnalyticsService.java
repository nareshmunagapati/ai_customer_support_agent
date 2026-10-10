package com.aicustomersupport.service;

import com.aicustomersupport.dto.DashboardAnalyticsResponse;
import com.aicustomersupport.entity.TicketStatus;
import com.aicustomersupport.entity.UserRole;
import com.aicustomersupport.repository.FeedbackRepository;
import com.aicustomersupport.repository.TicketRepository;
import com.aicustomersupport.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;
    private final FeedbackRepository feedbackRepository;

    public AnalyticsService(UserRepository userRepository,
                            TicketRepository ticketRepository,
                            FeedbackRepository feedbackRepository) {
        this.userRepository = userRepository;
        this.ticketRepository = ticketRepository;
        this.feedbackRepository = feedbackRepository;
    }

    public DashboardAnalyticsResponse getDashboardAnalytics() {
        long totalCustomers = userRepository.countByRole(UserRole.CUSTOMER);
        long totalAgents = userRepository.countByRole(UserRole.SUPPORT_AGENT);
        long totalTickets = ticketRepository.count();

        long openTickets = ticketRepository.countByStatus(TicketStatus.OPEN);
        long inProgressTickets = ticketRepository.countByStatus(TicketStatus.IN_PROGRESS);
        long escalatedTickets = ticketRepository.countByStatus(TicketStatus.ESCALATED);
        long resolvedTickets = ticketRepository.countByStatus(TicketStatus.RESOLVED);

        Double avgRating = feedbackRepository.findAverageRating();
        double averageRating = avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0;
        long totalFeedbackCount = feedbackRepository.count();

        // Status counts
        Map<String, Long> statusMap = new HashMap<>();
        List<Object[]> statusCounts = ticketRepository.countTicketsByStatusGroup();
        for (Object[] row : statusCounts) {
            statusMap.put(row[0].toString(), (Long) row[1]);
        }

        // Category counts
        Map<String, Long> categoryMap = new HashMap<>();
        List<Object[]> categoryCounts = ticketRepository.countTicketsByCategoryGroup();
        for (Object[] row : categoryCounts) {
            categoryMap.put(row[0].toString(), (Long) row[1]);
        }

        // Priority counts
        Map<String, Long> priorityMap = new HashMap<>();
        List<Object[]> priorityCounts = ticketRepository.countTicketsByPriorityGroup();
        for (Object[] row : priorityCounts) {
            priorityMap.put(row[0].toString(), (Long) row[1]);
        }

        return new DashboardAnalyticsResponse(
                totalCustomers,
                totalAgents,
                totalTickets,
                openTickets,
                inProgressTickets,
                escalatedTickets,
                resolvedTickets,
                averageRating,
                totalFeedbackCount,
                statusMap,
                categoryMap,
                priorityMap
        );
    }
}
