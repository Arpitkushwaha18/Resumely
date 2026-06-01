export default function SectionCard({ title, description, children, action }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.18)] backdrop-blur sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold tracking-[-0.02em] text-white">{title}</h2>
          {description && <p className="mt-1 text-xs leading-5 text-blue-100/70">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
