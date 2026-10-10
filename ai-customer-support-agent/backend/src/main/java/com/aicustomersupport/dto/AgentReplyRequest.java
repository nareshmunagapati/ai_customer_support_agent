package com.aicustomersupport.dto;

import com.aicustomersupport.entity.TicketStatus;
import jakarta.validation.constraints.NotBlank;

public class AgentReplyRequest {

    @NotBlank(message = "Reply message cannot be empty")
    private String message;

    private TicketStatus status;

    public AgentReplyRequest() {
    }

    public AgentReplyRequest(String message, TicketStatus status) {
        this.message = message;
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }
}
