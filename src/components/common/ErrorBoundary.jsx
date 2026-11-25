import { Component } from 'react'
import { AlertOctagon } from 'lucide-react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Surfacing the stack in the console is intentional: this site runs without
    // an error-reporting backend, so the browser console is the diagnostic channel.
    console.error('Unhandled application error', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950 px-6 text-white">
        <div className="max-w-lg text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/15">
            <AlertOctagon className="h-5 w-5 text-brand-teal-soft" strokeWidth={1.6} />
          </span>
          <h1 className="display-md mt-6 font-light">Something failed to render.</h1>
          <p className="mt-4 text-[0.9rem] leading-relaxed text-white/50">
            The interface hit an unexpected error. Reloading usually resolves it. If you were
            editing content, your last saved changes are stored and will reload with the page.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn btn-teal mt-8"
          >
            Reload the site
          </button>
          <p className="mt-6 font-mono text-[0.68rem] text-white/25">
            {String(this.state.error?.message || this.state.error)}
          </p>
        </div>
      </div>
    )
  }
}
