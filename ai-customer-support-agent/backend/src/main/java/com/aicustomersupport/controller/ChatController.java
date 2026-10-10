package com.aicustomersupport.controller;

import com.aicustomersupport.dto.ApiResponse;
import com.aicustomersupport.dto.ChatMessageRequest;
import com.aicustomersupport.dto.ChatMessageResponse;
import com.aicustomersupport.dto.ConversationResponse;
import com.aicustomersupport.dto.MessageDto;
import com.aicustomersupport.entity.User;
import com.aicustomersupport.service.AuthService;
import com.aicustomersupport.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;
    private final AuthService authService;

    public ChatController(ChatService chatService, AuthService authService) {
        this.chatService = chatService;
        this.authService = authService;
    }

    @PostMapping("/message")
    public ResponseEntity<ApiResponse<ChatMessageResponse>> sendMessage(@Valid @RequestBody ChatMessageRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        ChatMessageResponse response = chatService.processCustomerMessage(currentUser, request);
        return ResponseEntity.ok(ApiResponse.ok("Message processed successfully", response));
    }

    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<ConversationResponse>>> getConversations() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        List<ConversationResponse> conversations = chatService.getCustomerConversations(currentUser);
        return ResponseEntity.ok(ApiResponse.ok(conversations));
    }

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<ApiResponse<List<MessageDto>>> getConversationMessages(@PathVariable Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        List<MessageDto> messages = chatService.getConversationMessages(currentUser, id);
        return ResponseEntity.ok(ApiResponse.ok(messages));
    }

    @DeleteMapping("/conversations/{id}")
    public ResponseEntity<ApiResponse<Void>> clearConversation(@PathVariable Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        chatService.clearConversation(currentUser, id);
        return ResponseEntity.ok(ApiResponse.ok("Conversation cleared successfully", null));
    }
}
