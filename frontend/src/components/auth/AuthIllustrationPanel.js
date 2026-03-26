import React, { memo } from 'react';

/**
 * AuthIllustrationPanel — the dark left-side panel shared by Login and Register.
 * Pass `variant="login"` or `variant="register"` for different content.
 */
const CONTENT = {
  login: {
    emoji: '✍️',
    title: <>Share your<br />stories with<br />the world</>,
    subtitle: 'Join thousands of writers and readers on the most modern blogging platform.',
    features: [
      { icon: '🔐', text: 'Secure JWT authentication'  },
      { icon: '📝', text: 'Rich post editor with drafts' },
      { icon: '👥', text: 'Role-based access control'   },
      { icon: '💬', text: 'Engage with comments'        },
    ],
  },
  register: {
    emoji: '🚀',
    title: <>Start your<br />writing<br />journey today</>,
    subtitle: 'Create your free account and publish your first post in minutes.',
    features: [
      { icon: '✍️', text: 'Publish posts instantly'      },
      { icon: '📊', text: 'Track your analytics'         },
      { icon: '🔖', text: 'Draft & publish workflow'     },
      { icon: '🌐', text: 'Public blog for your readers' },
    ],
  },
};

const AuthIllustrationPanel = memo(({ variant = 'login' }) => {
  const { emoji, title, subtitle, features } = CONTENT[variant] || CONTENT.login;

  return (
    <div className="auth-illustration">
      <div className="auth-illustration-content">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{emoji}</div>
        <h2 className="auth-illustration-title">{title}</h2>
        <p className="auth-illustration-sub">{subtitle}</p>
        <div className="auth-features">
          {features.map((f, i) => (
            <div className="auth-feature-item" key={i}>
              <div className="auth-feature-icon">{f.icon}</div>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

AuthIllustrationPanel.displayName = 'AuthIllustrationPanel';
export default AuthIllustrationPanel;
