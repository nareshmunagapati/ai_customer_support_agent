package com.aicustomersupport.repository;

import com.aicustomersupport.entity.Ticket;
import com.aicustomersupport.entity.TicketPriority;
import com.aicustomersupport.entity.TicketStatus;
import com.aicustomersupport.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByCustomerOrderByCreatedAtDesc(User customer);

    List<Ticket> findByAssignedAgentOrderByCreatedAtDesc(User assignedAgent);

    List<Ticket> findAllByOrderByCreatedAtDesc();

    List<Ticket> findByStatus(TicketStatus status);

    long countByStatus(TicketStatus status);

    long countByCustomerAndStatus(User customer, TicketStatus status);

    long countByCustomer(User customer);

    long countByAssignedAgent(User assignedAgent);

    long countByAssignedAgentAndStatus(User assignedAgent, TicketStatus status);

    long countByAssignedAgentAndPriority(User assignedAgent, TicketPriority priority);

    long countByPriority(TicketPriority priority);

    @Query("SELECT t.status, COUNT(t) FROM Ticket t GROUP BY t.status")
    List<Object[]> countTicketsByStatusGroup();

    @Query("SELECT t.category, COUNT(t) FROM Ticket t GROUP BY t.category")
    List<Object[]> countTicketsByCategoryGroup();

    @Query("SELECT t.priority, COUNT(t) FROM Ticket t GROUP BY t.priority")
    List<Object[]> countTicketsByPriorityGroup();
}
