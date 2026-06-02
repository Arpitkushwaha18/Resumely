export const DEFAULT_SUMMARY = "Motivated student seeking opportunities to apply technical knowledge, develop practical skills, and gain professional experience.";

export const skillGroups = [
  {
    title: "Programming Languages",
    terms: ["C", "C++", "Python", "Java", "JavaScript", "TypeScript", "Kotlin", "Swift", "Dart", "Go (Golang)", "Rust", "PHP", "Ruby", "R", "MATLAB", "Scala", "Perl", "SQL", "PL/SQL"],
  },
  {
    title: "Frontend",
    terms: ["HTML5", "CSS3", "JavaScript (ES6+)", "React.js", "Next.js", "Vue.js", "Nuxt.js", "Angular", "Svelte", "Bootstrap", "Tailwind CSS", "Material UI", "SASS / SCSS", "jQuery", "Responsive Web Design"],
  },
  {
    title: "Backend",
    terms: ["Node.js", "Express.js", "Django", "Flask", "FastAPI", "Spring Boot", "Laravel", "Ruby on Rails", "ASP.NET Core", "NestJS", "GraphQL", "REST API Development", "Microservices Architecture", "gRPC", "WebSockets"],
  },
  {
    title: "Database",
    terms: ["MySQL", "PostgreSQL", "MongoDB", "SQLite", "Oracle Database", "Microsoft SQL Server", "Redis", "Cassandra", "Firebase Realtime Database", "Firestore", "DynamoDB", "Elasticsearch", "Neo4j", "Supabase"],
  },
  {
    title: "Tools",
    terms: ["Git", "GitHub", "GitLab", "Bitbucket", "Postman", "VS Code", "IntelliJ IDEA", "Eclipse", "Android Studio", "Xcode", "Figma", "Docker", "Vite", "Webpack", "Jira", "Notion", "Trello"],
  },
  {
    title: "Soft Skills",
    terms: ["Communication Skills", "Teamwork and Collaboration", "Problem Solving", "Critical Thinking", "Time Management", "Leadership", "Adaptability", "Attention to Detail", "Project Management", "Presentation Skills", "Research Skills", "Creativity and Innovation", "Public Speaking", "Work Ethic"],
  },
];

export function hasValues(object) {
  return Object.values(object || {}).some((value) => String(value || "").trim());
}

export function normalizeEducationEntries(education) {
  if (Array.isArray(education)) return education;
  if (!education || !hasValues(education)) return [];
  return [{
    institution: education.institution || education.college || "",
    level: education.level || "",
    degree: education.degree || "",
    branch: education.branch || "",
    currentYear: education.currentYear || "",
    graduationYear: education.graduationYear || "",
    score: education.score || "",
    coursework: education.coursework || "",
  }];
}

export function normalizeExperienceEntries(experience) {
  return Array.isArray(experience) ? experience : [];
}

export function formatTechnologies(value = "") {
  return value.split(/[,•|·]/).map((item) => item.trim()).filter(Boolean).join(" · ");
}

export function formatDegree(degree = "") {
  return degree.replace(/\s*\(Bachelor of Technology\)/, "").replace(/\s*\(Master of Technology\)/, "");
}

export function categorizeSkills(skills = []) {
  const categorized = new Map(skillGroups.map(({ title }) => [title, []]));
  const other = [];

  skills.forEach((skill) => {
    const group = skillGroups.find(({ terms }) => terms.includes(skill));
    if (group) categorized.get(group.title).push(skill);
    else other.push(skill);
  });

  const groups = skillGroups
    .map(({ title }) => ({ title, skills: categorized.get(title) }))
    .filter(({ skills: items }) => items.length > 0);

  if (other.length > 0) groups.push({ title: "Other Skills", skills: other });
  return groups;
}

export function normalizeResume(resume = {}) {
  return {
    personal: resume.personal || {},
    education: normalizeEducationEntries(resume.education),
    experience: normalizeExperienceEntries(resume.experience),
    projects: Array.isArray(resume.projects) ? resume.projects : [],
    skills: Array.isArray(resume.skills) ? resume.skills : [],
    certifications: Array.isArray(resume.certifications) ? resume.certifications : [],
    achievements: Array.isArray(resume.achievements) ? resume.achievements : [],
    summary: resume.summary || "",
  };
}

export function getResumeSections(resume) {
  const normalized = normalizeResume(resume);
  const { personal, education, experience, projects, skills, certifications, achievements, summary } = normalized;

  return {
    personal,
    education: education.filter(hasValues),
    experience: experience.filter(hasValues),
    summary: summary.trim(),
    projects: projects.filter(hasValues),
    skillGroups: categorizeSkills(skills),
    certifications: certifications.filter(hasValues),
    achievements: achievements.filter((item) => item.trim()),
    contactItems: [personal.email, personal.phone, personal.linkedin, personal.github, personal.portfolio, personal.location].filter(Boolean),
  };
}
