package com.aicustomersupport;

import com.aicustomersupport.dto.CreateTicketRequest;
import com.aicustomersupport.dto.TicketResponse;
import com.aicustomersupport.dto.UserSummaryDto;
import com.aicustomersupport.entity.*;
import com.aicustomersupport.repository.*;
import com.aicustomersupport.service.TicketService;
import com.aicustomersupport.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ConversationRepository conversationRepository;

    @Mock
    private MessageRepository messageRepository;

    @Mock
    private FeedbackRepository feedbackRepository;

    @Mock
    private UserService userService;

    private TicketService ticketService;

    private User customer;
    private User agent;

    @BeforeEach
    void setUp() {
        ticketService = new TicketService(
                ticketRepository, userRepository, conversationRepository,
                messageRepository, feedbackRepository, userService);

        customer = new User("Customer", "customer@example.com", "pass", "123", UserRole.CUSTOMER);
        customer.setId(1L);

        agent = new User("Agent", "agent@example.com", "pass", "456", UserRole.SUPPORT_AGENT);
        agent.setId(2L);
    }

    @Test
    void testCreateTicket() {
        CreateTicketRequest request = new CreateTicketRequest(
                "App issue", "Cannot open cart", "Technical issues", TicketPriority.HIGH, null);

        Ticket saved = new Ticket(customer, "App issue", "Cannot open cart", "Technical issues", TicketPriority.HIGH);
        saved.setId(100L);

        when(ticketRepository.save(any(Ticket.class))).thenReturn(saved);
        when(userService.toDto(customer)).thenReturn(new UserSummaryDto(1L, "Customer", "customer@example.com", "123", UserRole.CUSTOMER, LocalDateTime.now()));
        when(feedbackRepository.findByTicket(saved)).thenReturn(Optional.empty());
        when(conversationRepository.findByTicket(saved)).thenReturn(Optional.empty());

        TicketResponse response = ticketService.createTicket(customer, request);

        assertNotNull(response);
        assertEquals("App issue", response.getSubject());
        assertEquals(TicketStatus.OPEN, response.getStatus());
        assertEquals(TicketPriority.HIGH, response.getPriority());
        verify(ticketRepository, times(1)).save(any(Ticket.class));
    }

    @Test
    void testEscalateTicket() {
        Ticket ticket = new Ticket(customer, "Payment query", "Charged twice", "Payment", TicketPriority.MEDIUM);
        ticket.setId(50L);

        when(ticketRepository.findById(50L)).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(any(Ticket.class))).thenReturn(ticket);
        when(userService.toDto(customer)).thenReturn(new UserSummaryDto(1L, "Customer", "customer@example.com", "123", UserRole.CUSTOMER, LocalDateTime.now()));
        when(feedbackRepository.findByTicket(ticket)).thenReturn(Optional.empty());
        when(conversationRepository.findByTicket(ticket)).thenReturn(Optional.empty());

        TicketResponse response = ticketService.escalateTicket(50L, customer);

        assertEquals(TicketStatus.ESCALATED, response.getStatus());
        assertEquals(TicketPriority.HIGH, response.getPriority());
    }

    @Test
    void testAssignTicket() {
        Ticket ticket = new Ticket(customer, "Login issue", "Cannot sign in", "Account and login", TicketPriority.LOW);
        ticket.setId(20L);

        when(ticketRepository.findById(20L)).thenReturn(Optional.of(ticket));
        when(userRepository.findById(2L)).thenReturn(Optional.of(agent));
        when(ticketRepository.save(any(Ticket.class))).thenReturn(ticket);
        when(userService.toDto(customer)).thenReturn(new UserSummaryDto(1L, "Customer", "customer@example.com", "123", UserRole.CUSTOMER, LocalDateTime.now()));
        when(userService.toDto(agent)).thenReturn(new UserSummaryDto(2L, "Agent", "agent@example.com", "456", UserRole.SUPPORT_AGENT, LocalDateTime.now()));
        when(feedbackRepository.findByTicket(ticket)).thenReturn(Optional.empty());
        when(conversationRepository.findByTicket(ticket)).thenReturn(Optional.empty());

        TicketResponse response = ticketService.assignTicket(20L, 2L);

        assertNotNull(response.getAssignedAgent());
        assertEquals(TicketStatus.IN_PROGRESS, response.getStatus());
    }
}
