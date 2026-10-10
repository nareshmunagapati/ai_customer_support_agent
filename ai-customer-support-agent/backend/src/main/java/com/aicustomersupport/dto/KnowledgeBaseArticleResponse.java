package com.aicustomersupport.dto;

import java.time.LocalDateTime;

public class KnowledgeBaseArticleResponse {
    private Long id;
    private String title;
    private String question;
    private String answer;
    private String category;
    private String keywords;
    private LocalDateTime createdAt;

    public KnowledgeBaseArticleResponse() {
    }

    public KnowledgeBaseArticleResponse(Long id, String title, String question, String answer, String category, String keywords, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.question = question;
        this.answer = answer;
        this.category = category;
        this.keywords = keywords;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
