package com.aicustomersupport.dto;

import jakarta.validation.constraints.NotBlank;

public class KnowledgeBaseArticleRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Question is required")
    private String question;

    @NotBlank(message = "Answer is required")
    private String answer;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Keywords are required")
    private String keywords;

    public KnowledgeBaseArticleRequest() {
    }

    public KnowledgeBaseArticleRequest(String title, String question, String answer, String category, String keywords) {
        this.title = title;
        this.question = question;
        this.answer = answer;
        this.category = category;
        this.keywords = keywords;
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
}
