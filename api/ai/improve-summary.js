import { improveWithGemini, readJsonBody, sendJson, validateText } from "../_lib/gemini.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed." });
  }

  try {
    const body = await readJsonBody(req);
    const validationError = validateText(body.summary, "Summary", 1200);
    if (validationError) return sendJson(res, 400, { error: validationError });

    const improvedText = await improveWithGemini({
      instruction: "Rewrite this resume professional summary to sound polished, concise, recruiter-friendly, and ATS-friendly.",
      input: body.summary.trim(),
    });

    return sendJson(res, 200, { improvedText });
  } catch {
    return sendJson(res, 500, { error: "We could not improve your summary right now. Please try again." });
  }
}
