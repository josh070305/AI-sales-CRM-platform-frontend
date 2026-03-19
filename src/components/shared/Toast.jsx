import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '../../hooks/useToast';

export function ToastViewport() {
  const { items, dismiss } = useToast();

  useEffect(() => {
    const timers = items.map((item) =>
      setTimeout(() => {
        dismiss(item.id);
      }, item.duration || 3500)
    );

    return () => timers.forEach(clearTimeout);
  }, [items, dismiss]);

  return (
    <div className="fixed right-4 top-4 z-50 space-y-3">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            className="glass-panel w-80 border border-white/20 px-4 py-3 shadow-soft"
          >
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
