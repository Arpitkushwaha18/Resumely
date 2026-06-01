export const DEFAULT_TEMPLATE_ID = "launchpad";

const legacyTemplateAliases = {
  ats: "launchpad",
  modern: "horizon",
  minimal: "swift",
  sidebar: "nexus",
  creative: "elevate",
};

export const resumeTemplates = [
  {
    id: "launchpad",
    name: "LaunchPad",
    tag: "Best for Internships",
    description: "Clean and recruiter-friendly",
    previewKind: "classic",
    accent: "#1e5f4b",
    paperClassName: "px-[6.5%] py-[5.8%] text-[#34433e]",
    pdf: {
      layout: "single",
      accent: "#1e5f4b",
      ink: "#173f33",
      muted: "#64736e",
      soft: "#687772",
      rule: "#9eb3ac",
      marginX: 17,
      marginTop: 16,
      marginBottom: 16,
      titleSize: 19,
      bodySize: 8,
    },
  },
  {
    id: "horizon",
    name: "Horizon",
    tag: "Most Popular",
    description: "Modern and professional",
    previewKind: "modern",
    accent: "#256f8f",
    paperClassName: "px-[6%] py-[5.5%] text-[#39423f]",
    pdf: {
      layout: "single",
      accent: "#256f8f",
      ink: "#1e3e4b",
      muted: "#5b737c",
      soft: "#63747a",
      rule: "#8fb9c8",
      marginX: 16,
      marginTop: 15,
      marginBottom: 15,
      titleSize: 21,
      bodySize: 8.2,
    },
  },
  {
    id: "swift",
    name: "Swift",
    tag: "Fits More Content",
    description: "Ideal for multiple projects",
    previewKind: "minimal",
    accent: "#3c4a45",
    paperClassName: "px-[5.8%] py-[4.8%] text-[#303a36]",
    pdf: {
      layout: "single",
      accent: "#333f3b",
      ink: "#202a26",
      muted: "#626d68",
      soft: "#59635f",
      rule: "#c9d2ce",
      marginX: 14,
      marginTop: 13,
      marginBottom: 13,
      titleSize: 17,
      bodySize: 7.5,
    },
  },
  {
    id: "nexus",
    name: "Nexus",
    tag: "Professional Layout",
    description: "Highlight skills and contact details",
    previewKind: "sidebar",
    accent: "#2d5f73",
    paperClassName: "p-0 text-[#34433e]",
    pdf: {
      layout: "sidebar",
      accent: "#2d5f73",
      ink: "#1c3440",
      muted: "#5b6c73",
      soft: "#5e6f76",
      rule: "#91acb7",
      sidebarBg: "#eaf2f4",
      sidebarWidth: 62,
      marginX: 15,
      marginTop: 15,
      marginBottom: 15,
      titleSize: 18,
      bodySize: 7.9,
    },
  },
  {
    id: "elevate",
    name: "Elevate",
    tag: "Stand Out",
    description: "Modern design with personality",
    previewKind: "creative",
    accent: "#8058a8",
    paperClassName: "px-[6.3%] py-[5.7%] text-[#393744]",
    pdf: {
      layout: "single",
      accent: "#8058a8",
      ink: "#302b45",
      muted: "#686276",
      soft: "#625d6c",
      rule: "#c3b5df",
      marginX: 16,
      marginTop: 15,
      marginBottom: 15,
      titleSize: 20,
      bodySize: 8,
    },
  },
];

export const templateIds = resumeTemplates.map((template) => template.id);
export const templateById = Object.fromEntries(resumeTemplates.map((template) => [template.id, template]));

export function normalizeTemplateId(templateId) {
  return legacyTemplateAliases[templateId] || templateId;
}

export function isValidTemplateId(templateId) {
  return templateIds.includes(normalizeTemplateId(templateId));
}

export function getTemplate(templateId) {
  return templateById[normalizeTemplateId(templateId)] || templateById[DEFAULT_TEMPLATE_ID];
}
