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
      instruction: `Generate a complete professional fresher resume summary from the user's content.

Length and structure:
- Minimum 350 characters and maximum 500 characters.
- Write approximately 3 to 5 sentences.
- Never return a one-sentence summary.

Style:
- Write like a real student resume.
- Keep it professional, ATS-friendly, human sounding, and natural.
- Avoid generic filler and overly short wording.

Include when supported by the user's content:
- Educational background.
- Technical interests.
- Work ethic.
- Teamwork.
- Learning mindset.
- Career objective.

Do not invent internships, projects, achievements, certifications, metrics, technologies, employers, dates, work experience, or any other fake detail.
If a detail is not available, keep the wording broad and truthful.`,
      input: body.summary.trim(),
    });

    return sendJson(res, 200, { improvedText });
  } catch {
    return sendJson(res, 500, { error: "We could not improve your summary right now. Please try again." });
  }
}
