import { enhanceWithLengthGuard, readJsonBody, sendJson, validateText } from "../_lib/gemini.js";

function buildExperienceFallback({ role, organization, type, description }) {
  const roleText = role.trim() || "the assigned role";
  const organizationText = organization.trim() ? ` at ${organization.trim()}` : "";
  const typeText = type.trim() ? ` during the ${type.trim().toLowerCase()} experience` : "";
  const cleanDescription = description.trim().replace(/\s+/g, " ");

  return `Contributed as ${roleText}${organizationText}${typeText}, focusing on assigned responsibilities, consistent learning, and professional communication. ${cleanDescription} The experience helped strengthen discipline, teamwork, adaptability, and the ability to understand workplace expectations while applying knowledge in a practical setting.`;
}

const experienceInstruction = `Rewrite this resume experience description to sound professional, ATS-friendly, and suitable for a fresher resume.

Length and structure:
- Minimum 300 characters and maximum 400 characters.
- Write 2 to 4 complete sentences.
- Never stop mid-sentence or mid-phrase.
- End with sentence punctuation.

Style:
- Enhance grammar, clarity, responsibility, teamwork, and learning impact.
- Use only the supplied role, organization, type, location, dates, and description.
- Do not invent tasks, metrics, achievements, tools, projects, employers, dates, or responsibilities.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed." });
  }

  try {
    const body = await readJsonBody(req);
    const descriptionError = validateText(body.description, "Description", 1500);
    if (descriptionError) return sendJson(res, 400, { error: descriptionError });

    const optionalFields = ["role", "organization", "type", "location", "startDate", "endDate"];
    for (const field of optionalFields) {
      if (typeof body[field] !== "string" || body[field].length > 300) {
        return sendJson(res, 400, { error: `${field} must be valid text.` });
      }
    }

    const input = `Role: ${body.role.trim() || "Not provided"}
Organization: ${body.organization.trim() || "Not provided"}
Type: ${body.type.trim() || "Not provided"}
Location: ${body.location.trim() || "Not provided"}
Dates: ${body.startDate.trim() || "Not provided"} to ${body.endDate.trim() || "Not provided"}
Description: ${body.description.trim()}`;

    const enhancedText = await enhanceWithLengthGuard({
      instruction: experienceInstruction,
      input,
      minLength: 300,
      maxLength: 400,
      fallbackText: buildExperienceFallback(body),
    });

    return sendJson(res, 200, { enhancedText });
  } catch {
    return sendJson(res, 500, { error: "We could not enhance this experience right now. Please try again." });
  }
}
