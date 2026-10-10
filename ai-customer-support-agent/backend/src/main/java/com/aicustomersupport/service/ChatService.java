package com.aicustomersupport.service;

import com.aicustomersupport.dto.ChatMessageRequest;
import com.aicustomersupport.dto.ChatMessageResponse;
import com.aicustomersupport.dto.ConversationResponse;
import com.aicustomersupport.dto.MessageDto;
import com.aicustomersupport.entity.*;
import com.aicustomersupport.exception.ResourceNotFoundException;
import com.aicustomersupport.exception.UnauthorizedException;
import com.aicustomersupport.repository.ConversationRepository;
import com.aicustomersupport.repository.MessageRepository;
import com.aicustomersupport.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final TicketRepository ticketRepository;
    private final AiService aiService;

    public ChatService(ConversationRepository conversationRepository,
                       MessageRepository messageRepository,
                       TicketRepository ticketRepository,
                       AiService aiService) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.ticketRepository = ticketRepository;
        this.aiService = aiService;
    }

    @Transactional
    public ChatMessageResponse processCustomerMessage(User customer, ChatMessageRequest request) {
        Conversation conversation;

        if (request.getConversationId() != null) {
            conversation = conversationRepository.findById(request.getConversationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with id: " + request.getConversationId()));

            if (!conversation.getCustomer().getId().equals(customer.getId())) {
                throw new UnauthorizedException("You are not authorized to send messages to this conversation");
            }
        } else if (request.getTicketId() != null) {
            Ticket ticket = ticketRepository.findById(request.getTicketId())
                    .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + request.getTicketId()));

            conversation = conversationRepository.findByTicket(ticket)
                    .orElseGet(() -> conversationRepository.save(new Conversation(customer, ticket)));
        } else {
            conversation = conversationRepository.save(new Conversation(customer, null));
        }

        // Save Customer Message to MySQL
        Message customerMsg = new Message(conversation, SenderType.CUSTOMER, request.getMessage().trim());
        Message savedCustomerMsg = messageRepository.save(customerMsg);

        // Generate AI Response
        AiService.AiResponseData aiResponseData = aiService.generateResponse(request.getMessage().trim());

        // Save AI Message to MySQL
        Message aiMsg = new Message(conversation, SenderType.AI, aiResponseData.getReply());
        Message savedAiMsg = messageRepository.save(aiMsg);

        Long linkedTicketId = conversation.getTicket() != null ? conversation.getTicket().getId() : null;

        return new ChatMessageResponse(
                conversation.getId(),
                savedCustomerMsg.getId(),
                savedAiMsg.getId(),
                aiResponseData.getReply(),
                SenderType.AI,
                savedAiMsg.getCreatedAt(),
                aiResponseData.getDetectedCategory(),
                aiResponseData.isEscalationOffered(),
                linkedTicketId,
                aiResponseData.getSuggestedArticles()
        );
    }

    public List<ConversationResponse> getCustomerConversations(User customer) {
        List<Conversation> conversations = conversationRepository.findByCustomerOrderByCreatedAtDesc(customer);

        return conversations.stream().map(c -> {
            List<Message> messages = messageRepository.findByConversationOrderByCreatedAtAsc(c);
            String lastMsg = messages.isEmpty() ? "No messages yet" : messages.get(messages.size() - 1).getMessage();
            LocalDateTime lastMsgTime = messages.isEmpty() ? c.getCreatedAt() : messages.get(messages.size() - 1).getCreatedAt();
            Long ticketId = c.getTicket() != null ? c.getTicket().getId() : null;
            String ticketSubject = c.getTicket() != null ? c.getTicket().getSubject() : null;

            return new ConversationResponse(
                    c.getId(),
                    customer.getId(),
                    customer.getName(),
                    ticketId,
                    ticketSubject,
                    c.getCreatedAt(),
                    lastMsg,
                    lastMsgTime,
                    messages.size()
            );
        }).collect(Collectors.toList());
    }

    public List<MessageDto> getConversationMessages(User currentUser, Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with id: " + conversationId));

        // Ownership and role check
        boolean isOwner = conversation.getCustomer().getId().equals(currentUser.getId());
        boolean isStaff = currentUser.getRole() == UserRole.SUPPORT_AGENT || currentUser.getRole() == UserRole.ADMIN;

        if (!isOwner && !isStaff) {
            throw new UnauthorizedException("You are not authorized to view this conversation");
        }

        return messageRepository.findByConversationOrderByCreatedAtAsc(conversation).stream()
                .map(m -> new MessageDto(
                        m.getId(),
                        conversation.getId(),
                        m.getSenderType(),
                        m.getMessage(),
                        m.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void clearConversation(User customer, Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with id: " + conversationId));

        if (!conversation.getCustomer().getId().equals(customer.getId())) {
            throw new UnauthorizedException("You are not authorized to clear this conversation");
        }

        messageRepository.deleteByConversation(conversation);
    }
}
