import { enhanceWithLengthGuard, readJsonBody, sendJson, validateText } from "../_lib/gemini.js";

function buildAchievementFallback(achievement) {
  const cleanAchievement = achievement.trim().replace(/\s+/g, " ");
  return `Recognized for ${cleanAchievement}, demonstrating commitment, discipline, and a strong sense of responsibility. This achievement reflects the ability to stay focused on goals, contribute positively in academic or team environments, and maintain consistent effort. It also highlights a learning mindset, attention to detail, and readiness to take initiative in future professional opportunities.`;
}

const achievementInstruction = `Enhance the wording of this resume achievement while preserving the exact facts.

Length and structure:
- Minimum 300 characters and maximum 400 characters.
- Write 2 to 4 complete sentences.
- Never stop mid-sentence or mid-phrase.
- End with sentence punctuation.

Style:
- Keep it professional, ATS-friendly, and natural for a fresher resume.
- Enhance clarity and wording only.
- Do not invent awards, ranks, metrics, events, roles, organizations, dates, or outcomes.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed." });
  }

  try {
    const body = await readJsonBody(req);
    const validationError = validateText(body.achievement, "Achievement", 1000);
    if (validationError) return sendJson(res, 400, { error: validationError });

    const enhancedText = await enhanceWithLengthGuard({
      instruction: achievementInstruction,
      input: body.achievement.trim(),
      minLength: 300,
      maxLength: 400,
      fallbackText: buildAchievementFallback(body.achievement),
    });

    return sendJson(res, 200, { enhancedText });
  } catch {
    return sendJson(res, 500, { error: "We could not enhance this achievement right now. Please try again." });
  }
}
