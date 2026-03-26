import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import usePosts from '../../hooks/usePosts';
import { useToast } from '../../context/ToastContext';
import { parseTags } from '../../utils/helpers';

const PostEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { fetchPostById, createPost, updatePost, loading } = usePosts();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '', content: '', excerpt: '', tagsInput: '', status: 'draft',
  });
  const [formErrors, setFormErrors] = useState({});
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [wordCount, setWordCount] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;
    const load = async () => {
      setInitialLoading(true);
      try {
        const post = await fetchPostById(id);
        if (post) {
          setFormData({
            title: post.title, content: post.content,
            excerpt: post.excerpt || '',
            tagsInput: post.tags?.join(', ') || '',
            status: post.status,
          });
        } else {
          toast.error('Post not found or you don\'t have permission to edit it.');
          navigate('/dashboard');
        }
      } catch {
        toast.error('Failed to load post. Please try again.');
        navigate('/dashboard');
      } finally {
        setInitialLoading(false);
      }
    };
    load();
  }, [id, isEditMode]);

  useEffect(() => {
    const words = formData.content.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(formData.content.trim() ? words : 0);
  }, [formData.content]);

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    else if (formData.title.trim().length < 3) errors.title = 'At least 3 characters required';
    if (!formData.content.trim()) errors.content = 'Content is required';
    else if (formData.content.trim().length < 10) errors.content = 'Content must be at least 10 characters';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (formErrors[name]) setFormErrors(p => ({ ...p, [name]: '' }));
    setSaved(false);
  };

  const handleSubmit = async (e, saveStatus) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.warning('Please fix the errors before saving.');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      excerpt: formData.excerpt.trim(),
      tags: parseTags(formData.tagsInput),
      status: saveStatus || formData.status,
    };

    try {
      const result = isEditMode
        ? await updatePost(id, payload)
        : await createPost(payload);

      if (result.success) {
        const isPublishing = (saveStatus || formData.status) === 'published';
        toast.success(
          isEditMode
            ? `Post updated successfully!${isPublishing ? ' It\'s now live.' : ''}`
            : isPublishing
              ? '🚀 Post published and now live!'
              : '📝 Post saved as draft.'
        );
        setSaved(true);
        setTimeout(() => navigate('/dashboard'), 800);
      } else {
        toast.error(result.error || 'Failed to save post. Please try again.');
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  if (initialLoading) {
    return (
      <div className="loading-page" style={{ minHeight: 'calc(100vh - 70px)' }}>
        <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
        <span style={{ color: 'var(--gray-400)', marginTop: '0.5rem' }}>Loading post...</span>
      </div>
    );
  }

  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="editor-wrapper">
      {/* Header */}
      <div className="editor-header">
        <Link to="/dashboard" className="editor-back-btn" title="Back to dashboard">←</Link>
        <div style={{ flex: 1 }}>
          <div className="editor-title-text">
            {isEditMode ? '✏️ Edit Post' : '✨ Create New Post'}
          </div>
          {wordCount > 0 && (
            <div style={{ fontSize: '0.775rem', color: 'var(--gray-400)', marginTop: '0.15rem' }}>
              {wordCount.toLocaleString()} words · ~{estimatedReadTime} min read
            </div>
          )}
        </div>
        {saved && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            color: 'var(--success)', fontSize: '0.825rem', fontWeight: 600,
            background: 'var(--success-light)', padding: '0.35rem 0.75rem',
            borderRadius: 'var(--r-full)',
          }}>
            ✅ Saved
          </div>
        )}
      </div>

      <div className="editor-card">
        <form onSubmit={e => handleSubmit(e, formData.status)}>

          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="title">Post Title *</label>
            <input
              id="title" name="title" type="text"
              value={formData.title} onChange={handleChange}
              className={`editor-title-input ${formErrors.title ? 'error' : ''}`}
              placeholder="Write a compelling title..."
              maxLength={200}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {formErrors.title
                ? <p className="form-error">⚠ {formErrors.title}</p>
                : <span />}
              <span className="form-hint">{formData.title.length}/200</span>
            </div>
          </div>

          {/* Excerpt */}
          <div className="form-group">
            <label className="form-label" htmlFor="excerpt">
              Excerpt
              <span style={{ textTransform: 'none', fontWeight: 400, marginLeft: '0.4rem', color: 'var(--gray-400)' }}>
                (shown in post listings)
              </span>
            </label>
            <input
              id="excerpt" name="excerpt" type="text"
              value={formData.excerpt} onChange={handleChange}
              className="form-input"
              placeholder="Brief summary (auto-generated if empty)..."
              maxLength={500}
            />
            <p className="form-hint">{formData.excerpt.length}/500</p>
          </div>

          {/* Content */}
          <div className="form-group">
            <label className="form-label" htmlFor="content">Content *</label>
            <textarea
              id="content" name="content"
              value={formData.content} onChange={handleChange}
              className={`form-textarea ${formErrors.content ? 'error' : ''}`}
              placeholder="Tell your story..."
              rows={18}
              style={{ minHeight: 360, lineHeight: 1.85, fontSize: '0.975rem' }}
            />
            {formErrors.content && <p className="form-error">⚠ {formErrors.content}</p>}
          </div>

          {/* Tags + Status */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="tagsInput">Tags</label>
              <input
                id="tagsInput" name="tagsInput" type="text"
                value={formData.tagsInput} onChange={handleChange}
                className="form-input"
                placeholder="react, javascript, tutorial"
              />
              <p className="form-hint">Comma-separated · max 10 tags</p>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="status">Visibility</label>
              <select id="status" name="status" value={formData.status}
                onChange={handleChange} className="form-select">
                <option value="draft">📝 Draft — private</option>
                <option value="published">🌐 Published — public</option>
              </select>
            </div>
          </div>

          {/* Info tip */}
          <div className="alert alert-info" style={{ fontSize: '0.825rem', padding: '0.75rem 1rem', marginBottom: '0.25rem' }}>
            <span>💡</span>
            <span>
              {formData.status === 'draft'
                ? 'This post is private and only visible to you.'
                : 'This post will be visible to everyone on the public blog.'}
            </span>
          </div>

          {/* Actions */}
          <div className="editor-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading
                ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Saving...</>
                : isEditMode ? '💾 Save Changes' : '💾 Save Draft'}
            </button>

            {!isEditMode && formData.status !== 'published' && (
              <button
                type="button"
                className="btn btn-success"
                disabled={loading}
                onClick={e => handleSubmit(e, 'published')}
              >
                🚀 Save & Publish
              </button>
            )}

            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                if (formData.title || formData.content) {
                  if (window.confirm('Discard unsaved changes?')) navigate('/dashboard');
                } else {
                  navigate('/dashboard');
                }
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostEditor;
