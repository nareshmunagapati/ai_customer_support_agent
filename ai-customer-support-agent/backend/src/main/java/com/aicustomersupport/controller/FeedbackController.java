package com.aicustomersupport.controller;

import com.aicustomersupport.dto.ApiResponse;
import com.aicustomersupport.dto.FeedbackDto;
import com.aicustomersupport.dto.FeedbackRequest;
import com.aicustomersupport.entity.User;
import com.aicustomersupport.service.AuthService;
import com.aicustomersupport.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final AuthService authService;

    public FeedbackController(FeedbackService feedbackService, AuthService authService) {
        this.feedbackService = feedbackService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FeedbackDto>> submitFeedback(@Valid @RequestBody FeedbackRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        FeedbackDto response = feedbackService.submitFeedback(currentUser, request);
        return new ResponseEntity<>(ApiResponse.ok("Feedback submitted successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<FeedbackDto>>> getMyFeedback() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        List<FeedbackDto> feedbackList = feedbackService.getCustomerFeedback(currentUser);
        return ResponseEntity.ok(ApiResponse.ok(feedbackList));
    }
}
