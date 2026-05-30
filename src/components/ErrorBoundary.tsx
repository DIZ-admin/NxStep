import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center bg-zinc-950 rounded-xl border border-red-500/20">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4 animate-pulse" />
          <h2 className="text-xl font-bold text-white mb-2">System Error Caught</h2>
          <p className="text-zinc-400 max-w-md mx-auto mb-4 text-sm">
            The application encountered an unexpected error. Please refresh the page.
          </p>
          <pre className="text-xs text-red-400 bg-red-500/10 p-4 rounded-lg text-left overflow-auto max-w-full">
            {this.state.error?.message}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
