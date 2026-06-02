const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-2.5-flash";
const MAX_INPUT_LENGTH = 4000;
const ESTIMATED_AVERAGES = {
  "improve-summary": "~250 tokens",
  "improve-project": "~150 tokens",
  "improve-achievement": "~70 tokens",
  "improve-experience": "~150 tokens",
};

console.info("[AI Usage Estimates]");
for (const [feature, estimate] of Object.entries(ESTIMATED_AVERAGES)) {
  console.info(`${feature}: ${estimate}`);
}

export function validateText(value, fieldName, maxLength = MAX_INPUT_LENGTH) {
  if (typeof value !== "string") {
    return `${fieldName} must be text.`;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return `${fieldName} is required.`;
  }

  if (trimmed.length > maxLength) {
    return `${fieldName} is too long.`;
  }

  return "";
}

export function sendJson(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.json(body);
}

export async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);
  return {};
}

export function shouldReturnUsageToClient() {
  return process.env.NODE_ENV !== "production" && !process.env.VERCEL;
}

export function extractGeminiUsage(data) {
  const usageMetadata = data?.usageMetadata || {};
  return {
    promptTokens: usageMetadata.promptTokenCount || 0,
    completionTokens: usageMetadata.candidatesTokenCount || 0,
    totalTokens: usageMetadata.totalTokenCount || 0,
  };
}

export function addUsage(current = {}, next = {}) {
  return {
    promptTokens: (current.promptTokens || 0) + (next.promptTokens || 0),
    completionTokens: (current.completionTokens || 0) + (next.completionTokens || 0),
    totalTokens: (current.totalTokens || 0) + (next.totalTokens || 0),
  };
}

export function logTokenUsage(feature, usage) {
  console.info(`[AI Usage]
Feature: ${feature}
Prompt Tokens: ${usage.promptTokens}
Output Tokens: ${usage.completionTokens}
Total Tokens: ${usage.totalTokens}`);
}

export function sendAiJson(res, improvedText, usage) {
  const body = { improvedText };
  if (shouldReturnUsageToClient()) {
    body.text = improvedText;
    body.usage = usage;
  }
  return sendJson(res, 200, body);
}

export async function improveWithGemini({ instruction, input, feature = "unknown" }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const response = await fetch(`${GEMINI_ENDPOINT}/${model}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${instruction}

Rules:
- Improve writing, grammar, professionalism, and ATS friendliness.
- Preserve the user's facts and meaning.
- Do not invent internships, achievements, metrics, technologies, employers, dates, awards, or experience.
- Do not add fake information.
- Return only the improved text, with no markdown, labels, or explanations.

User content:
${input}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 700,
      },
    }),
  });

  const data = await response.json().catch(() => ({}));
  const usage = extractGeminiUsage(data);

  if (!response.ok) {
    const message = data?.error?.message || "Gemini request failed.";
    throw new Error(message);
  }

  const improvedText = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!improvedText) {
    throw new Error("Gemini returned an empty response.");
  }

  logTokenUsage(feature, usage);

  return { text: improvedText, usage };
}

export function isCompleteLengthBoundText(value, minLength, maxLength) {
  const text = value.trim();
  return text.length >= minLength && text.length <= maxLength && /[.!?]$/.test(text);
}

function normalizeFallbackText(value, minLength, maxLength) {
  let text = value.trim().replace(/\s+/g, " ");
  const extension = " It reflects consistent learning, teamwork, responsibility, and readiness to contribute in a professional setting.";

  while (text.length < minLength) {
    text = `${text}${extension}`;
  }

  if (text.length <= maxLength) {
    return /[.!?]$/.test(text) ? text : `${text}.`;
  }

  const clipped = text.slice(0, maxLength);
  const lastPeriod = Math.max(clipped.lastIndexOf("."), clipped.lastIndexOf("!"), clipped.lastIndexOf("?"));
  if (lastPeriod >= minLength - 1) {
    return clipped.slice(0, lastPeriod + 1).trim();
  }

  return `${clipped.slice(0, maxLength - 1).trim().replace(/[,:;\s]+$/, "")}.`;
}

export async function improveWithLengthGuard({ instruction, input, minLength, maxLength, fallbackText, feature }) {
  let improvedText = "";
  let totalUsage = {};
  const safeFallbackText = normalizeFallbackText(fallbackText, minLength, maxLength);
  const attempts = [
    instruction,
    `${instruction}

The previous draft was too short, too long, or incomplete. Regenerate it between ${minLength} and ${maxLength} characters, using complete sentences only.`,
    `${instruction}

Strict output rule: Return only the improved text between ${minLength} and ${maxLength} characters. End with sentence punctuation. Do not include markdown or labels.`,
  ];

  for (const attempt of attempts) {
    try {
      const result = await improveWithGemini({ instruction: attempt, input, feature });
      improvedText = result.text;
      totalUsage = addUsage(totalUsage, result.usage);
    } catch {
      return { text: safeFallbackText, usage: totalUsage };
    }

    if (isCompleteLengthBoundText(improvedText, minLength, maxLength)) return { text: improvedText, usage: totalUsage };
  }

  return { text: safeFallbackText, usage: totalUsage };
}
