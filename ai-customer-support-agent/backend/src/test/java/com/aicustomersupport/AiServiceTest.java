package com.aicustomersupport;

import com.aicustomersupport.entity.KnowledgeBaseArticle;
import com.aicustomersupport.repository.KnowledgeBaseArticleRepository;
import com.aicustomersupport.service.AiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AiServiceTest {

    @Mock
    private KnowledgeBaseArticleRepository articleRepository;

    private AiService aiService;

    @BeforeEach
    void setUp() {
        aiService = new AiService(articleRepository);
    }

    @Test
    void testQueryClassification() {
        assertEquals("Account and login", aiService.classifyCategory("I forgot my password and cannot sign in"));
        assertEquals("Payment", aiService.classifyCategory("My credit card payment was declined"));
        assertEquals("Orders and delivery", aiService.classifyCategory("Where is my package? Tracking number is 12345"));
        assertEquals("Refund", aiService.classifyCategory("I would like to request a refund for my order"));
        assertEquals("Technical issues", aiService.classifyCategory("The website keeps crashing with error 500"));
        assertEquals("Complaints", aiService.classifyCategory("The service was terrible and I want to complain"));
    }

    @Test
    void testExplicitEscalationDetection() {
        AiService.AiResponseData response = aiService.generateResponse("I want to speak with a human support agent please");
        assertTrue(response.isEscalationOffered());
        assertTrue(response.getReply().toLowerCase().contains("human support agent"));
    }

    @Test
    void testKnowledgeBaseMatching() {
        KnowledgeBaseArticle article = new KnowledgeBaseArticle(
                "Reset Password",
                "How do I reset password?",
                "Click on forgot password link on the login page.",
                "Account and login",
                "password, reset, login"
        );

        when(articleRepository.findAll()).thenReturn(List.of(article));
        when(articleRepository.findByCategoryIgnoreCase(anyString())).thenReturn(List.of(article));

        AiService.AiResponseData response = aiService.generateResponse("How do I reset my account password?");
        assertNotNull(response.getReply());
        assertTrue(response.getReply().contains("Click on forgot password"));
        assertFalse(response.getSuggestedArticles().isEmpty());
        assertEquals("Account and login", response.getDetectedCategory());
    }
}
