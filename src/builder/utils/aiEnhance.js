export async function enhanceResumeText(endpoint, payload) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Enhancement failed.");
  }

  if (typeof data.enhancedText !== "string" || !data.enhancedText.trim()) {
    throw new Error("Enhancement failed.");
  }

  return data.enhancedText.trim();
}
