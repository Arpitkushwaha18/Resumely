import { X } from "lucide-react";

export default function SkillTag({ skill, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-50 px-3 py-1.5 text-xs font-semibold text-mint-700">
      {skill}
      {onRemove && (
        <button type="button" aria-label={`Remove ${skill}`} onClick={onRemove} className="rounded-full p-0.5 transition hover:bg-mint-100">
          <X size={12} />
        </button>
      )}
    </span>
  );
}
