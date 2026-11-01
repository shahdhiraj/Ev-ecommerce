import React from "react"
import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router"
import { AlertTriangle, Home, RefreshCw, ArrowLeft, ShieldAlert } from "lucide-react"

export function GlobalErrorBoundary() {
  const error = useRouteError()
  const navigate = useNavigate()

  let title = "Application Notice"
  let message = "We encountered an unexpected display issue, but your session and cart data are safe."
  let statusCode = 500

  if (isRouteErrorResponse(error)) {
    statusCode = error.status
    if (error.status === 404) {
      title = "Page Not Found"
      message = "The part, category, or page you were looking for could not be located in our catalog."
    } else if (error.status === 401 || error.status === 403) {
      title = "Access Restricted"
      message = "You don't have authorization to view this technician portal or admin resource."
    } else {
      title = error.statusText || "Application Notice"
      message = (error.data as { message?: string })?.message || "An unexpected error occurred while loading this route."
    }
  } else if (error instanceof Error) {
    message = error.message || message
  }

  const isDev = import.meta.env.DEV

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50/50">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-900/5 p-8 text-center animate-fade-in">
        {/* Status Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 shadow-sm">
          {statusCode === 404 ? (
            <AlertTriangle className="w-8 h-8 stroke-[1.8]" />
          ) : (
            <ShieldAlert className="w-8 h-8 stroke-[1.8]" />
          )}
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider mb-4">
          <span>Status {statusCode}</span>
          <span>•</span>
          <span>ABC EV PART Engine</span>
        </div>

        {/* Heading & Friendly Explanation */}
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
          {title}
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-8">
          {message}
        </p>

        {/* Clean Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white text-sm font-semibold transition-all shadow-md shadow-orange-500/20"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </button>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Page</span>
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Optional Technical Accordion in Development */}
        {isDev && error instanceof Error && (
          <details className="mt-6 text-left rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 text-xs">
            <summary className="font-semibold text-slate-700 cursor-pointer select-none">
              Technical Diagnostics (Dev Mode)
            </summary>
            <div className="mt-2.5 pt-2 border-t border-slate-200 font-mono text-[11px] text-rose-600 break-all leading-normal">
              {error.name}: {error.message}
            </div>
            {error.stack && (
              <pre className="mt-2 max-h-40 overflow-y-auto p-2 bg-slate-900 text-slate-300 rounded font-mono text-[10px] leading-tight whitespace-pre-wrap">
                {error.stack}
              </pre>
            )}
          </details>
        )}
      </div>
    </div>
  )
}

/**
 * Standard React Class Error Boundary for wrapping any inner component tree.
 */
interface ReactErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ReactErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class AppErrorBoundary extends React.Component<ReactErrorBoundaryProps, ReactErrorBoundaryState> {
  constructor(props: ReactErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ReactErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Caught in AppErrorBoundary:", error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl my-6 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Display Module Recovery</h3>
          <p className="text-xs text-slate-500 mb-4">
            A temporary component error occurred. Your basket and account credentials are safe.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-semibold hover:bg-orange-600 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset View</span>
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

