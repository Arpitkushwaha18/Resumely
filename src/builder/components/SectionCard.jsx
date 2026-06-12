export default function SectionCard({ title, description, children, action }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-[0_22px_64px_rgba(0,0,0,0.20)] backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-black tracking-[-0.03em] text-white">{title}</h2>
          {description && <p className="mt-1 text-xs leading-5 text-blue-100/70">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
