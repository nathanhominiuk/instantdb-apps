import { StrictMode, Component, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { SettingsProvider } from "./contexts/SettingsContext";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="h-full flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <h1 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
              Application Error
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              An unexpected error occurred. See details below.
            </p>
            <pre className="text-xs text-left bg-gray-100 dark:bg-gray-800 dark:text-gray-300 p-3 rounded overflow-auto">
              {this.state.error.message}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </ErrorBoundary>
  </StrictMode>
);
