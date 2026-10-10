import React, { useState, useEffect } from 'react';
import { kbService } from '../../services/kbService';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { BookOpen, PlusCircle, Search, Edit2, Trash2, Tag, HelpCircle } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import { formatDate } from '../../utils/dateUtils';

export default function KnowledgeBaseAdminPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    question: '',
    answer: '',
    category: 'Account and login',
    keywords: '',
  });

  const { showToast } = useToast();

  const categories = [
    'Account and login',
    'Payment',
    'Orders and delivery',
    'Refund',
    'Technical issues',
    'Product information',
    'Complaints',
    'General queries',
  ];

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await kbService.getAllArticles();
      if (res.success) {
        setArticles(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load articles', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      question: '',
      answer: '',
      category: 'Account and login',
      keywords: '',
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      question: article.question,
      answer: article.answer,
      category: article.category,
      keywords: article.keywords,
    });
    setModalOpen(true);
  };

  const handleDeleteArticle = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        const res = await adminService.deleteKnowledgeBaseArticle(id);
        if (res.success) {
          showToast('Article deleted', 'info');
          fetchArticles();
        }
      } catch (err) {
        showToast('Failed to delete article', 'error');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingArticle) {
        const res = await adminService.updateKnowledgeBaseArticle(editingArticle.id, formData);
        if (res.success) {
          showToast('Article updated successfully!', 'success');
          setModalOpen(false);
          fetchArticles();
        }
      } else {
        const res = await adminService.createKnowledgeBaseArticle(formData);
        if (res.success) {
          showToast('Article created successfully!', 'success');
          setModalOpen(false);
          fetchArticles();
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save article', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredArticles = articles.filter((a) => {
    const term = searchTerm.toLowerCase();
    return (
      a.title.toLowerCase().includes(term) ||
      a.keywords.toLowerCase().includes(term) ||
      a.category.toLowerCase().includes(term) ||
      a.question.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Knowledge Base Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Maintain articles used by the automated AI response classifier and search engine.
          </p>
        </div>

        <button onClick={handleOpenCreateModal} className="btn btn-primary">
          <PlusCircle size={18} /> New Article
        </button>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search articles by title, keywords, or question..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading articles..." />
      ) : filteredArticles.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No articles found"
          description="Click 'New Article' above to add troubleshooting content to the database."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredArticles.map((article) => (
            <div key={article.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: 280 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                    <span
                      style={{
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {article.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Article #{article.id}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {article.title}
                  </h3>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    <strong>Q:</strong> {article.question}
                  </p>

                  <div style={{ backgroundColor: 'var(--bg-muted)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    <strong>Answer:</strong> {article.answer}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    <Tag size={13} /> Keywords: {article.keywords}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleOpenEditModal(article)}
                    className="btn btn-secondary btn-sm"
                    title="Edit article"
                  >
                    <Edit2 size={15} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteArticle(article.id)}
                    className="btn btn-secondary btn-sm"
                    title="Delete article"
                    style={{ color: '#ef4444' }}
                  >
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Article Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingArticle ? `Edit Article #${editingArticle.id}` : 'Create Knowledge Base Article'}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. How to troubleshoot 2FA login errors"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Common Question *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Why am I getting an invalid authentication code error?"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Solution / Answer *</label>
            <textarea
              className="form-textarea"
              rows={5}
              placeholder="Detailed resolution instructions returned to customer and AI..."
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Matching Keywords (comma separated) *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 2fa, two factor, auth, code, otp, authenticator"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : editingArticle ? 'Update Article' : 'Publish Article'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
