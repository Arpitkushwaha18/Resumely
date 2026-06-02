import { improveWithGemini, readJsonBody, sendJson, validateText } from "../_lib/gemini.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed." });
  }

  try {
    const body = await readJsonBody(req);
    const validationError = validateText(body.achievement, "Achievement", 1000);
    if (validationError) return sendJson(res, 400, { error: validationError });

    const improvedText = await improveWithGemini({
      instruction: "Improve the wording of this resume achievement only. Make it clearer, professional, and ATS-friendly while preserving the exact facts.",
      input: body.achievement.trim(),
    });

    return sendJson(res, 200, { improvedText });
  } catch {
    return sendJson(res, 500, { error: "We could not improve this achievement right now. Please try again." });
  }
}
