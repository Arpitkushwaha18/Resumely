import { useEffect, useId, useMemo, useState } from "react";

const DEBOUNCE_MS = 180;

function Highlight({ text, query }) {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (!query || index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-[#d9f6e9] font-semibold text-mint-700">{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

export default function AutocompleteInput({
  label,
  value,
  onChange,
  onSelect,
  suggestions,
  placeholder,
  type = "text",
  required = false,
  onEnter,
}) {
  const listId = useId();
  const [query, setQuery] = useState(value || "");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => setQuery(value || ""), [value]);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [query]);

  const matches = useMemo(() => {
    if (!debouncedQuery) return [];
    const normalized = debouncedQuery.toLowerCase();
    return suggestions.filter((item) => item.toLowerCase().includes(normalized)).slice(0, 7);
  }, [debouncedQuery, suggestions]);

  const choose = (item) => {
    setQuery(item);
    onChange(item);
    onSelect?.(item);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleChange = (event) => {
    const nextValue = event.target.value;
    setQuery(nextValue);
    onChange(nextValue);
    setOpen(true);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event) => {
    if (!open || matches.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % matches.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? matches.length - 1 : index - 1));
    } else if (event.key === "Enter") {
      if (activeIndex >= 0) {
        event.preventDefault();
        choose(matches[activeIndex]);
      } else if (onEnter && query.trim()) {
        event.preventDefault();
        onEnter(query.trim());
      }
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <label className="relative block">
      {label && <span className="mb-2 block text-xs font-bold text-[#53615c]">{label}{required && " *"}</span>}
      <input
        type={type}
        value={query}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        aria-autocomplete="list"
        aria-controls={listId}
        className="h-11 w-full rounded-xl border border-[#dce7e2] bg-white px-3.5 text-sm text-ink outline-none transition placeholder:text-[#a4afab] focus:border-mint-500 focus:ring-4 focus:ring-mint-100"
      />
      {open && matches.length > 0 && (
        <ul id={listId} role="listbox" className="absolute z-30 mt-1.5 max-h-60 w-full overflow-auto rounded-xl border border-[#dae6e1] bg-white p-1.5 shadow-[0_14px_35px_rgba(29,74,59,0.14)]">
          {matches.map((item, index) => (
            <li key={item} role="option" aria-selected={activeIndex === index}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(item)}
                className={`w-full rounded-lg px-3 py-2.5 text-left text-xs leading-5 transition ${activeIndex === index ? "bg-mint-50 text-mint-700" : "text-[#52605b] hover:bg-[#f4f8f6]"}`}
              >
                <Highlight text={item} query={debouncedQuery} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </label>
  );
}
