<<<<<<< ours
import React, { lazy, Suspense, useRef, useState } from "react";
import {
  ArrowRight,
  Bot,
  Check,
=======
import React, { useState } from "react";
import {
  ArrowRight,
>>>>>>> theirs
  ChevronRight,
  CircleCheck,
  Download,
  FileText,
  GraduationCap,
  LayoutTemplate,
<<<<<<< ours
  Mail,
=======
>>>>>>> theirs
  Menu,
  MousePointer2,
  Palette,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  X,
<<<<<<< ours
  Zap,
} from "lucide-react";
import TiltCard from "../components/TiltCard.jsx";
import MagneticButton from "../components/MagneticButton.jsx";
import { useGsapScrollReveal } from "../hooks/useGsapScrollReveal.js";
=======
} from "lucide-react";
>>>>>>> theirs
import elevatePreview from "../assets/template-previews/elevate.svg";
import atlasPreview from "../assets/template-previews/atlas.svg";
import executivePreview from "../assets/template-previews/executive.svg";
import horizonPreview from "../assets/template-previews/horizon.svg";
import launchpadPreview from "../assets/template-previews/launchpad.svg";
import nexusPreview from "../assets/template-previews/nexus.svg";
import novaPreview from "../assets/template-previews/nova.svg";
import prestigePreview from "../assets/template-previews/prestige.svg";
import swiftPreview from "../assets/template-previews/swift.svg";
import zenithPreview from "../assets/template-previews/zenith.svg";
import { resumeTemplates } from "../builder/templates/templateRegistry.js";

<<<<<<< ours
const HeroParticles = lazy(() => import("../components/HeroParticles.jsx"));

const navLinks = [
  ["Templates", "#templates"],
  ["Features", "#features"],
  ["AI", "#ai"],
  ["Contact", "#contact"],
=======
const navLinks = [
  ["Resume Templates", "#templates"],
  ["Features", "#features"],
  ["About", "#about"],
];

const features = [
  {
    icon: LayoutTemplate,
    title: "Professional Templates",
    text: "Modern layouts designed to make your experience stand out, even when you are just starting out.",
    tint: "bg-blue-50 text-blue-700",
  },
  {
    icon: Download,
    title: "Instant PDF Export",
    text: "Download a polished, recruiter-ready PDF in one click. No watermarks, no complicated steps.",
    tint: "bg-[#fef4e8] text-[#e48a35]",
  },
  {
    icon: ShieldCheck,
    title: "ATS Optimized",
    text: "Built with clean formatting and clear sections that applicant tracking systems can read with ease.",
    tint: "bg-[#eef0fd] text-[#6b70c9]",
  },
  {
    icon: Palette,
    title: "Easy Customization",
    text: "Personalize colors, fonts, and sections in minutes. Make your resume feel distinctly yours.",
    tint: "bg-[#fceff2] text-[#df7080]",
  },
>>>>>>> theirs
];

const templatePreviews = {
  launchpad: launchpadPreview,
  horizon: horizonPreview,
  swift: swiftPreview,
  nexus: nexusPreview,
  elevate: elevatePreview,
  executive: executivePreview,
  nova: novaPreview,
  atlas: atlasPreview,
  zenith: zenithPreview,
  prestige: prestigePreview,
};

<<<<<<< ours
const templates = resumeTemplates.map((template) => ({
  ...template,
  href: `/builder?template=${template.id}`,
  preview: templatePreviews[template.id],
}));

const featureCards = [
  {
    icon: LayoutTemplate,
    title: "Recruiter-ready templates",
    text: "Clean structures, strong hierarchy, and student-friendly defaults for internships, placements, and fresher roles.",
    className: "md:col-span-2",
  },
  {
    icon: Download,
    title: "One-click PDF",
    text: "Export a polished PDF without watermarks or layout surprises.",
  },
  {
    icon: ShieldCheck,
    title: "ATS conscious",
    text: "Readable sections and formatting that keep the resume easy to scan.",
  },
  {
    icon: Palette,
    title: "Flexible styling",
    text: "Switch templates and tune details without rebuilding from scratch.",
  },
  {
    icon: MousePointer2,
    title: "Start instantly",
    text: "No signup wall. Build first, download when ready.",
    className: "md:col-span-2",
  },
];

const aiCards = [
  ["Improve Summary", "Turn rough notes into a confident professional summary."],
  ["Improve Project", "Clarify project impact, stack, and ownership in stronger language."],
  ["Improve Achievement", "Convert accomplishments into concise resume bullets."],
];

function useBuilderTransition() {
  const [transitioning, setTransitioning] = useState(false);

  const navigate = (event, href = "/builder") => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setTransitioning(true);
    window.setTimeout(() => {
      window.location.href = href;
    }, 380);
  };

  return { transitioning, navigate };
}

function Logo({ dark = true }) {
  return (
    <a href="#" className={`flex items-center gap-2.5 font-bold tracking-[-0.04em] ${dark ? "text-white" : "text-ink"}`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-mint-600 text-white shadow-[0_10px_28px_rgba(37,99,235,0.38)]">
        <FileText size={18} strokeWidth={2.5} />
      </span>
      <span className="text-xl">resumely<span className="text-blue-400">.</span></span>
=======
const templates = resumeTemplates.map((template) => ({ ...template, href: `/builder?template=${template.id}`, preview: templatePreviews[template.id] }));

const studentBenefits = [
  {
    icon: MousePointer2,
    title: "No Signup Required",
    text: "Start building immediately without creating an account.",
  },
  {
    icon: Download,
    title: "Free PDF Download",
    text: "Download your resume instantly.",
  },
  {
    icon: ShieldCheck,
    title: "ATS-Friendly Templates",
    text: "Designed to pass modern applicant tracking systems.",
  },
  {
    icon: GraduationCap,
    title: "Built for Students",
    text: "Perfect for internships, placements, and fresher jobs.",
  },
];

function Logo() {
  return (
    <a href="#" className="flex items-center gap-2.5 font-bold text-white">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-mint-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.35)]">
        <FileText size={18} strokeWidth={2.5} />
      </span>
      <span className="text-xl">resumely<span className="text-mint-600">.</span></span>
>>>>>>> theirs
    </a>
  );
}

<<<<<<< ours
function PrimaryLink({ href = "/builder", children, onNavigate, light = false, className = "" }) {
  return (
    <MagneticButton
      href={href}
      onNavigate={(event) => href.startsWith("/builder") && onNavigate?.(event, href)}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold ${
        light
          ? "bg-white text-slate-950 shadow-[0_18px_42px_rgba(255,255,255,0.16)] hover:bg-blue-50"
          : "bg-mint-600 text-white shadow-[0_18px_42px_rgba(37,99,235,0.34)] hover:bg-mint-700"
      } ${className}`}
    >
      {children}
    </MagneticButton>
  );
}

function SecondaryLink({ href, children, onNavigate, className = "" }) {
  return (
    <MagneticButton
      href={href}
      onNavigate={(event) => href.startsWith("/builder") && onNavigate?.(event, href)}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.07] px-5 text-sm font-bold text-white backdrop-blur hover:border-blue-300/50 hover:bg-white/[0.11] ${className}`}
    >
      {children}
    </MagneticButton>
  );
}

function Navbar({ onNavigate }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/72 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8 lg:px-12">
        <Logo />
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map(([label, href]) => (
            <a key={label} href={href} className="text-sm font-semibold text-blue-100/74 transition hover:text-white">
              {label}
            </a>
          ))}
          <PrimaryLink href="/builder" onNavigate={onNavigate} className="min-h-10 px-4">
            Create Resume <ArrowRight size={15} />
          </PrimaryLink>
=======
function Button({ children, href = "#", secondary = false, className = "" }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-300 ${
        secondary
          ? "border border-[#dce5df] bg-white text-ink hover:border-mint-500 hover:text-mint-700"
          : "bg-mint-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.20)] hover:-translate-y-0.5 hover:bg-mint-700 hover:shadow-[0_14px_28px_rgba(37,99,235,0.28)]"
      } ${className}`}
    >
      {children}
    </a>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/88 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <Logo />
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map(([label, href]) => (
            <a key={label} href={href} className="text-sm font-semibold text-blue-100/80 transition hover:text-white">
              {label}
            </a>
          ))}
          <Button href="/builder" className="px-5 py-2.5">
            Create Resume <ArrowRight size={15} />
          </Button>
>>>>>>> theirs
        </div>
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/10 text-white md:hidden"
        >
          {open ? <X size={19} /> : <Menu size={20} />}
        </button>
      </nav>
      {open && (
<<<<<<< ours
        <div className="border-t border-white/10 bg-slate-950/96 px-4 py-5 shadow-soft md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            {navLinks.map(([label, href]) => (
              <a key={label} href={href} onClick={() => setOpen(false)} className="font-semibold text-blue-100">
                {label}
              </a>
            ))}
            <PrimaryLink href="/builder" onNavigate={onNavigate} className="w-full">
              Create Resume <ArrowRight size={15} />
            </PrimaryLink>
=======
        <div className="border-t border-white/10 bg-slate-950 px-5 py-5 shadow-soft md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            {navLinks.map(([label, href]) => (
              <a key={label} href={href} onClick={() => setOpen(false)} className="font-medium text-blue-100">
                {label}
              </a>
            ))}
            <Button href="/builder" className="mt-1 w-full">Create Resume <ArrowRight size={15} /></Button>
>>>>>>> theirs
          </div>
        </div>
      )}
    </header>
  );
}

<<<<<<< ours
function SectionTitle({ eyebrow, title, text, align = "center" }) {
  return (
    <div className={`motion-reveal mb-10 ${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-blue-300">{eyebrow}</p>
      <h2 className="text-[clamp(2rem,4vw,3.65rem)] font-black leading-[1.04] tracking-[-0.04em] text-white">{title}</h2>
      {text && <p className="mt-5 text-base leading-7 text-blue-100/76 sm:text-lg">{text}</p>}
    </div>
  );
}

function HeroResumeVisual() {
  return (
    <div className="motion-reveal relative mx-auto mt-10 max-w-[560px] lg:mt-0">
      <div className="absolute -inset-6 rounded-[2rem] bg-blue-500/20 blur-3xl" />
      <div className="premium-glass relative overflow-hidden rounded-[1.75rem] p-2">
        <div className="flex items-center gap-1.5 rounded-t-[1.2rem] border-b border-white/10 bg-slate-950/92 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff8a72]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f4c76b]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#6ee7b7]" />
          <div className="mx-auto rounded-full bg-white/10 px-10 py-1 text-[8px] font-bold text-blue-100">resume-preview.pdf</div>
        </div>
        <div className="mx-auto w-[76%] py-5">
          <img src={templates[0].preview} alt="Resumely resume preview" className="w-full rounded-sm bg-white shadow-[0_24px_70px_rgba(0,0,0,0.25)]" />
        </div>
      </div>
    </div>
  );
}

function Hero({ onNavigate }) {
  return (
    <section className="mesh-bg relative overflow-hidden border-b border-white/10">
      <div className="aurora-layer absolute -inset-16 z-0" />
      <Suspense fallback={null}>
        <HeroParticles />
      </Suspense>
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 px-4 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[1.02fr_0.98fr] lg:px-12 lg:pb-28 lg:pt-24">
        <div>
          <div className="motion-reveal mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-2 text-xs font-bold text-blue-100 shadow-sm backdrop-blur">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-mint-600 text-white"><Sparkles size={12} /></span>
            Premium resume builder for students and freshers
          </div>
          <h1 className="motion-reveal max-w-4xl text-[clamp(3rem,7vw,5.9rem)] font-black leading-[0.96] tracking-[-0.055em] text-white">
            Build a resume that feels ready for the real world.
          </h1>
          <p className="motion-reveal mt-6 max-w-2xl text-base leading-7 text-blue-100/82 sm:text-xl sm:leading-8">
            Choose a professional template, improve weak sections with AI, and download a clean ATS-friendly PDF in minutes.
          </p>
          <div className="motion-reveal mt-8 flex flex-col gap-3 sm:flex-row">
            <PrimaryLink href="/builder" onNavigate={onNavigate} className="px-6">
              Create Resume Free <ArrowRight size={17} />
            </PrimaryLink>
            <SecondaryLink href="#templates" className="px-6">
              Browse Templates <ChevronRight size={17} />
            </SecondaryLink>
          </div>
          <div className="motion-stagger mt-8 grid max-w-xl grid-cols-1 gap-3 text-sm font-bold text-blue-50 sm:grid-cols-3">
            {["No signup", "Free PDF export", "ATS-friendly"].map((item) => (
              <div key={item} className="premium-glass rounded-2xl px-4 py-3">
                <CircleCheck size={16} className="mr-2 inline text-blue-300" />{item}
              </div>
            ))}
          </div>
        </div>
        <HeroResumeVisual />
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [["10", "Templates"], ["3", "AI helpers"], ["1-click", "PDF export"], ["Mobile", "Builder"]];
  return (
    <div className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="motion-stagger mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-6 sm:px-8 md:grid-cols-4 lg:px-12">
        {items.map(([value, label]) => (
          <div key={label} className="premium-glass rounded-2xl px-4 py-4 text-center">
            <p className="text-2xl font-black tracking-[-0.04em] text-white">{value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-blue-100/62">{label}</p>
          </div>
        ))}
=======
function ResumePreview({ mini = false, accent = "#2563eb", kind = "classic" }) {
  const side = kind === "sidebar";
  const tiny = mini ? "text-[5px]" : "text-[7px] sm:text-[8px]";
  const heading = mini ? "text-[5px]" : "text-[7px] sm:text-[8px]";
  return (
    <div className={`overflow-hidden bg-white ${mini ? "h-full w-full" : "aspect-[0.72] w-full"}`}>
      <div className="p-[7%]">
        <div className={side ? "flex gap-[6%]" : ""}>
          {side && (
            <aside className="w-[27%] shrink-0 border-r border-[#e5ebe8] pr-[5%]">
              <div className="mb-[16%] aspect-square rounded-full bg-[#e4ece8]" />
              <ResumeHeading text="CONTACT" accent={accent} mini={mini} />
              <p className={`${tiny} leading-[1.7] text-[#6f7b77]`}>Bengaluru, Karnataka<br />+91 98765 43210<br />daniel-morgan@example.com</p>
              <div className="mt-[16%]"><ResumeHeading text="SKILLS" accent={accent} mini={mini} /></div>
              <p className={`${tiny} leading-[1.8] text-[#6f7b77]`}>React<br />TypeScript<br />Node.js<br />PostgreSQL</p>
            </aside>
          )}
          <div className="min-w-0 flex-1">
            <div className="mb-[6%]">
              <h3 className={`${mini ? "text-[9px]" : "text-base sm:text-lg"} font-bold tracking-[-0.04em]`} style={{ color: accent }}>
                DANIEL MORGAN
              </h3>
              <p className={`${mini ? "mt-0.5 text-[5px]" : "mt-1 text-[8px] sm:text-[9px]"} font-semibold tracking-[0.15em] text-[#495651]`}>
                SOFTWARE ENGINEERING STUDENT
              </p>
              {!side && (
                <p className={`${tiny} mt-[2%] text-[#77817e]`}>
                  Bengaluru, Karnataka&nbsp;&nbsp; | &nbsp;&nbsp;daniel-morgan@example.com&nbsp;&nbsp; | &nbsp;&nbsp;+91 98765 43210
                </p>
              )}
            </div>

            <ResumeHeading text="PROFILE" accent={accent} mini={mini} />
            <p className={`${tiny} leading-[1.55] text-[#6f7b77]`}>
              Software engineering student focused on reliable web applications, clean code, and product-ready user experiences.
            </p>

            <div className="mt-[6%]"><ResumeHeading text={kind === "line" ? "PROJECTS" : "EXPERIENCE"} accent={accent} mini={mini} /></div>
            <ResumeEntry
              title={kind === "line" ? "Internship Tracker" : "Software Engineering Intern"}
              meta={kind === "line" ? "React.js · Node.js · PostgreSQL" : "BrightLayer Labs | May - Jul 2025"}
              text={kind === "line" ? "Created a workflow app for applications, interviews, offers, and recruiter notes." : "Built reusable React components and supported API integration."}
              mini={mini}
            />
            <ResumeEntry
              title={kind === "line" ? "Code Review Dashboard" : "Student Project Contributor"}
              meta={kind === "line" ? "TypeScript · REST APIs · Tailwind CSS" : "Engineering Club | 2024 - Present"}
              text={kind === "line" ? "Designed a dashboard for pull request activity, review status, and project health." : "Documented frontend patterns and helped review student project code."}
              mini={mini}
            />

            <div className="mt-[5%]"><ResumeHeading text="EDUCATION" accent={accent} mini={mini} /></div>
            <ResumeEntry title="B.Tech in Computer Science" meta="PES University | 2023 - 2027" text="CGPA: 8.6 / 10" mini={mini} compact />

            {!side && (
              <div className="mt-[4%]">
                <ResumeHeading text="SKILLS" accent={accent} mini={mini} />
                <p className={`${tiny} font-medium leading-[1.6] text-[#65716d]`}>JavaScript&nbsp;&nbsp; TypeScript&nbsp;&nbsp; React&nbsp;&nbsp; Node.js&nbsp;&nbsp; PostgreSQL&nbsp;&nbsp; Git</p>
              </div>
            )}
          </div>
        </div>
>>>>>>> theirs
      </div>
    </div>
  );
}

<<<<<<< ours
function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-12 lg:py-24">
      <SectionTitle eyebrow="Product system" title="A focused builder, not a formatting maze." text="Resumely keeps the workflow direct: write, improve, preview, and export. The interface supports completion instead of asking students to become designers." />
      <div className="motion-stagger grid gap-4 md:grid-cols-4">
        {featureCards.map(({ icon: Icon, title, text, className = "" }) => (
          <TiltCard key={title} className={`premium-glass min-h-[210px] rounded-3xl p-6 ${className}`}>
            <span className="relative z-10 mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/16 text-blue-200">
              <Icon size={22} />
            </span>
            <h3 className="relative z-10 text-xl font-black tracking-[-0.03em] text-white">{title}</h3>
            <p className="relative z-10 mt-3 text-sm leading-6 text-blue-100/72">{text}</p>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}

function Templates({ onNavigate }) {
  return (
    <section id="templates" className="relative overflow-hidden border-y border-white/10 py-16 lg:py-24">
      <div className="aurora-layer absolute -inset-20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <SectionTitle eyebrow="Templates" title="Professional layouts with a sharper first impression." text="Each template keeps the preview aligned with PDF export, so what you see in the builder is what recruiters receive." />
        <div className="motion-stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {templates.map((template) => (
            <TiltCard
              as="a"
              key={template.id}
              href={template.href}
              onClick={(event) => onNavigate(event, template.href)}
              className="group premium-glass block overflow-hidden rounded-3xl p-3 text-white focus:outline-none focus:ring-4 focus:ring-blue-300/35"
            >
              <div className="relative z-10 aspect-[0.78] overflow-hidden rounded-2xl bg-slate-950/85 p-4">
                <img src={template.preview} alt={`${template.name} resume template preview`} className="h-full w-full rounded-sm bg-white object-contain object-top shadow-[0_16px_36px_rgba(0,0,0,0.24)]" loading="lazy" />
                <span className="absolute left-3 top-3 rounded-full border border-white/50 bg-white/90 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-slate-700">{template.tag}</span>
              </div>
              <div className="relative z-10 px-1 pb-1 pt-4">
                <h3 className="text-base font-black tracking-[-0.02em] text-white">{template.name}</h3>
                <p className="mt-1 min-h-10 text-xs leading-5 text-blue-100/68">{template.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-black text-blue-300 transition group-hover:text-white">
                  Use Template <ArrowRight size={12} />
                </span>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function AiExperience() {
  return (
    <section id="ai" className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
        <div className="motion-reveal premium-glass relative overflow-hidden rounded-3xl p-7 sm:p-8">
          <div className="aurora-layer absolute -inset-24 opacity-40" />
          <div className="relative">
            <span className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-violet-500/16 text-violet-200"><Bot size={26} /></span>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-blue-300">AI Features</p>
            <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-black leading-[1.04] tracking-[-0.04em] text-white">Cleaner writing when your draft is almost there.</h2>
            <p className="mt-5 text-base leading-7 text-blue-100/76">AI actions stay close to the fields they improve, with clearer loading states and feedback in the builder.</p>
          </div>
        </div>
        <div className="motion-stagger grid gap-4 md:grid-cols-3">
          {aiCards.map(([title, text]) => (
            <TiltCard key={title} className="premium-glass min-h-[240px] rounded-3xl p-6">
              <span className="relative z-10 mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/15 px-3 py-1.5 text-xs font-black text-violet-100">
                <WandSparkles size={14} /> AI
              </span>
              <h3 className="relative z-10 text-xl font-black tracking-[-0.03em] text-white">{title}</h3>
              <p className="relative z-10 mt-3 text-sm leading-6 text-blue-100/72">{text}</p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyResumely() {
  const items = [
    [GraduationCap, "Student-first", "Built around fresher resumes, project work, coursework, and placement workflows."],
    [Zap, "Fast completion", "Guided fields and samples reduce the blank-page problem."],
    [Check, "Trustworthy output", "Live preview and PDF export preserve the professional resume surface."],
  ];

  return (
    <section id="about" className="relative overflow-hidden border-y border-white/10 bg-slate-900/42 py-16 lg:py-24">
      <div className="aurora-layer absolute -inset-24 opacity-35" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <SectionTitle eyebrow="Why Resumely" title="Serious enough for recruiters. Simple enough for a deadline." />
        <div className="motion-stagger grid gap-4 lg:grid-cols-3">
          {items.map(([Icon, title, text]) => (
            <TiltCard key={title} className="premium-glass rounded-3xl p-7">
              <Icon className="relative z-10 text-blue-300" size={26} />
              <h3 className="relative z-10 mt-6 text-2xl font-black tracking-[-0.04em] text-white">{title}</h3>
              <p className="relative z-10 mt-3 text-sm leading-6 text-blue-100/72">{text}</p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactCta({ onNavigate }) {
  return (
    <section id="contact" className="px-4 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="motion-reveal premium-glass relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] px-6 py-12 text-center sm:px-12 sm:py-16">
        <div className="aurora-layer absolute -inset-24 opacity-50" />
        <div className="relative">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-blue-300">Start free</p>
          <h2 className="text-[clamp(2.1rem,5vw,4.4rem)] font-black leading-[1.02] tracking-[-0.05em] text-white">Finish the resume. Download the PDF. Apply with confidence.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-blue-100/78">No signup required. No watermark. A professional builder designed for students moving quickly.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PrimaryLink href="/builder" light onNavigate={onNavigate} className="w-full px-7 sm:w-auto">
              Create Resume <ArrowRight size={17} />
            </PrimaryLink>
            <SecondaryLink href="mailto:resumelyofficial@gmail.com" className="w-full px-7 sm:w-auto">
              Contact <Mail size={16} />
            </SecondaryLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const pageRef = useRef(null);
  const { transitioning, navigate } = useBuilderTransition();
  useGsapScrollReveal(pageRef);

  return (
    <div ref={pageRef} className="overflow-hidden bg-slate-950 text-white">
      <div className={`page-transition-mask ${transitioning ? "is-active" : ""}`} />
      <Navbar onNavigate={navigate} />
      <main>
        <Hero onNavigate={navigate} />
        <TrustBar />
        <Features />
        <Templates onNavigate={navigate} />
        <AiExperience />
        <WhyResumely />
        <ContactCta onNavigate={navigate} />
      </main>
      <footer className="border-t border-white/10 bg-[#07111f]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-8 md:grid-cols-[1.4fr_0.8fr_0.8fr] lg:px-12">
          <div>
            <Logo />
            <p className="mt-4 max-w-md text-sm leading-6 text-blue-100/65">Resumely helps students and freshers create professional, ATS-friendly resumes quickly using templates, AI writing help, and instant PDF export.</p>
          </div>
          <div>
            <h3 className="text-sm font-black">Contact</h3>
            <a href="mailto:resumelyofficial@gmail.com" className="mt-3 inline-block text-sm text-blue-100/70 transition hover:text-white">resumelyofficial@gmail.com</a>
          </div>
          <div>
            <h3 className="text-sm font-black">Links</h3>
            <div className="mt-3 flex flex-col gap-2 text-sm text-blue-100/70">
              <a href="#templates" className="transition hover:text-white">Templates</a>
              <a href="#features" className="transition hover:text-white">Features</a>
              <a href="/builder" onClick={(event) => navigate(event, "/builder")} className="transition hover:text-white">Resume Builder</a>
            </div>
          </div>
          <p className="border-t border-white/10 pt-5 text-xs text-blue-200/70 md:col-span-3">© Resumely</p>
=======
function ResumeHeading({ text, accent, mini }) {
  return (
    <div className="mb-[2.5%] flex items-center gap-2">
      <span className={`${mini ? "text-[5px]" : "text-[7px] sm:text-[8px]"} font-bold tracking-[0.16em]`} style={{ color: accent }}>{text}</span>
      <span className="h-px flex-1 bg-[#dde6e2]" />
    </div>
  );
}

function ResumeEntry({ title, meta, text, mini, compact = false }) {
  return (
    <div className={compact ? "" : "mb-[4%]"}>
      <div className="flex items-start justify-between gap-2">
        <p className={`${mini ? "text-[5px]" : "text-[7px] sm:text-[8px]"} font-bold text-[#33413c]`}>{title}</p>
        {!mini && <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-mint-500" />}
      </div>
      <p className={`${mini ? "text-[4px]" : "text-[6px] sm:text-[7px]"} mt-0.5 font-semibold text-[#87928e]`}>{meta}</p>
      <p className={`${mini ? "text-[4px]" : "text-[6px] sm:text-[7px]"} mt-1 leading-[1.45] text-[#6f7b77]`}>{text}</p>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto mt-10 max-w-[560px] lg:mt-0">
      <div className="relative rounded-[1.6rem] border border-slate-200 bg-white p-2 shadow-[0_34px_90px_rgba(15,23,42,0.18)]">
        <div className="flex items-center gap-1.5 rounded-t-[1.1rem] border-b border-slate-200 bg-slate-950 px-3 pb-2 pt-2">
          <span className="h-2 w-2 rounded-full bg-[#ff9a87]" />
          <span className="h-2 w-2 rounded-full bg-[#f3c96b]" />
          <span className="h-2 w-2 rounded-full bg-[#7bcfa7]" />
          <div className="mx-auto rounded-full bg-white/10 px-10 py-1 text-[7px] font-semibold text-blue-100">resume-preview.pdf</div>
        </div>
        <div className="mx-auto w-[76%] py-5">
          <ResumePreview />
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title, text, dark = false }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <p className={`mb-3 text-xs font-bold uppercase tracking-[0.2em] ${dark ? "text-blue-300" : "text-mint-600"}`}>{eyebrow}</p>
      <h2 className={`text-3xl font-bold tracking-[-0.045em] sm:text-4xl ${dark ? "text-white" : "text-ink"}`}>{title}</h2>
      {text && <p className={`mt-4 text-base leading-7 ${dark ? "text-blue-100" : "text-muted"}`}>{text}</p>}
    </div>
  );
}

function TrustBar() {
  const items = [[ShieldCheck, "ATS Friendly"], [Download, "PDF Download"], [LayoutTemplate, "Free Templates"], [MousePointer2, "Mobile Friendly"]];
  return (
    <div className="border-y border-white/10 bg-slate-950">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-5 px-5 py-6 sm:grid-cols-4 sm:px-8">
        {items.map(([Icon, label]) => (
          <div key={label} className="flex items-center justify-center gap-2.5 text-xs font-bold text-blue-100 sm:text-sm">
            <Icon size={18} className="text-blue-300" strokeWidth={2} /> {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="overflow-hidden bg-slate-950">
      <Navbar />
      <main>
        <section className="relative border-b border-white/10 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.35),transparent_32%),radial-gradient(circle_at_82%_20%,rgba(14,165,233,0.22),transparent_28%),linear-gradient(180deg,#020617_0%,#0f172a_62%,#111827_100%)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:44px_44px] opacity-35" />
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 pb-16 pt-14 sm:px-8 sm:pt-18 lg:grid-cols-[1.04fr_0.96fr] lg:px-12 lg:pb-20 lg:pt-20">
            <div className="relative z-10">
              <div className="animate-reveal mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-blue-100 shadow-sm backdrop-blur">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-mint-600 text-white"><Sparkles size={12} /></span>
                Modern resume builder for students
              </div>
              <h1 className="animate-reveal animation-delay-150 max-w-3xl text-[2.75rem] font-black leading-[1.04] text-white sm:text-6xl lg:text-[4.35rem]">
                Create a Professional Resume <span className="text-blue-300">in Minutes</span>
              </h1>
              <p className="animate-reveal animation-delay-300 mt-6 max-w-xl text-base leading-7 text-blue-100 sm:text-lg sm:leading-8">
                Create a polished, ATS-friendly resume for internships, placements, and fresher roles. Pick a template, fill your details, and export a clean PDF.
              </p>
              <div className="animate-reveal animation-delay-500 mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/builder" className="px-6 py-3.5">Create Resume Free <ArrowRight size={16} /></Button>
                <Button href="#templates" secondary className="px-6 py-3.5">Browse Templates <ChevronRight size={16} /></Button>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-blue-100">
                <span className="flex items-center gap-1.5"><CircleCheck size={15} className="text-blue-300" /> No signup required</span>
                <span className="flex items-center gap-1.5"><CircleCheck size={15} className="text-blue-300" /> Free PDF download</span>
                <span className="flex items-center gap-1.5"><CircleCheck size={15} className="text-blue-300" /> ATS-friendly format</span>
              </div>
              <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
                {["10 Professional Templates", "ATS Ready", "1-Click PDF"].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-center text-xs font-bold text-white backdrop-blur">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <HeroVisual />
          </div>
        </section>

        <TrustBar />

        <section id="features" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <SectionTitle dark eyebrow="Everything you need" title="A better way to build your resume" text="Simple, thoughtful tools that help you put your best foot forward without overthinking the process." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, text, tint }) => (
              <article key={title} className="group rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-blue-300/50 hover:bg-white/[0.09] hover:shadow-[0_18px_42px_rgba(30,64,175,0.20)]">
                <span className={`mb-5 grid h-11 w-11 place-items-center rounded-xl ${tint}`}><Icon size={21} strokeWidth={2} /></span>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-blue-100/80">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="templates" className="border-y border-white/10 bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)] py-16 text-white lg:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Resume Templates</p>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Start with a template that fits you</h2>
              <p className="mt-4 text-base leading-7 text-blue-100">Recruiter-friendly designs for every step of your career. Pick one and make it yours.</p>
            </div>
            <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {templates.map((template) => (
                <a key={template.name} href={template.href} className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.08] p-3 text-white shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:bg-white/[0.12] hover:shadow-[0_22px_50px_rgba(15,23,42,0.35)] active:scale-[0.985] focus:outline-none focus:ring-4 focus:ring-blue-300/40">
                  <div className="relative aspect-[0.78] overflow-hidden rounded-xl bg-slate-900 p-4 sm:p-5">
                    <div className="flex h-full items-start justify-center overflow-hidden rounded-sm bg-white shadow-[0_8px_20px_rgba(42,79,65,0.13)]">
                      <img src={template.preview} alt={`${template.name} sample resume preview`} className="h-full w-full object-contain object-top" />
                    </div>
                    <span className="absolute left-3 top-3 rounded-full border border-white/60 bg-white/90 px-2.5 py-1 text-[8px] font-bold uppercase tracking-wide text-slate-700 shadow-sm backdrop-blur">{template.tag}</span>
                    <div className="absolute inset-0 grid place-items-center bg-blue-950/0 transition duration-300 group-hover:bg-blue-950/20">
                      <span className="translate-y-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-mint-700 opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">Use Template</span>
                    </div>
                  </div>
                  <div className="px-1 pb-1 pt-4">
                    <span className="mb-2 inline-flex rounded-full border border-blue-200/20 bg-blue-300/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-blue-200">{template.tag}</span>
                    <h3 className="text-base font-bold text-white">{template.name}</h3>
                    <p className="mt-1 min-h-10 text-xs leading-5 text-blue-100/75">{template.description}</p>
                    <span className="mt-3 inline-flex min-h-9 items-center gap-1 text-xs font-bold text-blue-300 transition group-hover:text-white">Use Template <ArrowRight size={12} /></span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <SectionTitle dark eyebrow="How It Works" title="Your resume, ready in three steps" text="No complicated setup. Just add your details, make it yours, and start applying." />
          <div className="relative grid gap-5 md:grid-cols-3">
            <div className="absolute left-[17%] right-[17%] top-12 hidden border-t-2 border-dashed border-blue-300/30 md:block" />
            {[
              [FileText, "01", "Enter Your Details", "Add your education, skills, projects, and experience with simple guided prompts."],
              [WandSparkles, "02", "Enhance With AI", "Use AI to strengthen your summary with clearer phrasing, sharper focus, and a more professional tone."],
              [Download, "03", "Download PDF", "Export a clean, ATS-friendly PDF and start sending applications with confidence."],
            ].map(([Icon, number, title, text]) => (
              <article key={title} className="relative rounded-2xl border border-white/10 bg-white/[0.06] p-7 text-center shadow-sm backdrop-blur">
                <span className="relative mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-blue-500/15 text-blue-300">
                  <Icon size={25} strokeWidth={1.8} />
                  <b className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-mint-600 text-[9px] text-white ring-4 ring-slate-950">{number}</b>
                </span>
                <h3 className="text-lg font-bold tracking-[-0.02em] text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-blue-100/80">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-slate-900 py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <SectionTitle dark eyebrow="Designed for your next step" title="Why Students Choose Resumely" text="Everything you need to build a polished resume and start applying with confidence." />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {studentBenefits.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 transition hover:-translate-y-1 hover:bg-white/[0.09] hover:shadow-soft">
                  <span className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-blue-500/15 text-blue-300"><Icon size={20} strokeWidth={2} /></span>
                  <h3 className="text-base font-bold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-blue-100/80">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <div className="grid gap-8 rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.20)] backdrop-blur sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="rounded-2xl border border-white/10 bg-slate-950 p-6 text-white sm:p-7">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-mint-600">About Us</p>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Why Resumely?</h2>
              <p className="mt-4 text-base leading-7 text-blue-100">
                Resumely was built to help students and freshers create professional resumes without struggling with formatting, design, or expensive resume tools.
              </p>
              <p className="mt-3 text-base leading-7 text-blue-100">
                Choose a template, fill your information, and download a professional resume within minutes.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {["ATS-Friendly Templates", "Student-Focused Design", "Fast Resume Creation", "Professional PDF Export", "Mobile Friendly"].map((item) => (
                <div key={item} className="flex min-h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm font-bold text-blue-100">
                  <CircleCheck size={17} className="shrink-0 text-blue-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="px-5 py-14 sm:px-8 lg:px-12 lg:py-18">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-blue-200 bg-[linear-gradient(135deg,#1d4ed8_0%,#0f172a_78%)] px-6 py-12 text-center text-white shadow-[0_28px_80px_rgba(30,64,175,0.25)] sm:px-12 sm:py-14">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:36px_36px] opacity-25" />
            <div className="relative">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-200">Start for free today</p>
              <h2 className="text-3xl font-bold sm:text-5xl">Ready to Build Your Resume?</h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">Create a professional resume in minutes and download it instantly.</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a href="/builder" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-[#173a6a] shadow-xl transition duration-300 hover:-translate-y-0.5 hover:bg-blue-50 sm:w-auto">
                  Create Resume Free <ArrowRight size={16} />
                </a>
                <a href="#templates" className="inline-flex items-center gap-1.5 text-sm font-bold text-white transition hover:text-[#bde8d5]">
                  Browse Templates <ChevronRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-blue-100 bg-[#0f1f3a] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1.4fr_0.8fr_0.8fr] lg:px-12">
          <div>
            <a href="#" className="flex items-center gap-2.5 font-bold tracking-[-0.04em] text-white">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-mint-700"><FileText size={18} strokeWidth={2.5} /></span>
              <span className="text-xl">resumely<span className="text-blue-300">.</span></span>
            </a>
            <h3 className="mt-6 text-sm font-bold">About Resumely</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-blue-100">Resumely helps students and freshers create professional, ATS-friendly resumes quickly using modern templates and smart tools.</p>
          </div>
          <div>
            <h3 className="text-sm font-bold">Contact</h3>
            <a href="mailto:resumelyofficial@gmail.com" className="mt-3 inline-block text-sm text-blue-100 transition hover:text-white">resumelyofficial@gmail.com</a>
          </div>
          <div>
            <h3 className="text-sm font-bold">Links</h3>
            <div className="mt-3 flex flex-col gap-2 text-sm text-blue-100">
              <a href="#" className="transition hover:text-white">Home</a>
              <a href="#templates" className="transition hover:text-white">Templates</a>
              <a href="/builder" className="transition hover:text-white">Resume Builder</a>
            </div>
          </div>
          <p className="border-t border-white/10 pt-5 text-xs text-blue-200 md:col-span-3">© Resumely</p>
>>>>>>> theirs
        </div>
      </footer>
    </div>
  );
}
<<<<<<< ours
=======

export default App;
>>>>>>> theirs
