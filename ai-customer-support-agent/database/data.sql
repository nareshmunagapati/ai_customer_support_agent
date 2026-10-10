-- AI Customer Support Agent Seed Data
-- Database: ai_customer_support

USE `ai_customer_support`;

-- 1. Demo Users (Password for all demo accounts is Password123!)
-- BCrypt hash: $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `phone`, `role`, `created_at`)
VALUES
(1, 'System Administrator', 'admin@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '+1-555-0100', 'ADMIN', NOW()),
(2, 'Sarah Agent', 'agent@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '+1-555-0101', 'SUPPORT_AGENT', NOW()),
(3, 'Alex Agent', 'alex.agent@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '+1-555-0102', 'SUPPORT_AGENT', NOW()),
(4, 'John Doe', 'customer@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '+1-555-0103', 'CUSTOMER', NOW()),
(5, 'Jane Smith', 'jane.customer@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '+1-555-0104', 'CUSTOMER', NOW())
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);

-- 2. Knowledge Base Articles
INSERT INTO `knowledge_base_articles` (`id`, `title`, `question`, `answer`, `category`, `keywords`, `createdAt`)
VALUES
(1, 'Troubleshooting Account Login and Password Reset',
 'How do I reset my password or fix login issues?',
 'To reset your password, visit the login page and click "Forgot Password". Enter your registered email address, and you will receive a secure reset link within 5 minutes. If you encounter an "Invalid credentials" error, ensure caps lock is off and clear your browser cache. For 2FA issues, use your backup codes or contact human support.',
 'Account and login',
 'login, password, reset, forgot password, authentication, locked account, credentials, access',
 NOW()),

(2, 'Resolving Failed and Pending Payments',
 'Why was my payment declined and how can I complete my order?',
 'Payment failures typically occur due to insufficient funds, bank fraud prevention filters, incorrect CVV or billing zip codes, or expired cards. Check your online banking app to authorize the charge, or try an alternate payment method like PayPal, credit/debit card, or net banking. If your account was debited but the order shows failed, the hold will automatically be reversed by your bank in 3-5 business days.',
 'Payment',
 'payment, declined, failed payment, transaction, credit card, checkout, debit, billing, charge',
 NOW()),

(3, 'Tracking Your Orders and Delivery Times',
 'Where is my order and how do I track shipping progress?',
 'You can track your package anytime from the "My Orders" tab on your account dashboard. Once dispatched, an email containing your tracking number and carrier link is sent. Standard delivery takes 3-5 business days, while express delivery takes 1-2 business days. If tracking shows no movement for more than 48 hours, please escalate for an agent investigation.',
 'Orders and delivery',
 'order, tracking, shipment, shipping, delivery, dispatch, carrier, transit, package, where is my order',
 NOW()),

(4, 'Refund Policy and Processing Times',
 'How do I request a refund and how long does it take?',
 'You can request a refund within 30 days of delivery for eligible items in original condition. Navigate to your Order History, select the item, and choose "Request Return/Refund". Once we receive and inspect the returned item, approved refunds are credited back to your original payment method within 5-7 business days. Digital services and gift cards are non-refundable.',
 'Refund',
 'refund, return, money back, reimbursement, cancel order, refund status, return policy',
 NOW()),

(5, 'Technical Issues, App Crashing, and Browser Glitches',
 'What should I do if the application crashes or shows unexpected errors?',
 'For application or website glitches, try these steps: 1) Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R); 2) Clear cookies and site cache; 3) Disable conflicting browser extensions such as aggressive ad-blockers; 4) Ensure your browser is updated to the latest version. If using our mobile app, check the App Store or Google Play for updates or reinstall the app.',
 'Technical issues',
 'technical, crash, bug, error, loading, glitch, browser, app, freeze, slow',
 NOW()),

(6, 'Product Availability and Warranty Information',
 'How do I check product specifications and warranty coverage?',
 'All products listed in our store include standard manufacturer warranty details in the "Specifications" section of the product page. Typically, electronics come with a 1-year limited warranty covering hardware defects. You can register your product serial number under your Profile to access extended warranty and claim assistance.',
 'Product information',
 'product, warranty, specs, specifications, features, guarantee, stock, availability',
 NOW()),

(7, 'Filing a Formal Complaint or Service Escalation',
 'How do I submit a formal complaint regarding service or delivery quality?',
 'We take customer satisfaction very seriously. If you have had an unsatisfactory experience with our service, staff, or delivery partners, you can submit a complaint ticket categorized under "Complaints". All complaints are automatically flagged with HIGH priority and assigned directly to a senior customer experience supervisor within 2 hours.',
 'Complaints',
 'complaint, unhappy, poor service, escalation, supervisor, manager, dispute, dissatisfaction',
 NOW()),

(8, 'General Inquiries and Business Hours',
 'What are your support operating hours and contact methods?',
 'Our AI Customer Support Agent is available 24/7/365 to assist you instantly. Human support agents are on duty Monday through Friday from 8:00 AM to 8:00 PM EST, and Saturday from 9:00 AM to 5:00 PM EST. For urgent issues outside operating hours, submit an escalated ticket and our on-call team will respond.',
 'General queries',
 'hours, contact, phone, email, support hours, help, general, business hours',
 NOW())
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- 3. Sample Tickets
INSERT INTO `tickets` (`id`, `customer_id`, `assigned_agent_id`, `subject`, `description`, `category`, `priority`, `status`, `created_at`, `updated_at`)
VALUES
(1, 4, 2, 'Cannot log in after resetting password', 'I received the reset email, clicked the link and entered a new password, but logging in gives error 401.', 'Account and login', 'HIGH', 'IN_PROGRESS', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 1 DAY),
(2, 4, 3, 'Double charge on invoice #9021', 'My credit card shows two charges of $89.99 for order #9021. Please refund the duplicate transaction.', 'Payment', 'URGENT', 'ESCALATED', NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 6 HOUR),
(3, 5, NULL, 'Package marked as delivered but not received', 'Tracking status says delivered on front porch yesterday 3pm, but nothing is there.', 'Orders and delivery', 'MEDIUM', 'OPEN', NOW() - INTERVAL 4 HOUR, NOW() - INTERVAL 4 HOUR),
(4, 5, 2, 'Request for invoice copy for order #8841', 'Need a tax invoice PDF for business reimbursement.', 'General queries', 'LOW', 'RESOLVED', NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 3 DAY)
ON DUPLICATE KEY UPDATE `subject` = VALUES(`subject`);

-- 4. Sample Conversation and Messages
INSERT INTO `conversations` (`id`, `customer_id`, `ticket_id`, `created_at`)
VALUES
(1, 4, 1, NOW() - INTERVAL 2 DAY),
(2, 4, 2, NOW() - INTERVAL 1 DAY)
ON DUPLICATE KEY UPDATE `customer_id` = VALUES(`customer_id`);

INSERT INTO `messages` (`id`, `conversation_id`, `sender_type`, `message`, `created_at`)
VALUES
(1, 1, 'CUSTOMER', 'Hi, I cannot log in after resetting my password.', NOW() - INTERVAL 2 DAY),
(2, 1, 'AI', 'Hello John! I understand you are having login issues. Please ensure caps lock is disabled, clear your browser cache, or try an incognito window. If the issue persists, would you like me to connect you with a human agent?', NOW() - INTERVAL 2 DAY + INTERVAL 2 SECOND),
(3, 1, 'CUSTOMER', 'I tried incognito and it still failed. Please escalate.', NOW() - INTERVAL 2 DAY + INTERVAL 1 MINUTE),
(4, 1, 'AGENT', 'Hello John, Sarah here from Support. I checked your account and detected a temporary security lock. I have unlocked your account and sent a fresh activation link.', NOW() - INTERVAL 1 DAY)
ON DUPLICATE KEY UPDATE `message` = VALUES(`message`);

-- 5. Sample Feedback
INSERT INTO `feedback` (`id`, `ticket_id`, `customer_id`, `rating`, `comment`, `created_at`)
VALUES
(1, 4, 5, 5, 'Quick response and had my tax invoice sent in minutes! Great support.', NOW() - INTERVAL 3 DAY)
ON DUPLICATE KEY UPDATE `comment` = VALUES(`comment`);
