import { improveWithLengthGuard, readJsonBody, sendJson, validateText } from "../_lib/gemini.js";

function buildProjectFallback({ name, technologies, description }) {
  const projectName = name.trim() || "this project";
  const techText = technologies.trim() ? ` using ${technologies.trim()}` : "";
  const cleanDescription = description.trim().replace(/\s+/g, " ");

  return `Developed ${projectName}${techText}, focusing on practical problem solving, clean implementation, and user-focused functionality. The work involved understanding requirements, organizing the solution, and improving the overall flow based on the project goals. ${cleanDescription} This project strengthened technical learning, attention to detail, and the ability to apply concepts in a practical environment.`;
}

const projectInstruction = `Rewrite this resume project description to sound professional, practical, impact-oriented, and ATS-friendly.

Length and structure:
- Minimum 300 characters and maximum 400 characters.
- Write 2 to 4 complete sentences.
- Never stop mid-sentence or mid-phrase.
- End with sentence punctuation.

Style:
- Keep it natural and suitable for a fresher resume.
- Use only the supplied project name, technologies, and description.
- Do not invent metrics, outcomes, features, technologies, users, awards, or deployment details.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed." });
  }

  try {
    const body = await readJsonBody(req);
    const descriptionError = validateText(body.description, "Description", 1500);
    if (descriptionError) return sendJson(res, 400, { error: descriptionError });

    if (typeof body.name !== "string" || body.name.length > 200) {
      return sendJson(res, 400, { error: "Project name must be valid text." });
    }

    if (typeof body.technologies !== "string" || body.technologies.length > 500) {
      return sendJson(res, 400, { error: "Technologies must be valid text." });
    }

    const input = `Project Name: ${body.name.trim() || "Not provided"}
Technologies: ${body.technologies.trim() || "Not provided"}
Description: ${body.description.trim()}`;
    const improvedText = await improveWithLengthGuard({
      instruction: projectInstruction,
      input,
      minLength: 300,
      maxLength: 400,
      fallbackText: buildProjectFallback(body),
    });

    return sendJson(res, 200, { improvedText });
  } catch {
    return sendJson(res, 500, { error: "We could not improve this project right now. Please try again." });
  }
}
