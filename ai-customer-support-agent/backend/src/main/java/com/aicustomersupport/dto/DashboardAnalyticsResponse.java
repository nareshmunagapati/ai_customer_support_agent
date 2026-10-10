package com.aicustomersupport.dto;

import java.util.Map;

public class DashboardAnalyticsResponse {
    private long totalCustomers;
    private long totalAgents;
    private long totalTickets;
    private long openTickets;
    private long inProgressTickets;
    private long escalatedTickets;
    private long resolvedTickets;
    private double averageRating;
    private long totalFeedbackCount;
    private Map<String, Long> ticketsByStatus;
    private Map<String, Long> ticketsByCategory;
    private Map<String, Long> ticketsByPriority;

    public DashboardAnalyticsResponse() {
    }

    public DashboardAnalyticsResponse(long totalCustomers, long totalAgents, long totalTickets,
                                      long openTickets, long inProgressTickets, long escalatedTickets,
                                      long resolvedTickets, double averageRating, long totalFeedbackCount,
                                      Map<String, Long> ticketsByStatus, Map<String, Long> ticketsByCategory,
                                      Map<String, Long> ticketsByPriority) {
        this.totalCustomers = totalCustomers;
        this.totalAgents = totalAgents;
        this.totalTickets = totalTickets;
        this.openTickets = openTickets;
        this.inProgressTickets = inProgressTickets;
        this.escalatedTickets = escalatedTickets;
        this.resolvedTickets = resolvedTickets;
        this.averageRating = averageRating;
        this.totalFeedbackCount = totalFeedbackCount;
        this.ticketsByStatus = ticketsByStatus;
        this.ticketsByCategory = ticketsByCategory;
        this.ticketsByPriority = ticketsByPriority;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalAgents() {
        return totalAgents;
    }

    public void setTotalAgents(long totalAgents) {
        this.totalAgents = totalAgents;
    }

    public long getTotalTickets() {
        return totalTickets;
    }

    public void setTotalTickets(long totalTickets) {
        this.totalTickets = totalTickets;
    }

    public long getOpenTickets() {
        return openTickets;
    }

    public void setOpenTickets(long openTickets) {
        this.openTickets = openTickets;
    }

    public long getInProgressTickets() {
        return inProgressTickets;
    }

    public void setInProgressTickets(long inProgressTickets) {
        this.inProgressTickets = inProgressTickets;
    }

    public long getEscalatedTickets() {
        return escalatedTickets;
    }

    public void setEscalatedTickets(long escalatedTickets) {
        this.escalatedTickets = escalatedTickets;
    }

    public long getResolvedTickets() {
        return resolvedTickets;
    }

    public void setResolvedTickets(long resolvedTickets) {
        this.resolvedTickets = resolvedTickets;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public long getTotalFeedbackCount() {
        return totalFeedbackCount;
    }

    public void setTotalFeedbackCount(long totalFeedbackCount) {
        this.totalFeedbackCount = totalFeedbackCount;
    }

    public Map<String, Long> getTicketsByStatus() {
        return ticketsByStatus;
    }

    public void setTicketsByStatus(Map<String, Long> ticketsByStatus) {
        this.ticketsByStatus = ticketsByStatus;
    }

    public Map<String, Long> getTicketsByCategory() {
        return ticketsByCategory;
    }

    public void setTicketsByCategory(Map<String, Long> ticketsByCategory) {
        this.ticketsByCategory = ticketsByCategory;
    }

    public Map<String, Long> getTicketsByPriority() {
        return ticketsByPriority;
    }

    public void setTicketsByPriority(Map<String, Long> ticketsByPriority) {
        this.ticketsByPriority = ticketsByPriority;
    }
}
