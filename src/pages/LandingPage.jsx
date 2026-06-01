import React, { useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  CircleCheck,
  Download,
  FileText,
  GraduationCap,
  LayoutTemplate,
  Menu,
  MousePointer2,
  Palette,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";
import elevatePreview from "../assets/template-previews/elevate.svg";
import horizonPreview from "../assets/template-previews/horizon.svg";
import launchpadPreview from "../assets/template-previews/launchpad.svg";
import nexusPreview from "../assets/template-previews/nexus.svg";
import swiftPreview from "../assets/template-previews/swift.svg";
import { resumeTemplates } from "../builder/templates/templateRegistry.js";

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
    tint: "bg-[#eaf8f0] text-[#268b67]",
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
];

const templatePreviews = {
  launchpad: launchpadPreview,
  horizon: horizonPreview,
  swift: swiftPreview,
  nexus: nexusPreview,
  elevate: elevatePreview,
};

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
    <a href="#" className="flex items-center gap-2.5 font-bold tracking-[-0.04em] text-ink">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-mint-600 text-white shadow-[0_8px_18px_rgba(34,154,109,0.2)]">
        <FileText size={18} strokeWidth={2.5} />
      </span>
      <span className="text-xl">resumely<span className="text-mint-600">.</span></span>
    </a>
  );
}

function Button({ children, href = "#", secondary = false, className = "" }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-300 ${
        secondary
          ? "border border-[#dce5df] bg-white text-ink hover:border-mint-500 hover:text-mint-700"
          : "bg-mint-600 text-white shadow-[0_10px_24px_rgba(34,154,109,0.18)] hover:-translate-y-0.5 hover:bg-mint-700 hover:shadow-[0_14px_28px_rgba(34,154,109,0.26)]"
      } ${className}`}
    >
      {children}
    </a>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-[#e7eee9]/80 bg-cream/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <Logo />
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map(([label, href]) => (
            <a key={label} href={href} className="text-sm font-medium text-[#596660] transition hover:text-mint-700">
              {label}
            </a>
          ))}
          <Button href="/builder" className="px-5 py-2.5">
            Create Resume <ArrowRight size={15} />
          </Button>
        </div>
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-[#dde8e2] bg-white text-ink md:hidden"
        >
          {open ? <X size={19} /> : <Menu size={20} />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-[#e7eee9] bg-white px-5 py-5 shadow-soft md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            {navLinks.map(([label, href]) => (
              <a key={label} href={href} onClick={() => setOpen(false)} className="font-medium text-[#596660]">
                {label}
              </a>
            ))}
            <Button href="/builder" className="mt-1 w-full">Create Resume <ArrowRight size={15} /></Button>
          </div>
        </div>
      )}
    </header>
  );
}

function ResumePreview({ mini = false, accent = "#229a6d", kind = "classic" }) {
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
              <p className={`${tiny} leading-[1.7] text-[#6f7b77]`}>Delhi, India<br />+91 98765 43210<br />riya@email.com</p>
              <div className="mt-[16%]"><ResumeHeading text="SKILLS" accent={accent} mini={mini} /></div>
              <p className={`${tiny} leading-[1.8] text-[#6f7b77]`}>React<br />JavaScript<br />Figma<br />Communication</p>
            </aside>
          )}
          <div className="min-w-0 flex-1">
            <div className="mb-[6%]">
              <h3 className={`${mini ? "text-[9px]" : "text-base sm:text-lg"} font-bold tracking-[-0.04em]`} style={{ color: accent }}>
                RIYA SHARMA
              </h3>
              <p className={`${mini ? "mt-0.5 text-[5px]" : "mt-1 text-[8px] sm:text-[9px]"} font-semibold tracking-[0.15em] text-[#495651]`}>
                COMPUTER SCIENCE STUDENT
              </p>
              {!side && (
                <p className={`${tiny} mt-[2%] text-[#77817e]`}>
                  Delhi, India&nbsp;&nbsp; | &nbsp;&nbsp;riya@email.com&nbsp;&nbsp; | &nbsp;&nbsp;+91 98765 43210
                </p>
              )}
            </div>

            <ResumeHeading text="PROFILE" accent={accent} mini={mini} />
            <p className={`${tiny} leading-[1.55] text-[#6f7b77]`}>
              Motivated computer science student with hands-on experience building responsive web applications and solving real-world problems.
            </p>

            <div className="mt-[6%]"><ResumeHeading text={kind === "line" ? "PROJECTS" : "EXPERIENCE"} accent={accent} mini={mini} /></div>
            <ResumeEntry
              title={kind === "line" ? "Campus Placement Portal" : "Frontend Developer Intern"}
              meta={kind === "line" ? "React, Node.js, MongoDB" : "TechNova Labs | May - Jul 2025"}
              text={kind === "line" ? "Built a placement dashboard used to manage student applications." : "Developed reusable UI components and improved mobile responsiveness."}
              mini={mini}
            />
            <ResumeEntry
              title={kind === "line" ? "Expense Tracker App" : "Student Community Volunteer"}
              meta={kind === "line" ? "JavaScript, HTML, CSS" : "Coding Club | 2024 - Present"}
              text={kind === "line" ? "Designed a mobile-first app with category-based expense insights." : "Organized peer learning sessions for first-year students."}
              mini={mini}
            />

            <div className="mt-[5%]"><ResumeHeading text="EDUCATION" accent={accent} mini={mini} /></div>
            <ResumeEntry title="B.Tech in Computer Science" meta="Delhi Technical University | 2022 - 2026" text="CGPA: 8.7 / 10" mini={mini} compact />

            {!side && (
              <div className="mt-[4%]">
                <ResumeHeading text="SKILLS" accent={accent} mini={mini} />
                <p className={`${tiny} font-medium leading-[1.6] text-[#65716d]`}>React&nbsp;&nbsp; JavaScript&nbsp;&nbsp; HTML/CSS&nbsp;&nbsp; Git&nbsp;&nbsp; Figma&nbsp;&nbsp; Communication</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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
      <div className="absolute -inset-5 rounded-[3rem] bg-[#dff7e9]/70 blur-2xl" />
      <div className="relative rounded-2xl border border-[#dce7e2] bg-white p-2 shadow-[0_30px_70px_rgba(41,103,78,0.16)]">
        <div className="flex items-center gap-1.5 border-b border-[#edf1ef] px-2 pb-2 pt-1">
          <span className="h-2 w-2 rounded-full bg-[#ff9a87]" />
          <span className="h-2 w-2 rounded-full bg-[#f3c96b]" />
          <span className="h-2 w-2 rounded-full bg-[#7bcfa7]" />
          <div className="mx-auto rounded-full bg-[#f5f7f6] px-10 py-1 text-[7px] font-medium text-[#8a9692]">resume-preview.pdf</div>
        </div>
        <div className="mx-auto w-[76%] py-4">
          <ResumePreview />
        </div>
      </div>
      <div className="animate-float absolute -left-2 top-[24%] flex items-center gap-2 rounded-xl border border-white bg-white/95 px-3 py-2.5 shadow-[0_14px_32px_rgba(40,80,65,0.14)] sm:-left-8">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-mint-100 text-mint-700"><ShieldCheck size={15} /></span>
        <div><p className="text-[10px] font-bold text-ink">ATS-friendly format</p><p className="text-[9px] text-muted">Clean and readable</p></div>
      </div>
      <div className="animate-float animation-delay-500 absolute -bottom-3 right-0 flex items-center gap-2 rounded-xl border border-white bg-white/95 px-3 py-2.5 shadow-[0_14px_32px_rgba(40,80,65,0.14)] sm:-right-6">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#fff1e8] text-coral"><Download size={14} /></span>
        <div><p className="text-[10px] font-bold text-ink">PDF download</p><p className="text-[9px] text-muted">Ready when you are</p></div>
      </div>
      <span className="absolute -left-8 bottom-[14%] h-8 w-8 rounded-full border-[7px] border-[#f3a38f]/35" />
      <Sparkles className="absolute -right-6 top-[35%] text-[#e1ad53]" size={22} />
    </div>
  );
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-mint-600">{eyebrow}</p>
      <h2 className="text-3xl font-bold tracking-[-0.045em] text-ink sm:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-base leading-7 text-muted">{text}</p>}
    </div>
  );
}

function TrustBar() {
  const items = [[ShieldCheck, "ATS Friendly"], [Download, "PDF Download"], [LayoutTemplate, "Free Templates"], [MousePointer2, "Mobile Friendly"]];
  return (
    <div className="border-y border-[#e4ece7] bg-white/80">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-5 px-5 py-6 sm:grid-cols-4 sm:px-8">
        {items.map(([Icon, label]) => (
          <div key={label} className="flex items-center justify-center gap-2.5 text-xs font-semibold text-[#54625d] sm:text-sm">
            <Icon size={18} className="text-mint-600" strokeWidth={2} /> {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="overflow-hidden">
      <Navbar />
      <main>
        <section className="relative">
          <div className="absolute left-0 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[#eaf8f0] blur-3xl" />
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 pb-16 pt-14 sm:px-8 sm:pt-18 lg:grid-cols-[1.04fr_0.96fr] lg:px-12 lg:pb-20 lg:pt-20">
            <div className="relative z-10">
              <div className="animate-reveal mb-6 inline-flex items-center gap-2 rounded-full border border-[#dcece4] bg-white px-3 py-2 text-xs font-bold text-mint-700 shadow-sm">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-mint-100"><Sparkles size={12} /></span>
                Resume building made simple
              </div>
              <h1 className="animate-reveal animation-delay-150 max-w-3xl text-[2.8rem] font-bold leading-[1.08] tracking-[-0.065em] text-ink sm:text-6xl lg:text-[4.4rem]">
                Create a Professional Resume <span className="text-mint-600">in Minutes</span>
              </h1>
              <p className="animate-reveal animation-delay-300 mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
                Build ATS-friendly resumes for internships, placements, and jobs. No signup required.
              </p>
              <div className="animate-reveal animation-delay-500 mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/builder" className="px-6 py-3.5">Create Resume Free <ArrowRight size={16} /></Button>
                <Button href="#templates" secondary className="px-6 py-3.5">Browse Templates <ChevronRight size={16} /></Button>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-muted">
                <span className="flex items-center gap-1.5"><CircleCheck size={15} className="text-mint-600" /> No signup required</span>
                <span className="flex items-center gap-1.5"><CircleCheck size={15} className="text-mint-600" /> Free PDF download</span>
              </div>
            </div>
            <HeroVisual />
          </div>
        </section>

        <TrustBar />

        <section id="features" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <SectionTitle eyebrow="Everything you need" title="A better way to build your resume" text="Simple, thoughtful tools that help you put your best foot forward without overthinking the process." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, text, tint }) => (
              <article key={title} className="group rounded-[1.4rem] border border-[#e4ece7] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#c9e6d8] hover:shadow-soft">
                <span className={`mb-5 grid h-11 w-11 place-items-center rounded-xl ${tint}`}><Icon size={21} strokeWidth={2} /></span>
                <h3 className="text-lg font-bold tracking-[-0.025em] text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="templates" className="bg-[#f3f8f5] py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <SectionTitle eyebrow="Resume Templates" title="Start with a template that fits" text="Recruiter-friendly designs for every step of your career. Pick one and make it yours." />
            <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {templates.map((template) => (
                <article key={template.name} className="group overflow-hidden rounded-2xl border border-[#dce8e3] bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(43,89,71,0.12)]">
                  <div className="relative aspect-[0.78] overflow-hidden rounded-xl bg-[#edf3f0] p-4 sm:p-5">
                    <div className="flex h-full items-start justify-center overflow-hidden rounded-sm bg-white shadow-[0_8px_20px_rgba(42,79,65,0.13)]">
                      <img src={template.preview} alt={`${template.name} sample resume preview`} className="h-full w-full object-contain object-top" />
                    </div>
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[8px] font-bold uppercase tracking-wide text-mint-700 shadow-sm">{template.tag}</span>
                    <div className="absolute inset-0 grid place-items-center bg-[#1d4f3d]/0 transition duration-300 group-hover:bg-[#1d4f3d]/20">
                      <a href={template.href} className="translate-y-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-mint-700 opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">Use Template</a>
                    </div>
                  </div>
                  <div className="px-1 pb-1 pt-4">
                    <h3 className="text-base font-bold tracking-[-0.02em] text-ink">{template.name}</h3>
                    <p className="mt-1 text-xs text-muted">{template.description}</p>
                    <a href={template.href} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-mint-600 transition hover:text-mint-700">Use Template <ArrowRight size={12} /></a>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-10 text-center"><Button href="#templates" secondary>Browse All Templates <ArrowRight size={15} /></Button></div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <SectionTitle eyebrow="How It Works" title="Your resume, ready in three steps" text="No complicated setup. Just add your details, make it yours, and start applying." />
          <div className="relative grid gap-5 md:grid-cols-3">
            <div className="absolute left-[17%] right-[17%] top-12 hidden border-t-2 border-dashed border-[#d5e8df] md:block" />
            {[
              [FileText, "01", "Enter Your Details", "Add your education, skills, projects, and experience with simple guided prompts."],
              [WandSparkles, "02", "Customize Resume", "Choose a template and fine-tune the colors and sections to suit your style."],
              [Download, "03", "Download PDF", "Export a clean, ATS-friendly PDF and start sending applications with confidence."],
            ].map(([Icon, number, title, text]) => (
              <article key={title} className="relative rounded-[1.4rem] border border-[#e4ece7] bg-white p-7 text-center shadow-sm">
                <span className="relative mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-mint-50 text-mint-700">
                  <Icon size={25} strokeWidth={1.8} />
                  <b className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-mint-600 text-[9px] text-white ring-4 ring-white">{number}</b>
                </span>
                <h3 className="text-lg font-bold tracking-[-0.02em]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-[#e8efeb] bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <SectionTitle eyebrow="Designed for your next step" title="Why Students Choose Resumely" text="Everything you need to build a polished resume and start applying with confidence." />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {studentBenefits.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-[1.4rem] border border-[#e4ece7] bg-cream p-6">
                  <span className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-mint-100 text-mint-700"><Icon size={20} strokeWidth={2} /></span>
                  <h3 className="text-base font-bold tracking-[-0.02em] text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="px-5 py-14 sm:px-8 lg:px-12 lg:py-18">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[#1d604b] px-6 py-12 text-center text-white sm:px-12 sm:py-14">
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full border-[30px] border-white/5" />
            <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full border-[30px] border-[#80d4ad]/15" />
            <Sparkles className="absolute right-[16%] top-12 text-[#f6c977]" size={26} />
            <div className="relative">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#a7e1c8]">Start for free today</p>
              <h2 className="text-3xl font-bold tracking-[-0.045em] sm:text-5xl">Ready to Build Your Resume?</h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#cce7dc] sm:text-base">Create a professional resume in minutes and download it instantly.</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a href="/builder" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-[#173e32] shadow-xl transition duration-300 hover:-translate-y-0.5 hover:bg-[#f3fbf7] sm:w-auto">
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

      <footer id="about" className="border-t border-[#e4ece7] bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-8 sm:px-8 md:grid-cols-[1fr_auto] md:items-center lg:px-12">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-muted">Built for students and freshers.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-muted">
            {["About", "Contact", "Privacy Policy", "Terms"].map((item) => <a key={item} href="#" className="transition hover:text-mint-700">{item}</a>)}
          </div>
          <p className="text-xs text-[#8b9893] md:col-span-2">© 2026 Resumely. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
