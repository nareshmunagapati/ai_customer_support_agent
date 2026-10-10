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
│   └── data.sql                  # Optional seed data for public knowledge base articles
│
├── .env.example                  # Environment configuration template
├── .gitignore
└── README.md
```

---

## Local Demo Data

Demo records are disabled by default. To enable them in a local development environment, explicitly set `SEED_DEMO_DATA=true` and provide a private `DEMO_PASSWORD` of at least 12 characters (no more than 72 UTF-8 bytes). The initializer creates sample users, tickets, and knowledge base content using that local-only password. Do not enable demo seeding or set `DEMO_PASSWORD` in production. No demo credentials are published in the application UI or this README.

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
   > **Note:** `database/data.sql` seeds public knowledge base articles only. Demo accounts and sample tickets are created by the application initializer only when `SEED_DEMO_DATA=true` and a local `DEMO_PASSWORD` is configured.

---

### 3. Environment Variables Configuration

Spring Boot does not load `.env` files automatically. Set these variables in the shell that starts Maven (or configure them in your IDE):

```bash
# Windows PowerShell
$env:DB_URL="jdbc:mysql://localhost:3306/ai_customer_support?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password_here"
$env:JWT_SECRET="<base64-encoded random secret of at least 32 bytes>"
```

Generate a development JWT key with `openssl rand -base64 32`. Do not put real credentials in tracked files. The Vite frontend reads `frontend/.env`; set `VITE_API_BASE_URL=http://localhost:8080` there for local use.

For local demo records only, explicitly set `SEED_DEMO_DATA=true` and `DEMO_PASSWORD` in your local backend environment. Demo seeding is disabled by default.

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

---

## ☁️ Deployment (Vercel + Render + Managed MySQL)

The frontend and API are deployed separately. Use the managed MySQL provider's connection details for the Render service; this repository does not create cloud resources.

### Frontend on Vercel

1. Import the GitHub repository into Vercel and set **Root Directory** to `frontend`.
2. Use the Vite defaults: **Build Command** `npm run build`, **Output Directory** `dist`, and **Install Command** `npm install` (or let Vercel detect them).
3. Set the `VITE_API_BASE_URL` environment variable to the public Render API URL, for example `https://your-api.onrender.com` (no trailing slash).
4. Deploy. `frontend/vercel.json` rewrites client-side routes to `index.html` so refreshes on React Router routes work.

### Backend on Render (Docker)

Create a **Web Service** from this repository, choose **Docker** as the runtime, and set the Dockerfile path to `backend/Dockerfile` (or set the service root directory to `backend` and use `Dockerfile`). The container listens on Render's `PORT` environment variable.

Configure these environment variables in Render. Keep credentials in Render's secret environment settings; do not commit them:

| Variable | Value |
|---|---|
| `DB_URL` | JDBC URL for your managed MySQL database, e.g. `jdbc:mysql://HOST:3306/DATABASE?sslMode=REQUIRED&serverTimezone=UTC` (follow your provider's TLS requirements) |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | A unique Base64-encoded secret of at least 32 random bytes |
| `CORS_ALLOWED_ORIGINS` | Exact Vercel origin, e.g. `https://your-app.vercel.app`; comma-separate additional trusted origins if needed |
| `SEED_DEMO_DATA` | `false` for deployed environments; prevents demo users, tickets, and sample records from being inserted |
| `DEMO_PASSWORD` | Local development only; required if demo seeding is enabled and must never be configured in production |
| `ALLOW_AGENT_SIGNUP` | `false` for deployed environments; public signups should create customer accounts only |
| `ADMIN_BOOTSTRAP_EMAIL` | Optional one-time administrator email; set together with the password below |
| `ADMIN_BOOTSTRAP_PASSWORD` | Optional one-time administrator password; at least 12 characters and at most 72 UTF-8 bytes |
| `PORT` | Supplied by Render; do not hardcode a different port |

Generate a JWT key locally with `openssl rand -base64 32`; set the resulting value only in Render's environment configuration. Changing this key invalidates existing JWTs. Configure the managed database and create its database/schema before starting the backend. Hibernate `update` creates missing tables and updates mapped schema, but it is not a versioned migration system; back up production data and use reviewed migrations for future schema changes. The included SQL seed files and demo initializer are for development/sample data, not production provisioning.

To provision the first production administrator, temporarily set `ADMIN_BOOTSTRAP_EMAIL` and `ADMIN_BOOTSTRAP_PASSWORD` together in the backend service's secret environment settings, keep `SEED_DEMO_DATA=false`, and run exactly **one backend instance** during bootstrap. At startup, the application creates an administrator only when none exists and stores the password using the existing BCrypt encoder. It fails startup if only one bootstrap value is configured. After the successful startup, remove **both** bootstrap variables from the service settings. Later restarts without them leave the administrator unchanged. If the variables remain set, later starts still never reset or overwrite an existing administrator. Do not use the public registration form to provision staff.

### Verify the deployed connection

Set the Vercel API URL and Render CORS origin to the corresponding public service URLs. Open the Vercel site, test public knowledge base access and sign-in, and check Render logs for database connectivity or startup errors. For local checks, run `npm run build` from `frontend` and `mvn test` from `backend`.

### Production notes

- Keep `SEED_DEMO_DATA=false` and `ALLOW_AGENT_SIGNUP=false`; public registration cannot create administrator accounts, and customer registration remains available. Use the one-time bootstrap variables above for the first administrator, run one backend instance during bootstrap, then remove both variables.
- The backend requires database credentials and `JWT_SECRET` through environment variables. The development JWT fallback and embedded database password have been removed.
- CORS permits only the configured origin(s); avoid wildcard origins. Authentication remains stateless with JWT, and password hashes continue to use BCrypt.
- Keep TLS enabled for managed MySQL connections according to the provider's documented JDBC parameters. Do not expose database credentials in the frontend, source control, or logs.
