export async function improveResumeText(endpoint, payload) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Improvement failed.");
  }

  if (typeof data.improvedText !== "string" || !data.improvedText.trim()) {
    throw new Error("Improvement failed.");
  }

  return data.improvedText.trim();
}
