export default function SectionCard({ title, description, children, action }) {
  return (
    <section className="rounded-2xl border border-[#dfe9f6] bg-white p-5 shadow-sm shadow-blue-950/[0.03] sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold tracking-[-0.02em] text-ink">{title}</h2>
          {description && <p className="mt-1 text-xs leading-5 text-muted">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
