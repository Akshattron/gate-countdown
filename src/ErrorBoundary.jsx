import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('The syllabus tracker failed to render. The countdown is unaffected.', error, info);
  }

  render() {
    return this.state.hasError ? this.props.fallback ?? null : this.props.children;
  }
}
