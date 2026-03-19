import { cn } from '../../lib/utils';

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-brand-400 dark:border-slate-700 dark:bg-slate-900/80',
        className
      )}
      {...props}
    />
  );
}
