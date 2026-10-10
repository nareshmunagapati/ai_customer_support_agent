package com.aicustomersupport.dto;

import java.time.LocalDateTime;

public class ConversationResponse {
    private Long id;
    private Long customerId;
    private String customerName;
    private Long ticketId;
    private String ticketSubject;
    private LocalDateTime createdAt;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private long messageCount;

    public ConversationResponse() {
    }

    public ConversationResponse(Long id, Long customerId, String customerName, Long ticketId, String ticketSubject,
                                LocalDateTime createdAt, String lastMessage, LocalDateTime lastMessageTime, long messageCount) {
        this.id = id;
        this.customerId = customerId;
        this.customerName = customerName;
        this.ticketId = ticketId;
        this.ticketSubject = ticketSubject;
        this.createdAt = createdAt;
        this.lastMessage = lastMessage;
        this.lastMessageTime = lastMessageTime;
        this.messageCount = messageCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public String getTicketSubject() {
        return ticketSubject;
    }

    public void setTicketSubject(String ticketSubject) {
        this.ticketSubject = ticketSubject;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public LocalDateTime getLastMessageTime() {
        return lastMessageTime;
    }

    public void setLastMessageTime(LocalDateTime lastMessageTime) {
        this.lastMessageTime = lastMessageTime;
    }

    public long getMessageCount() {
        return messageCount;
    }

    public void setMessageCount(long messageCount) {
        this.messageCount = messageCount;
    }
}
