package com.aicustomersupport.repository;

import com.aicustomersupport.entity.Conversation;
import com.aicustomersupport.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationOrderByCreatedAtAsc(Conversation conversation);
    long countByConversation(Conversation conversation);
    void deleteByConversation(Conversation conversation);
}
