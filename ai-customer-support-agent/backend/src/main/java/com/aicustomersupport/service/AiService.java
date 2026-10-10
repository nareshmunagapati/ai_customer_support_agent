package com.aicustomersupport.service;

import com.aicustomersupport.dto.KnowledgeBaseArticleResponse;
import com.aicustomersupport.entity.KnowledgeBaseArticle;
import com.aicustomersupport.repository.KnowledgeBaseArticleRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AiService {

    private final KnowledgeBaseArticleRepository articleRepository;

    public static class AiResponseData {
        private final String reply;
        private final String detectedCategory;
        private final boolean escalationOffered;
        private final List<KnowledgeBaseArticleResponse> suggestedArticles;
        private final String engineType;

        public AiResponseData(String reply, String detectedCategory, boolean escalationOffered,
                              List<KnowledgeBaseArticleResponse> suggestedArticles, String engineType) {
            this.reply = reply;
            this.detectedCategory = detectedCategory;
            this.escalationOffered = escalationOffered;
            this.suggestedArticles = suggestedArticles;
            this.engineType = engineType;
        }

        public String getReply() { return reply; }
        public String getDetectedCategory() { return detectedCategory; }
        public boolean isEscalationOffered() { return escalationOffered; }
        public List<KnowledgeBaseArticleResponse> getSuggestedArticles() { return suggestedArticles; }
        public String getEngineType() { return engineType; }
    }

    public AiService(KnowledgeBaseArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public AiResponseData generateResponse(String userMessage) {
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return new AiResponseData(
                    "Hello! How can I assist you today? You can ask about accounts, orders, payments, refunds, or technical questions.",
                    "General queries",
                    false,
                    Collections.emptyList(),
                    "Local Fallback Knowledge Engine"
            );
        }

        String normalized = userMessage.trim().toLowerCase();

        // 1. Check for explicit escalation request
        if (isEscalationRequested(normalized)) {
            return new AiResponseData(
                    "I understand you would like to connect with a human support agent. I can create an escalated support ticket for you right away. Our team will review our conversation and follow up promptly. Would you like to confirm ticket creation?",
                    classifyCategory(normalized),
                    true,
                    Collections.emptyList(),
                    "Local Fallback Knowledge Engine"
            );
        }

        // 2. Classify query category
        String category = classifyCategory(normalized);

        // 3. Search knowledge base in MySQL
        List<KnowledgeBaseArticle> matchingArticles = findRelevantArticles(normalized, category);

        // 4. Build response based on matching articles
        if (!matchingArticles.isEmpty()) {
            KnowledgeBaseArticle bestMatch = matchingArticles.get(0);
            List<KnowledgeBaseArticleResponse> suggestions = matchingArticles.stream()
                    .map(a -> new KnowledgeBaseArticleResponse(
                            a.getId(), a.getTitle(), a.getQuestion(), a.getAnswer(),
                            a.getCategory(), a.getKeywords(), a.getCreatedAt()))
                    .collect(Collectors.toList());

            StringBuilder sb = new StringBuilder();
            sb.append("Based on our knowledge base regarding ").append(category).append(":\n\n");
            sb.append(bestMatch.getAnswer()).append("\n\n");
            sb.append("💡 Did this resolve your issue? If you need further assistance or would like to speak with a human support specialist, please select 'Connect to Human Agent'.");

            return new AiResponseData(
                    sb.toString(),
                    category,
                    true,
                    suggestions,
                    "Local Fallback Knowledge Engine"
            );
        }

        // 5. Fallback response with troubleshooting guidance
        String fallbackResponse = buildGeneralTroubleshootingResponse(normalized, category);
        return new AiResponseData(
                fallbackResponse,
                category,
                true,
                Collections.emptyList(),
                "Local Fallback Knowledge Engine"
        );
    }

    public String classifyCategory(String message) {
        Map<String, List<String>> categoryKeywords = new LinkedHashMap<>();

        categoryKeywords.put("Account and login", Arrays.asList(
                "login", "log in", "signin", "sign in", "password", "reset password", "forgot password",
                "username", "account", "locked", "credentials", "otp", "2fa", "profile", "authentication"
        ));

        categoryKeywords.put("Refund", Arrays.asList(
                "refund", "refunds", "return", "returns", "money back", "reimbursement", "cancel order", "cancelation"
        ));

        categoryKeywords.put("Payment", Arrays.asList(
                "payment", "credit card", "debit card", "pay", "charge", "charged", "billing",
                "invoice", "declined", "transaction", "checkout", "cvv", "paypal", "bank"
        ));

        categoryKeywords.put("Orders and delivery", Arrays.asList(
                "order", "orders", "track", "tracking", "delivery", "shipping", "shipped",
                "dispatch", "package", "parcel", "courier", "arrive", "transit", "where is my"
        ));

        categoryKeywords.put("Technical issues", Arrays.asList(
                "bug", "crash", "glitch", "error", "error 404", "error 500", "broken", "freeze",
                "frozen", "app", "browser", "not working", "website down", "slow"
        ));

        categoryKeywords.put("Product information", Arrays.asList(
                "product", "warranty", "spec", "specification", "features", "stock", "availability",
                "catalog", "dimensions", "manual", "model"
        ));

        categoryKeywords.put("Complaints", Arrays.asList(
                "complaint", "unhappy", "angry", "poor service", "terrible", "worst", "manager",
                "supervisor", "dispute", "disappointed", "rude"
        ));

        for (Map.Entry<String, List<String>> entry : categoryKeywords.entrySet()) {
            for (String kw : entry.getValue()) {
                if (message.contains(kw)) {
                    return entry.getKey();
                }
            }
        }

        return "General queries";
    }

    private boolean isEscalationRequested(String message) {
        String[] triggers = {
                "human", "agent", "representative", "real person", "person", "operator",
                "speak to someone", "talk to human", "talk to someone", "escalate",
                "support agent", "customer care", "manager"
        };
        for (String trigger : triggers) {
            if (Pattern.compile("\\b" + Pattern.quote(trigger) + "\\b", Pattern.CASE_INSENSITIVE).matcher(message).find()) {
                return true;
            }
        }
        return false;
    }

    private List<KnowledgeBaseArticle> findRelevantArticles(String message, String category) {
        // Try searching by the category first
        List<KnowledgeBaseArticle> byCat = articleRepository.findByCategoryIgnoreCase(category);

        // Find words in query
        String[] words = message.toLowerCase().split("\\W+");
        List<String> meaningfulWords = Arrays.stream(words)
                .filter(w -> w.length() > 3)
                .collect(Collectors.toList());

        List<KnowledgeBaseArticle> scoredList = new ArrayList<>();

        List<KnowledgeBaseArticle> pool = articleRepository.findAll();
        for (KnowledgeBaseArticle article : pool) {
            int score = 0;
            String text = (article.getTitle() + " " + article.getKeywords() + " " + article.getQuestion()).toLowerCase();

            if (article.getCategory().equalsIgnoreCase(category)) {
                score += 3;
            }

            for (String word : meaningfulWords) {
                if (text.contains(word)) {
                    score += 2;
                }
            }

            if (score >= 4) {
                scoredList.add(article);
            }
        }

        if (!scoredList.isEmpty()) {
            return scoredList;
        }

        return byCat;
    }

    private String buildGeneralTroubleshootingResponse(String message, String category) {
        switch (category) {
            case "Account and login":
                return "To resolve account access issues, please verify your credentials and check if caps lock is enabled. You can use the 'Forgot Password' option on the login screen to reset your password. If your account remains inaccessible, I can connect you directly with our support team.";
            case "Payment":
                return "For billing and payment inquiries, please verify your card details, billing address, and bank balance. If a duplicate charge occurred, it will typically reverse automatically within 3 to 5 business days. Would you like me to open a billing ticket with a human agent?";
            case "Orders and delivery":
                return "You can view up-to-date tracking details under your profile dashboard. Deliveries typically arrive within 3-5 business days. If your parcel is delayed or marked as delivered without receipt, please let me know and I will escalate this to our logistics team.";
            case "Refund":
                return "Returns and refunds can be initiated within 30 days of product receipt. Approved refunds are credited to the original payment method within 5 to 7 business days. Would you like to create a refund ticket?";
            case "Technical issues":
                return "For technical issues, we recommend refreshing your browser cache, attempting the action in an incognito window, or ensuring your browser is updated. If the issue persists, our technical support team is ready to assist.";
            default:
                return "Thank you for reaching out. I have analyzed your question regarding " + category + ". While I did not find an exact match in our automated knowledge base, our human support team is available to assist you. Would you like to connect with a support agent?";
        }
    }
}
