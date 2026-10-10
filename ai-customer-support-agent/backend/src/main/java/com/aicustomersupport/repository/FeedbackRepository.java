package com.aicustomersupport.repository;

import com.aicustomersupport.entity.Feedback;
import com.aicustomersupport.entity.Ticket;
import com.aicustomersupport.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findAllByOrderByCreatedAtDesc();
    Optional<Feedback> findByTicket(Ticket ticket);
    List<Feedback> findByCustomerOrderByCreatedAtDesc(User customer);
    boolean existsByTicket(Ticket ticket);

    @Query("SELECT AVG(f.rating) FROM Feedback f")
    Double findAverageRating();

    @Query("SELECT f.rating, COUNT(f) FROM Feedback f GROUP BY f.rating ORDER BY f.rating DESC")
    List<Object[]> countFeedbackByRatingGroup();
}
