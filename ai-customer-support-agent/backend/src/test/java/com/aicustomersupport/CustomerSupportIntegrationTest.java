package com.aicustomersupport;

import com.aicustomersupport.dto.*;
import com.aicustomersupport.entity.*;
import com.aicustomersupport.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class CustomerSupportIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String customerToken;
    private String agentToken;
    private String adminToken;

    @BeforeEach
    void setup() throws Exception {
        // Log in as customer
        LoginRequest customerLogin = new LoginRequest("customer@example.com", "Password123!");
        MvcResult custResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(customerLogin)))
                .andExpect(status().isOk())
                .andReturn();

        String custBody = custResult.getResponse().getContentAsString();
        customerToken = objectMapper.readTree(custBody).path("data").path("token").asText();

        // Log in as agent
        LoginRequest agentLogin = new LoginRequest("agent@example.com", "Password123!");
        MvcResult agentResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(agentLogin)))
                .andExpect(status().isOk())
                .andReturn();
        agentToken = objectMapper.readTree(agentResult.getResponse().getContentAsString()).path("data").path("token").asText();

        // Log in as admin
        LoginRequest adminLogin = new LoginRequest("admin@example.com", "Password123!");
        MvcResult adminResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(adminLogin)))
                .andExpect(status().isOk())
                .andReturn();
        adminToken = objectMapper.readTree(adminResult.getResponse().getContentAsString()).path("data").path("token").asText();
    }

    @Test
    void testChatbotMessageFlow() throws Exception {
        ChatMessageRequest chatReq = new ChatMessageRequest(null, null, "How do I reset my password?");

        mockMvc.perform(post("/api/chat/message")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(chatReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.reply").isNotEmpty())
                .andExpect(jsonPath("$.data.detectedCategory").value("Account and login"));
    }

    @Test
    void testCreateTicketAndEscalateFlow() throws Exception {
        CreateTicketRequest createReq = new CreateTicketRequest(
                "Cannot complete checkout", "Card is getting error 400", "Payment", TicketPriority.HIGH, null);

        MvcResult createResult = mockMvc.perform(post("/api/tickets")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.status").value("OPEN"))
                .andReturn();

        Long ticketId = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .path("data").path("id").asLong();

        // Escalate ticket
        mockMvc.perform(post("/api/tickets/" + ticketId + "/escalate")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("ESCALATED"));
    }

    @Test
    void testAdminAnalyticsEndpoint() throws Exception {
        mockMvc.perform(get("/api/admin/analytics")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalCustomers").isNumber())
                .andExpect(jsonPath("$.data.totalTickets").isNumber());
    }

    @Test
    void testPublicKnowledgeBaseSearch() throws Exception {
        mockMvc.perform(get("/api/knowledge-base/search?query=payment"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }
}
