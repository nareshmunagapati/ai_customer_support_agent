package com.aicustomersupport.controller;

import com.aicustomersupport.dto.AgentReplyRequest;
import com.aicustomersupport.dto.ApiResponse;
import com.aicustomersupport.dto.TicketResponse;
import com.aicustomersupport.dto.UpdateTicketStatusRequest;
import com.aicustomersupport.entity.User;
import com.aicustomersupport.service.AuthService;
import com.aicustomersupport.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agent")
public class AgentController {

    private final TicketService ticketService;
    private final AuthService authService;

    public AgentController(TicketService ticketService, AuthService authService) {
        this.ticketService = ticketService;
        this.authService = authService;
    }

    @GetMapping("/tickets")
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getAgentTickets() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        List<TicketResponse> tickets = ticketService.getAgentTickets(currentUser);
        return ResponseEntity.ok(ApiResponse.ok(tickets));
    }

    @PostMapping("/tickets/{id}/reply")
    public ResponseEntity<ApiResponse<TicketResponse>> replyToTicket(
            @PathVariable Long id,
            @Valid @RequestBody AgentReplyRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        TicketResponse ticket = ticketService.replyToTicket(id, currentUser, request);
        return ResponseEntity.ok(ApiResponse.ok("Reply sent successfully", ticket));
    }

    @PutMapping("/tickets/{id}/status")
    public ResponseEntity<ApiResponse<TicketResponse>> updateTicketStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTicketStatusRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        TicketResponse ticket = ticketService.updateTicketStatus(id, request.getStatus(), currentUser);
        return ResponseEntity.ok(ApiResponse.ok("Ticket status updated successfully", ticket));
    }
}
