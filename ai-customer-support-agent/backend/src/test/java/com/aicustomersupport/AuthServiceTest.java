package com.aicustomersupport;

import com.aicustomersupport.dto.AuthResponse;
import com.aicustomersupport.dto.RegisterRequest;
import com.aicustomersupport.entity.User;
import com.aicustomersupport.entity.UserRole;
import com.aicustomersupport.exception.BadRequestException;
import com.aicustomersupport.repository.UserRepository;
import com.aicustomersupport.security.JwtUtil;
import com.aicustomersupport.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AuthenticationManager authenticationManager;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, passwordEncoder, jwtUtil, authenticationManager);
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest("Test User", "test@example.com", "Password123!", "1234567890", UserRole.CUSTOMER);

        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password123!")).thenReturn("encoded_pass");

        User savedUser = new User("Test User", "test@example.com", "encoded_pass", "1234567890", UserRole.CUSTOMER);
        savedUser.setId(10L);

        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtUtil.generateToken(eq(10L), eq("test@example.com"), eq("CUSTOMER"))).thenReturn("mock_jwt_token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mock_jwt_token", response.getToken());
        assertEquals("test@example.com", response.getEmail());
        assertEquals(UserRole.CUSTOMER, response.getRole());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterDuplicateEmailThrowsException() {
        RegisterRequest request = new RegisterRequest("Test User", "test@example.com", "Password123!", "1234567890", UserRole.CUSTOMER);

        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testPublicRegistrationCannotCreateAdministrator() {
        RegisterRequest request = new RegisterRequest(
                "Test Admin", "admin@example.com", "Password123!", null, UserRole.ADMIN);

        assertThrows(BadRequestException.class, () -> authService.register(request));

        verify(userRepository, never()).save(any(User.class));
        verify(passwordEncoder, never()).encode(anyString());
    }
}
