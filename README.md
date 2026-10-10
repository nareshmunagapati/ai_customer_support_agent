# AI Customer Support Agent

A full-stack, enterprise-grade AI-powered customer support web application built with **React.js**, **Java Spring Boot**, **MySQL**, and **Maven**.

The application provides automated AI customer support with query classification, knowledge base retrieval, escalation to human support agents, complete ticket lifecycle tracking, and customer satisfaction feedback.

---

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| **Frontend** | React 18, Vite, JavaScript, HTML5, CSS3, Lucide Icons |
| **Frontend Routing** | React Router DOM v7 |
| **API Client** | Axios with JWT interceptors |
| **Backend** | Java 17+, Spring Boot 3.3.4 |
| **API Architecture** | RESTful API |
| **Security & Auth** | Spring Security 6 with JWT (JJWT) & BCrypt Password Hashing |
| **Database & ORM** | MySQL 8.0+, Spring Data JPA, Hibernate |
| **Build & Tooling** | Apache Maven 3.9+ |
| **Testing** | JUnit 5, Mockito, Spring Boot Test |

---

## 🚀 System Architecture & User Roles

The system supports three distinct user roles:

1. **Customer**
   - Interactive 24/7 AI chatbot with automated knowledge base recommendations
   - Ticket escalation when automated answers are insufficient
   - Creation and tracking of support tickets
   - Real-time status tracker (Open, In Progress, Waiting for Customer, Escalated, Resolved, Closed)
   - Chat dialogue history review and session clearing
   - Post-resolution star ratings (1 to 5) and feedback submission
   - Profile management and password updates

2. **Support Agent**
   - Agent dashboard monitoring assigned, open, in-progress, and escalated tickets
   - Complete review of prior customer-to-AI conversation transcripts
   - Reply directly to customers within the ticket thread
   - Status transitions (e.g., In Progress, Waiting for Customer, Resolved)

3. **Administrator**
   - Comprehensive analytical dashboard (Total Customers, Agents, Tickets, Escalated, Average Rating, Category and Priority charts)
   - User account directory management (Customers, Support Agents, Administrators)
   - Ticket dispatching & assignment to specific support agents
   - Full Knowledge Base CRUD management (Title, Question, Answer, Category, Keywords)
   - Customer feedback and ratings review

---

## 📁 Project Structure

```
ai-customer-support-agent/
│
├── frontend/                     # React.js application (Vite)
│   ├── src/
│   │   ├── components/           # Reusable UI widgets (Navbar, Sidebar, Badges, Modals, Cards)
│   │   ├── context/              # AuthContext & ToastContext
│   │   ├── layouts/              # DashboardLayout & PublicLayout
│   │   ├── pages/
│   │   │   ├── admin/            # Admin dashboard, users, tickets, knowledge base, feedback
│   │   │   ├── agent/            # Agent dashboard, assigned tickets, ticket details
│   │   │   ├── customer/         # Customer dashboard, AI chat, tickets, history, profile, feedback
│   │   │   └── public/           # Home, Login, Register, Knowledge Base search
│   │   ├── services/             # Centralized Axios API services
│   │   ├── utils/                # Date formatting utilities
│   │   ├── App.jsx               # React Router routes
│   │   ├── index.css             # Responsive design system
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Spring Boot Maven application
│   ├── src/main/java/com/aicustomersupport/
│   │   ├── config/               # SecurityConfig, DataInitializer
│   │   ├── controller/           # REST Controllers (Auth, Customer, Ticket, Chat, Agent, Admin, KB, Feedback)
│   │   ├── dto/                  # Data Transfer Objects (Requests & Responses)
│   │   ├── entity/               # JPA Entities (User, Ticket, Conversation, Message, KBArticle, Feedback)
│   │   ├── exception/            # Global Exception Handler and custom exceptions
│   │   ├── repository/           # Spring Data JPA Repositories
│   │   ├── security/             # JWT utility, filters, and UserDetails implementation
│   │   ├── service/              # Modular AiService, AuthService, TicketService, ChatService, etc.
│   │   └── AiCustomerSupportApplication.java
│   ├── src/main/resources/
│   │   └── application.properties # Main application configuration
│   ├── src/test/java/            # Unit & Integration test suites
│   ├── src/test/resources/
│   │   └── application.properties # In-memory H2 test configuration
│   └── pom.xml
│
├── database/
│   ├── schema.sql                # Complete MySQL DDL schema
│   └── data.sql                  # Seed data with demo accounts and 8 KB articles
│
├── .env.example                  # Environment configuration template
├── .gitignore
└── README.md
```

---

## 🔑 Demo Accounts

The application automatically seeds the following demo users upon first startup (passwords are pre-hashed with BCrypt):

| Role | Email | Password | Description |
|---|---|---|---|
| **Administrator** | `admin@example.com` | `Password123!` | Full admin dashboard, ticket assignment, KB management |
| **Support Agent** | `agent@example.com` | `Password123!` | Ticket resolution, customer replies, queue status |
| **Support Agent** | `alex.agent@example.com` | `Password123!` | Secondary support specialist |
| **Customer** | `customer@example.com` | `Password123!` | AI chatbot, ticket creation, feedback rating |
| **Customer** | `jane.customer@example.com` | `Password123!` | Sample customer account |

> **Tip:** The Login page includes convenient one-click demo autofill buttons for Customer, Agent, and Admin.

---

## ⚙️ Prerequisites & Setup Instructions

### 1. Required Software
- **Java Development Kit (JDK)**: Version 17, 21, or newer
- **Apache Maven**: Version 3.8+ (A portable Maven installation is also configured in user tools)
- **Node.js & npm**: Node.js 18+ (tested with Node.js 26 / npm 11)
- **MySQL Server**: Version 8.0 or newer

---

### 2. Database Setup

1. Log into your MySQL console or MySQL Workbench:
   ```bash
   mysql -u root -p
   ```

2. Execute the schema script:
   ```sql
   SOURCE database/schema.sql;
   ```
   *(Alternatively, run the SQL script `database/schema.sql` inside MySQL Workbench).*

3. *(Optional)* Execute the sample seed data script:
   ```sql
   SOURCE database/data.sql;
   ```
   > **Note:** Spring Boot includes a built-in `DataInitializer` that automatically provisions default demo accounts and knowledge base articles if the database is initially empty.

---

### 3. Environment Variables Configuration

Copy `.env.example` to `.env` or set environment variables:

```bash
# Windows PowerShell
$env:DB_URL="jdbc:mysql://localhost:3306/ai_customer_support?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password_here"
```

Or configure directly in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ai_customer_support?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_mysql_password_here
```

---

### 4. Running the Spring Boot Backend

Navigate to the `backend/` directory and execute:

```bash
# Compile and run
mvn spring-boot:run
```

The backend server starts on **http://localhost:8080**.

To run unit and integration tests:
```bash
mvn test
```

---

### 5. Running the React Frontend

Navigate to the `frontend/` directory:

```bash
# Install dependencies (already executed)
npm install

# Start Vite development server
npm run dev
```

The React frontend starts on **http://localhost:5173**.

To create a production build:
```bash
npm run build
```

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a customer or agent
- `POST /api/auth/login` — Authenticate and receive JWT token

### Customer Profile (`/api/customers`)
- `GET /api/customers/profile` — Fetch authenticated customer profile
- `PUT /api/customers/profile` — Update name, phone, or password

### Support Tickets (`/api/tickets`)
- `POST /api/tickets` — Create a new support ticket
- `GET /api/tickets` — List customer's tickets (or all tickets if staff)
- `GET /api/tickets/{id}` — Retrieve full ticket details
- `PUT /api/tickets/{id}/status` — Update ticket status
- `POST /api/tickets/{id}/escalate` — Escalate ticket to priority human support

### AI Chatbot (`/api/chat`)
- `POST /api/chat/message` — Send message to AI chatbot and receive automated response
- `GET /api/chat/conversations` — Retrieve past conversation sessions
- `GET /api/chat/conversations/{id}/messages` — Retrieve conversation messages
- `DELETE /api/chat/conversations/{id}` — Clear conversation history

### Support Agent (`/api/agent`)
- `GET /api/agent/tickets` — List tickets assigned to current agent
- `POST /api/agent/tickets/{id}/reply` — Reply to customer and update ticket status
- `PUT /api/agent/tickets/{id}/status` — Update ticket resolution state

### Administrator (`/api/admin`)
- `GET /api/admin/users` — Directory of all users
- `GET /api/admin/tickets` — View all system tickets
- `PUT /api/admin/tickets/{id}/assign` — Assign ticket to a support agent
- `GET /api/admin/analytics` — Platform metrics & distribution analytics
- `POST /api/admin/knowledge-base` — Add new article
- `PUT /api/admin/knowledge-base/{id}` — Update article
- `DELETE /api/admin/knowledge-base/{id}` — Remove article
- `GET /api/admin/feedback` — View all customer ratings and reviews

### Knowledge Base (`/api/knowledge-base`)
- `GET /api/knowledge-base/search?query=...` — Search articles by keyword or category
- `GET /api/knowledge-base` — List all articles

### Feedback (`/api/feedback`)
- `POST /api/feedback` — Submit star rating (1-5) and review for a resolved ticket
- `GET /api/feedback/my` — Customer's submitted feedback history

---

## 🤖 Modular AI Engine & Query Classifier

The backend features a dedicated modular `AiService`:

1. **Intent Classification**: Evaluates customer text into domain categories:
   - *Account and login*
   - *Payment*
   - *Orders and delivery*
   - *Refund*
   - *Technical issues*
   - *Product information*
   - *Complaints*
   - *General queries*

2. **Automated Escalation Detection**: Recognizes escalation triggers (*"human", "representative", "real person", "escalate", "agent"*) and immediately prompts the customer to create a priority ticket with full conversation context preserved.

3. **Knowledge Base Fallback**: Uses weighted keyword and title matching against MySQL articles.

4. **Extensibility**: The AI architecture is cleanly decoupled from the controller and frontend. Integrating an external LLM (e.g., Google Gemini, OpenAI, Claude) only requires implementing an external connector in `AiService` without altering frontend components or database schemas.

---

## 🧪 Testing Verification

All 12 backend unit and integration tests compile and run via Maven:
- `AiServiceTest`: Validates query classification, escalation detection, and knowledge base matching.
- `AuthServiceTest`: Validates user registration and duplicate check validations.
- `TicketServiceTest`: Validates ticket creation, escalation, and agent assignment.
- `CustomerSupportIntegrationTest`: End-to-end integration test validating authentication, AI chatbot responses, ticket creation, escalation, and public knowledge base searches.
