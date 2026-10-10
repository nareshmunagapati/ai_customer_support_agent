import React, { useState, useEffect } from 'react';
import { kbService } from '../../services/kbService';
import { Search, BookOpen, Tag, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function KnowledgeBaseSearchPage() {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedId, setExpandedId] = useState(null);

  const categories = [
    'ALL',
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

  const fetchArticles = async (query = '') => {
    setLoading(true);
    try {
      const res = await kbService.searchArticles(query);
      if (res.success) {
        setArticles(res.data);
      }
    } catch (err) {
      console.error('Failed to load articles', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchArticles(searchQuery);
  };

  const filteredArticles = articles.filter((a) => {
    if (selectedCategory === 'ALL') return true;
    return a.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div style={{ maxWidth: 1000, margin: '2rem auto', padding: '0 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Knowledge Base & Help Center
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 600, margin: '0 auto 1.75rem' }}>
          Instant answers to common customer questions, troubleshooting procedures, and policy guides.
        </p>

        {/* Search Input */}
        <form onSubmit={handleSearch} style={{ maxWidth: 600, margin: '0 auto', display: 'flex', gap: '0.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem', height: 48, fontSize: '1rem', borderRadius: 'var(--radius-md)' }}
              placeholder="Search by keywords (e.g. password reset, declined payment, tracking)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={20} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: 48, padding: '0 1.5rem', borderRadius: 'var(--radius-md)' }}>
            Search
          </button>
        </form>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid var(--border)',
              backgroundColor: selectedCategory === cat ? 'var(--primary)' : '#ffffff',
              color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Article List */}
      {loading ? (
        <LoadingSpinner message="Searching knowledge base..." />
      ) : filteredArticles.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No articles match your search"
          description="Try different keywords or browse our category filters above."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredArticles.map((article) => {
            const isExpanded = expandedId === article.id;
            return (
              <div
                key={article.id}
                className="card"
                style={{
                  cursor: 'pointer',
                  border: isExpanded ? '1px solid var(--primary)' : '1px solid var(--border)',
                  boxShadow: isExpanded ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                }}
                onClick={() => toggleExpand(article.id)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
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
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {article.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                      <strong>Q:</strong> {article.question}
                    </p>
                  </div>
                  <div style={{ color: 'var(--text-muted)', paddingTop: '0.25rem' }}>
                    {isExpanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
                    <div style={{ backgroundColor: 'var(--bg-muted)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', lineHeight: 1.6, fontSize: '0.93rem', color: 'var(--text-primary)' }}>
                      <strong style={{ display: 'block', color: 'var(--primary)', marginBottom: '0.4rem' }}>
                        Troubleshooting Solution:
                      </strong>
                      {article.answer}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      <Tag size={14} /> Keywords: {article.keywords}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
