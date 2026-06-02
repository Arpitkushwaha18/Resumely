import { jsPDF } from "jspdf";
import { DEFAULT_TEMPLATE_ID, getTemplate } from "../templates/templateRegistry.js";
import { formatDegree, formatTechnologies, getResumeSections } from "../templates/templateUtils.js";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const FONT_FAMILY = "helvetica";
const LINK_COLOR = "#1f6fb2";
const URL_PATTERN = /((?:https?:\/\/|www\.)[^\s,;]+|[a-zA-Z0-9.-]+\.(?:com|org|net|io|dev|app|in|co|me|ai|edu)(?:\/[^\s,;]*)?)/gi;

function createFilename(fullName = "") {
  const safeName = fullName
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return safeName ? `${safeName}_Resume.pdf` : "Resume.pdf";
}

function getDisplayName(sections) {
  return sections.personal.fullName?.trim() || "Resume";
}

function createPdf(sections) {
  const displayName = getDisplayName(sections);
  const hasStudentName = displayName !== "Resume";
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  pdf.setProperties({
    title: hasStudentName ? `${displayName} Resume` : "Resume",
    author: hasStudentName ? displayName : "Resumely",
    subject: "Resume",
    keywords: "Resume, Student, Internship, Career",
    creator: "Resumely",
  });
  pdf.setFont(FONT_FAMILY, "normal");
  return pdf;
}

function setText(pdf, size, color, style = "normal") {
  pdf.setFont(FONT_FAMILY, style);
  pdf.setFontSize(size);
  pdf.setTextColor(color);
}

function splitText(pdf, text, maxWidth) {
  return pdf.splitTextToSize(String(text || ""), maxWidth);
}

function normalizeUrl(value = "", type = "website") {
  const trimmed = String(value || "").trim().replace(/[.)\]]+$/, "");
  if (!trimmed) return "";
  if (type === "email") return trimmed.startsWith("mailto:") ? trimmed : `mailto:${trimmed}`;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (type === "linkedin" && !/linkedin\.com/i.test(trimmed)) return `https://linkedin.com/in/${trimmed.replace(/^@/, "")}`;
  if (type === "github" && !/github\.com/i.test(trimmed)) return `https://github.com/${trimmed.replace(/^@/, "")}`;
  return `https://${trimmed.replace(/^\/+/, "")}`;
}

function extractFirstUrl(...values) {
  for (const value of values) {
    const match = String(value || "").match(URL_PATTERN);
    if (match?.[0]) return normalizeUrl(match[0]);
  }
  return "";
}

function createContactLinks(personal) {
  return [
    personal.email && { label: personal.email, url: normalizeUrl(personal.email, "email") },
    personal.phone && { label: personal.phone },
    personal.linkedin && { label: personal.linkedin, url: normalizeUrl(personal.linkedin, "linkedin") },
    personal.github && { label: personal.github, url: normalizeUrl(personal.github, "github") },
    personal.portfolio && { label: personal.portfolio, url: normalizeUrl(personal.portfolio) },
    personal.location && { label: personal.location },
  ].filter(Boolean);
}

function measureContactRows(pdf, items, maxWidth, size) {
  const separator = "  |  ";
  let rows = 1;
  let x = 0;
  pdf.setFont(FONT_FAMILY, "normal");
  pdf.setFontSize(size);
  items.forEach((item, index) => {
    const suffix = index < items.length - 1 ? separator : "";
    const width = pdf.getTextWidth(`${item.label || ""}${suffix}`);
    if (x > 0 && x + width > maxWidth) {
      rows += 1;
      x = 0;
    }
    x += width;
  });
  return rows;
}

class PdfWriter {
  constructor(pdf, template, bounds) {
    this.pdf = pdf;
    this.template = template;
    this.bounds = bounds;
    this.y = bounds.top;
  }

  get style() {
    return this.template.pdf;
  }

  availableHeight() {
    return A4_HEIGHT_MM - this.bounds.bottom - this.y;
  }

  addPage() {
    this.pdf.addPage("a4", "portrait");
    this.y = this.bounds.top;
    if (this.style.layout === "sidebar") drawSidebarBackground(this.pdf, this.template);
  }

  ensure(height) {
    if (this.y > this.bounds.top && this.availableHeight() < height) {
      this.addPage();
    }
  }

  move(amount) {
    this.y += amount;
  }

  line(x1, y, x2, color = this.style.rule, width = 0.22) {
    this.pdf.setDrawColor(color);
    this.pdf.setLineWidth(width);
    this.pdf.line(x1, y, x2, y);
  }

  paragraph(text, options = {}) {
    const lineHeight = options.lineHeight || 4.2;
    const lines = splitText(this.pdf, text, options.maxWidth || this.bounds.width);
    lines.forEach((line) => {
      this.ensure(lineHeight + 1);
      setText(this.pdf, options.size || this.style.bodySize, options.color || this.style.soft, options.style || "normal");
      this.pdf.text(line, this.bounds.left, this.y);
      this.y += lineHeight;
    });
  }

  lineCount(text, maxWidth = this.bounds.width) {
    return splitText(this.pdf, text, maxWidth).length;
  }

  paragraphHeight(text, options = {}) {
    return this.lineCount(text, options.maxWidth || this.bounds.width) * (options.lineHeight || 4.2);
  }

  linkedText(text, url, x, y, options = {}) {
    const size = options.size || this.style.bodySize;
    setText(this.pdf, size, options.color || LINK_COLOR, options.style || "normal");
    this.pdf.text(text, x, y);
    const width = this.pdf.getTextWidth(text);
    this.pdf.link(x, y - size * 0.34, width, size * 0.48, { url });
    this.pdf.setDrawColor(options.color || LINK_COLOR);
    this.pdf.setLineWidth(0.12);
    this.pdf.line(x, y + 0.7, x + width, y + 0.7);
    return width;
  }

  contactLine(items, options = {}) {
    const size = options.size || 7.3;
    const lineHeight = options.lineHeight || 3.8;
    const separator = "  |  ";
    const left = options.x || this.bounds.left;
    const maxRight = options.maxRight || this.bounds.right;
    let x = left;
    setText(this.pdf, size, options.color || this.style.muted, options.style || "normal");
    this.ensure(lineHeight + 1);
    items.forEach((item, index) => {
      const label = String(item.label || "");
      const suffixWidth = index < items.length - 1 ? this.pdf.getTextWidth(separator) : 0;
      const itemWidth = this.pdf.getTextWidth(label) + suffixWidth;
      if (x > left && x + itemWidth > maxRight) {
        this.y += lineHeight;
        this.ensure(lineHeight + 1);
        x = left;
      }
      const color = item.url ? options.linkColor || LINK_COLOR : options.color || this.style.muted;
      if (item.url) {
        x += this.linkedText(label, item.url, x, this.y, { size, color, style: options.style || "normal" });
      } else {
        setText(this.pdf, size, color, options.style || "normal");
        this.pdf.text(label, x, this.y);
        x += this.pdf.getTextWidth(label);
      }
      if (index < items.length - 1) {
        setText(this.pdf, size, options.color || this.style.muted, options.style || "normal");
        this.pdf.text(separator, x, this.y);
        x += this.pdf.getTextWidth(separator);
      }
    });
    this.y += lineHeight;
  }

  section(title, minContentHeight = 0) {
    this.ensure(14 + minContentHeight);
    if (this.y > this.bounds.top + 3) this.move(4);
    setText(this.pdf, 8.5, this.style.accent, "bold");
    this.pdf.text(title.toUpperCase(), this.bounds.left, this.y);
    this.line(this.bounds.left, this.y + 1.7, this.bounds.right);
    this.move(6);
  }
}

function getSingleBounds(template) {
  const marginX = template.pdf.marginX;
  return {
    left: marginX,
    right: A4_WIDTH_MM - marginX,
    width: A4_WIDTH_MM - marginX * 2,
    top: template.pdf.marginTop,
    bottom: template.pdf.marginBottom,
  };
}

function getSidebarMainBounds(template) {
  const sidebarRight = template.pdf.sidebarWidth + template.pdf.marginX;
  const left = sidebarRight + 10;
  const right = A4_WIDTH_MM - template.pdf.marginX;
  return {
    left,
    right,
    width: right - left,
    top: template.pdf.marginTop,
    bottom: template.pdf.marginBottom,
  };
}

function drawSidebarBackground(pdf, template) {
  pdf.setFillColor(template.pdf.sidebarBg);
  pdf.rect(0, 0, template.pdf.sidebarWidth + template.pdf.marginX, A4_HEIGHT_MM, "F");
}

function renderHeader(writer, sections) {
  const { pdf, style, bounds } = writer;
  const fullName = sections.personal.fullName || "Your Name";
  const professionalTitle = sections.personal.professionalTitle || "Student Professional";

  setText(pdf, style.titleSize, style.ink, "bold");
  pdf.text(fullName.toUpperCase(), bounds.left, writer.y, { maxWidth: bounds.width });
  writer.move(6.2);

  setText(pdf, 8.5, style.muted, "bold");
  pdf.text(professionalTitle, bounds.left, writer.y, { maxWidth: bounds.width });
  writer.move(4.8);

  const contactLinks = createContactLinks(sections.personal);
  if (contactLinks.length > 0) {
    writer.contactLine(contactLinks, { size: 7.3, color: style.muted, lineHeight: 3.8 });
    writer.move(1);
  }

  writer.line(bounds.left, writer.y, bounds.right, style.accent, 0.65);
  writer.move(6);
}

function renderHorizonHeader(writer, sections) {
  const { pdf, style, bounds } = writer;
  const fullName = sections.personal.fullName || "Your Name";
  const professionalTitle = sections.personal.professionalTitle || "Student Professional";

  const contactLinks = createContactLinks(sections.personal);
  const contactRows = contactLinks.length > 0 ? measureContactRows(pdf, contactLinks, bounds.width - 10, 7.2) : 0;
  const headerHeight = Math.max(28, 23 + contactRows * 3.6);

  pdf.setFillColor(style.accent);
  pdf.roundedRect(bounds.left, writer.y - 2, bounds.width, headerHeight, 2.5, 2.5, "F");
  setText(pdf, style.titleSize, "#ffffff", "bold");
  pdf.text(fullName.toUpperCase(), bounds.left + 5, writer.y + 7, { maxWidth: bounds.width - 10 });
  setText(pdf, 8.5, "#eaf7fb", "bold");
  pdf.text(professionalTitle, bounds.left + 5, writer.y + 13.5, { maxWidth: bounds.width - 10 });
  if (contactLinks.length > 0) {
    const oldY = writer.y;
    writer.y += 19;
    writer.contactLine(contactLinks, { x: bounds.left + 5, maxRight: bounds.right - 5, size: 7.2, color: "#eaf7fb", linkColor: "#ffffff", lineHeight: 3.6 });
    writer.y = oldY;
  }
  writer.y += headerHeight + 6;
}

function renderElevateHeader(writer, sections) {
  const { pdf, style, bounds } = writer;
  const fullName = sections.personal.fullName || "Your Name";
  const professionalTitle = sections.personal.professionalTitle || "Student Professional";

  const contactLinks = createContactLinks(sections.personal);
  const contactRows = contactLinks.length > 0 ? measureContactRows(pdf, contactLinks, bounds.width - 10, 7.2) : 0;
  const headerHeight = Math.max(29, 23 + contactRows * 3.6);

  pdf.setFillColor("#f3effb");
  pdf.roundedRect(bounds.left, writer.y - 2, bounds.width, headerHeight, 3, 3, "F");
  pdf.setDrawColor("#d8cbea");
  pdf.setLineWidth(0.2);
  pdf.roundedRect(bounds.left, writer.y - 2, bounds.width, headerHeight, 3, 3, "S");
  setText(pdf, style.titleSize, style.ink, "bold");
  pdf.text(fullName.toUpperCase(), bounds.left + 5, writer.y + 7, { maxWidth: bounds.width - 10 });
  setText(pdf, 8.5, style.accent, "bold");
  pdf.text(professionalTitle, bounds.left + 5, writer.y + 13.5, { maxWidth: bounds.width - 10 });
  if (contactLinks.length > 0) {
    const oldY = writer.y;
    writer.y += 19;
    writer.contactLine(contactLinks, { x: bounds.left + 5, maxRight: bounds.right - 5, size: 7.2, color: style.muted, lineHeight: 3.6 });
    writer.y = oldY;
  }
  writer.y += headerHeight + 6;
}

function renderNovaHeader(writer, sections) {
  const { pdf, style, bounds } = writer;
  const fullName = sections.personal.fullName || "Your Name";
  const professionalTitle = sections.personal.professionalTitle || "Software Engineer";

  setText(pdf, style.titleSize, style.ink, "bold");
  pdf.text(fullName.toUpperCase(), bounds.left, writer.y, { maxWidth: bounds.width * 0.64 });
  setText(pdf, 8.4, style.accent, "bold");
  pdf.text(professionalTitle.toUpperCase(), bounds.left, writer.y + 6.3, { maxWidth: bounds.width * 0.64 });

  const contactLinks = createContactLinks(sections.personal);
  if (contactLinks.length > 0) {
    const oldY = writer.y;
    writer.y += 1;
    writer.contactLine(contactLinks, { x: bounds.left + bounds.width * 0.68, maxRight: bounds.right, size: 7, color: style.muted, lineHeight: 3.6 });
    writer.y = oldY;
  }

  writer.move(13);
  writer.line(bounds.left, writer.y, bounds.right, style.accent, 0.8);
  writer.move(5);
}

function renderPrestigeHeader(writer, sections) {
  const { pdf, style, bounds } = writer;
  const center = bounds.left + bounds.width / 2;
  const fullName = sections.personal.fullName || "Your Name";
  const professionalTitle = sections.personal.professionalTitle || "Professional";

  setText(pdf, style.titleSize, style.ink, "bold");
  pdf.text(fullName.toUpperCase(), center, writer.y, { align: "center", maxWidth: bounds.width });
  writer.move(5.8);
  setText(pdf, 8, style.accent, "bold");
  pdf.text(professionalTitle.toUpperCase(), center, writer.y, { align: "center", maxWidth: bounds.width });
  writer.move(4.6);

  const contactLinks = createContactLinks(sections.personal);
  if (contactLinks.length > 0) {
    writer.contactLine(contactLinks, { x: bounds.left + 16, maxRight: bounds.right - 16, size: 7, color: style.muted, lineHeight: 3.7 });
  }

  writer.line(center - 15, writer.y + 1, center + 15, style.accent, 0.45);
  writer.move(7);
}

function renderSidebarHeader(writer, sections) {
  const { pdf, style, bounds } = writer;
  const fullName = sections.personal.fullName || "Your Name";
  const professionalTitle = sections.personal.professionalTitle || "Student Professional";

  setText(pdf, style.titleSize, style.ink, "bold");
  pdf.text(fullName.toUpperCase(), bounds.left, writer.y, { maxWidth: bounds.width });
  writer.move(6);

  setText(pdf, 8.2, style.accent, "bold");
  pdf.text(professionalTitle, bounds.left, writer.y, { maxWidth: bounds.width });
  writer.move(7);
}

function renderSummary(writer, sections) {
  if (!sections.summary) return;
  writer.section("Professional Summary", writer.paragraphHeight(sections.summary, { lineHeight: 4.4 }));
  writer.paragraph(sections.summary, { size: writer.style.bodySize + 0.3, color: writer.style.soft, lineHeight: 4.4 });
}

function renderExperience(writer, experience) {
  if (experience.length === 0) return;

  const firstExperience = experience[0];
  const firstMeta = [firstExperience.organization, firstExperience.type, firstExperience.location].filter(Boolean).join(" • ");
  const firstExperienceHeight = 8.5
    + (firstMeta ? writer.paragraphHeight(firstMeta, { lineHeight: 4 }) : 0)
    + (firstExperience.description ? writer.paragraphHeight(`Description: ${firstExperience.description}`, { lineHeight: 4.2 }) : 0);
  writer.section("Experience", Math.max(14, firstExperienceHeight));
  experience.forEach((item, index) => {
    if (index > 0) writer.move(2.4);
    const meta = [item.organization, item.type, item.location].filter(Boolean).join(" • ");
    const dates = [item.startDate, item.endDate].filter(Boolean).join(" - ");
    const estimatedHeight = 8.5
      + (meta ? writer.paragraphHeight(meta, { lineHeight: 4 }) : 0)
      + (item.description ? writer.paragraphHeight(`Description: ${item.description}`, { lineHeight: 4.2 }) : 0);
    writer.ensure(Math.max(14, estimatedHeight));

    setText(writer.pdf, 9.2, writer.style.ink, "bold");
    writer.pdf.text(item.role || "Role", writer.bounds.left, writer.y, { maxWidth: writer.bounds.width - 42 });

    if (dates) {
      setText(writer.pdf, 7.5, writer.style.muted, "bold");
      writer.pdf.text(dates, writer.bounds.right, writer.y, { align: "right" });
    }

    writer.move(4.1);
    if (meta) writer.paragraph(meta, { size: writer.style.bodySize, color: writer.style.muted, style: "bold", lineHeight: 4 });
    if (item.description) writer.paragraph(`Description: ${item.description}`, { size: writer.style.bodySize, color: writer.style.soft, lineHeight: 4.2 });
  });
}

function renderEducation(writer, education) {
  if (education.length === 0) return;

  const firstEducation = education[0];
  const firstShouldShowLevel = ["Class 10", "Class 12", "Diploma"].includes(firstEducation.level);
  const firstCredential = firstShouldShowLevel
    ? [firstEducation.level, formatDegree(firstEducation.degree), firstEducation.branch].filter(Boolean).join(" ")
    : [formatDegree(firstEducation.degree) || firstEducation.level, firstEducation.branch].filter(Boolean).join(" ");
  const firstDetails = [firstCredential || firstEducation.level, firstEducation.score].filter(Boolean).join(" • ");
  const firstRightWidth = Math.min(43, writer.bounds.width * 0.35);
  const firstLeftWidth = writer.bounds.width - firstRightWidth - 8;
  setText(writer.pdf, 9.4, writer.style.ink, "bold");
  const firstTitleHeight = Math.max(
    writer.paragraphHeight(firstEducation.institution || "Institution Name", { lineHeight: 4.1, maxWidth: firstLeftWidth }),
    [firstEducation.currentYear, firstEducation.graduationYear ? (firstEducation.level?.startsWith("Class") ? firstEducation.graduationYear : `Graduation: ${firstEducation.graduationYear}`) : ""].filter(Boolean).length * 3.7,
    4.4,
  );
  const firstEducationHeight = firstTitleHeight + 3.6
    + (firstDetails ? writer.paragraphHeight(firstDetails, { lineHeight: 4, maxWidth: firstLeftWidth }) : 0)
    + (firstEducation.coursework ? writer.paragraphHeight(`Coursework: ${firstEducation.coursework}`, { lineHeight: 4 }) : 0);
  writer.section("Education", Math.max(13, firstEducationHeight));
  education.forEach((item, index) => {
    if (index > 0) writer.move(2.2);

    const shouldShowLevel = ["Class 10", "Class 12", "Diploma"].includes(item.level);
    const credential = shouldShowLevel
      ? [item.level, formatDegree(item.degree), item.branch].filter(Boolean).join(" ")
      : [formatDegree(item.degree) || item.level, item.branch].filter(Boolean).join(" ");
    const details = [credential || item.level, item.score].filter(Boolean).join(" • ");
    const dateLines = [item.currentYear, item.graduationYear ? (item.level?.startsWith("Class") ? item.graduationYear : `Graduation: ${item.graduationYear}`) : ""].filter(Boolean);
    const rightWidth = Math.min(43, writer.bounds.width * 0.35);
    const leftWidth = writer.bounds.width - rightWidth - 8;
    setText(writer.pdf, 9.4, writer.style.ink, "bold");
    const titleLines = splitText(writer.pdf, item.institution || "Institution Name", leftWidth);
    const titleHeight = Math.max(titleLines.length * 4.1, dateLines.length * 3.7, 4.4);
    const estimatedHeight = titleHeight + 3.6
      + (details ? writer.paragraphHeight(details, { lineHeight: 4, maxWidth: leftWidth }) : 0)
      + (item.coursework ? writer.paragraphHeight(`Coursework: ${item.coursework}`, { lineHeight: 4 }) : 0);
    writer.ensure(Math.max(13, estimatedHeight));

    setText(writer.pdf, 9.4, writer.style.ink, "bold");
    writer.pdf.text(titleLines, writer.bounds.left, writer.y);

    if (dateLines.length > 0) {
      setText(writer.pdf, 7.5, writer.style.muted, "bold");
      dateLines.forEach((line, lineIndex) => {
        writer.pdf.text(line, writer.bounds.right, writer.y + lineIndex * 3.7, { align: "right" });
      });
    }

    writer.move(titleHeight);
    if (details) writer.paragraph(details, { size: 8.3, color: writer.style.muted, style: "bold", lineHeight: 4, maxWidth: leftWidth });
    if (item.coursework) writer.paragraph(`Coursework: ${item.coursework}`, { size: writer.style.bodySize, color: writer.style.soft, lineHeight: 4 });
  });
}

function renderProjects(writer, projects) {
  if (projects.length === 0) return;

  const firstProject = projects[0];
  const firstProjectUrl = normalizeUrl(firstProject.url || firstProject.link || firstProject.projectUrl || extractFirstUrl(firstProject.description));
  const firstProjectHeight = 8
    + (firstProject.technologies ? writer.paragraphHeight(formatTechnologies(firstProject.technologies), { lineHeight: 4.1 }) : 0)
    + (firstProject.description ? writer.paragraphHeight(firstProject.description, { lineHeight: 4.2 }) : 0)
    + (firstProjectUrl ? 4.2 : 0);
  writer.section("Projects", Math.max(14, firstProjectHeight));
  projects.forEach((project, index) => {
    if (index > 0) writer.move(2.4);
    const projectUrl = normalizeUrl(project.url || project.link || project.projectUrl || extractFirstUrl(project.description));
    const estimatedHeight = 8
      + (project.technologies ? writer.paragraphHeight(formatTechnologies(project.technologies), { lineHeight: 4.1 }) : 0)
      + (project.description ? writer.paragraphHeight(project.description, { lineHeight: 4.2 }) : 0)
      + (projectUrl ? 4.2 : 0);
    writer.ensure(Math.max(14, estimatedHeight));
    setText(writer.pdf, 9.2, writer.style.ink, "bold");
    writer.pdf.text(project.name || "Untitled Project", writer.bounds.left, writer.y, { maxWidth: writer.bounds.width });
    writer.move(4.3);

    if (project.technologies) {
      writer.paragraph(formatTechnologies(project.technologies), { size: writer.style.bodySize, color: writer.style.muted, style: "bold", lineHeight: 4.1 });
    }

    if (project.description) {
      writer.paragraph(project.description, { size: writer.style.bodySize, color: writer.style.soft, lineHeight: 4.2 });
    }

    if (projectUrl) {
      writer.ensure(5);
      writer.linkedText("Project Link", projectUrl, writer.bounds.left, writer.y, { size: writer.style.bodySize, color: LINK_COLOR, style: "bold" });
      writer.y += 4.2;
    }
  });
}

function renderSkills(writer, skillGroups) {
  if (skillGroups.length === 0) return;

  const firstSkillGroup = skillGroups[0];
  writer.section("Skills", writer.paragraphHeight(`${firstSkillGroup.title}: ${firstSkillGroup.skills.join(", ")}`, { lineHeight: 4.1 }));
  skillGroups.forEach(({ title, skills }) => {
    writer.paragraph(`${title}: ${skills.join(", ")}`, { size: writer.style.bodySize, color: writer.style.soft, lineHeight: 4.1 });
  });
}

function renderCertifications(writer, certifications) {
  if (certifications.length === 0) return;

  const firstCertificate = certifications[0];
  const firstCertificateHeight = 5 + (firstCertificate.organization ? writer.paragraphHeight(firstCertificate.organization, { lineHeight: 3.9 }) : 0);
  writer.section("Certifications", Math.max(10, firstCertificateHeight));
  certifications.forEach((certificate, index) => {
    if (index > 0) writer.move(1.6);
    writer.ensure(10);

    setText(writer.pdf, 8.7, writer.style.ink, "bold");
    writer.pdf.text(certificate.name || "Certificate", writer.bounds.left, writer.y, { maxWidth: writer.bounds.width - 24 });

    if (certificate.year) {
      setText(writer.pdf, 7.5, writer.style.muted, "bold");
      writer.pdf.text(certificate.year, writer.bounds.right, writer.y, { align: "right" });
    }

    writer.move(4);
    if (certificate.organization) {
      writer.paragraph(certificate.organization, { size: writer.style.bodySize, color: writer.style.soft, lineHeight: 3.9 });
    }
  });
}

function renderAchievements(writer, achievements) {
  if (achievements.length === 0) return;

  writer.section("Achievements", writer.paragraphHeight(`• ${achievements[0]}`, { lineHeight: 4.1 }));
  achievements.forEach((achievement) => {
    writer.paragraph(`• ${achievement}`, { size: writer.style.bodySize, color: writer.style.soft, lineHeight: 4.1 });
  });
}

function renderMainSections(writer, sections, options = {}) {
  renderSummary(writer, sections);
  renderExperience(writer, sections.experience);
  renderEducation(writer, sections.education);
  renderProjects(writer, sections.projects);
  if (!options.skipSkills) renderSkills(writer, sections.skillGroups);
  renderCertifications(writer, sections.certifications);
  renderAchievements(writer, sections.achievements);
}

function renderMainSectionsByOrder(writer, sections, order, options = {}) {
  order.forEach((section) => {
    if (section === "summary") renderSummary(writer, sections);
    if (section === "experience") renderExperience(writer, sections.experience);
    if (section === "education") renderEducation(writer, sections.education);
    if (section === "projects") renderProjects(writer, sections.projects);
    if (section === "skills" && !options.skipSkills) renderSkills(writer, sections.skillGroups);
    if (section === "certifications") renderCertifications(writer, sections.certifications);
    if (section === "achievements") renderAchievements(writer, sections.achievements);
  });
}

function renderSidebarContent(pdf, template, sections) {
  const left = 10;
  const width = template.pdf.sidebarWidth - 4;
  let y = template.pdf.marginTop;

  setText(pdf, 8, template.pdf.ink, "bold");
  pdf.text("CONTACT", left, y);
  y += 5;

  const contactItems = createContactLinks(sections.personal);
  contactItems.forEach((item) => {
    splitText(pdf, item.label, width).forEach((line) => {
      setText(pdf, 7.2, item.url ? LINK_COLOR : template.pdf.muted, "normal");
      pdf.text(line, left, y);
      if (item.url) {
        const lineWidth = pdf.getTextWidth(line);
        pdf.link(left, y - 2.3, lineWidth, 3.2, { url: item.url });
      }
      y += 3.7;
    });
    y += 1;
  });

  if (sections.skillGroups.length === 0) return;

  y += 5;
  setText(pdf, 8, template.pdf.ink, "bold");
  pdf.text("SKILLS", left, y);
  y += 5;

  setText(pdf, 7.2, template.pdf.muted, "normal");
  sections.skillGroups.flatMap(({ skills }) => skills).slice(0, 26).forEach((skill) => {
    splitText(pdf, skill, width).forEach((line) => {
      if (y > A4_HEIGHT_MM - template.pdf.marginBottom) return;
      pdf.text(line, left, y);
      y += 3.7;
    });
    y += 0.7;
  });
}

function renderSingleColumnPdf(pdf, template, sections) {
  const writer = new PdfWriter(pdf, template, getSingleBounds(template));
  if (template.previewKind === "modern") {
    renderHorizonHeader(writer, sections);
    renderMainSections(writer, sections);
  } else if (template.previewKind === "creative") {
    renderElevateHeader(writer, sections);
    renderMainSections(writer, sections);
  } else if (template.pdf.layout === "executive") {
    renderHeader(writer, sections);
    renderMainSectionsByOrder(writer, sections, ["summary", "experience", "projects", "education", "skills", "certifications", "achievements"]);
  } else if (template.pdf.layout === "nova") {
    renderNovaHeader(writer, sections);
    renderMainSectionsByOrder(writer, sections, ["skills", "projects", "experience", "education", "certifications", "achievements"]);
  } else if (template.pdf.layout === "zenith") {
    renderHorizonHeader(writer, sections);
    renderMainSectionsByOrder(writer, sections, ["summary", "skills", "projects", "experience", "education", "certifications", "achievements"]);
  } else if (template.pdf.layout === "prestige") {
    renderPrestigeHeader(writer, sections);
    renderMainSectionsByOrder(writer, sections, ["summary", "experience", "projects", "education", "skills", "certifications", "achievements"]);
  } else {
    renderHeader(writer, sections);
    renderMainSections(writer, sections);
  }
}

function renderSidebarPdf(pdf, template, sections) {
  drawSidebarBackground(pdf, template);
  renderSidebarContent(pdf, template, sections);
  const writer = new PdfWriter(pdf, template, getSidebarMainBounds(template));
  renderSidebarHeader(writer, sections);
  if (template.pdf.layout === "atlas") {
    renderMainSectionsByOrder(writer, sections, ["summary", "projects", "experience", "education", "certifications", "achievements"], { skipSkills: true });
    renderSkills(writer, sections.skillGroups);
  } else {
    renderMainSections(writer, sections, { skipSkills: true });
    renderSkills(writer, sections.skillGroups);
  }
}

export async function exportResumePdf(resume, templateId = DEFAULT_TEMPLATE_ID) {
  const template = getTemplate(templateId);
  const sections = getResumeSections(resume);
  const pdf = createPdf(sections);

  if (template.pdf.layout === "sidebar" || template.pdf.layout === "atlas") {
    renderSidebarPdf(pdf, template, sections);
  } else {
    renderSingleColumnPdf(pdf, template, sections);
  }

  pdf.save(createFilename(sections.personal.fullName));
}
