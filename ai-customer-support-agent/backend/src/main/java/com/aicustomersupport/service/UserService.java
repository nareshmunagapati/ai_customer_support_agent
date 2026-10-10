package com.aicustomersupport.service;

import com.aicustomersupport.dto.UpdateProfileRequest;
import com.aicustomersupport.dto.UserSummaryDto;
import com.aicustomersupport.entity.User;
import com.aicustomersupport.entity.UserRole;
import com.aicustomersupport.exception.BadRequestException;
import com.aicustomersupport.exception.ResourceNotFoundException;
import com.aicustomersupport.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserSummaryDto toDto(User user) {
        return new UserSummaryDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getCreatedAt()
        );
    }

    public UserSummaryDto getProfile(User user) {
        User existing = userRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toDto(existing);
    }

    @Transactional
    public UserSummaryDto updateProfile(User user, UpdateProfileRequest request) {
        User existing = userRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getName() != null && !request.getName().isBlank()) {
            existing.setName(request.getName().trim());
        }

        if (request.getPhone() != null) {
            existing.setPhone(request.getPhone().trim());
        }

        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
                throw new BadRequestException("Current password is required to set a new password");
            }
            if (!passwordEncoder.matches(request.getCurrentPassword(), existing.getPasswordHash())) {
                throw new BadRequestException("Current password is incorrect");
            }
            existing.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        }

        User saved = userRepository.save(existing);
        return toDto(saved);
    }

    public List<UserSummaryDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<UserSummaryDto> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public User getUserEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
}
