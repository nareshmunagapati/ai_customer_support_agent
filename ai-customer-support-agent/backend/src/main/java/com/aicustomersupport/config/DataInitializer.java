package com.aicustomersupport.config;

import com.aicustomersupport.entity.*;
import com.aicustomersupport.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final KnowledgeBaseArticleRepository articleRepository;
    private final TicketRepository ticketRepository;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           KnowledgeBaseArticleRepository articleRepository,
                           TicketRepository ticketRepository,
                           ConversationRepository conversationRepository,
                           MessageRepository messageRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.articleRepository = articleRepository;
        this.ticketRepository = ticketRepository;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedKnowledgeBase();
        seedSampleTickets();
        log.info("AI Customer Support Agent: Data initialization completed successfully.");
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@example.com")) {
            User admin = new User("System Administrator", "admin@example.com",
                    passwordEncoder.encode("Password123!"), "+1-555-0100", UserRole.ADMIN);
            userRepository.save(admin);
            log.info("Created default admin user: admin@example.com");
        }

        if (!userRepository.existsByEmail("agent@example.com")) {
            User agent = new User("Sarah Agent", "agent@example.com",
                    passwordEncoder.encode("Password123!"), "+1-555-0101", UserRole.SUPPORT_AGENT);
            userRepository.save(agent);
            log.info("Created default support agent user: agent@example.com");
        }

        if (!userRepository.existsByEmail("alex.agent@example.com")) {
            User agent2 = new User("Alex Agent", "alex.agent@example.com",
                    passwordEncoder.encode("Password123!"), "+1-555-0102", UserRole.SUPPORT_AGENT);
            userRepository.save(agent2);
        }

        if (!userRepository.existsByEmail("customer@example.com")) {
            User customer = new User("John Doe", "customer@example.com",
                    passwordEncoder.encode("Password123!"), "+1-555-0103", UserRole.CUSTOMER);
            userRepository.save(customer);
            log.info("Created default customer user: customer@example.com");
        }

        if (!userRepository.existsByEmail("jane.customer@example.com")) {
            User customer2 = new User("Jane Smith", "jane.customer@example.com",
                    passwordEncoder.encode("Password123!"), "+1-555-0104", UserRole.CUSTOMER);
            userRepository.save(customer2);
        }
    }

    private void seedKnowledgeBase() {
        if (articleRepository.count() == 0) {
            List<KnowledgeBaseArticle> articles = List.of(
                new KnowledgeBaseArticle(
                    "Troubleshooting Account Login and Password Reset",
                    "How do I reset my password or fix login issues?",
                    "To reset your password, visit the login page and click 'Forgot Password'. Enter your registered email address, and you will receive a secure reset link within 5 minutes. If you encounter an 'Invalid credentials' error, ensure caps lock is off and clear your browser cache. For 2FA issues, use your backup codes or contact human support.",
                    "Account and login",
                    "login, password, reset, forgot password, authentication, locked account, credentials, access"
                ),
                new KnowledgeBaseArticle(
                    "Resolving Failed and Pending Payments",
                    "Why was my payment declined and how can I complete my order?",
                    "Payment failures typically occur due to insufficient funds, bank fraud prevention filters, incorrect CVV or billing zip codes, or expired cards. Check your online banking app to authorize the charge, or try an alternate payment method like PayPal, credit/debit card, or net banking. If your account was debited but the order shows failed, the hold will automatically be reversed by your bank in 3-5 business days.",
                    "Payment",
                    "payment, declined, failed payment, transaction, credit card, checkout, debit, billing, charge"
                ),
                new KnowledgeBaseArticle(
                    "Tracking Your Orders and Delivery Times",
                    "Where is my order and how do I track shipping progress?",
                    "You can track your package anytime from the 'My Orders' tab on your account dashboard. Once dispatched, an email containing your tracking number and carrier link is sent. Standard delivery takes 3-5 business days, while express delivery takes 1-2 business days. If tracking shows no movement for more than 48 hours, please escalate for an agent investigation.",
                    "Orders and delivery",
                    "order, tracking, shipment, shipping, delivery, dispatch, carrier, transit, package, where is my order"
                ),
                new KnowledgeBaseArticle(
                    "Refund Policy and Processing Times",
                    "How do I request a refund and how long does it take?",
                    "You can request a refund within 30 days of delivery for eligible items in original condition. Navigate to your Order History, select the item, and choose 'Request Return/Refund'. Once we receive and inspect the returned item, approved refunds are credited back to your original payment method within 5-7 business days. Digital services and gift cards are non-refundable.",
                    "Refund",
                    "refund, return, money back, reimbursement, cancel order, refund status, return policy"
                ),
                new KnowledgeBaseArticle(
                    "Technical Issues, App Crashing, and Browser Glitches",
                    "What should I do if the application crashes or shows unexpected errors?",
                    "For application or website glitches, try these steps: 1) Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R); 2) Clear cookies and site cache; 3) Disable conflicting browser extensions such as aggressive ad-blockers; 4) Ensure your browser is updated to the latest version. If using our mobile app, check the App Store or Google Play for updates or reinstall the app.",
                    "Technical issues",
                    "technical, crash, bug, error, loading, glitch, browser, app, freeze, slow"
                ),
                new KnowledgeBaseArticle(
                    "Product Availability and Warranty Information",
                    "How do I check product specifications and warranty coverage?",
                    "All products listed in our store include standard manufacturer warranty details in the 'Specifications' section of the product page. Typically, electronics come with a 1-year limited warranty covering hardware defects. You can register your product serial number under your Profile to access extended warranty and claim assistance.",
                    "Product information",
                    "product, warranty, specs, specifications, features, guarantee, stock, availability"
                ),
                new KnowledgeBaseArticle(
                    "Filing a Formal Complaint or Service Escalation",
                    "How do I submit a formal complaint regarding service or delivery quality?",
                    "We take customer satisfaction very seriously. If you have had an unsatisfactory experience with our service, staff, or delivery partners, you can submit a complaint ticket categorized under 'Complaints'. All complaints are automatically flagged with HIGH priority and assigned directly to a senior customer experience supervisor within 2 hours.",
                    "Complaints",
                    "complaint, unhappy, poor service, escalation, supervisor, manager, dispute, dissatisfaction"
                ),
                new KnowledgeBaseArticle(
                    "General Inquiries and Business Hours",
                    "What are your support operating hours and contact methods?",
                    "Our AI Customer Support Agent is available 24/7/365 to assist you instantly. Human support agents are on duty Monday through Friday from 8:00 AM to 8:00 PM EST, and Saturday from 9:00 AM to 5:00 PM EST. For urgent issues outside operating hours, submit an escalated ticket and our on-call team will respond.",
                    "General queries",
                    "hours, contact, phone, email, support hours, help, general, business hours"
                )
            );
            articleRepository.saveAll(articles);
            log.info("Initialized 8 knowledge base articles.");
        }
    }

    private void seedSampleTickets() {
        if (ticketRepository.count() == 0) {
            userRepository.findByEmail("customer@example.com").ifPresent(customer -> {
                userRepository.findByEmail("agent@example.com").ifPresent(agent -> {
                    Ticket ticket1 = new Ticket(customer, "Cannot log in after resetting password",
                            "I received the reset email, clicked the link and entered a new password, but logging in gives error 401.",
                            "Account and login", TicketPriority.HIGH);
                    ticket1.setStatus(TicketStatus.IN_PROGRESS);
                    ticket1.setAssignedAgent(agent);
                    ticketRepository.save(ticket1);

                    Conversation conv = conversationRepository.save(new Conversation(customer, ticket1));
                    messageRepository.save(new Message(conv, SenderType.CUSTOMER, "Hi, I cannot log in after resetting my password."));
                    messageRepository.save(new Message(conv, SenderType.AI, "Hello John! Please check caps lock or clear browser cache. If the issue persists, let me know."));
                    messageRepository.save(new Message(conv, SenderType.CUSTOMER, "I tried incognito and it still failed. Please escalate."));
                    messageRepository.save(new Message(conv, SenderType.AGENT, "Hello John, Sarah here. I unlocked your account and sent a fresh activation link."));

                    Ticket ticket2 = new Ticket(customer, "Double charge on invoice #9021",
                            "My credit card shows two charges of $89.99 for order #9021. Please refund the duplicate transaction.",
                            "Payment", TicketPriority.URGENT);
                    ticket2.setStatus(TicketStatus.ESCALATED);
                    ticketRepository.save(ticket2);
                });
            });
        }
    }
}
