import { improveWithGemini, readJsonBody, sendJson, validateText } from "../_lib/gemini.js";

function isCompleteSummary(value) {
  const text = value.trim();
  return text.length >= 350 && text.length <= 500 && /[.!?]$/.test(text);
}

const summaryInstruction = `Generate a complete professional fresher resume summary from the user's content.

Length and structure:
- Minimum 350 characters and maximum 500 characters.
- Write approximately 3 to 5 complete sentences.
- Never return a one-sentence summary.
- Never stop mid-sentence or mid-phrase.
- The final character must be sentence-ending punctuation.

Style:
- Write like a real student resume.
- Keep it professional, ATS-friendly, human sounding, and natural.
- Prefer third-person resume language instead of first-person wording.
- Avoid generic filler and overly short wording.

Include when supported by the user's content:
- Educational background.
- Technical interests.
- Work ethic.
- Teamwork.
- Learning mindset.
- Career objective.

Do not invent internships, projects, achievements, certifications, metrics, technologies, employers, dates, work experience, or any other fake detail.
If a detail is not available, keep the wording broad and truthful.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed." });
  }

  try {
    const body = await readJsonBody(req);
    const validationError = validateText(body.summary, "Summary", 1200);
    if (validationError) return sendJson(res, 400, { error: validationError });

    let improvedText = await improveWithGemini({
      instruction: summaryInstruction,
      input: body.summary.trim(),
    });

    if (!isCompleteSummary(improvedText)) {
      improvedText = await improveWithGemini({
        instruction: `${summaryInstruction}

The previous draft was too short or incomplete. Regenerate it as a complete 350-500 character fresher summary that ends with a full sentence.`,
        input: body.summary.trim(),
      });
    }

    return sendJson(res, 200, { improvedText });
  } catch {
    return sendJson(res, 500, { error: "We could not improve your summary right now. Please try again." });
  }
}
