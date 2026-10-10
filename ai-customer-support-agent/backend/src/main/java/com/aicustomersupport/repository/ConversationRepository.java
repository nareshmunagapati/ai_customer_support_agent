package com.aicustomersupport.repository;

import com.aicustomersupport.entity.Conversation;
import com.aicustomersupport.entity.Ticket;
import com.aicustomersupport.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findByCustomerOrderByCreatedAtDesc(User customer);
    Optional<Conversation> findByTicket(Ticket ticket);
    Optional<Conversation> findFirstByCustomerOrderByCreatedAtDesc(User customer);
}
