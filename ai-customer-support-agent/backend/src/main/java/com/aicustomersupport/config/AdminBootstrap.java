package com.aicustomersupport.config;

import com.aicustomersupport.entity.User;
import com.aicustomersupport.entity.UserRole;
import com.aicustomersupport.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.Locale;

@Component
public class AdminBootstrap implements CommandLineRunner {

    private static final int MAX_BCRYPT_PASSWORD_BYTES = 72;
    private static final int MIN_PASSWORD_LENGTH = 12;
    private static final int MAX_EMAIL_LENGTH = 150;
    private static final String EMAIL_PATTERN = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String bootstrapEmail;
    private final String bootstrapPassword;

    public AdminBootstrap(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          @Value("${app.admin-bootstrap.email:}") String bootstrapEmail,
                          @Value("${app.admin-bootstrap.password:}") String bootstrapPassword) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.bootstrapEmail = bootstrapEmail;
        this.bootstrapPassword = bootstrapPassword;
    }

    @Override
    @Transactional
    public void run(String... args) {
        boolean emailConfigured = !bootstrapEmail.isBlank();
        boolean passwordConfigured = !bootstrapPassword.isBlank();

        if (!emailConfigured && !passwordConfigured) {
            return;
        }
        if (!emailConfigured || !passwordConfigured) {
            throw new IllegalStateException(
                    "ADMIN_BOOTSTRAP_EMAIL and ADMIN_BOOTSTRAP_PASSWORD must be configured together");
        }

        String normalizedEmail = bootstrapEmail.trim().toLowerCase(Locale.ROOT);
        validateConfiguration(normalizedEmail, bootstrapPassword);

        if (userRepository.countByRole(UserRole.ADMIN) > 0) {
            return;
        }

        User administrator = new User(
                "Administrator",
                normalizedEmail,
                passwordEncoder.encode(bootstrapPassword),
                null,
                UserRole.ADMIN);
        userRepository.save(administrator);
    }

    private void validateConfiguration(String email, String password) {
        if (email.length() > MAX_EMAIL_LENGTH || !email.matches(EMAIL_PATTERN)) {
            throw new IllegalStateException("ADMIN_BOOTSTRAP_EMAIL must be a valid email address");
        }
        int passwordBytes = password.getBytes(StandardCharsets.UTF_8).length;
        if (password.length() < MIN_PASSWORD_LENGTH || passwordBytes > MAX_BCRYPT_PASSWORD_BYTES) {
            throw new IllegalStateException(
                    "ADMIN_BOOTSTRAP_PASSWORD must be at least 12 characters and no more than 72 UTF-8 bytes");
        }
    }
}
