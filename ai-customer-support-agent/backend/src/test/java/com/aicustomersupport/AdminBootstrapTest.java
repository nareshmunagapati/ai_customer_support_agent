package com.aicustomersupport;

import com.aicustomersupport.config.AdminBootstrap;
import com.aicustomersupport.entity.User;
import com.aicustomersupport.entity.UserRole;
import com.aicustomersupport.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminBootstrapTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Test
    void createsAdministratorWithBCryptEncodedPasswordWhenNoAdminExists() {
        when(userRepository.countByRole(UserRole.ADMIN)).thenReturn(0L);
        when(passwordEncoder.encode("a-long-bootstrap-password")).thenReturn("bcrypt-hash");

        AdminBootstrap bootstrap = bootstrap(" FIRST.ADMIN@EXAMPLE.COM ", "a-long-bootstrap-password");
        bootstrap.run();

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User saved = userCaptor.getValue();
        assertEquals("first.admin@example.com", saved.getEmail());
        assertEquals("bcrypt-hash", saved.getPasswordHash());
        assertEquals(UserRole.ADMIN, saved.getRole());
        verify(passwordEncoder).encode("a-long-bootstrap-password");
    }

    @Test
    void repeatedStartupDoesNotCreateOrChangeAdministrator() {
        when(userRepository.countByRole(UserRole.ADMIN)).thenReturn(0L, 1L);
        when(passwordEncoder.encode("a-long-bootstrap-password")).thenReturn("bcrypt-hash");
        AdminBootstrap bootstrap = bootstrap("admin@example.com", "a-long-bootstrap-password");

        bootstrap.run();
        bootstrap.run();

        verify(userRepository, times(1)).save(any(User.class));
        verify(passwordEncoder, times(1)).encode("a-long-bootstrap-password");
    }

    @Test
    void existingAdministratorIsNeverOverwrittenOrReset() {
        when(userRepository.countByRole(UserRole.ADMIN)).thenReturn(1L);
        AdminBootstrap bootstrap = bootstrap("admin@example.com", "a-long-bootstrap-password");

        bootstrap.run();

        verify(userRepository, never()).save(any(User.class));
        verify(passwordEncoder, never()).encode(any());
    }

    @Test
    void partialBootstrapConfigurationFailsWithoutLoggingOrUsingCredentials() {
        AdminBootstrap bootstrap = bootstrap("admin@example.com", "");

        assertThrows(IllegalStateException.class, bootstrap::run);

        verify(userRepository, never()).save(any(User.class));
        verify(passwordEncoder, never()).encode(any());
    }

    private AdminBootstrap bootstrap(String email, String password) {
        return new AdminBootstrap(userRepository, passwordEncoder, email, password);
    }
}
