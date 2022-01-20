import React, { ErrorInfo } from "react";

export type ErrorState = {
  hasError: boolean;
  error?: any;
};

export class ErrorBoundary extends React.Component<{}, ErrorState> {
  constructor(props = {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState((prev: ErrorState) => ({ ...prev, error }));
    console.error({ error, errorInfo });
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const message =
        this.state.error.message ?? JSON.stringify(this.state.error);
      return (
        <pre className="text-red-600 text-2xl p-4">
          Something went wrong: {{ message }}
        </pre>
      );
    }

    return this.props.children;
  }
}
