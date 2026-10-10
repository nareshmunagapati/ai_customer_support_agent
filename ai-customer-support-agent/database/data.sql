-- AI Customer Support Agent public knowledge base seed data.
-- Demo users, password hashes, tickets, and administrator credentials are intentionally excluded.

USE `ai_customer_support`;

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
