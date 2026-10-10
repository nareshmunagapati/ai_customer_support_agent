package com.aicustomersupport.dto;

import com.aicustomersupport.entity.TicketPriority;
import com.aicustomersupport.entity.TicketStatus;
import java.time.LocalDateTime;

public class TicketResponse {
    private Long id;
    private UserSummaryDto customer;
    private UserSummaryDto assignedAgent;
    private String subject;
    private String description;
    private String category;
    private TicketPriority priority;
    private TicketStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private FeedbackDto feedback;
    private Long conversationId;

    public TicketResponse() {
    }

    public TicketResponse(Long id, UserSummaryDto customer, UserSummaryDto assignedAgent,
                          String subject, String description, String category,
                          TicketPriority priority, TicketStatus status,
                          LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime resolvedAt,
                          FeedbackDto feedback, Long conversationId) {
        this.id = id;
        this.customer = customer;
        this.assignedAgent = assignedAgent;
        this.subject = subject;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.resolvedAt = resolvedAt;
        this.feedback = feedback;
        this.conversationId = conversationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserSummaryDto getCustomer() {
        return customer;
    }

    public void setCustomer(UserSummaryDto customer) {
        this.customer = customer;
    }

    public UserSummaryDto getAssignedAgent() {
        return assignedAgent;
    }

    public void setAssignedAgent(UserSummaryDto assignedAgent) {
        this.assignedAgent = assignedAgent;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public TicketPriority getPriority() {
        return priority;
    }

    public void setPriority(TicketPriority priority) {
        this.priority = priority;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public FeedbackDto getFeedback() {
        return feedback;
    }

    public void setFeedback(FeedbackDto feedback) {
        this.feedback = feedback;
    }

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }
}
