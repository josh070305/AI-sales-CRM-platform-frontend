import { cn } from '../../lib/utils';

export function Card({ className, ...props }) {
  return <div className={cn('glass-panel border border-white/20 p-6 shadow-soft', className)} {...props} />;
}
