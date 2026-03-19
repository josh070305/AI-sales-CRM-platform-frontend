import { cn } from '../../lib/utils';

export function Button({ className, variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
    outline: 'border border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800',
    danger: 'bg-rose-500 text-white hover:bg-rose-600',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
