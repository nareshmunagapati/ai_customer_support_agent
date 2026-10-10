package com.aicustomersupport.dto;

import com.aicustomersupport.entity.SenderType;
import java.time.LocalDateTime;

public class MessageDto {
    private Long id;
    private Long conversationId;
    private SenderType senderType;
    private String message;
    private LocalDateTime createdAt;

    public MessageDto() {
    }

    public MessageDto(Long id, Long conversationId, SenderType senderType, String message, LocalDateTime createdAt) {
        this.id = id;
        this.conversationId = conversationId;
        this.senderType = senderType;
        this.message = message;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }

    public SenderType getSenderType() {
        return senderType;
    }

    public void setSenderType(SenderType senderType) {
        this.senderType = senderType;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
