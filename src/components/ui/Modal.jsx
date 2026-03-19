import { cn } from '../../lib/utils';

export function Modal({ open, title, children, onClose, className }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/55 px-4">
      <div className={cn('glass-panel w-full max-w-2xl p-6 shadow-soft', className)}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-sm text-slate-500">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
