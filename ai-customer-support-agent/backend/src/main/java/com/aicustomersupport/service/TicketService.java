package com.aicustomersupport.service;

import com.aicustomersupport.dto.AgentReplyRequest;
import com.aicustomersupport.dto.CreateTicketRequest;
import com.aicustomersupport.dto.FeedbackDto;
import com.aicustomersupport.dto.TicketResponse;
import com.aicustomersupport.dto.UserSummaryDto;
import com.aicustomersupport.entity.*;
import com.aicustomersupport.exception.BadRequestException;
import com.aicustomersupport.exception.ResourceNotFoundException;
import com.aicustomersupport.exception.UnauthorizedException;
import com.aicustomersupport.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final FeedbackRepository feedbackRepository;
    private final UserService userService;

    public TicketService(TicketRepository ticketRepository,
                         UserRepository userRepository,
                         ConversationRepository conversationRepository,
                         MessageRepository messageRepository,
                         FeedbackRepository feedbackRepository,
                         UserService userService) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.feedbackRepository = feedbackRepository;
        this.userService = userService;
    }

    public TicketResponse toDto(Ticket ticket) {
        UserSummaryDto customerDto = userService.toDto(ticket.getCustomer());
        UserSummaryDto agentDto = ticket.getAssignedAgent() != null ? userService.toDto(ticket.getAssignedAgent()) : null;

        FeedbackDto feedbackDto = null;
        Optional<Feedback> feedbackOpt = feedbackRepository.findByTicket(ticket);
        if (feedbackOpt.isPresent()) {
            Feedback f = feedbackOpt.get();
            feedbackDto = new FeedbackDto(
                    f.getId(),
                    ticket.getId(),
                    f.getCustomer().getId(),
                    f.getCustomer().getName(),
                    f.getRating(),
                    f.getComment(),
                    f.getCreatedAt()
            );
        }

        Long conversationId = null;
        Optional<Conversation> convOpt = conversationRepository.findByTicket(ticket);
        if (convOpt.isPresent()) {
            conversationId = convOpt.get().getId();
        }

        return new TicketResponse(
                ticket.getId(),
                customerDto,
                agentDto,
                ticket.getSubject(),
                ticket.getDescription(),
                ticket.getCategory(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt(),
                ticket.getResolvedAt(),
                feedbackDto,
                conversationId
        );
    }

    @Transactional
    public TicketResponse createTicket(User customer, CreateTicketRequest request) {
        Ticket ticket = new Ticket(
                customer,
                request.getSubject().trim(),
                request.getDescription().trim(),
                request.getCategory(),
                request.getPriority()
        );

        Ticket savedTicket = ticketRepository.save(ticket);

        // If conversation ID is provided, link that conversation to the ticket
        if (request.getConversationId() != null) {
            conversationRepository.findById(request.getConversationId()).ifPresent(conversation -> {
                if (conversation.getCustomer().getId().equals(customer.getId())) {
                    conversation.setTicket(savedTicket);
                    conversationRepository.save(conversation);
                }
            });
        }

        return toDto(savedTicket);
    }

    public List<TicketResponse> getCustomerTickets(User customer) {
        return ticketRepository.findByCustomerOrderByCreatedAtDesc(customer).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public TicketResponse getTicketById(Long id, User currentUser) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        boolean isCustomer = ticket.getCustomer().getId().equals(currentUser.getId());
        boolean isStaff = currentUser.getRole() == UserRole.SUPPORT_AGENT || currentUser.getRole() == UserRole.ADMIN;

        if (!isCustomer && !isStaff) {
            throw new UnauthorizedException("You are not authorized to view this ticket");
        }

        return toDto(ticket);
    }

    @Transactional
    public TicketResponse updateTicketStatus(Long id, TicketStatus newStatus, User currentUser) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        boolean isCustomer = ticket.getCustomer().getId().equals(currentUser.getId());
        boolean isStaff = currentUser.getRole() == UserRole.SUPPORT_AGENT || currentUser.getRole() == UserRole.ADMIN;

        if (isCustomer) {
            // Customer can only close their own ticket or escalate
            if (newStatus != TicketStatus.CLOSED && newStatus != TicketStatus.ESCALATED) {
                throw new BadRequestException("Customers can only close or escalate their tickets");
            }
        } else if (!isStaff) {
            throw new UnauthorizedException("You are not authorized to update this ticket");
        }

        ticket.setStatus(newStatus);
        ticket.setUpdatedAt(LocalDateTime.now());
        Ticket updated = ticketRepository.save(ticket);
        return toDto(updated);
    }

    @Transactional
    public TicketResponse escalateTicket(Long id, User currentUser) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        boolean isCustomer = ticket.getCustomer().getId().equals(currentUser.getId());
        boolean isStaff = currentUser.getRole() == UserRole.SUPPORT_AGENT || currentUser.getRole() == UserRole.ADMIN;

        if (!isCustomer && !isStaff) {
            throw new UnauthorizedException("You are not authorized to escalate this ticket");
        }

        ticket.setStatus(TicketStatus.ESCALATED);
        if (ticket.getPriority() == TicketPriority.LOW || ticket.getPriority() == TicketPriority.MEDIUM) {
            ticket.setPriority(TicketPriority.HIGH);
        } else {
            ticket.setPriority(TicketPriority.URGENT);
        }

        ticket.setUpdatedAt(LocalDateTime.now());
        Ticket updated = ticketRepository.save(ticket);
        return toDto(updated);
    }

    public List<TicketResponse> getAgentTickets(User agent) {
        return ticketRepository.findByAssignedAgentOrderByCreatedAtDesc(agent).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TicketResponse replyToTicket(Long id, User agent, AgentReplyRequest request) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        if (ticket.getAssignedAgent() != null &&
            !ticket.getAssignedAgent().getId().equals(agent.getId()) &&
            agent.getRole() != UserRole.ADMIN) {
            throw new UnauthorizedException("This ticket is assigned to another agent");
        }

        // If ticket was unassigned, assign to this responding agent
        if (ticket.getAssignedAgent() == null) {
            ticket.setAssignedAgent(agent);
        }

        // Find or create conversation for this ticket
        Conversation conversation = conversationRepository.findByTicket(ticket)
                .orElseGet(() -> conversationRepository.save(new Conversation(ticket.getCustomer(), ticket)));

        // Save Agent message
        Message agentMessage = new Message(conversation, SenderType.AGENT, request.getMessage().trim());
        messageRepository.save(agentMessage);

        if (request.getStatus() != null) {
            ticket.setStatus(request.getStatus());
        } else if (ticket.getStatus() == TicketStatus.OPEN || ticket.getStatus() == TicketStatus.ESCALATED) {
            ticket.setStatus(TicketStatus.IN_PROGRESS);
        }

        ticket.setUpdatedAt(LocalDateTime.now());
        Ticket updated = ticketRepository.save(ticket);
        return toDto(updated);
    }

    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TicketResponse assignTicket(Long ticketId, Long agentId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found with id: " + agentId));

        if (agent.getRole() != UserRole.SUPPORT_AGENT && agent.getRole() != UserRole.ADMIN) {
            throw new BadRequestException("Assigned user must have SUPPORT_AGENT or ADMIN role");
        }

        ticket.setAssignedAgent(agent);
        if (ticket.getStatus() == TicketStatus.OPEN) {
            ticket.setStatus(TicketStatus.IN_PROGRESS);
        }
        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket updated = ticketRepository.save(ticket);
        return toDto(updated);
    }
}
