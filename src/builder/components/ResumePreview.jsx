import { getTemplate } from "../templates/templateRegistry.js";
import { formatDegree, formatTechnologies, getResumeSections } from "../templates/templateUtils.js";

function Section({ title, children, accent, minimal = false }) {
  if (!children) return null;
  return (
    <section className={minimal ? "mt-3" : "mt-3.5"}>
      <h2 className={`border-b pb-1 text-[9px] font-bold uppercase ${minimal ? "tracking-[0.12em]" : "tracking-[0.18em]"}`} style={{ borderColor: `${accent}66`, color: accent }}>{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function ModernSection({ title, children, accent }) {
  if (!children) return null;
  return (
    <section className="mt-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
        <h2 className="text-[9px] font-black uppercase tracking-[0.16em]" style={{ color: accent }}>{title}</h2>
      </div>
      <div className="border-l-2 pl-3" style={{ borderColor: `${accent}55` }}>{children}</div>
    </section>
  );
}

function CreativeSection({ title, children, accent }) {
  if (!children) return null;
  return (
    <section className="mt-3 rounded-md bg-[#fbf9fe] px-3 py-2 shadow-[inset_0_0_0_1px_rgba(128,88,168,0.13)]">
      <h2 className="mb-1.5 text-[8px] font-black uppercase tracking-[0.17em]" style={{ color: accent }}>{title}</h2>
      {children}
    </section>
  );
}

function ContactLine({ items, className = "" }) {
  if (items.length === 0) return null;
  return <p className={`text-[8px] leading-[1.65] ${className}`}>{items.join("  |  ")}</p>;
}

function Header({ personal, contactItems, template, centered = false }) {
  return (
    <header className={`${centered ? "text-center" : ""} border-b-2 pb-3`} style={{ borderColor: template.accent }}>
      <h1 className="text-xl font-bold uppercase tracking-[0.045em] sm:text-2xl" style={{ color: template.pdf.ink }}>{personal.fullName || "Your Name"}</h1>
      <p className="mt-1 text-[10px] font-bold tracking-[0.09em]" style={{ color: template.pdf.muted }}>{personal.professionalTitle || "Student Professional"}</p>
      <ContactLine items={contactItems} className="mt-2 text-[#64736e]" />
    </header>
  );
}

function Experience({ experience, accent, minimal = false }) {
  if (experience.length === 0) return null;
  return (
    <Section title="Experience" accent={accent} minimal={minimal}>
      <ExperienceContent experience={experience} accent={accent} />
    </Section>
  );
}

function ExperienceContent({ experience, accent }) {
  if (experience.length === 0) return null;
  return (
    <div className="space-y-3">
      {experience.map((item, index) => {
        const meta = [item.organization, item.type, item.location].filter(Boolean).join(" • ");
        const dates = [item.startDate, item.endDate].filter(Boolean).join(" - ");
        return (
          <div key={`${item.role}-${index}`}>
            <div className="flex justify-between gap-4">
              <div>
                <h3 className="text-[10px] font-bold text-[#2b3e37]">{item.role || "Role"}</h3>
                {meta && <p className="mt-0.5 text-[8px] font-semibold leading-[1.45] text-[#52635d]">{meta}</p>}
              </div>
              {dates && <span className="shrink-0 text-right text-[8px] font-semibold leading-[1.45] text-[#65756f]">{dates}</span>}
            </div>
            {item.description && <p className="mt-0.5 text-[8px] leading-[1.6] text-[#687772]"><b style={{ color: accent }}>Description:</b> {item.description}</p>}
          </div>
        );
      })}
    </div>
  );
}

function Education({ education, accent, minimal = false }) {
  if (education.length === 0) return null;
  return (
    <Section title="Education" accent={accent} minimal={minimal}>
      <EducationContent education={education} />
    </Section>
  );
}

function EducationContent({ education }) {
  if (education.length === 0) return null;
  return (
    <div className="space-y-2.5">
      {education.map((item, index) => {
        const shouldShowLevel = ["Class 10", "Class 12", "Diploma"].includes(item.level);
        const credential = shouldShowLevel
          ? [item.level, formatDegree(item.degree), item.branch].filter(Boolean).join(" ")
          : [formatDegree(item.degree) || item.level, item.branch].filter(Boolean).join(" ");
        const details = [credential, item.score].filter(Boolean).join(" • ");
        return (
          <div key={`${item.institution}-${index}`} className="flex justify-between gap-4">
            <div>
              <h3 className="text-[10px] font-bold text-[#2b3e37]">{item.institution || "Institution Name"}</h3>
              {details && <p className="mt-0.5 text-[9px] font-semibold text-[#52635d]">{details}</p>}
              {item.coursework && <p className="mt-0.5 text-[8px] leading-[1.45] text-[#687772]">Coursework: {item.coursework}</p>}
            </div>
            <div className="shrink-0 text-right text-[8px] font-semibold leading-[1.65] text-[#65756f]">
              {item.currentYear && <p>{item.currentYear}</p>}
              {item.graduationYear && <p>{item.level?.startsWith("Class") ? item.graduationYear : `Graduation Year: ${item.graduationYear}`}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Projects({ projects, accent, minimal = false }) {
  if (projects.length === 0) return null;
  return (
    <Section title="Projects" accent={accent} minimal={minimal}>
      <ProjectsContent projects={projects} accent={accent} />
    </Section>
  );
}

function ProjectsContent({ projects, accent }) {
  if (projects.length === 0) return null;
  return (
    <div className="space-y-3">
      {projects.map((project, index) => (
        <div key={`${project.name}-${index}`}>
          <h3 className="text-[10px] font-bold text-[#2b3e37]">{project.name || "Untitled Project"}</h3>
          {project.technologies && <p className="mt-0.5 text-[8px] leading-[1.5] text-[#52635d]"><b style={{ color: accent }}>Technologies Used:</b> {formatTechnologies(project.technologies)}</p>}
          {project.description && <p className="mt-0.5 text-[8px] leading-[1.6] text-[#687772]"><b className="text-[#52635d]">Description:</b> {project.description}</p>}
        </div>
      ))}
    </div>
  );
}

function Skills({ skillGroups, accent, minimal = false }) {
  if (skillGroups.length === 0) return null;
  return (
    <Section title="Skills" accent={accent} minimal={minimal}>
      <SkillsContent skillGroups={skillGroups} />
    </Section>
  );
}

function SkillsContent({ skillGroups }) {
  if (skillGroups.length === 0) return null;
  return (
    <div className="space-y-1">
      {skillGroups.map(({ title, skills }) => (
        <p key={title} className="text-[8px] leading-[1.55] text-[#62716c]"><b className="text-[#41534d]">{title}:</b> {skills.join(", ")}</p>
      ))}
    </div>
  );
}

function Certifications({ certifications, accent, minimal = false }) {
  if (certifications.length === 0) return null;
  return (
    <Section title="Certifications" accent={accent} minimal={minimal}>
      <CertificationsContent certifications={certifications} />
    </Section>
  );
}

function CertificationsContent({ certifications }) {
  if (certifications.length === 0) return null;
  return (
    <div className="space-y-1.5">
      {certifications.map((certificate, index) => (
        <div key={`${certificate.name}-${index}`} className="flex justify-between gap-4">
          <div>
            <h3 className="text-[9px] font-bold text-[#344640]">{certificate.name || "Certificate"}</h3>
            {certificate.organization && <p className="mt-0.5 text-[8px] text-[#687772]">{certificate.organization}</p>}
          </div>
          {certificate.year && <span className="shrink-0 text-[8px] font-semibold text-[#71807b]">{certificate.year}</span>}
        </div>
      ))}
    </div>
  );
}

function Achievements({ achievements, accent, minimal = false }) {
  if (achievements.length === 0) return null;
  return (
    <Section title="Achievements" accent={accent} minimal={minimal}>
      <AchievementsContent achievements={achievements} />
    </Section>
  );
}

function AchievementsContent({ achievements }) {
  if (achievements.length === 0) return null;
  return (
    <ul className="space-y-1 text-[8px] leading-[1.55] text-[#687772]">
      {achievements.map((achievement, index) => <li key={`${achievement}-${index}`}>• {achievement}</li>)}
    </ul>
  );
}

function MainSections({ sections, template, minimal = false }) {
  return (
    <>
      {sections.summary && <Section title="Professional Summary" accent={template.accent} minimal={minimal}>
        <p className="text-[8px] leading-[1.65] text-[#5e6d68]">{sections.summary}</p>
      </Section>}
      <Experience experience={sections.experience} accent={template.accent} minimal={minimal} />
      <Education education={sections.education} accent={template.accent} minimal={minimal} />
      <Projects projects={sections.projects} accent={template.accent} minimal={minimal} />
      <Skills skillGroups={sections.skillGroups} accent={template.accent} minimal={minimal} />
      <Certifications certifications={sections.certifications} accent={template.accent} minimal={minimal} />
      <Achievements achievements={sections.achievements} accent={template.accent} minimal={minimal} />
    </>
  );
}

function HorizonTemplate({ sections, template }) {
  return (
    <article className={`resume-paper font-sans ${template.paperClassName}`}>
      <header className="rounded-xl px-4 py-3 text-white" style={{ backgroundColor: template.accent }}>
        <h1 className="text-2xl font-black uppercase leading-none tracking-[0.03em] sm:text-3xl">{sections.personal.fullName || "Your Name"}</h1>
        <p className="mt-1.5 text-[10px] font-bold tracking-[0.12em] text-white/90">{sections.personal.professionalTitle || "Student Professional"}</p>
        {sections.contactItems.length > 0 && <p className="mt-2 text-[8px] leading-[1.65] text-white/85">{sections.contactItems.join("  |  ")}</p>}
      </header>
      {sections.summary && <ModernSection title="Professional Summary" accent={template.accent}>
        <p className="text-[8px] leading-[1.7] text-[#5e6d68]">{sections.summary}</p>
      </ModernSection>}
      {sections.experience.length > 0 && <ModernSection title="Experience" accent={template.accent}><ExperienceContent experience={sections.experience} accent={template.accent} /></ModernSection>}
      {sections.education.length > 0 && <ModernSection title="Education" accent={template.accent}><EducationContent education={sections.education} /></ModernSection>}
      {sections.projects.length > 0 && <ModernSection title="Projects" accent={template.accent}><ProjectsContent projects={sections.projects} accent={template.accent} /></ModernSection>}
      {sections.skillGroups.length > 0 && <ModernSection title="Skills" accent={template.accent}><SkillsContent skillGroups={sections.skillGroups} /></ModernSection>}
      {sections.certifications.length > 0 && <ModernSection title="Certifications" accent={template.accent}><CertificationsContent certifications={sections.certifications} /></ModernSection>}
      {sections.achievements.length > 0 && <ModernSection title="Achievements" accent={template.accent}><AchievementsContent achievements={sections.achievements} /></ModernSection>}
    </article>
  );
}

function SwiftTemplate({ sections, template }) {
  return (
    <article className={`resume-paper font-sans ${template.paperClassName}`}>
      <header className="border-b pb-2" style={{ borderColor: template.accent }}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-lg font-black uppercase tracking-[0.025em]" style={{ color: template.pdf.ink }}>{sections.personal.fullName || "Your Name"}</h1>
            <p className="mt-0.5 text-[8px] font-bold tracking-[0.08em]" style={{ color: template.pdf.muted }}>{sections.personal.professionalTitle || "Student Professional"}</p>
          </div>
          <ContactLine items={sections.contactItems} className="max-w-[48%] text-right text-[#64736e]" />
        </div>
      </header>
      <div className="[&_section]:mt-2.5 [&_h2]:text-[8px] [&_p]:leading-[1.48] [&_ul]:leading-[1.48]">
        <MainSections sections={sections} template={template} minimal />
      </div>
    </article>
  );
}

function SingleColumnTemplate({ sections, template, variant = "classic" }) {
  const centered = variant === "minimal";
  const minimal = variant === "minimal";
  const creative = variant === "creative";

  return (
    <article className={`resume-paper font-sans ${template.paperClassName}`}>
      {creative && <div className="-mx-[1.5%] mb-3 rounded-xl px-4 py-3" style={{ backgroundColor: "#f3effb" }}>
        <p className="text-[8px] font-black uppercase tracking-[0.2em]" style={{ color: template.accent }}>Portfolio Resume</p>
      </div>}
      <Header personal={sections.personal} contactItems={sections.contactItems} template={template} centered={centered} />
      <MainSections sections={sections} template={template} minimal={minimal} />
    </article>
  );
}

function SidebarTemplate({ sections, template }) {
  const contactItems = sections.contactItems.length > 0 ? sections.contactItems : ["you@email.com", "+91 98765 43210"];
  return (
    <article className={`resume-paper overflow-hidden font-sans ${template.paperClassName}`}>
      <div className="grid h-full grid-cols-[33%_1fr]">
        <aside className="min-w-0 overflow-hidden px-[10%] py-[15%]" style={{ backgroundColor: template.pdf.sidebarBg }}>
          <h1 className="break-words text-[15px] font-bold uppercase leading-tight tracking-[0.035em]" style={{ color: template.pdf.ink }}>{sections.personal.fullName || "Your Name"}</h1>
          <p className="mt-2 break-words text-[7.5px] font-bold leading-[1.45]" style={{ color: template.accent }}>{sections.personal.professionalTitle || "Student Professional"}</p>
          <div className="mt-5">
            <h2 className="text-[8px] font-bold uppercase tracking-[0.16em]" style={{ color: template.pdf.ink }}>Contact</h2>
            <div className="mt-2 space-y-1.5 text-[6.7px] leading-[1.45] text-[#5f6e78] [overflow-wrap:anywhere]">
              {contactItems.map((item) => <p key={item}>{item}</p>)}
            </div>
          </div>
          {sections.skillGroups.length > 0 && (
            <div className="mt-5">
              <h2 className="text-[8px] font-bold uppercase tracking-[0.16em]" style={{ color: template.pdf.ink }}>Skills</h2>
              <div className="mt-2 space-y-1.5 text-[6.9px] leading-[1.45] text-[#5f6e78] [overflow-wrap:anywhere]">
                {sections.skillGroups.flatMap(({ skills }) => skills).slice(0, 18).map((skill) => <p key={skill}>{skill}</p>)}
              </div>
            </div>
          )}
        </aside>
        <main className="min-w-0 px-[6.5%] py-[6.5%]">
          <MainSections sections={{ ...sections, skillGroups: [] }} template={template} />
        </main>
      </div>
    </article>
  );
}

function ElevateTemplate({ sections, template }) {
  return (
    <article className={`resume-paper font-sans ${template.paperClassName}`}>
      <header className="relative overflow-hidden rounded-xl px-4 py-3" style={{ backgroundColor: "#f3effb" }}>
        <span className="absolute right-4 top-4 h-10 w-10 rounded-full border-[7px]" style={{ borderColor: `${template.accent}33` }} />
        <h1 className="relative text-2xl font-black uppercase leading-none tracking-[0.02em]" style={{ color: template.pdf.ink }}>{sections.personal.fullName || "Your Name"}</h1>
        <p className="relative mt-1.5 text-[10px] font-bold tracking-[0.12em]" style={{ color: template.accent }}>{sections.personal.professionalTitle || "Student Professional"}</p>
        {sections.contactItems.length > 0 && <p className="relative mt-2 text-[8px] leading-[1.65] text-[#686276]">{sections.contactItems.join("  |  ")}</p>}
      </header>
      {sections.summary && <CreativeSection title="Professional Summary" accent={template.accent}><p className="text-[8px] leading-[1.65] text-[#625d6c]">{sections.summary}</p></CreativeSection>}
      {sections.experience.length > 0 && <CreativeSection title="Experience" accent={template.accent}><ExperienceContent experience={sections.experience} accent={template.accent} /></CreativeSection>}
      {sections.education.length > 0 && <CreativeSection title="Education" accent={template.accent}><EducationContent education={sections.education} /></CreativeSection>}
      {sections.projects.length > 0 && <CreativeSection title="Projects" accent={template.accent}><ProjectsContent projects={sections.projects} accent={template.accent} /></CreativeSection>}
      {sections.skillGroups.length > 0 && <CreativeSection title="Skills" accent={template.accent}><SkillsContent skillGroups={sections.skillGroups} /></CreativeSection>}
      {sections.certifications.length > 0 && <CreativeSection title="Certifications" accent={template.accent}><CertificationsContent certifications={sections.certifications} /></CreativeSection>}
      {sections.achievements.length > 0 && <CreativeSection title="Achievements" accent={template.accent}><AchievementsContent achievements={sections.achievements} /></CreativeSection>}
    </article>
  );
}

const renderers = {
  classic: (props) => <SingleColumnTemplate {...props} variant="classic" />,
  modern: (props) => <HorizonTemplate {...props} />,
  minimal: (props) => <SwiftTemplate {...props} />,
  creative: (props) => <ElevateTemplate {...props} />,
  sidebar: (props) => <SidebarTemplate {...props} />,
};

export default function ResumePreview({ resume, templateId = "launchpad", previewRef }) {
  const template = getTemplate(templateId);
  const sections = getResumeSections(resume);
  const renderTemplate = renderers[template.previewKind] || renderers.classic;

  return <div ref={previewRef}>{renderTemplate({ sections, template })}</div>;
}
