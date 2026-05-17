import React from 'react';

interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Page crash:', error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '60vh', padding: '2rem',
          textAlign: 'center', backgroundColor: '#fff1f2',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h4 style={{ color: '#9f1239', fontWeight: 700, marginBottom: '0.5rem' }}>
            Page Error — Something went wrong
          </h4>
          <pre style={{
            background: '#fee2e2', color: '#dc2626', padding: '1rem',
            borderRadius: '8px', maxWidth: '700px', overflow: 'auto',
            fontSize: '0.75rem', textAlign: 'left', marginBottom: '1.5rem',
            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>
            {this.state.error?.message || 'Unknown error'}
            {'\n\n'}
            {this.state.error?.stack?.slice(0, 600)}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '0.6rem 1.5rem', background: '#2563eb', color: '#fff',
              border: 'none', borderRadius: '20px', cursor: 'pointer',
              fontWeight: 700, fontSize: '0.9rem',
            }}
          >
            🔄 Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
