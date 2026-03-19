import { Link } from 'react-router-dom';

export function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(30,180,135,0.35),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.2),_transparent_25%)]" />
      <div className="absolute inset-0 bg-grid bg-[size:36px_36px] opacity-20" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-between gap-16 px-6 py-10 lg:px-12">
        <div className="hidden max-w-xl lg:block">
          <Link to="/" className="inline-flex items-center gap-3 text-lg font-bold">
            <div className="h-10 w-10 rounded-2xl bg-brand-500" />
            AI Sales CRM Platform
          </Link>
          <h1 className="mt-10 text-5xl font-semibold leading-tight">
            Revenue operations, collaboration, and AI workflows in one premium workspace.
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            Manage the full sales journey with live messaging, pipeline control, notifications, analytics, and AI
            assistance.
          </p>
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
