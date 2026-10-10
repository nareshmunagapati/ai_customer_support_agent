package com.aicustomersupport.service;

import com.aicustomersupport.dto.KnowledgeBaseArticleRequest;
import com.aicustomersupport.dto.KnowledgeBaseArticleResponse;
import com.aicustomersupport.entity.KnowledgeBaseArticle;
import com.aicustomersupport.exception.ResourceNotFoundException;
import com.aicustomersupport.repository.KnowledgeBaseArticleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class KnowledgeBaseService {

    private final KnowledgeBaseArticleRepository repository;

    public KnowledgeBaseService(KnowledgeBaseArticleRepository repository) {
        this.repository = repository;
    }

    public KnowledgeBaseArticleResponse toDto(KnowledgeBaseArticle article) {
        return new KnowledgeBaseArticleResponse(
                article.getId(),
                article.getTitle(),
                article.getQuestion(),
                article.getAnswer(),
                article.getCategory(),
                article.getKeywords(),
                article.getCreatedAt()
        );
    }

    public List<KnowledgeBaseArticleResponse> getAllArticles() {
        return repository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<KnowledgeBaseArticleResponse> searchArticles(String query) {
        if (query == null || query.isBlank()) {
            return getAllArticles();
        }
        return repository.searchArticles(query.trim()).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public KnowledgeBaseArticleResponse getArticleById(Long id) {
        KnowledgeBaseArticle article = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Knowledge base article not found with id: " + id));
        return toDto(article);
    }

    @Transactional
    public KnowledgeBaseArticleResponse createArticle(KnowledgeBaseArticleRequest request) {
        KnowledgeBaseArticle article = new KnowledgeBaseArticle(
                request.getTitle().trim(),
                request.getQuestion().trim(),
                request.getAnswer().trim(),
                request.getCategory().trim(),
                request.getKeywords().trim()
        );
        KnowledgeBaseArticle saved = repository.save(article);
        return toDto(saved);
    }

    @Transactional
    public KnowledgeBaseArticleResponse updateArticle(Long id, KnowledgeBaseArticleRequest request) {
        KnowledgeBaseArticle article = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Knowledge base article not found with id: " + id));

        article.setTitle(request.getTitle().trim());
        article.setQuestion(request.getQuestion().trim());
        article.setAnswer(request.getAnswer().trim());
        article.setCategory(request.getCategory().trim());
        article.setKeywords(request.getKeywords().trim());

        KnowledgeBaseArticle updated = repository.save(article);
        return toDto(updated);
    }

    @Transactional
    public void deleteArticle(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Knowledge base article not found with id: " + id);
        }
        repository.deleteById(id);
    }

    public List<String> getCategories() {
        return repository.findDistinctCategories();
    }
}
