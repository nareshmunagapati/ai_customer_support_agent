package com.aicustomersupport.dto;

import jakarta.validation.constraints.NotBlank;

public class ChatMessageRequest {

    private Long conversationId;

    private Long ticketId;

    @NotBlank(message = "Message cannot be empty")
    private String message;

    public ChatMessageRequest() {
    }

    public ChatMessageRequest(Long conversationId, Long ticketId, String message) {
        this.conversationId = conversationId;
        this.ticketId = ticketId;
        this.message = message;
    }

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
