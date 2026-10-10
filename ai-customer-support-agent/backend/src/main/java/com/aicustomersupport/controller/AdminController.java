package com.aicustomersupport.controller;

import com.aicustomersupport.dto.*;
import com.aicustomersupport.service.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;
    private final TicketService ticketService;
    private final KnowledgeBaseService knowledgeBaseService;
    private final FeedbackService feedbackService;
    private final AnalyticsService analyticsService;

    public AdminController(UserService userService,
                           TicketService ticketService,
                           KnowledgeBaseService knowledgeBaseService,
                           FeedbackService feedbackService,
                           AnalyticsService analyticsService) {
        this.userService = userService;
        this.ticketService = ticketService;
        this.knowledgeBaseService = knowledgeBaseService;
        this.feedbackService = feedbackService;
        this.analyticsService = analyticsService;
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserSummaryDto>>> getAllUsers() {
        List<UserSummaryDto> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    @GetMapping("/tickets")
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getAllTickets() {
        List<TicketResponse> tickets = ticketService.getAllTickets();
        return ResponseEntity.ok(ApiResponse.ok(tickets));
    }

    @PutMapping("/tickets/{id}/assign")
    public ResponseEntity<ApiResponse<TicketResponse>> assignTicket(
            @PathVariable Long id,
            @Valid @RequestBody AssignTicketRequest request) {
        TicketResponse ticket = ticketService.assignTicket(id, request.getAgentId());
        return ResponseEntity.ok(ApiResponse.ok("Ticket assigned successfully", ticket));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<DashboardAnalyticsResponse>> getAnalytics() {
        DashboardAnalyticsResponse analytics = analyticsService.getDashboardAnalytics();
        return ResponseEntity.ok(ApiResponse.ok(analytics));
    }

    @PostMapping("/knowledge-base")
    public ResponseEntity<ApiResponse<KnowledgeBaseArticleResponse>> createKnowledgeBaseArticle(
            @Valid @RequestBody KnowledgeBaseArticleRequest request) {
        KnowledgeBaseArticleResponse article = knowledgeBaseService.createArticle(request);
        return new ResponseEntity<>(ApiResponse.ok("Article created successfully", article), HttpStatus.CREATED);
    }

    @PutMapping("/knowledge-base/{id}")
    public ResponseEntity<ApiResponse<KnowledgeBaseArticleResponse>> updateKnowledgeBaseArticle(
            @PathVariable Long id,
            @Valid @RequestBody KnowledgeBaseArticleRequest request) {
        KnowledgeBaseArticleResponse article = knowledgeBaseService.updateArticle(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Article updated successfully", article));
    }

    @DeleteMapping("/knowledge-base/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteKnowledgeBaseArticle(@PathVariable Long id) {
        knowledgeBaseService.deleteArticle(id);
        return ResponseEntity.ok(ApiResponse.ok("Article deleted successfully", null));
    }

    @GetMapping("/feedback")
    public ResponseEntity<ApiResponse<List<FeedbackDto>>> getAllFeedback() {
        List<FeedbackDto> feedbackList = feedbackService.getAllFeedback();
        return ResponseEntity.ok(ApiResponse.ok(feedbackList));
    }
}
