package com.aicustomersupport.controller;

import com.aicustomersupport.dto.ApiResponse;
import com.aicustomersupport.dto.KnowledgeBaseArticleResponse;
import com.aicustomersupport.service.KnowledgeBaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/knowledge-base")
public class KnowledgeBaseController {

    private final KnowledgeBaseService knowledgeBaseService;

    public KnowledgeBaseController(KnowledgeBaseService knowledgeBaseService) {
        this.knowledgeBaseService = knowledgeBaseService;
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<KnowledgeBaseArticleResponse>>> search(
            @RequestParam(value = "query", required = false) String query) {
        List<KnowledgeBaseArticleResponse> results = knowledgeBaseService.searchArticles(query);
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<KnowledgeBaseArticleResponse>>> getAll() {
        List<KnowledgeBaseArticleResponse> articles = knowledgeBaseService.getAllArticles();
        return ResponseEntity.ok(ApiResponse.ok(articles));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<KnowledgeBaseArticleResponse>> getById(@PathVariable Long id) {
        KnowledgeBaseArticleResponse article = knowledgeBaseService.getArticleById(id);
        return ResponseEntity.ok(ApiResponse.ok(article));
    }
}
