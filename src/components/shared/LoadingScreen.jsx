export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="space-y-4 text-center">
        <div className="mx-auto h-14 w-14 animate-pulse rounded-3xl bg-brand-500/70" />
        <p className="text-sm text-slate-400">Loading AI Sales CRM...</p>
      </div>
    </div>
  );
}
