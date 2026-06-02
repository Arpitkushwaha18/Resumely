const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-2.5-flash";
const MAX_INPUT_LENGTH = 4000;

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

export async function enhanceWithGemini({ instruction, input }) {
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
- Enhance writing, grammar, professionalism, and ATS friendliness.
- Preserve the user's facts and meaning.
- Do not invent internships, achievements, metrics, technologies, employers, dates, awards, or experience.
- Do not add fake information.
- Return only the enhanced text, with no markdown, labels, or explanations.

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

  if (!response.ok) {
    const message = data?.error?.message || "Gemini request failed.";
    throw new Error(message);
  }

  const enhancedText = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!enhancedText) {
    throw new Error("Gemini returned an empty response.");
  }

  return enhancedText;
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

export async function enhanceWithLengthGuard({ instruction, input, minLength, maxLength, fallbackText }) {
  let enhancedText = "";
  const safeFallbackText = normalizeFallbackText(fallbackText, minLength, maxLength);
  const attempts = [
    instruction,
    `${instruction}

The previous draft was too short, too long, or incomplete. Regenerate it between ${minLength} and ${maxLength} characters, using complete sentences only.`,
    `${instruction}

Strict output rule: Return only the enhanced text between ${minLength} and ${maxLength} characters. End with sentence punctuation. Do not include markdown or labels.`,
  ];

  for (const attempt of attempts) {
    try {
      enhancedText = await enhanceWithGemini({ instruction: attempt, input });
    } catch {
      return safeFallbackText;
    }

    if (isCompleteLengthBoundText(enhancedText, minLength, maxLength)) return enhancedText;
  }

  return safeFallbackText;
}
