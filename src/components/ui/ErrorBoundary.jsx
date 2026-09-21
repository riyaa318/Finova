import { Component } from "react";
import ErrorState from "./ErrorState";

export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error", error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="flex min-h-dvh items-center justify-center bg-canvas p-6">
        <ErrorState
          title="Something went wrong"
          message="An unexpected error occurred. Reloading usually fixes it."
          onRetry={() => window.location.reload()}
          className="max-w-md"
        />
      </div>
    );
  }
}
