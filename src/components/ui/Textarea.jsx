import { cn } from '../../lib/utils';

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'min-h-28 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none focus:border-brand-400 dark:border-slate-700 dark:bg-slate-900/80',
        className
      )}
      {...props}
    />
  );
}
