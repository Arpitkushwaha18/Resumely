import { jsPDF } from "jspdf";
import { DEFAULT_TEMPLATE_ID, getTemplate } from "../templates/templateRegistry.js";
import { formatDegree, formatTechnologies, getResumeSections } from "../templates/templateUtils.js";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const FONT_FAMILY = "helvetica";

function createFilename(fullName = "") {
  const safeName = fullName
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return safeName ? `${safeName}_Resume.pdf` : "resume.pdf";
}

function createPdf(template) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  pdf.setProperties({
    title: `${template.name} Resume`,
    subject: "Professional resume",
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

  section(title) {
    this.ensure(14);
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

  if (sections.contactItems.length > 0) {
    writer.paragraph(sections.contactItems.join("  |  "), { size: 7.3, color: style.muted, lineHeight: 3.8 });
    writer.move(1);
  }

  writer.line(bounds.left, writer.y, bounds.right, style.accent, 0.65);
  writer.move(6);
}

function renderHorizonHeader(writer, sections) {
  const { pdf, style, bounds } = writer;
  const fullName = sections.personal.fullName || "Your Name";
  const professionalTitle = sections.personal.professionalTitle || "Student Professional";

  pdf.setFillColor(style.accent);
  pdf.roundedRect(bounds.left, writer.y - 2, bounds.width, 28, 2.5, 2.5, "F");
  setText(pdf, style.titleSize, "#ffffff", "bold");
  pdf.text(fullName.toUpperCase(), bounds.left + 5, writer.y + 7, { maxWidth: bounds.width - 10 });
  setText(pdf, 8.5, "#eaf7fb", "bold");
  pdf.text(professionalTitle, bounds.left + 5, writer.y + 13.5, { maxWidth: bounds.width - 10 });
  if (sections.contactItems.length > 0) {
    setText(pdf, 7.2, "#eaf7fb", "normal");
    splitText(pdf, sections.contactItems.join("  |  "), bounds.width - 10).forEach((line, index) => {
      pdf.text(line, bounds.left + 5, writer.y + 19 + index * 3.6);
    });
  }
  writer.y += 34;
}

function renderElevateHeader(writer, sections) {
  const { pdf, style, bounds } = writer;
  const fullName = sections.personal.fullName || "Your Name";
  const professionalTitle = sections.personal.professionalTitle || "Student Professional";

  pdf.setFillColor("#f3effb");
  pdf.roundedRect(bounds.left, writer.y - 2, bounds.width, 29, 3, 3, "F");
  pdf.setDrawColor("#d8cbea");
  pdf.setLineWidth(0.2);
  pdf.roundedRect(bounds.left, writer.y - 2, bounds.width, 29, 3, 3, "S");
  setText(pdf, style.titleSize, style.ink, "bold");
  pdf.text(fullName.toUpperCase(), bounds.left + 5, writer.y + 7, { maxWidth: bounds.width - 10 });
  setText(pdf, 8.5, style.accent, "bold");
  pdf.text(professionalTitle, bounds.left + 5, writer.y + 13.5, { maxWidth: bounds.width - 10 });
  if (sections.contactItems.length > 0) {
    setText(pdf, 7.2, style.muted, "normal");
    splitText(pdf, sections.contactItems.join("  |  "), bounds.width - 10).forEach((line, index) => {
      pdf.text(line, bounds.left + 5, writer.y + 19 + index * 3.6);
    });
  }
  writer.y += 34;
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
  writer.section("Professional Summary");
  writer.paragraph(sections.summary, { size: writer.style.bodySize + 0.3, color: writer.style.soft, lineHeight: 4.4 });
}

function renderExperience(writer, experience) {
  if (experience.length === 0) return;

  writer.section("Experience");
  experience.forEach((item, index) => {
    if (index > 0) writer.move(2.4);
    writer.ensure(14);
    const meta = [item.organization, item.type, item.location].filter(Boolean).join(" • ");
    const dates = [item.startDate, item.endDate].filter(Boolean).join(" - ");

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

  writer.section("Education");
  education.forEach((item, index) => {
    if (index > 0) writer.move(2.2);
    writer.ensure(13);

    const credential = [formatDegree(item.degree), item.branch].filter(Boolean).join(" ");
    const details = [credential || item.level, item.score].filter(Boolean).join(" • ");
    const dateLines = [item.currentYear, item.graduationYear ? (item.level?.startsWith("Class") ? item.graduationYear : `Expected Graduation: ${item.graduationYear}`) : ""].filter(Boolean);
    const rightWidth = 43;
    const leftWidth = Math.max(60, writer.bounds.width - rightWidth - 8);

    setText(writer.pdf, 9.4, writer.style.ink, "bold");
    writer.pdf.text(item.institution || "Institution Name", writer.bounds.left, writer.y, { maxWidth: leftWidth });

    if (dateLines.length > 0) {
      setText(writer.pdf, 7.5, writer.style.muted, "bold");
      dateLines.forEach((line, lineIndex) => {
        writer.pdf.text(line, writer.bounds.right, writer.y + lineIndex * 3.7, { align: "right" });
      });
    }

    writer.move(4.4);
    if (details) writer.paragraph(details, { size: 8.3, color: writer.style.muted, style: "bold", lineHeight: 4, maxWidth: leftWidth });
    if (item.coursework) writer.paragraph(`Coursework: ${item.coursework}`, { size: writer.style.bodySize, color: writer.style.soft, lineHeight: 4 });
  });
}

function renderProjects(writer, projects) {
  if (projects.length === 0) return;

  writer.section("Projects");
  projects.forEach((project, index) => {
    if (index > 0) writer.move(2.4);
    writer.ensure(14);
    setText(writer.pdf, 9.2, writer.style.ink, "bold");
    writer.pdf.text(project.name || "Untitled Project", writer.bounds.left, writer.y, { maxWidth: writer.bounds.width });
    writer.move(4.3);

    if (project.technologies) {
      writer.paragraph(`Technologies Used: ${formatTechnologies(project.technologies)}`, { size: writer.style.bodySize, color: writer.style.muted, lineHeight: 4.1 });
    }

    if (project.description) {
      writer.paragraph(`Description: ${project.description}`, { size: writer.style.bodySize, color: writer.style.soft, lineHeight: 4.2 });
    }
  });
}

function renderSkills(writer, skillGroups) {
  if (skillGroups.length === 0) return;

  writer.section("Skills");
  skillGroups.forEach(({ title, skills }) => {
    writer.paragraph(`${title}: ${skills.join(", ")}`, { size: writer.style.bodySize, color: writer.style.soft, lineHeight: 4.1 });
  });
}

function renderCertifications(writer, certifications) {
  if (certifications.length === 0) return;

  writer.section("Certifications");
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

  writer.section("Achievements");
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

function renderSidebarContent(pdf, template, sections) {
  const left = 10;
  const width = template.pdf.sidebarWidth - 4;
  let y = template.pdf.marginTop;

  setText(pdf, 8, template.pdf.ink, "bold");
  pdf.text("CONTACT", left, y);
  y += 5;

  setText(pdf, 7.2, template.pdf.muted, "normal");
  const contactItems = sections.contactItems.length > 0 ? sections.contactItems : ["you@email.com", "+91 98765 43210"];
  contactItems.forEach((item) => {
    splitText(pdf, item, width).forEach((line) => {
      pdf.text(line, left, y);
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
  if (template.previewKind === "modern") renderHorizonHeader(writer, sections);
  else if (template.previewKind === "creative") renderElevateHeader(writer, sections);
  else renderHeader(writer, sections);
  renderMainSections(writer, sections);
}

function renderSidebarPdf(pdf, template, sections) {
  drawSidebarBackground(pdf, template);
  renderSidebarContent(pdf, template, sections);
  const writer = new PdfWriter(pdf, template, getSidebarMainBounds(template));
  renderSidebarHeader(writer, sections);
  renderMainSections(writer, sections, { skipSkills: true });
  renderSkills(writer, sections.skillGroups);
}

export async function exportResumePdf(resume, templateId = DEFAULT_TEMPLATE_ID) {
  const template = getTemplate(templateId);
  const sections = getResumeSections(resume);
  const pdf = createPdf(template);

  if (template.pdf.layout === "sidebar") {
    renderSidebarPdf(pdf, template, sections);
  } else {
    renderSingleColumnPdf(pdf, template, sections);
  }

  pdf.save(createFilename(sections.personal.fullName));
}
