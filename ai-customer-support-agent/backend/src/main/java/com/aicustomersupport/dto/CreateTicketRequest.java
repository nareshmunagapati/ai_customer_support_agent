package com.aicustomersupport.dto;

import com.aicustomersupport.entity.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateTicketRequest {

    @NotBlank(message = "Subject is required")
    @Size(max = 255, message = "Subject cannot exceed 255 characters")
    private String subject;

    @NotBlank(message = "Description is required")
    private String description;

    private String category = "General queries";

    private TicketPriority priority = TicketPriority.MEDIUM;

    private Long conversationId;

    public CreateTicketRequest() {
    }

    public CreateTicketRequest(String subject, String description, String category, TicketPriority priority, Long conversationId) {
        this.subject = subject;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.conversationId = conversationId;
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

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }
}
