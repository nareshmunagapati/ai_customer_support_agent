package com.aicustomersupport.controller;

import com.aicustomersupport.dto.ApiResponse;
import com.aicustomersupport.dto.CreateTicketRequest;
import com.aicustomersupport.dto.TicketResponse;
import com.aicustomersupport.dto.UpdateTicketStatusRequest;
import com.aicustomersupport.entity.User;
import com.aicustomersupport.entity.UserRole;
import com.aicustomersupport.service.AuthService;
import com.aicustomersupport.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final AuthService authService;

    public TicketController(TicketService ticketService, AuthService authService) {
        this.ticketService = ticketService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TicketResponse>> createTicket(@Valid @RequestBody CreateTicketRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        TicketResponse response = ticketService.createTicket(currentUser, request);
        return new ResponseEntity<>(ApiResponse.ok("Ticket created successfully", response), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getTickets() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        List<TicketResponse> tickets;
        if (currentUser.getRole() == UserRole.CUSTOMER) {
            tickets = ticketService.getCustomerTickets(currentUser);
        } else if (currentUser.getRole() == UserRole.SUPPORT_AGENT) {
            tickets = ticketService.getAgentTickets(currentUser);
        } else {
            tickets = ticketService.getAllTickets();
        }
        return ResponseEntity.ok(ApiResponse.ok(tickets));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicketById(@PathVariable Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        TicketResponse ticket = ticketService.getTicketById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.ok(ticket));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TicketResponse>> updateTicketStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTicketStatusRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        TicketResponse updated = ticketService.updateTicketStatus(id, request.getStatus(), currentUser);
        return ResponseEntity.ok(ApiResponse.ok("Ticket status updated successfully", updated));
    }

    @PostMapping("/{id}/escalate")
    public ResponseEntity<ApiResponse<TicketResponse>> escalateTicket(@PathVariable Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        TicketResponse escalated = ticketService.escalateTicket(id, currentUser);
        return ResponseEntity.ok(ApiResponse.ok("Ticket successfully escalated to human support", escalated));
    }
}
