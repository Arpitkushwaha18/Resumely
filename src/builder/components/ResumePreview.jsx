const DEFAULT_SUMMARY = "Motivated student seeking opportunities to apply technical knowledge, develop practical skills, and gain professional experience.";

const skillGroups = [
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

function PreviewSection({ title, children }) {
  if (!children) return null;
  return (
    <section className="mt-3.5">
      <h2 className="border-b border-[#9eb3ac] pb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#1e5f4b]">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function hasValues(object) {
  return Object.values(object).some((value) => String(value || "").trim());
}

function formatTechnologies(value) {
  return value.split(/[,•|]/).map((item) => item.trim()).filter(Boolean).join(" • ");
}

function formatDegree(degree) {
  return degree.replace(/\s*\(Bachelor of Technology\)/, "").replace(/\s*\(Master of Technology\)/, "");
}

function categorizeSkills(skills) {
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

export default function ResumePreview({ resume, previewRef }) {
  const { personal, education, projects, skills, certifications, achievements } = resume;
  const activeProjects = projects.filter(hasValues);
  const activeCertifications = certifications.filter(hasValues);
  const activeAchievements = achievements.filter((item) => item.trim());
  const categorizedSkills = categorizeSkills(skills);
  const contactItems = [personal.email, personal.phone, personal.linkedin, personal.github, personal.portfolio, personal.location].filter(Boolean);

  return (
    <article ref={previewRef} className="resume-paper overflow-hidden px-[6.5%] py-[5.8%] font-sans text-[#34433e]">
      <header className="border-b-2 border-[#1e5f4b] pb-3">
        <h1 className="text-xl font-bold uppercase tracking-[0.045em] text-[#173f33] sm:text-2xl">{personal.fullName || "Your Name"}</h1>
        <p className="mt-1 text-[10px] font-bold tracking-[0.09em] text-[#49635a]">{personal.professionalTitle || "Student Professional"}</p>
        {contactItems.length > 0 && <p className="mt-2 text-[8px] leading-[1.65] text-[#64736e]">{contactItems.join("  |  ")}</p>}
      </header>

      <PreviewSection title="Professional Summary">
        <p className="text-[8px] leading-[1.65] text-[#5e6d68]">{resume.summary?.trim() || DEFAULT_SUMMARY}</p>
      </PreviewSection>

      {hasValues(education) && (
        <PreviewSection title="Education">
          <div className="flex justify-between gap-4">
            <div>
              <h3 className="text-[10px] font-bold text-[#2b3e37]">{education.college || "College Name"}</h3>
              <p className="mt-0.5 text-[9px] font-semibold text-[#52635d]">{[formatDegree(education.degree), education.branch].filter(Boolean).join(" - ")}</p>
            </div>
            <div className="shrink-0 text-right text-[8px] font-semibold leading-[1.65] text-[#65756f]">
              {education.currentYear && <p>{education.currentYear}</p>}
              {education.graduationYear && <p>Expected Graduation: {education.graduationYear}</p>}
            </div>
          </div>
        </PreviewSection>
      )}

      {activeProjects.length > 0 && (
        <PreviewSection title="Projects">
          <div className="space-y-3">
            {activeProjects.map((project, index) => (
              <div key={`${project.name}-${index}`}>
                <h3 className="text-[10px] font-bold text-[#2b3e37]">{project.name || "Untitled Project"}</h3>
                {project.technologies && <p className="mt-0.5 text-[8px] leading-[1.5] text-[#52635d]"><b className="text-[#1e5f4b]">Technologies Used:</b> {formatTechnologies(project.technologies)}</p>}
                {project.description && <p className="mt-0.5 text-[8px] leading-[1.6] text-[#687772]"><b className="text-[#52635d]">Description:</b> {project.description}</p>}
              </div>
            ))}
          </div>
        </PreviewSection>
      )}

      {categorizedSkills.length > 0 && (
        <PreviewSection title="Skills">
          <div className="space-y-1">
            {categorizedSkills.map(({ title, skills: items }) => (
              <p key={title} className="text-[8px] leading-[1.55] text-[#62716c]"><b className="text-[#41534d]">{title}:</b> {items.join(", ")}</p>
            ))}
          </div>
        </PreviewSection>
      )}

      {activeCertifications.length > 0 && (
        <PreviewSection title="Certifications">
          <div className="space-y-1.5">
            {activeCertifications.map((certificate, index) => (
              <div key={`${certificate.name}-${index}`} className="flex justify-between gap-4">
                <div>
                  <h3 className="text-[9px] font-bold text-[#344640]">{certificate.name || "Certificate"}</h3>
                  {certificate.organization && <p className="mt-0.5 text-[8px] text-[#687772]">{certificate.organization}</p>}
                </div>
                {certificate.year && <span className="shrink-0 text-[8px] font-semibold text-[#71807b]">{certificate.year}</span>}
              </div>
            ))}
          </div>
        </PreviewSection>
      )}

      {activeAchievements.length > 0 && (
        <PreviewSection title="Achievements">
          <ul className="space-y-1 text-[8px] leading-[1.55] text-[#687772]">
            {activeAchievements.map((achievement, index) => <li key={`${achievement}-${index}`}>• {achievement}</li>)}
          </ul>
        </PreviewSection>
      )}
    </article>
  );
}
