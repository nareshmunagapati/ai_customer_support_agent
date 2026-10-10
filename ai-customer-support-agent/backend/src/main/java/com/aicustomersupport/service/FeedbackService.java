package com.aicustomersupport.service;

import com.aicustomersupport.dto.FeedbackDto;
import com.aicustomersupport.dto.FeedbackRequest;
import com.aicustomersupport.entity.Feedback;
import com.aicustomersupport.entity.Ticket;
import com.aicustomersupport.entity.TicketStatus;
import com.aicustomersupport.entity.User;
import com.aicustomersupport.exception.BadRequestException;
import com.aicustomersupport.exception.ResourceNotFoundException;
import com.aicustomersupport.exception.UnauthorizedException;
import com.aicustomersupport.repository.FeedbackRepository;
import com.aicustomersupport.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final TicketRepository ticketRepository;

    public FeedbackService(FeedbackRepository feedbackRepository, TicketRepository ticketRepository) {
        this.feedbackRepository = feedbackRepository;
        this.ticketRepository = ticketRepository;
    }

    public FeedbackDto toDto(Feedback feedback) {
        return new FeedbackDto(
                feedback.getId(),
                feedback.getTicket().getId(),
                feedback.getCustomer().getId(),
                feedback.getCustomer().getName(),
                feedback.getRating(),
                feedback.getComment(),
                feedback.getCreatedAt()
        );
    }

    @Transactional
    public FeedbackDto submitFeedback(User customer, FeedbackRequest request) {
        Ticket ticket = ticketRepository.findById(request.getTicketId())
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + request.getTicketId()));

        if (!ticket.getCustomer().getId().equals(customer.getId())) {
            throw new UnauthorizedException("You can only submit feedback for your own tickets");
        }

        if (ticket.getStatus() != TicketStatus.RESOLVED && ticket.getStatus() != TicketStatus.CLOSED) {
            throw new BadRequestException("Feedback can only be submitted for resolved or closed tickets");
        }

        if (feedbackRepository.existsByTicket(ticket)) {
            throw new BadRequestException("Feedback has already been submitted for this ticket");
        }

        Feedback feedback = new Feedback(
                ticket,
                customer,
                request.getRating(),
                request.getComment() != null ? request.getComment().trim() : null
        );

        Feedback saved = feedbackRepository.save(feedback);
        return toDto(saved);
    }

    public List<FeedbackDto> getAllFeedback() {
        return feedbackRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<FeedbackDto> getCustomerFeedback(User customer) {
        return feedbackRepository.findByCustomerOrderByCreatedAtDesc(customer).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Double getAverageRating() {
        Double avg = feedbackRepository.findAverageRating();
        return avg != null ? Math.round(avg * 100.0) / 100.0 : 0.0;
    }
}
