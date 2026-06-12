import React, { lazy, Suspense, useRef, useState } from "react";
import {
  ArrowRight,
  Bot,
  Check,
  ChevronRight,
  CircleCheck,
  Download,
  FileText,
  GraduationCap,
  LayoutTemplate,
  Mail,
  Menu,
  MousePointer2,
  Palette,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import TiltCard from "../components/TiltCard.jsx";
import MagneticButton from "../components/MagneticButton.jsx";
import { useGsapScrollReveal } from "../hooks/useGsapScrollReveal.js";
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

const HeroParticles = lazy(() => import("../components/HeroParticles.jsx"));

const navLinks = [
  ["Templates", "#templates"],
  ["Features", "#features"],
  ["AI", "#ai"],
  ["Contact", "#contact"],
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
    </a>
  );
}

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
          </div>
        </div>
      )}
    </header>
  );
}

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
      </div>
    </div>
  );
}

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
        </div>
      </footer>
    </div>
  );
}
