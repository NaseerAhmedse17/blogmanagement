import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-code">⚠️</div>
          <h2>Something went wrong</h2>
          <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <button className="btn btn-primary" onClick={this.handleReset}>
            🔄 Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
