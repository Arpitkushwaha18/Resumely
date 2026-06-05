import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Download, Eye, FileText, LoaderCircle, Plus, RotateCcw, Sparkles, Trash2, X } from "lucide-react";
import { branches } from "../data/branches.js";
import { cities } from "../data/cities.js";
import { colleges } from "../data/colleges.js";
import { degrees } from "../data/degrees.js";
import { skills as skillSuggestions } from "../data/skills.js";
import AutocompleteInput from "./components/AutocompleteInput.jsx";
import ResumePreview from "./components/ResumePreview.jsx";
import SectionCard from "./components/SectionCard.jsx";
import SkillTag from "./components/SkillTag.jsx";
import { getSampleResumeData, sampleResumeDataByTemplate } from "./templates/sampleResumeData.js";
import { DEFAULT_TEMPLATE_ID, getTemplate, isValidTemplateId, normalizeTemplateId, resumeTemplates } from "./templates/templateRegistry.js";
import { normalizeEducationEntries, normalizeExperienceEntries } from "./templates/templateUtils.js";
import { enhanceResumeText } from "./utils/aiEnhance.js";

const STORAGE_KEY = "resumely-builder-draft";
const TEMPLATE_STORAGE_KEY = "resumely-builder-template";
const emptyProject = () => ({ name: "", technologies: "", description: "" });
const emptyCertificate = () => ({ name: "", organization: "", year: "" });
const emptyEducation = () => ({ institution: "", level: "", degree: "", branch: "", currentYear: "", graduationYear: "", score: "", coursework: "" });
const emptyExperience = () => ({ role: "", organization: "", type: "", location: "", startDate: "", endDate: "", description: "" });

const emptyResume = () => ({
  personal: { fullName: "", professionalTitle: "", email: "", phone: "", linkedin: "", github: "", portfolio: "", location: "" },
  summary: "",
  experience: [],
  education: [emptyEducation()],
  projects: [emptyProject()],
  skills: [],
  certifications: [emptyCertificate()],
  achievements: [""],
});

const popularSkills = ["JavaScript", "Python", "Java", "React.js", "SQL", "Git", "Communication Skills", "Problem Solving"].filter((skill) => skillSuggestions.includes(skill));
const currentYears = ["First Year", "Second Year", "Third Year", "Final Year", "Graduated"];
const educationLevels = ["Class 10", "Class 12", "Diploma", "Undergraduate", "Postgraduate", "Doctorate"];
const experienceTypes = ["Internship", "Part-Time", "Full-Time", "Volunteer"];
const graduationYears = Array.from({ length: 19 }, (_, index) => String(new Date().getFullYear() - 8 + index));

function getInitialTemplateId() {
  const urlTemplate = new URLSearchParams(window.location.search).get("template");
  if (isValidTemplateId(urlTemplate)) return normalizeTemplateId(urlTemplate);

  const savedTemplate = localStorage.getItem(TEMPLATE_STORAGE_KEY);
  if (isValidTemplateId(savedTemplate)) return normalizeTemplateId(savedTemplate);

  return DEFAULT_TEMPLATE_ID;
}

const sampleResumeNames = new Set(Object.values(sampleResumeDataByTemplate).map((sample) => sample.personal.fullName));

function hasFilledObject(object = {}) {
  return Object.values(object).some((value) => String(value || "").trim());
}

function hasResumeContent(resume = {}) {
  return Boolean(
    hasFilledObject(resume.personal)
    || String(resume.summary || "").trim()
    || (resume.skills || []).length > 0
    || (resume.experience || []).some(hasFilledObject)
    || (resume.education || []).some(hasFilledObject)
    || (resume.projects || []).some(hasFilledObject)
    || (resume.certifications || []).some(hasFilledObject)
    || (resume.achievements || []).some((item) => String(item || "").trim()),
  );
}

function isTemplateSampleResume(resume = {}) {
  return sampleResumeNames.has(resume.personal?.fullName || "");
}

function shouldReplaceWithTemplateSample(resume) {
  return !hasResumeContent(resume) || isTemplateSampleResume(resume);
}

function TextInput({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-blue-100/85">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/55 px-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-blue-300/40 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15" />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 3, maxLength, showCount = false }) {
  return (
    <label className="block">
      {label && <span className="mb-2 block text-xs font-bold text-blue-100/85">{label}</span>}
      <textarea rows={rows} value={value} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/55 px-3.5 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 hover:border-blue-300/40 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15" />
      {showCount && <span className="mt-1.5 block text-right text-[11px] font-medium text-blue-100/55">{value.length} / {maxLength}</span>}
    </label>
  );
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-blue-100/85">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/55 px-3.5 text-sm text-white outline-none transition hover:border-blue-300/40 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15">
        <option value="">Select</option>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function AddButton({ children, onClick }) {
  return <button type="button" onClick={onClick} className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-blue-300/25 bg-blue-500/15 px-3 py-2 text-xs font-bold text-blue-100 transition hover:bg-blue-500/25 active:scale-[0.98]"><Plus size={14} />{children}</button>;
}

function DeleteButton({ label, onClick }) {
  return <button type="button" onClick={onClick} aria-label={label} className="grid h-9 w-9 place-items-center rounded-lg text-rose-300 transition hover:bg-rose-500/15 active:scale-95"><Trash2 size={16} /></button>;
}

function EnhanceButton({ onClick, loading, disabled, label = "Enhance" }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled || loading} className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-violet-300/25 bg-violet-500/15 px-3 py-2 text-xs font-bold text-violet-100 transition hover:bg-violet-500/25 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60">
      {loading ? <LoaderCircle size={14} className="animate-spin" /> : <Sparkles size={14} />}
      <span>{loading ? "Enhancing..." : label}</span>
    </button>
  );
}

function AiError({ message }) {
  if (!message) return null;
  return <p className="mt-2 rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-100">{message}</p>;
}

function TemplateSelect({ value, onChange }) {
  return (
    <label className="flex min-h-9 items-center gap-2 rounded-full border border-white/10 bg-slate-950/55 px-3 py-2 text-xs font-bold text-blue-100 shadow-sm">
      <span className="hidden sm:inline">Template</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="bg-slate-950 text-xs font-bold text-blue-100 outline-none">
        {resumeTemplates.map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}
      </select>
    </label>
  );
}

function BuilderApp() {
  const [resume, setResume] = useState(() => {
    const initialTemplateId = getInitialTemplateId();
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved) return getSampleResumeData(initialTemplateId);
      const fallback = emptyResume();
      const hydratedResume = {
        ...fallback,
        ...saved,
        personal: { ...fallback.personal, ...saved.personal },
        experience: normalizeExperienceEntries(saved.experience),
        education: normalizeEducationEntries(saved.education).length > 0 ? normalizeEducationEntries(saved.education) : fallback.education,
      };
      const urlTemplate = new URLSearchParams(window.location.search).get("template");
      if (isValidTemplateId(urlTemplate) && shouldReplaceWithTemplateSample(hydratedResume)) {
        return getSampleResumeData(initialTemplateId);
      }
      return hydratedResume;
    } catch {
      return getSampleResumeData(initialTemplateId);
    }
  });
  const [skillDraft, setSkillDraft] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saveState, setSaveState] = useState("Saved locally");
  const [pdfState, setPdfState] = useState("idle");
  const [pdfMessage, setPdfMessage] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState(getInitialTemplateId);
  const [aiStatus, setAiStatus] = useState({ summary: { loading: false, error: "" }, experiences: {}, projects: {}, achievements: {} });

  const selectedTemplate = getTemplate(selectedTemplateId);

  const handleTemplateChange = (templateId) => {
    setSelectedTemplateId(templateId);
    setResume((current) => shouldReplaceWithTemplateSample(current) ? getSampleResumeData(templateId) : current);
  };

  useEffect(() => {
    setSaveState("Saving...");
    const timer = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
      setSaveState("Saved locally");
    }, 300);
    return () => window.clearTimeout(timer);
  }, [resume]);

  useEffect(() => {
    localStorage.setItem(TEMPLATE_STORAGE_KEY, selectedTemplateId);
    const url = new URL(window.location.href);
    url.searchParams.set("template", selectedTemplateId);
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, [selectedTemplateId]);

  const updatePersonal = (field, value) => setResume((current) => ({ ...current, personal: { ...current.personal, [field]: value } }));
  const updateSummary = (value) => setResume((current) => ({ ...current, summary: value }));
  const updateEducation = (index, field, value) => setResume((current) => ({ ...current, education: current.education.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) }));
  const updateExperience = (index, field, value) => setResume((current) => ({ ...current, experience: current.experience.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) }));
  const updateProject = (index, field, value) => setResume((current) => ({ ...current, projects: current.projects.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) }));
  const updateCertificate = (index, field, value) => setResume((current) => ({ ...current, certifications: current.certifications.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) }));
  const updateAchievement = (index, value) => setResume((current) => ({ ...current, achievements: current.achievements.map((item, itemIndex) => itemIndex === index ? value : item) }));

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (!trimmed || resume.skills.some((item) => item.toLowerCase() === trimmed.toLowerCase())) return;
    setResume((current) => ({ ...current, skills: [...current.skills, trimmed] }));
    setSkillDraft("");
  };

  const availablePopularSkills = useMemo(() => popularSkills.filter((skill) => !resume.skills.includes(skill)), [resume.skills]);
  const pdfButtonText = pdfState === "generating" ? "Generating PDF..." : pdfState === "success" ? "Downloaded Successfully" : "Download PDF";

  const updateAiStatus = (type, key, nextStatus) => {
    if (type === "summary") {
      setAiStatus((current) => ({ ...current, summary: { ...current.summary, ...nextStatus } }));
      return;
    }

    setAiStatus((current) => ({
      ...current,
      [type]: {
        ...current[type],
        [key]: { ...(current[type][key] || { loading: false, error: "" }), ...nextStatus },
      },
    }));
  };

  const handleEnhanceSummary = async () => {
    updateAiStatus("summary", null, { loading: true, error: "" });
    try {
      const enhancedText = await enhanceResumeText("/api/ai/enhance-summary", { summary: resume.summary });
      updateSummary(enhancedText);
      updateAiStatus("summary", null, { loading: false, error: "" });
    } catch {
      updateAiStatus("summary", null, { loading: false, error: "We could not enhance your summary right now. Please try again." });
    }
  };

  const handleEnhanceProject = async (index) => {
    const project = resume.projects[index];
    updateAiStatus("projects", index, { loading: true, error: "" });
    try {
      const enhancedText = await enhanceResumeText("/api/ai/enhance-project", {
        name: project.name,
        technologies: project.technologies,
        description: project.description,
      });
      updateProject(index, "description", enhancedText);
      updateAiStatus("projects", index, { loading: false, error: "" });
    } catch {
      updateAiStatus("projects", index, { loading: false, error: "We could not enhance this project right now. Please try again." });
    }
  };

  const handleEnhanceExperience = async (index) => {
    const experience = resume.experience[index];
    updateAiStatus("experiences", index, { loading: true, error: "" });
    try {
      const enhancedText = await enhanceResumeText("/api/ai/enhance-experience", {
        role: experience.role,
        organization: experience.organization,
        type: experience.type,
        location: experience.location,
        startDate: experience.startDate,
        endDate: experience.endDate,
        description: experience.description,
      });
      updateExperience(index, "description", enhancedText);
      updateAiStatus("experiences", index, { loading: false, error: "" });
    } catch {
      updateAiStatus("experiences", index, { loading: false, error: "We could not enhance this experience right now. Please try again." });
    }
  };

  const handleEnhanceAchievement = async (index) => {
    updateAiStatus("achievements", index, { loading: true, error: "" });
    try {
      const enhancedText = await enhanceResumeText("/api/ai/enhance-achievement", { achievement: resume.achievements[index] });
      updateAchievement(index, enhancedText);
      updateAiStatus("achievements", index, { loading: false, error: "" });
    } catch {
      updateAiStatus("achievements", index, { loading: false, error: "We could not enhance this achievement right now. Please try again." });
    }
  };

  const handleDownloadPdf = async () => {
    setPdfState("generating");
    setPdfMessage("");
    try {
      const { exportResumePdf } = await import("./utils/exportResumePdf.js");
      await exportResumePdf(resume, selectedTemplateId);
      setPdfState("success");
      window.setTimeout(() => setPdfState("idle"), 2500);
    } catch {
      setPdfState("error");
      setPdfMessage("We could not generate your PDF. Please try again.");
      window.setTimeout(() => setPdfState("idle"), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.20),transparent_32%),linear-gradient(180deg,#020617_0%,#0f172a_55%,#111827_100%)] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-3 lg:justify-start">
            <div className="flex min-w-0 items-center gap-3">
              <a href="/" aria-label="Back to landing page" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/10 text-blue-100 shadow-sm transition hover:border-blue-300/40 hover:text-white"><ArrowLeft size={17} /></a>
              <a href="/" className="flex shrink-0 items-center gap-2 font-bold tracking-[-0.04em] text-white">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-mint-600 text-white shadow-[0_8px_18px_rgba(37,99,235,0.35)]"><FileText size={18} /></span>
                <span className="hidden text-lg sm:inline">resumely<span className="text-mint-600">.</span></span>
              </a>
              <span className="hidden h-6 w-px bg-white/10 sm:block" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">Resume Builder</p>
                <p className="text-[11px] font-medium text-blue-100/60">{saveState}</p>
              </div>
            </div>
            <button type="button" disabled={pdfState === "generating"} onClick={handleDownloadPdf} aria-label="Download PDF" title="Download PDF" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mint-600 text-white shadow-sm transition hover:bg-mint-700 disabled:cursor-wait disabled:opacity-70 lg:hidden"><Download size={15} /></button>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-1.5 lg:justify-end">
            <TemplateSelect value={selectedTemplateId} onChange={handleTemplateChange} />
            <div className="ml-auto flex items-center gap-2">
              <button type="button" onClick={() => setResume(getSampleResumeData(selectedTemplateId))} className="min-h-9 rounded-full border border-white/10 bg-slate-950/55 px-3 text-xs font-bold text-blue-100 shadow-sm transition hover:border-blue-300/40 hover:text-white sm:px-4">Load Sample</button>
              <button type="button" onClick={() => setResume(emptyResume())} aria-label="Clear Resume" title="Clear Resume" className="grid h-9 w-9 place-items-center rounded-full text-rose-300 transition hover:bg-rose-500/15"><RotateCcw size={14} /></button>
              <button type="button" disabled={pdfState === "generating"} onClick={handleDownloadPdf} aria-label="Download PDF" title="Download PDF" className="hidden min-h-9 items-center gap-1.5 rounded-full bg-mint-600 px-3 text-xs font-bold text-white shadow-sm transition hover:bg-mint-700 disabled:cursor-wait disabled:opacity-70 sm:px-4 lg:inline-flex"><Download size={14} /><span>{pdfButtonText}</span></button>
            </div>
          </div>
        </div>
        {pdfMessage && <p className="border-t border-rose-500/20 bg-rose-950/50 px-4 py-2 text-center text-xs font-semibold text-rose-200">{pdfMessage}</p>}
      </header>

      <main className="builder-shell mx-auto grid max-w-[1500px] gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.88fr)]">
        <div className="space-y-5">
          <SectionCard title="Personal Information" description="Add the details recruiters can use to contact you.">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput label="Full Name" value={resume.personal.fullName} onChange={(value) => updatePersonal("fullName", value)} placeholder="Your Name" />
              <TextInput label="Professional Title" value={resume.personal.professionalTitle} onChange={(value) => updatePersonal("professionalTitle", value)} placeholder="Computer Science Engineering Student" />
              <TextInput label="Email" value={resume.personal.email} onChange={(value) => updatePersonal("email", value)} placeholder="you@email.com" type="email" />
              <TextInput label="Phone" value={resume.personal.phone} onChange={(value) => updatePersonal("phone", value)} placeholder="+91 98765 43210" />
              <AutocompleteInput label="Location" value={resume.personal.location} onChange={(value) => updatePersonal("location", value)} suggestions={cities} placeholder="Start typing a city" />
              <TextInput label="LinkedIn" value={resume.personal.linkedin} onChange={(value) => updatePersonal("linkedin", value)} placeholder="linkedin.com/in/yourname" />
              <TextInput label="GitHub" value={resume.personal.github} onChange={(value) => updatePersonal("github", value)} placeholder="github.com/yourname" />
              <div className="sm:col-span-2"><TextInput label="Portfolio" value={resume.personal.portfolio} onChange={(value) => updatePersonal("portfolio", value)} placeholder="yourportfolio.dev" /></div>
            </div>
          </SectionCard>

          <SectionCard title="Professional Summary" description="Introduce yourself professionally and highlight the opportunities you are seeking." action={<EnhanceButton onClick={handleEnhanceSummary} loading={aiStatus.summary.loading} disabled={!resume.summary.trim()} />}>
            <TextArea
              value={resume.summary || ""}
              onChange={updateSummary}
              placeholder="Computer Science Engineering student passionate about web development, problem solving, and software development. Seeking internship opportunities to apply technical skills, gain industry experience, and contribute to meaningful projects."
              rows={4}
              maxLength={500}
              showCount
            />
            <AiError message={aiStatus.summary.error} />
          </SectionCard>

          <SectionCard title="Experience" description="Optional. Add internships, jobs, part-time work, or volunteering." action={<AddButton onClick={() => setResume((current) => ({ ...current, experience: [...current.experience, emptyExperience()] }))}>Add Experience</AddButton>}>
            {resume.experience.length === 0 ? (
              <p className="rounded-xl border border-dashed border-white/15 bg-slate-950/35 px-4 py-3 text-xs font-medium text-blue-100/65">No experience added yet.</p>
            ) : (
              <div className="space-y-4">
                {resume.experience.map((experience, index) => (
                  <div key={index} className="rounded-xl border border-white/10 bg-slate-950/35 p-4">
                    <div className="mb-3 flex items-center justify-between"><p className="text-xs font-bold text-blue-100/60">Experience {index + 1}</p><DeleteButton label={`Delete experience ${index + 1}`} onClick={() => setResume((current) => ({ ...current, experience: current.experience.filter((_, itemIndex) => itemIndex !== index) }))} /></div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <TextInput label="Role" value={experience.role} onChange={(value) => updateExperience(index, "role", value)} placeholder="Frontend Developer Intern" />
                      <TextInput label="Organization" value={experience.organization} onChange={(value) => updateExperience(index, "organization", value)} placeholder="TechNova Labs" />
                      <SelectInput label="Type" value={experience.type} onChange={(value) => updateExperience(index, "type", value)} options={experienceTypes} />
                      <AutocompleteInput label="Location" value={experience.location} onChange={(value) => updateExperience(index, "location", value)} suggestions={cities} placeholder="Remote or city" />
                      <TextInput label="Start Date" value={experience.startDate} onChange={(value) => updateExperience(index, "startDate", value)} placeholder="May 2025" />
                      <TextInput label="End Date" value={experience.endDate} onChange={(value) => updateExperience(index, "endDate", value)} placeholder="Jul 2025 or Present" />
                      <div className="sm:col-span-2">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="block text-xs font-bold text-blue-100/85">Description</span>
                          <EnhanceButton onClick={() => handleEnhanceExperience(index)} loading={aiStatus.experiences[index]?.loading} disabled={!experience.description.trim()} />
                        </div>
                        <TextArea value={experience.description} onChange={(value) => updateExperience(index, "description", value)} placeholder="Describe your responsibilities, tools used, and impact." />
                        <AiError message={aiStatus.experiences[index]?.error} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Education" description="Add school, diploma, undergraduate, or postgraduate education." action={<AddButton onClick={() => setResume((current) => ({ ...current, education: [...current.education, emptyEducation()] }))}>Add Education</AddButton>}>
            <div className="space-y-4">
              {resume.education.map((education, index) => (
                <div key={index} className="rounded-xl border border-white/10 bg-slate-950/35 p-4">
                  <div className="mb-3 flex items-center justify-between"><p className="text-xs font-bold text-blue-100/60">Education {index + 1}</p>{resume.education.length > 1 && <DeleteButton label={`Delete education ${index + 1}`} onClick={() => setResume((current) => ({ ...current, education: current.education.filter((_, itemIndex) => itemIndex !== index) }))} />}</div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2"><AutocompleteInput label="Institution Name" value={education.institution} onChange={(value) => updateEducation(index, "institution", value)} suggestions={colleges} placeholder="Start typing institution name" /></div>
                    <SelectInput label="Education Level" value={education.level} onChange={(value) => updateEducation(index, "level", value)} options={educationLevels} />
                    <AutocompleteInput label="Degree" value={education.degree} onChange={(value) => updateEducation(index, "degree", value)} suggestions={degrees} placeholder="B.Tech" />
                    <AutocompleteInput label="Branch / Specialization" value={education.branch} onChange={(value) => updateEducation(index, "branch", value)} suggestions={branches} placeholder="Computer Science" />
                    <SelectInput label="Current Year" value={education.currentYear} onChange={(value) => updateEducation(index, "currentYear", value)} options={currentYears} />
                    <SelectInput label="Graduation Year" value={education.graduationYear} onChange={(value) => updateEducation(index, "graduationYear", value)} options={graduationYears} />
                    <TextInput label="Percentage / CGPA" value={education.score} onChange={(value) => updateEducation(index, "score", value)} placeholder="8.4 CGPA or 91%" />
                    <div className="sm:col-span-2"><TextArea label="Relevant Coursework" value={education.coursework} onChange={(value) => updateEducation(index, "coursework", value)} placeholder="Data Structures, DBMS, Operating Systems" rows={2} /></div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Projects" description="Add the projects that best show your practical skills." action={<AddButton onClick={() => setResume((current) => ({ ...current, projects: [...current.projects, emptyProject()] }))}>Add Project</AddButton>}>
            <div className="space-y-4">
              {resume.projects.map((project, index) => (
                <div key={index} className="rounded-xl border border-white/10 bg-slate-950/35 p-4">
                  <div className="mb-3 flex items-center justify-between"><p className="text-xs font-bold text-blue-100/60">Project {index + 1}</p>{resume.projects.length > 1 && <DeleteButton label={`Delete project ${index + 1}`} onClick={() => setResume((current) => ({ ...current, projects: current.projects.filter((_, itemIndex) => itemIndex !== index) }))} />}</div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextInput label="Project Name" value={project.name} onChange={(value) => updateProject(index, "name", value)} placeholder="Campus Placement Portal" />
                    <TextInput label="Technologies" value={project.technologies} onChange={(value) => updateProject(index, "technologies", value)} placeholder="React, Node.js, MongoDB" />
                    <div className="sm:col-span-2">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="block text-xs font-bold text-blue-100/85">Description</span>
                        <EnhanceButton onClick={() => handleEnhanceProject(index)} loading={aiStatus.projects[index]?.loading} disabled={!project.description.trim()} />
                      </div>
                      <TextArea value={project.description} onChange={(value) => updateProject(index, "description", value)} placeholder="Explain what you built and the result." />
                      <AiError message={aiStatus.projects[index]?.error} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Skills" description="Choose suggestions or add any custom skill.">
            <div className="flex gap-2">
              <div className="min-w-0 flex-1"><AutocompleteInput value={skillDraft} onChange={setSkillDraft} onSelect={addSkill} onEnter={addSkill} suggestions={skillSuggestions} placeholder="Type a skill and press Enter" /></div>
              <button type="button" onClick={() => addSkill(skillDraft)} className="h-11 shrink-0 rounded-xl bg-mint-600 px-4 text-xs font-bold text-white shadow-sm transition hover:bg-mint-700">Add Skill</button>
            </div>
            {resume.skills.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{resume.skills.map((skill) => <SkillTag key={skill} skill={skill} onRemove={() => setResume((current) => ({ ...current, skills: current.skills.filter((item) => item !== skill) }))} />)}</div>}
            {availablePopularSkills.length > 0 && <div className="mt-5 border-t border-white/10 pt-4"><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-blue-100/50">Popular skills</p><div className="flex flex-wrap gap-2">{availablePopularSkills.map((skill) => <button type="button" key={skill} onClick={() => addSkill(skill)} className="rounded-full border border-white/10 bg-slate-950/45 px-3 py-1.5 text-xs font-semibold text-blue-100/75 transition hover:border-blue-300/40 hover:text-white">+ {skill}</button>)}</div></div>}
          </SectionCard>

          <SectionCard title="Certifications" action={<AddButton onClick={() => setResume((current) => ({ ...current, certifications: [...current.certifications, emptyCertificate()] }))}>Add Certificate</AddButton>}>
            <div className="space-y-4">
              {resume.certifications.map((certificate, index) => (
                <div key={index} className="grid gap-4 rounded-xl border border-white/10 bg-slate-950/35 p-4 sm:grid-cols-[1fr_1fr_100px_auto] sm:items-end">
                  <TextInput label="Certificate Name" value={certificate.name} onChange={(value) => updateCertificate(index, "name", value)} placeholder="Web Development Bootcamp" />
                  <TextInput label="Organization" value={certificate.organization} onChange={(value) => updateCertificate(index, "organization", value)} placeholder="Organization" />
                  <TextInput label="Year" value={certificate.year} onChange={(value) => updateCertificate(index, "year", value)} placeholder="2025" />
                  {resume.certifications.length > 1 && <DeleteButton label={`Delete certificate ${index + 1}`} onClick={() => setResume((current) => ({ ...current, certifications: current.certifications.filter((_, itemIndex) => itemIndex !== index) }))} />}
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Achievements" action={<AddButton onClick={() => setResume((current) => ({ ...current, achievements: [...current.achievements, ""] }))}>Add Achievement</AddButton>}>
            <div className="space-y-3">
              {resume.achievements.map((achievement, index) => (
                <div key={index} className="rounded-xl border border-white/10 bg-slate-950/35 p-3 sm:p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-xs font-bold text-blue-100/60">Achievement {index + 1}</p>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <EnhanceButton onClick={() => handleEnhanceAchievement(index)} loading={aiStatus.achievements[index]?.loading} disabled={!achievement.trim()} />
                      {resume.achievements.length > 1 && <DeleteButton label={`Delete achievement ${index + 1}`} onClick={() => setResume((current) => ({ ...current, achievements: current.achievements.filter((_, itemIndex) => itemIndex !== index) }))} />}
                    </div>
                  </div>
                  <TextArea value={achievement} onChange={(value) => updateAchievement(index, value)} placeholder="Describe an academic, technical, or leadership achievement." rows={2} />
                  <AiError message={aiStatus.achievements[index]?.error} />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="mb-3 flex items-center justify-between"><div><h2 className="text-sm font-bold text-white">Live Preview</h2><p className="mt-0.5 text-xs text-blue-100/60">{selectedTemplate.name}</p></div><span className="rounded-full bg-blue-500/15 px-3 py-1 text-[11px] font-bold text-blue-200">A4 Preview</span></div>
            <div className="builder-scrollbar max-h-[calc(100vh-9rem)] overflow-auto rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)]"><ResumePreview resume={resume} templateId={selectedTemplateId} /></div>
          </div>
        </aside>
      </main>

      <button type="button" onClick={() => setPreviewOpen(true)} className="fixed bottom-4 left-1/2 z-40 inline-flex min-h-12 -translate-x-1/2 items-center gap-2 rounded-full bg-mint-600 px-6 text-sm font-bold text-white shadow-[0_12px_30px_rgba(37,99,235,0.34)] lg:hidden"><Eye size={17} />Preview Resume</button>
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex min-h-0 flex-col bg-slate-950 lg:hidden">
          <div className="shrink-0 flex items-center justify-between border-b border-white/10 bg-slate-950 px-4 py-3"><div><p className="text-sm font-bold text-white">Resume Preview</p><p className="text-[11px] text-blue-100/60">{selectedTemplate.name}</p></div><button type="button" onClick={() => setPreviewOpen(false)} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/10 text-white"><X size={17} /></button></div>
          <div className="builder-scrollbar builder-mobile-preview min-h-0 flex-1 overflow-y-auto px-3 pt-5"><div className="builder-mobile-preview-page mx-auto w-full max-w-[620px]"><ResumePreview resume={resume} templateId={selectedTemplateId} /></div></div>
        </div>
      )}
    </div>
  );
}

export default BuilderApp;
