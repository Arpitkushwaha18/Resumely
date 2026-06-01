import { X } from "lucide-react";

export default function SkillTag({ skill, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-300/20 bg-blue-500/15 px-3 py-1.5 text-xs font-semibold text-blue-100">
      {skill}
      {onRemove && (
        <button type="button" aria-label={`Remove ${skill}`} onClick={onRemove} className="rounded-full p-0.5 transition hover:bg-white/10">
          <X size={12} />
        </button>
      )}
    </span>
  );
}
