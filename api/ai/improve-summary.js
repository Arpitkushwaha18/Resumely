import { improveWithGemini, readJsonBody, sendJson, validateText } from "../_lib/gemini.js";

function isCompleteSummary(value) {
  const text = value.trim();
  return text.length >= 350 && text.length <= 500 && /[.!?]$/.test(text);
}

function buildFallbackSummary(input) {
  const normalized = input.toLowerCase();
  const education = normalized.includes("computer science")
    ? "Computer Science student"
    : "Fresher candidate";

  return `${education} with a strong interest in technology, software development, and continuous learning. Known for a disciplined work ethic, hardworking attitude, and ability to collaborate effectively in team environments. Focused on strengthening technical knowledge, adapting to new challenges, and applying academic learning in practical settings. Seeking an opportunity to grow professionally, contribute responsibly, and build valuable industry experience.`;
}

const summaryInstruction = `Generate a complete professional fresher resume summary from the user's content.

Length and structure:
- Minimum 350 characters and maximum 500 characters. Aim for 380 to 450 characters.
- Write approximately 3 to 5 complete sentences.
- Never return a one-sentence summary.
- Never return fewer than 350 characters.
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

    const input = body.summary.trim();
    let improvedText = "";
    const attempts = [
      summaryInstruction,
      `${summaryInstruction}

The previous draft was too short or incomplete. Regenerate it as a complete 380-450 character fresher summary that ends with a full sentence.`,
      `${summaryInstruction}

Strict output rule: Return 3 to 5 complete sentences between 380 and 450 characters. Do not return a short summary. Do not include markdown or labels.`,
    ];

    for (const instruction of attempts) {
      improvedText = await improveWithGemini({
        instruction,
        input,
      });

      if (isCompleteSummary(improvedText)) break;
    }

    if (!isCompleteSummary(improvedText)) {
      improvedText = buildFallbackSummary(input);
    }

    return sendJson(res, 200, { improvedText });
  } catch {
    return sendJson(res, 500, { error: "We could not improve your summary right now. Please try again." });
  }
}
