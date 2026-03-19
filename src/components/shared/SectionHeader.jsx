export function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
      <div>
        {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">{eyebrow}</p> : null}
        <h2 className="mt-1 text-3xl font-semibold">{title}</h2>
        {description ? <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
