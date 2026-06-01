# Resumely Project Context

This document is the authoritative handoff guide for the current Resumely codebase. It is intended for a developer or AI coding assistant starting with zero prior context. Read it before making changes.

## Project Overview

### What the project is

Resumely is a frontend-only resume builder for students, freshers, internship seekers, and users who need a professional resume quickly. The repository contains:

1. A completed public marketing landing page.
2. A functional resume builder at a separate route.
3. Dataset-powered autocomplete for education, location, and skills.
4. Automatic local draft persistence.
5. A live ATS-style A4 resume preview.
6. Client-side PDF export.

There is no backend, authentication system, AI integration, or database.

### Target audience

- College students
- Freshers
- Internship seekers
- Campus placement applicants
- Early-career users who need an ATS-friendly resume quickly

### Main purpose

The product helps users create a structured, recruiter-friendly resume without signup. The builder prioritizes a simple student workflow: enter details, see an instant preview, and download an A4 PDF.

### Current status

The project is a working frontend prototype:

- The landing page is complete and approved.
- The resume builder is functional.
- Autocomplete, autosave, live preview, mobile preview modal, sample loading, and clearing are implemented.
- PDF export is implemented but needs quality improvements before it should be treated as production-ready.

The highest-priority technical issue is PDF quality. The current PDF is rasterized and may not preserve selectable/searchable text.

## Tech Stack

### Frameworks and build tooling

- React `19.1.0`
- React DOM `19.1.0`
- Vite `6.3.5`
- `@vitejs/plugin-react`
- ES modules (`"type": "module"` in `package.json`)

### Styling

- Tailwind CSS `4.1.7`
- `@tailwindcss/vite`
- Shared Tailwind theme in `src/index.css`
- Builder-specific CSS in `src/builder/builder.css`

### UI libraries

- `lucide-react` for interface icons

### State management

- React hooks only
- `useState` for form state, mobile preview state, save state, skill draft, and PDF export state
- `useEffect` for autosave
- `useMemo` for available popular skill chips
- `useRef` for the canonical resume preview DOM node used by PDF export

There is no Redux, Zustand, Context API store, or external form library.

### PDF generation approach

- `html2canvas`
- `jsPDF`
- PDF libraries are dynamically imported only when the user clicks `Download PDF`.
- The preview DOM is cloned into an offscreen export stage.
- Content is grouped into A4-sized pages.
- Each generated page is rasterized at `2x` scale and inserted into an A4 portrait PDF.

### Storage approach

- Browser `localStorage`
- Autosave key: `resumely-builder-draft`
- Drafts are saved automatically while typing.
- Saved drafts are restored when the builder loads.
- Older draft shapes are merged with the current default schema to avoid losing data when new fields are introduced.

## Folder Structure

```text
.
├── .gitignore
├── PROJECT_CONTEXT.md
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── vite.builder.config.js
├── builder/
│   └── index.html
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── data/
    │   ├── colleges.js
    │   ├── cities.js
    │   ├── degrees.js
    │   ├── branches.js
    │   └── skills.js
    └── builder/
        ├── BuilderApp.jsx
        ├── builder.css
        ├── main.jsx
        ├── components/
        │   ├── AutocompleteInput.jsx
        │   ├── ResumePreview.jsx
        │   ├── SectionCard.jsx
        │   └── SkillTag.jsx
        └── utils/
            └── exportResumePdf.js
```

### Root files

| File | Purpose |
| --- | --- |
| `index.html` | Landing-page HTML entry. Do not modify unless explicitly requested. |
| `package.json` | Dependencies and root Vite scripts. |
| `package-lock.json` | Locked npm dependency graph. |
| `vite.config.js` | Standard Vite config for the landing page and development server. Includes React and Tailwind plugins. |
| `vite.builder.config.js` | Separate production build config for the builder entry. Outputs to `dist-builder`. |
| `.gitignore` | Ignores `node_modules`, `dist`, and `.DS_Store`. Note: `dist-builder` is not currently ignored. |

### Landing-page files

| File | Purpose |
| --- | --- |
| `src/main.jsx` | React entry for the landing page. |
| `src/App.jsx` | Complete approved landing page. Keep stable. |
| `src/index.css` | Shared Tailwind import, theme tokens, and animation utilities. Used by both landing page and builder. |

### Builder files

| File | Purpose |
| --- | --- |
| `builder/index.html` | HTML entry for `/builder/`. Loads `src/builder/main.jsx`. |
| `src/builder/main.jsx` | React entry for the builder. Imports shared CSS and builder CSS. |
| `src/builder/BuilderApp.jsx` | Main builder state, autosave logic, form UI, top action bar, mobile preview modal, and PDF button state. |
| `src/builder/builder.css` | Builder-only scrollbar styles and `.resume-paper` A4 visual styles. |
| `src/builder/components/AutocompleteInput.jsx` | Reusable debounced free-text autocomplete component. |
| `src/builder/components/SectionCard.jsx` | Reusable form-section shell. |
| `src/builder/components/SkillTag.jsx` | Selected-skill chip with remove button. |
| `src/builder/components/ResumePreview.jsx` | ATS-style resume output used for live preview and PDF export. |
| `src/builder/utils/exportResumePdf.js` | Offscreen cloning, pagination, rasterization, filename creation, and PDF saving. |

### Dataset files

| File | Export | Current entries | Purpose |
| --- | --- | ---: | --- |
| `src/data/colleges.js` | `colleges` | 82 | College autocomplete |
| `src/data/cities.js` | `cities` | 100 | Location autocomplete |
| `src/data/degrees.js` | `degrees` | 55 | Degree autocomplete |
| `src/data/branches.js` | `branches` | 148 | Branch/specialization autocomplete |
| `src/data/skills.js` | `skills` | 288 | Skills autocomplete and popular skill validation |

Treat these files as the authoritative datasets. Do not regenerate, replace, or expand them unless the user explicitly requests dataset changes.

## Routes

The project uses separate HTML entry points rather than React Router.

| Route | Purpose | Entry |
| --- | --- | --- |
| `/` | Approved marketing landing page | `index.html` → `src/main.jsx` → `src/App.jsx` |
| `/builder/` | Resume builder | `builder/index.html` → `src/builder/main.jsx` → `src/builder/BuilderApp.jsx` |

### Important route behavior

- Use the trailing slash: `/builder/`.
- Landing-page creation CTA links currently navigate to `/builder/`.
- Landing-page `Browse Templates` links scroll to `#templates`.
- Builder back arrow and builder logo navigate to `/`.
- No React Router dependency is installed.

## Running and Building

### Development server

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173/
http://localhost:5173/builder/
```

### Landing-page production build

```bash
npm run build
```

Output:

```text
dist/
```

### Builder production build

```bash
npx vite build --config vite.builder.config.js
```

Output:

```text
dist-builder/
```

Run both builds after modifying shared CSS or builder code.

## Current Features Completed

## Landing Page

The landing page is complete and approved. It is implemented entirely in `src/App.jsx`.

### Existing sections

1. Sticky navbar
   - Resumely logo
   - `Resume Templates`
   - `Features`
   - `About`
   - Desktop and mobile `Create Resume` CTA
   - Mobile hamburger menu

2. Hero section
   - Headline: `Create a Professional Resume in Minutes`
   - Supporting copy
   - `Create Resume Free`
   - `Browse Templates`
   - Browser-style resume preview mockup
   - Lightweight floating UI badges

3. Trust bar
   - ATS Friendly
   - PDF Download
   - Free Templates
   - Mobile Friendly

4. Features section
   - Professional Templates
   - Instant PDF Export
   - ATS Optimized
   - Easy Customization

5. Template preview section
   - ATS Professional
   - Modern Student
   - Placement Ready
   - Each template has a product-style visual preview and `Use Template`

6. How It Works
   - Enter Your Details
   - Customize Resume
   - Download PDF

7. Student-benefits section
   - `Why Students Choose Resumely`
   - No Signup Required
   - Free PDF Download
   - ATS-Friendly Templates
   - Built for Students

8. Final CTA section
   - `Ready to Build Your Resume?`
   - `Create Resume Free`
   - `Browse Templates`

9. Footer
   - About
   - Contact
   - Privacy Policy
   - Terms
   - `Built for students and freshers.`

### Landing-page design language

- Modern SaaS visual style
- Soft cream background
- Mint-green brand color
- Rounded cards and pill buttons
- Minimal, student-friendly tone
- No fake testimonials, fake reviews, fake ratings, or fake user counts

### Important landing-page decision

The landing page has already been polished and approved. Do not refactor, restyle, rename routes, move landing components, change navbar behavior, or modify homepage sections unless the user explicitly asks for landing-page changes.

## Resume Builder

The builder is implemented in `src/builder/BuilderApp.jsx`.

### Desktop layout

- Left panel: resume form
- Right panel: sticky live resume preview
- Preview container is scrollable when the A4 card exceeds viewport height

### Mobile layout

- Form shown first
- Sticky bottom `Preview Resume` button
- Preview opens in a full-screen modal

### Top action bar

- Back to landing page
- Resumely logo
- Autosave status: `Saving...` or `Saved locally`
- `Load Sample Resume`
- `Clear Resume`
- `Download PDF`

### Personal Information

Fields:

- `fullName`
- `professionalTitle`
- `email`
- `phone`
- `linkedin`
- `github`
- `portfolio`
- `location`

`location` uses dataset-powered city autocomplete but still allows custom text.

### Professional Summary

- Textarea directly below Personal Information
- Maximum length: 500 characters
- Live character count
- Saved in `resume.summary`
- Preview uses a default summary when empty:

```text
Motivated student seeking opportunities to apply technical knowledge, develop practical skills, and gain professional experience.
```

### Education

Current fields:

- College Name
- Degree
- Branch / Specialization
- Current Year
- Expected Graduation Year

Removed fields:

- CGPA is intentionally not present.
- Relevant Coursework was intentionally removed.

Autocomplete:

- College Name → `colleges`
- Degree → `degrees`
- Branch / Specialization → `branches`

All education autocomplete fields permit custom values.

### Projects

Projects are repeatable.

Fields:

- Project Name
- Technologies
- Description

Controls:

- Add Project
- Delete Project

In the preview, each project displays:

- Project name
- `Technologies Used:` followed by bullet-separated technologies
- `Description:` followed by project details

Projects appear above skills because projects are the strongest evidence of practical ability for students and freshers.

### Skills

Features:

- Dataset-powered autocomplete
- Add Skill button
- Press Enter to add a typed skill
- Click a suggestion to add it
- Remove selected skills with a chip remove button
- Popular skill chips
- Custom skills allowed
- Duplicate skills prevented case-insensitively

Preview output automatically categorizes recognized skills:

- Programming Languages
- Frontend
- Backend
- Database
- Tools
- Soft Skills
- Other Skills

Unknown custom skills appear under `Other Skills`.

### Certifications

Certifications are repeatable.

Fields:

- Certificate Name
- Organization
- Year

Controls:

- Add Certificate
- Delete Certificate

### Achievements

Achievements are repeatable free-text entries.

Controls:

- Add Achievement
- Delete Achievement

Preview output uses bullet points.

## Autocomplete

### Component

`src/builder/components/AutocompleteInput.jsx`

### How it works

1. The controlled input receives `value`, `onChange`, and a `suggestions` array.
2. Internal `query` state mirrors the controlled value.
3. Query updates are debounced by `180ms`.
4. Matching uses case-insensitive substring search.
5. Results are limited to the first seven matches.
6. Matching text is highlighted using a `<mark>` element.
7. Clicking a suggestion selects it.
8. Arrow Up and Arrow Down move the active option.
9. Enter selects an active option.
10. Escape closes the suggestion list.
11. The optional `onEnter` callback allows custom typed skills to be added.

### User experience requirements

- Suggestions are optional.
- Users can always type custom values not included in a dataset.
- Do not turn autocomplete fields into restrictive select dropdowns.
- Keep keyboard navigation and mobile touch selection working.

### Example

Typing:

```text
KC
```

Can show:

```text
KCC Institute of Technology and Management
```

The user can still ignore the suggestion and enter any other college name.

## Local Storage

### Storage key

```text
resumely-builder-draft
```

### Autosave behavior

- `resume` state is watched using `useEffect`.
- Autosave is delayed by `300ms` after edits.
- Status changes to `Saving...`.
- The serialized resume is saved with:

```js
localStorage.setItem("resumely-builder-draft", JSON.stringify(resume));
```

- Status changes back to `Saved locally`.

### Restore behavior

On initial builder load:

1. Parse the saved JSON.
2. If nothing exists, use `emptyResume()`.
3. If parsing fails, use `emptyResume()`.
4. Merge saved state with fallback defaults.
5. Merge nested `personal` and `education` objects separately.

This merge strategy preserves older drafts when fields such as `professionalTitle` or `summary` are introduced.

### Clear behavior

`Clear Resume` resets state to `emptyResume()`. The autosave effect then persists the cleared draft.

## Live Preview

### Architecture

The preview is implemented by:

```text
BuilderApp
└── ResumePreview
```

`BuilderApp` passes the current `resume` object into `ResumePreview`. React re-renders instantly after any form update.

### Canonical preview DOM node

The desktop preview receives:

```jsx
<ResumePreview resume={resume} previewRef={previewRef} />
```

`previewRef` is used by PDF export. The mobile modal renders the same `ResumePreview` component without the export ref.

### Resume output order

1. Full Name
2. Professional Title
3. Contact Information
4. Professional Summary
5. Education
6. Projects
7. Skills
8. Certifications
9. Achievements

### Resume visual structure

- Single-column layout
- Standard ATS-friendly headings
- A4 aspect ratio: `210 / 297`
- White paper background
- Minimal green accent
- Plain text contact line separated by pipes
- No decorative icons inside the resume output
- No complex columns
- No template switching

### Default values in preview

- Name fallback: `Your Name`
- Professional title fallback: `Student Professional`
- Summary fallback: the default motivated-student summary documented above

### Skill rendering flow

1. Read `resume.skills`.
2. Match exact known skills against local category arrays in `ResumePreview.jsx`.
3. Render non-empty recognized groups.
4. Put unmatched custom values under `Other Skills`.

## PDF Export

### UI

The builder top action bar includes a primary `Download PDF` button.

Button states:

| State | Label |
| --- | --- |
| Normal | `Download PDF` |
| Loading | `Generating PDF...` |
| Success | `Downloaded Successfully` |

If export fails, the UI shows:

```text
We could not generate your PDF. Please try again.
```

### Implementation

PDF export is implemented in:

```text
src/builder/utils/exportResumePdf.js
```

The exporter is dynamically imported from `BuilderApp.jsx`:

```js
const { exportResumePdf } = await import("./utils/exportResumePdf.js");
```

This prevents `html2canvas` and `jsPDF` from increasing the initial builder bundle cost.

### Export flow

1. Read the canonical resume preview DOM node through `previewRef`.
2. Create an offscreen staging container.
3. Clone top-level resume blocks from the preview.
4. Group blocks into `794 × 1123px` page containers.
5. Render each page with `html2canvas` using `scale: 2`.
6. Add each rendered canvas to a `jsPDF` A4 portrait document.
7. Save the file.
8. Remove the offscreen stage in a `finally` block.

### PDF dimensions

```text
210mm × 297mm
A4
Portrait
```

### Filename behavior

If a name is available:

```text
Arpit_Kushwaha_Resume.pdf
```

If no name is available:

```text
resume.pdf
```

### Multi-page behavior

- Top-level resume sections are moved to a new page if they do not fit on the current page.
- If one section itself is taller than a page, canvas slicing is used as a fallback.

### Current PDF issues and limitations

The current exporter works, but it is not the final production-quality approach.

1. **Rasterized text**
   - `html2canvas` converts the preview into images.
   - PDF text may look blurry when zoomed.
   - Text is not reliably selectable or searchable.
   - Raster PDFs are less ideal for ATS parsing than text-based PDFs.

2. **Large on-demand bundle**
   - PDF export dependencies create a large lazy-loaded chunk.
   - This is acceptable for the prototype because it downloads only after clicking `Download PDF`.

3. **Section-level pagination**
   - Pagination is aware of top-level sections, not individual project or certification entries.
   - A very large single section may still use image slicing.
   - Image slicing can split content visually at an awkward position.

4. **No automated browser export test**
   - Build verification exists.
   - PDF appearance still needs manual browser testing with short, medium, and long resumes.

5. **Preview clipping**
   - The visible preview uses `.resume-paper { aspect-ratio: 210 / 297; }` and `overflow-hidden`.
   - Long content can be clipped visually in the live one-page preview even though export attempts multi-page handling.
   - A future improvement should introduce explicit page previews.

### Recommended PDF direction

Prefer a text-preserving PDF strategy before considering PDF export complete. Options:

1. Render PDF directly with `jsPDF` text commands using the resume schema.
2. Use a print-specific HTML route and browser print flow with `@media print`.
3. Generate a semantic PDF with a library designed for document layout.

Avoid claiming ATS-perfect PDF output while export remains image-based.

## Resume Data Schema

The builder stores one resume object in React state and local storage.

```js
resumeData = {
  personal: {
    fullName: "",
    professionalTitle: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    portfolio: "",
    location: ""
  },
  summary: "",
  education: {
    college: "",
    degree: "",
    branch: "",
    currentYear: "",
    graduationYear: ""
  },
  projects: [
    {
      name: "",
      technologies: "",
      description: ""
    }
  ],
  skills: [],
  certifications: [
    {
      name: "",
      organization: "",
      year: ""
    }
  ],
  achievements: [""]
}
```

### Field documentation

#### `personal`

| Field | Type | Description |
| --- | --- | --- |
| `fullName` | `string` | User's name. Used for resume header and PDF filename. |
| `professionalTitle` | `string` | Student or career title shown below the name. |
| `email` | `string` | Contact email. |
| `phone` | `string` | Contact number. |
| `linkedin` | `string` | LinkedIn URL or handle. |
| `github` | `string` | GitHub URL or handle. |
| `portfolio` | `string` | Portfolio URL. |
| `location` | `string` | Free-text city/location with city autocomplete. |

#### `summary`

| Field | Type | Description |
| --- | --- | --- |
| `summary` | `string` | Professional summary. Maximum 500 characters in the form. |

#### `education`

| Field | Type | Description |
| --- | --- | --- |
| `college` | `string` | College name with free-text autocomplete. |
| `degree` | `string` | Degree with free-text autocomplete. |
| `branch` | `string` | Branch or specialization with free-text autocomplete. |
| `currentYear` | `string` | `First Year`, `Second Year`, `Third Year`, `Final Year`, or `Graduated`. |
| `graduationYear` | `string` | Expected graduation year selected from generated year options. |

#### `projects`

| Field | Type | Description |
| --- | --- | --- |
| `projects` | `Array<object>` | Repeatable project list. |
| `projects[].name` | `string` | Project title. |
| `projects[].technologies` | `string` | Comma, bullet, or pipe-separated technology list. Preview normalizes separators to bullets. |
| `projects[].description` | `string` | Project explanation and result. |

#### `skills`

| Field | Type | Description |
| --- | --- | --- |
| `skills` | `Array<string>` | Selected skills, including optional custom entries. |

#### `certifications`

| Field | Type | Description |
| --- | --- | --- |
| `certifications` | `Array<object>` | Repeatable certificate list. |
| `certifications[].name` | `string` | Certificate name. |
| `certifications[].organization` | `string` | Issuing organization. |
| `certifications[].year` | `string` | Completion year. |

#### `achievements`

| Field | Type | Description |
| --- | --- | --- |
| `achievements` | `Array<string>` | Repeatable achievement text rendered as bullets. |

## Component Architecture

### Component hierarchy

```text
Landing Page
└── App
    ├── Navbar
    │   ├── Logo
    │   └── Button
    ├── HeroVisual
    │   └── ResumePreview (landing-only mock preview defined inside App.jsx)
    ├── TrustBar
    ├── SectionTitle
    ├── Feature cards
    ├── Template cards
    ├── How It Works cards
    ├── Student-benefit cards
    ├── CTA
    └── Footer

Resume Builder
└── BuilderApp
    ├── Top action bar
    ├── SectionCard: Personal Information
    │   ├── TextInput
    │   └── AutocompleteInput: location
    ├── SectionCard: Professional Summary
    │   └── TextArea
    ├── SectionCard: Education
    │   ├── AutocompleteInput: college
    │   ├── AutocompleteInput: degree
    │   ├── AutocompleteInput: branch
    │   └── SelectInput
    ├── SectionCard: Projects
    │   ├── AddButton
    │   ├── DeleteButton
    │   ├── TextInput
    │   └── TextArea
    ├── SectionCard: Skills
    │   ├── AutocompleteInput
    │   └── SkillTag
    ├── SectionCard: Certifications
    │   ├── AddButton
    │   ├── DeleteButton
    │   └── TextInput
    ├── SectionCard: Achievements
    │   ├── AddButton
    │   ├── DeleteButton
    │   └── TextArea
    ├── Desktop ResumePreview
    └── Mobile preview modal
        └── ResumePreview
```

### Builder component details

#### `BuilderApp`

File:

```text
src/builder/BuilderApp.jsx
```

Purpose:

- Own all resume state.
- Restore and autosave drafts.
- Render the top action bar.
- Render all form sections.
- Manage dynamic lists.
- Manage selected skills.
- Open and close the mobile preview modal.
- Manage PDF export states.

Important internal state:

```js
resume
skillDraft
previewOpen
saveState
pdfState
pdfMessage
previewRef
```

#### `AutocompleteInput`

File:

```text
src/builder/components/AutocompleteInput.jsx
```

Props:

| Prop | Type | Purpose |
| --- | --- | --- |
| `label` | `string` | Optional field label |
| `value` | `string` | Controlled input value |
| `onChange` | `function` | Called for every text change |
| `onSelect` | `function` | Optional callback after selecting a suggestion |
| `suggestions` | `Array<string>` | Dataset source |
| `placeholder` | `string` | Input placeholder |
| `type` | `string` | Input type, defaults to `text` |
| `required` | `boolean` | Adds required attribute and label marker |
| `onEnter` | `function` | Optional callback for custom typed values |

Internal state:

```js
query
debouncedQuery
open
activeIndex
```

#### `SectionCard`

File:

```text
src/builder/components/SectionCard.jsx
```

Props:

| Prop | Purpose |
| --- | --- |
| `title` | Section heading |
| `description` | Optional supporting copy |
| `children` | Form controls |
| `action` | Optional top-right action such as Add Project |

#### `SkillTag`

File:

```text
src/builder/components/SkillTag.jsx
```

Props:

| Prop | Purpose |
| --- | --- |
| `skill` | Visible skill text |
| `onRemove` | Optional remove callback |

#### `ResumePreview`

File:

```text
src/builder/components/ResumePreview.jsx
```

Props:

| Prop | Purpose |
| --- | --- |
| `resume` | Current resume schema |
| `previewRef` | Optional ref attached to the exportable `<article>` |

Responsibilities:

- Render ATS resume sections.
- Apply fallback summary and header values.
- Normalize project technology separators.
- Categorize skills.
- Hide empty sections where appropriate.

#### `exportResumePdf`

File:

```text
src/builder/utils/exportResumePdf.js
```

Export:

```js
exportResumePdf(source, fullName)
```

Responsibilities:

- Validate preview availability.
- Clone the preview.
- Paginate top-level sections.
- Rasterize pages.
- Build A4 PDF.
- Generate filename.
- Save PDF.
- Clean up offscreen DOM.

## Data Sources

All autocomplete datasets are local JavaScript arrays under `src/data`.

### Colleges

```js
import { colleges } from "../data/colleges.js";
```

- Used by College Name.
- Current entries: 82.
- Includes institutions from Greater Noida and Delhi regions.

### Cities

```js
import { cities } from "../data/cities.js";
```

- Used by Location.
- Current entries: 100.
- Treat current file content as authoritative.

### Degrees

```js
import { degrees } from "../data/degrees.js";
```

- Used by Degree.
- Current entries: 55.
- Includes undergraduate, postgraduate, doctoral, diploma, and certificate options.

### Branches

```js
import { branches } from "../data/branches.js";
```

- Used by Branch / Specialization.
- Current entries: 148.
- Includes engineering, science, arts, commerce, business, architecture, and design specializations.

### Skills

```js
import { skills as skillSuggestions } from "../data/skills.js";
```

- Used by skill autocomplete.
- Current entries: 288.
- Also validates which popular-skill chips can appear.
- Includes technical, engineering, soft-skill, productivity, business, and design skills.

### Free-text policy

Datasets improve suggestions but never restrict user input. Preserve this rule for all future autocomplete work.

## Design System

### Design philosophy

- Modern SaaS aesthetic
- Professional but not corporate-heavy
- Student-friendly
- Minimal visual noise
- Strong spacing and readable hierarchy
- Mint-green accents
- Rounded UI cards
- ATS output remains plain and conservative

### Shared colors

Defined in `src/index.css`:

| Token | Value | Usage |
| --- | --- | --- |
| `ink` | `#17231f` | Primary dark text |
| `muted` | `#66736f` | Secondary text |
| `mint-50` | `#f0fbf6` | Light backgrounds |
| `mint-100` | `#d9f6e9` | Chips and highlights |
| `mint-200` | `#b5ecd4` | Supporting mint |
| `mint-500` | `#35b985` | Focus and accents |
| `mint-600` | `#229a6d` | Primary button and logo |
| `mint-700` | `#197957` | Hover state |
| `coral` | `#ff8a72` | Supporting accent |
| `cream` | `#fbfcf8` | Landing background |

### Typography

Shared font stack:

```css
"Inter", "Segoe UI", sans-serif
```

Inter is not fetched from an external font CDN. The stack falls back to Segoe UI and sans-serif.

### Spacing

- Builder page uses compact `space-y-4` form-section spacing.
- Cards generally use `p-5 sm:p-6`.
- Inputs use `h-11`.
- Preview paper uses percentage-based A4 margins:

```jsx
px-[6.5%] py-[5.8%]
```

### Card styles

Builder `SectionCard`:

```text
rounded-2xl
border border-[#e1ebe6]
bg-white
p-5 sm:p-6
shadow-sm
```

### Button styles

- Primary builder action: mint background, white text, rounded pill.
- Secondary actions: white background, subtle border, dark muted text.
- Destructive clear/remove actions: muted red text and soft red hover background.
- Add actions: mint-tinted pill with plus icon.

### Resume output styles

- White A4 paper
- Single column
- Dark text
- Green horizontal rules and headings
- Small typography to fit student resume content naturally
- No decorative resume icons
- Standard section names for ATS readability

## Important Decisions

### Landing page should not be modified

The landing page is already approved. Previous work polished its sections, responsive behavior, button navigation, and visual hierarchy. Future tasks should treat it as stable. Builder work must stay under `src/builder`, `src/data`, or new feature-specific files unless the user explicitly authorizes landing-page edits.

### CGPA was removed or omitted

CGPA is intentionally not part of the current education schema. The current product keeps education entry concise and avoids introducing optional academic metrics until the product requirements explicitly request them.

### Relevant Coursework was removed

Relevant Coursework previously existed but was removed by request. Do not re-add it unless explicitly requested.

### Professional Summary was added

Students and freshers often lack formal work experience. A professional summary lets them communicate direction, strengths, and internship goals near the top of the resume. A fallback summary prevents an empty-looking resume.

### Projects appear above Skills

For internship and fresher applications, projects provide stronger evidence than a raw skills list. The resume order intentionally emphasizes practical work before keyword lists.

### Suggestions allow free text

Datasets are incomplete by nature. Restricting values would block legitimate colleges, cities, branches, and skills. Autocomplete is assistive, not prescriptive.

### ATS-friendly design was chosen

The resume uses:

- Standard headings
- Single-column layout
- Simple typography
- Minimal accent color
- No complex visual layout
- No decorative icons in exported resume content

This is more recruiter-friendly and easier for applicant tracking systems to interpret.

### PDF dependencies are lazy-loaded

`html2canvas` and `jsPDF` add significant bundle weight. Dynamic import keeps the initial editor faster and loads export code only when the user needs it.

## Current Problems

### High priority

1. **PDF text is rasterized**
   - Exported resume text can become blurry at zoom.
   - Text is not reliably selectable.
   - ATS parsing may be weaker than a semantic PDF.

2. **Live preview is one visual page**
   - Long resume content can overflow the `.resume-paper` A4 card and be visually clipped.
   - Export attempts multi-page output, but the live preview does not display explicit page 2 or page 3 cards.

3. **Pagination is section-aware, not entry-aware**
   - A long Projects section can still be sliced in the middle.
   - A future exporter should split at project, certification, and achievement boundaries.

### Medium priority

4. **No automated PDF visual test**
   - There is no Playwright or Puppeteer setup.
   - PDF output requires manual browser validation.

5. **No dedicated print stylesheet**
   - Existing builder CSS contains a minimal `@media print` block but does not implement a complete semantic print route.

6. **`dist-builder` is not ignored**
   - `.gitignore` currently ignores `dist` but not `dist-builder`.
   - Decide whether builder output should be committed or ignored.

7. **No unified production multi-entry build**
   - Landing and builder currently use separate build commands.
   - Deployment configuration must account for both outputs.

### Lower priority

8. **No validation layer**
   - Fields are permissive.
   - Email, URL, and phone validation are not enforced.

9. **No reorder controls**
   - Projects, certifications, and achievements can be added or deleted but not reordered.

10. **Skill categorization uses exact string matches**
    - Custom variants such as `React` instead of `React.js` appear under `Other Skills`.
    - Future improvements could add normalized aliases.

11. **No template switching**
    - Landing page previews multiple concepts, but the builder currently renders one ATS template.

## Roadmap

### Completed

- ✅ Landing Page
- ✅ Resume Builder
- ✅ Personal Information
- ✅ Professional Summary
- ✅ Education
- ✅ Repeatable Projects
- ✅ Skills with Categories
- ✅ Repeatable Certifications
- ✅ Repeatable Achievements
- ✅ Dataset-Powered Autocomplete
- ✅ LocalStorage Autosave
- ✅ Live Preview
- ✅ Mobile Preview Modal
- ✅ Sample Resume Loader
- ✅ Clear Resume
- ✅ Initial Client-Side PDF Export

### In Progress

- ⚠ PDF Export Improvements
- ⚠ Multi-page preview and export reliability
- ⚠ Text-preserving ATS-friendly PDF generation

### Planned

- ⬜ Template System
- ⬜ Multiple Resume Templates
- ⬜ Project Reordering
- ⬜ Certification Reordering
- ⬜ Achievement Reordering
- ⬜ Validation Improvements
- ⬜ Print-Specific Resume Route
- ⬜ AI Summary Generator
- ⬜ AI Project Description Generator
- ⬜ Resume Score Checker
- ⬜ ATS Analyzer
- ⬜ Authentication
- ⬜ Backend Persistence

Do not start AI, authentication, or backend work unless explicitly requested.

## AI Handoff Instructions

### What has already been built

Before changing code, assume the following work is complete:

- Marketing landing page
- Landing CTA navigation to `/builder/`
- Responsive builder layout
- Mobile preview modal
- Dataset files
- Reusable autocomplete
- Resume form sections
- Autosave and draft restore
- Professional ATS preview
- Lazy-loaded client-side PDF export

### What must not be changed

Unless explicitly requested:

- Do not modify `src/App.jsx`.
- Do not modify landing-page sections.
- Do not alter navbar behavior.
- Do not rename `/` or `/builder/`.
- Do not restyle the landing page.
- Do not regenerate datasets.
- Do not re-add CGPA.
- Do not re-add Relevant Coursework.
- Do not add AI features.
- Do not add authentication.
- Do not add backend functionality.
- Do not add template switching prematurely.

### Coding conventions

- Use React functional components and hooks.
- Use Tailwind utility classes for UI styling.
- Keep builder-specific CSS in `src/builder/builder.css`.
- Prefer small focused helpers for logic such as PDF export.
- Keep datasets in `src/data`.
- Preserve free-text autocomplete behavior.
- Preserve the current local-storage key unless a migration is implemented.
- Merge saved drafts with defaults when adding schema fields.
- Add only the narrowest necessary dependencies.
- Lazy-load heavy optional features where practical.

### Design conventions

- Keep builder UI modern, minimal, and mint-green.
- Keep cards rounded with subtle borders and restrained shadows.
- Keep resume output simpler than builder UI.
- Use standard ATS headings.
- Do not add decorative graphics inside the resume output.
- Keep projects above skills.
- Keep mobile behavior first-class.

### Architecture conventions

- Landing and builder remain separate Vite HTML entries.
- Builder feature code belongs under `src/builder`.
- Shared theme belongs in `src/index.css`.
- Resume data remains one serializable object.
- Live preview should derive from current resume state.
- PDF export should derive from the same resume content as preview.
- Heavy export dependencies should stay behind dynamic imports.

### Verification checklist

After builder changes:

```bash
npx vite build --config vite.builder.config.js
npm run build
```

Also manually verify:

1. `/builder/` loads.
2. Existing drafts restore.
3. Typing updates preview.
4. Autocomplete still accepts custom values.
5. Mobile preview modal opens and closes.
6. Load Sample Resume works.
7. Clear Resume works.
8. Download PDF works.
9. Landing page remains visually unchanged.

## Next Recommended Task

The next task after current PDF quality improvements should be a **text-preserving semantic PDF export and explicit multi-page resume preview**.

### Goal

Replace raster-only PDF output with a professional A4 export that:

- Preserves selectable text
- Improves ATS parser compatibility
- Supports multiple pages cleanly
- Avoids splitting project, certification, or achievement entries awkwardly
- Matches the visible preview closely

### Recommended implementation plan

#### Phase 1: Extract a resume document model

Create a builder utility such as:

```text
src/builder/utils/createResumeDocumentModel.js
```

Convert `resumeData` into normalized sections:

```js
{
  header: {
    fullName,
    professionalTitle,
    contactItems
  },
  sections: [
    {
      id: "summary",
      title: "PROFESSIONAL SUMMARY",
      entries: [...]
    },
    {
      id: "education",
      title: "EDUCATION",
      entries: [...]
    }
  ]
}
```

Use this model for both preview rendering and export. This reduces drift between the browser preview and the downloaded document.

#### Phase 2: Render explicit browser preview pages

Create:

```text
src/builder/components/ResumePage.jsx
src/builder/components/PaginatedResumePreview.jsx
```

Requirements:

- Render one A4 page card per page.
- Preserve the current single-column ATS design.
- Split at entry boundaries:
  - Individual project
  - Individual certification
  - Individual achievement
  - Skill category row
- Repeat minimal header context only if product requirements call for it.
- Avoid splitting a text entry unless the entry itself exceeds one page.

#### Phase 3: Use semantic PDF text output

Preferred options:

1. Use `jsPDF` text rendering with explicit typography measurements.
2. Use a document-layout library that preserves text.
3. Use a print-specific HTML document and browser print flow if acceptable for the product.

Do not use a screenshot-only PDF as the final ATS path.

#### Phase 4: Add export tests

Test at least:

1. Empty resume
2. Sample resume
3. One-page medium resume
4. Two-page project-heavy resume
5. Three-page resume with many certifications and achievements
6. Long professional summary
7. Empty full name filename fallback
8. Full name with spaces and punctuation

Manual acceptance criteria:

- Text remains sharp at `200%` zoom.
- Text can be selected in the generated PDF.
- Page breaks occur between entries where possible.
- No clipped content.
- No blank pages.
- Filename format remains correct.
- Preview and PDF remain visually consistent.

### After semantic PDF export

The next product feature should be the **template system**:

1. Define a stable resume document model.
2. Create a template registry.
3. Keep ATS Professional as the default.
4. Add Modern Student and Placement Ready as additional templates.
5. Persist the selected template in local storage.
6. Keep content schema independent from template markup.
7. Do not duplicate form logic per template.

This sequencing matters: a stable semantic document model and pagination system should exist before multiple templates are introduced.
