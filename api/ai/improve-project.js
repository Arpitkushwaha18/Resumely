import { improveWithGemini, readJsonBody, sendJson, validateText } from "../_lib/gemini.js";

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

    const improvedText = await improveWithGemini({
      instruction: "Rewrite this resume project description to sound professional, concise, impact-oriented, and ATS-friendly. Use only the supplied project name, technologies, and description.",
      input: `Project Name: ${body.name.trim() || "Not provided"}
Technologies: ${body.technologies.trim() || "Not provided"}
Description: ${body.description.trim()}`,
    });

    return sendJson(res, 200, { improvedText });
  } catch {
    return sendJson(res, 500, { error: "We could not improve this project right now. Please try again." });
  }
}
