import { cn } from '../../lib/utils';

const variants = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
  danger: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200',
  brand: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-200',
};

export function Badge({ className, variant = 'default', children }) {
  return (
    <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold', variants[variant], className)}>
      {children}
    </span>
  );
}
