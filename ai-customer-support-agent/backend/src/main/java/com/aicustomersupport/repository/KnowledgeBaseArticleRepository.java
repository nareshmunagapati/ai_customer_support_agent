package com.aicustomersupport.repository;

import com.aicustomersupport.entity.KnowledgeBaseArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KnowledgeBaseArticleRepository extends JpaRepository<KnowledgeBaseArticle, Long> {

    List<KnowledgeBaseArticle> findByCategoryIgnoreCase(String category);

    @Query("SELECT k FROM KnowledgeBaseArticle k WHERE " +
           "LOWER(k.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(k.question) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(k.keywords) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(k.answer) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(k.category) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<KnowledgeBaseArticle> searchArticles(@Param("query") String query);

    @Query("SELECT DISTINCT k.category FROM KnowledgeBaseArticle k")
    List<String> findDistinctCategories();
}
