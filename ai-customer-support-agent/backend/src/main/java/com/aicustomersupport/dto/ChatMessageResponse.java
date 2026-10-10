package com.aicustomersupport.dto;

import com.aicustomersupport.entity.SenderType;
import java.time.LocalDateTime;
import java.util.List;

public class ChatMessageResponse {
    private Long conversationId;
    private Long userMessageId;
    private Long aiMessageId;
    private String reply;
    private SenderType senderType;
    private LocalDateTime createdAt;
    private String detectedCategory;
    private boolean escalationOffered;
    private Long ticketId;
    private List<KnowledgeBaseArticleResponse> suggestedArticles;

    public ChatMessageResponse() {
    }

    public ChatMessageResponse(Long conversationId, Long userMessageId, Long aiMessageId,
                               String reply, SenderType senderType, LocalDateTime createdAt,
                               String detectedCategory, boolean escalationOffered,
                               Long ticketId, List<KnowledgeBaseArticleResponse> suggestedArticles) {
        this.conversationId = conversationId;
        this.userMessageId = userMessageId;
        this.aiMessageId = aiMessageId;
        this.reply = reply;
        this.senderType = senderType;
        this.createdAt = createdAt;
        this.detectedCategory = detectedCategory;
        this.escalationOffered = escalationOffered;
        this.ticketId = ticketId;
        this.suggestedArticles = suggestedArticles;
    }

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }

    public Long getUserMessageId() {
        return userMessageId;
    }

    public void setUserMessageId(Long userMessageId) {
        this.userMessageId = userMessageId;
    }

    public Long getAiMessageId() {
        return aiMessageId;
    }

    public void setAiMessageId(Long aiMessageId) {
        this.aiMessageId = aiMessageId;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public SenderType getSenderType() {
        return senderType;
    }

    public void setSenderType(SenderType senderType) {
        this.senderType = senderType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getDetectedCategory() {
        return detectedCategory;
    }

    public void setDetectedCategory(String detectedCategory) {
        this.detectedCategory = detectedCategory;
    }

    public boolean isEscalationOffered() {
        return escalationOffered;
    }

    public void setEscalationOffered(boolean escalationOffered) {
        this.escalationOffered = escalationOffered;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public List<KnowledgeBaseArticleResponse> getSuggestedArticles() {
        return suggestedArticles;
    }

    public void setSuggestedArticles(List<KnowledgeBaseArticleResponse> suggestedArticles) {
        this.suggestedArticles = suggestedArticles;
    }
}
