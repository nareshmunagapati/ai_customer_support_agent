package com.aicustomersupport.dto;

import jakarta.validation.constraints.NotNull;

public class AssignTicketRequest {

    @NotNull(message = "Agent ID is required")
    private Long agentId;

    public AssignTicketRequest() {
    }

    public AssignTicketRequest(Long agentId) {
        this.agentId = agentId;
    }

    public Long getAgentId() {
        return agentId;
    }

    public void setAgentId(Long agentId) {
        this.agentId = agentId;
    }
}
