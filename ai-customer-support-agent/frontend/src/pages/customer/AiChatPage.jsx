import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { chatService } from '../../services/chatService';
import { ticketService } from '../../services/ticketService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Bot,
  User,
  Send,
  Loader2,
  Trash2,
  AlertTriangle,
  BookOpen,
  Sparkles,
  PlusCircle,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

export default function AiChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialConvId = searchParams.get('conversationId');

  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [conversationId, setConversationId] = useState(initialConvId ? Number(initialConvId) : null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [escalationOffered, setEscalationOffered] = useState(false);
  const [detectedCategory, setDetectedCategory] = useState(null);
  const [conversationsList, setConversationsList] = useState([]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    if (initialConvId) {
      loadConversationMessages(Number(initialConvId));
    } else {
      // Default initial welcome greeting from AI
      setMessages([
        {
          id: 'welcome',
          senderType: 'AI',
          message: `Hello ${user?.name || 'there'}! I am your AI Customer Support Assistant. How can I help you today? You can ask me about password resets, payments, order tracking, returns, or technical troubleshooting.`,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  }, [initialConvId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const res = await chatService.getConversations();
      if (res.success) {
        setConversationsList(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load past conversations', err);
    }
  };

  const loadConversationMessages = async (id) => {
    setLoading(true);
    setConversationId(id);
    setSearchParams({ conversationId: id });
    try {
      const res = await chatService.getConversationMessages(id);
      if (res.success) {
        setMessages(res.data || []);
      }
    } catch (err) {
      showToast('Could not load conversation transcript', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const text = inputMessage.trim();
    if (!text || sending) return;

    setInputMessage('');
    setSending(true);

    // Optimistically add user message
    const tempUserMsg = {
      id: 'temp-' + Date.now(),
      senderType: 'CUSTOMER',
      message: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await chatService.sendMessage({
        conversationId,
        message: text,
      });

      if (res.success && res.data) {
        const data = res.data;
        if (!conversationId) {
          setConversationId(data.conversationId);
          setSearchParams({ conversationId: data.conversationId });
          fetchConversations();
        }

        const aiMsg = {
          id: data.aiMessageId,
          senderType: data.senderType,
          message: data.reply,
          createdAt: data.createdAt,
          suggestedArticles: data.suggestedArticles,
        };

        setMessages((prev) => [...prev, aiMsg]);
        setEscalationOffered(data.escalationOffered);
        setDetectedCategory(data.detectedCategory);
      }
    } catch (err) {
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleClearConversation = async () => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    if (window.confirm('Are you sure you want to clear this conversation?')) {
      try {
        await chatService.clearConversation(conversationId);
        setMessages([]);
        showToast('Conversation cleared', 'info');
        fetchConversations();
      } catch (err) {
        showToast('Failed to clear conversation', 'error');
      }
    }
  };

  const handleEscalateToTicket = () => {
    // Navigate to ticket creation prefilled with this conversation
    const lastUserMsg = messages
      .slice()
      .reverse()
      .find((m) => m.senderType === 'CUSTOMER')?.message || 'Customer requested human agent escalation';

    navigate(`/customer/tickets/new?conversationId=${conversationId || ''}&category=${encodeURIComponent(detectedCategory || 'General queries')}&subject=${encodeURIComponent(lastUserMsg.slice(0, 60))}`);
  };

  const handleNewChat = () => {
    setConversationId(null);
    setSearchParams({});
    setEscalationOffered(false);
    setDetectedCategory(null);
    setMessages([
      {
        id: 'welcome-new',
        senderType: 'AI',
        message: `Hello ${user?.name || 'there'}! Starting a new conversation. What can I help you resolve?`,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div style={{ display: 'flex', gap: '1.5rem', height: 'calc(100vh - 120px)', minHeight: 600 }}>
      {/* Left Chat Sessions Drawer */}
      <div
        className="card"
        style={{
          width: 280,
          display: 'flex',
          flexDirection: 'column',
          padding: '1.25rem',
          flexShrink: 0,
        }}
      >
        <button
          onClick={handleNewChat}
          className="btn btn-primary"
          style={{ width: '100%', marginBottom: '1.25rem' }}
        >
          <PlusCircle size={18} /> New AI Chat
        </button>

        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Past Conversations
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {conversationsList.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '2rem 0' }}>
              No previous chats
            </div>
          ) : (
            conversationsList.map((c) => (
              <button
                key={c.id}
                onClick={() => loadConversationMessages(c.id)}
                style={{
                  textAlign: 'left',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: conversationId === c.id ? '1px solid var(--primary)' : '1px solid var(--border)',
                  backgroundColor: conversationId === c.id ? 'var(--primary-light)' : 'transparent',
                  color: conversationId === c.id ? 'var(--primary)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.2rem' }}>
                  Chat #{c.id}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.lastMessage}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div
        className="card"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
        }}
      >
        {/* Chat Header */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bot size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>SupportAI Assistant</h3>
                <span
                  style={{
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981' }} />
                  Online
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Powered by MySQL Knowledge Base & Query Classifier
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleEscalateToTicket}
              className="btn btn-secondary btn-sm"
              title="Escalate issue to a human support agent"
              style={{ color: '#b91c1c', borderColor: '#fca5a5' }}
            >
              <AlertTriangle size={15} /> Escalate to Human Agent
            </button>
            <button
              onClick={handleClearConversation}
              className="btn btn-secondary btn-sm"
              title="Clear Conversation"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div
          style={{
            flex: 1,
            padding: '1.5rem',
            overflowY: 'auto',
            backgroundColor: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {messages.map((m, idx) => {
            const isCustomer = m.senderType === 'CUSTOMER';
            const isAgent = m.senderType === 'AGENT';
            return (
              <div
                key={m.id || idx}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignSelf: isCustomer ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                }}
              >
                {!isCustomer && (
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      backgroundColor: isAgent ? '#059669' : 'var(--primary)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isAgent ? <User size={18} /> : <Bot size={18} />}
                  </div>
                )}

                <div>
                  <div
                    style={{
                      padding: '0.85rem 1.15rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isCustomer ? 'var(--primary)' : '#ffffff',
                      color: isCustomer ? '#ffffff' : 'var(--text-primary)',
                      boxShadow: 'var(--shadow-sm)',
                      border: isCustomer ? 'none' : '1px solid var(--border)',
                      fontSize: '0.92rem',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {m.message}

                    {/* Suggested Knowledge Base links if returned */}
                    {m.suggestedArticles && m.suggestedArticles.length > 0 && (
                      <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <BookOpen size={14} /> Relevant Knowledge Articles:
                        </div>
                        {m.suggestedArticles.map((art) => (
                          <div
                            key={art.id}
                            style={{
                              fontSize: '0.8rem',
                              color: 'var(--text-secondary)',
                              padding: '0.25rem 0',
                            }}
                          >
                            • <strong>{art.title}</strong>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      marginTop: '0.25rem',
                      textAlign: isCustomer ? 'right' : 'left',
                    }}
                  >
                    {isCustomer ? 'You' : isAgent ? 'Support Agent' : 'SupportAI'} • {formatDate(m.createdAt)}
                  </div>
                </div>

                {isCustomer && (
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      backgroundColor: '#334155',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <User size={18} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {sending && (
            <div style={{ display: 'flex', gap: '0.75rem', alignSelf: 'flex-start' }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot size={18} />
              </div>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                }}
              >
                <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                SupportAI is analyzing your query...
              </div>
            </div>
          )}

          {/* Escalation Prompt Card */}
          {escalationOffered && (
            <div
              style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginTop: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <AlertTriangle size={20} color="#d97706" />
                <span style={{ fontSize: '0.88rem', color: '#92400e', fontWeight: 500 }}>
                  Need deeper assistance? Connect directly with a human specialist.
                </span>
              </div>
              <button onClick={handleEscalateToTicket} className="btn btn-sm btn-primary">
                Open Support Ticket <ArrowRight size={14} />
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <form
          onSubmit={handleSendMessage}
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border)',
            backgroundColor: '#ffffff',
            display: 'flex',
            gap: '0.75rem',
          }}
        >
          <input
            type="text"
            className="form-input"
            style={{ borderRadius: 'var(--radius-full)', paddingLeft: '1.25rem' }}
            placeholder="Type your question or issue (e.g., 'Payment was declined', 'How to reset password?')..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={sending}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ borderRadius: 'var(--radius-full)', padding: '0 1.25rem' }}
            disabled={!inputMessage.trim() || sending}
          >
            <Send size={18} /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
