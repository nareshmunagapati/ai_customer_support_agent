package com.aicustomersupport.controller;

import com.aicustomersupport.dto.ApiResponse;
import com.aicustomersupport.dto.UpdateProfileRequest;
import com.aicustomersupport.dto.UserSummaryDto;
import com.aicustomersupport.entity.User;
import com.aicustomersupport.service.AuthService;
import com.aicustomersupport.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final UserService userService;
    private final AuthService authService;

    public CustomerController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserSummaryDto>> getProfile() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        UserSummaryDto profile = userService.getProfile(currentUser);
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserSummaryDto>> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        UserSummaryDto updated = userService.updateProfile(currentUser, request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }
}
