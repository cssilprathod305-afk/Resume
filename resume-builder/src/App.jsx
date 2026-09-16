import React, { useState, useEffect } from "react";
import {
  LayoutTemplate,
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  FolderKanban,
  Plus,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Globe,
  ZoomIn,
  ZoomOut,
  Download,
  Menu,
  X,
  Check,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import { ModernTemplate, ProfessionalTemplate, CreativeTemplate, ClassicTemplate } from "./template.jsx";
import ProjectsPanel from "./components/ProjectsPanel.jsx";

/* ============================================================================
   RESUME BUILDER — a Canva-style live resume editor.
   Stack: React (hooks only, no external state libs), Tailwind CSS, lucide-react.

   HOW IT'S ORGANIZED
   1. Constants & helpers      — accent palette, templates, empty-row factories
   2. Small UI atoms            — SectionLabel, TextField, IconRow, Pill
   3. Sidebar panels            — Templates / Personal / Experience / Education / Skills / Languages
   4. Resume templates          — <ModernTemplate /> and <ProfessionalTemplate />
   5. App shell                 — ControlBar, Sidebar, Canvas, top-level state
   ========================================================================== */

/* ---------------------------------------------------------------------------
   1. CONSTANTS & HELPERS
   ------------------------------------------------------------------------- */

// A curated accent palette. Selecting one re-tints BOTH the resume preview
// and the tool's own active states, so the whole app feels like "your" file.
const ACCENT_COLORS = [
  { name: "Forest", value: "#2F6F5E" },
  { name: "Slate Blue", value: "#445E93" },
  { name: "Plum", value: "#7A4069" },
  { name: "Rust", value: "#B5562A" },
  { name: "Charcoal", value: "#33363D" },
  { name: "Ochre", value: "#A9791F" },
  { name: "skyblue", value: "#3B82F6" }
];

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    description: "Single column, editorial serif header, generous whitespace.",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Two-column split with a colored sidebar for contact & skills.",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold blocks, modern accent panels, and a unique visual hierarchy.",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Clean left-hand contact panel with refined experience cards.",
  },
];

const FONT_UI = "'Outfit', system-ui, sans-serif";

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const emptyExperience = () => ({
  id: uid(),
  role: "",
  company: "",
  location: "",
  start: "",
  end: "",
  current: false,
  description: "",
});

const emptyEducation = () => ({
  id: uid(),
  school: "",
  degree: "",
  field: "",
  language: "",
  type: "Degree",
  start: "",
  end: "",
  gpa: "",
});
const emptyProject = () => ({
  id: uid(),
  name: "",
  description: "",
  technologies: "",
  role: "",
  start: "",
  end: "",
  link: "",
  github: "",
});

// Seeded starter content — demonstrates both templates immediately, and every
// field can be edited or cleared to see the empty-state handling in action.
const initialData = {
  personal: {
    name: "Jordan Ellis",
    title: "Senior Product Designer",
    email: "jordan.ellis@email.com",
    phone: "+1 (555) 013-2847",
    location: "Austin, TX",
    website: "linkedin.com/in/jordanellis",
    photo: null,
    summary:
      "Product designer with 7 years of experience shaping design systems and 0-to-1 products for B2B SaaS teams. I pair rigorous UX research with fast, high-fidelity prototyping.",
  },
  experience: [
    {
      id: uid(),
      role: "Senior Product Designer",
      company: "Northwind Analytics",
      location: "Austin, TX",
      start: "2022",
      end: "",
      current: true,
      description:
        "Led design for the reporting suite used by 40k+ weekly active users.\nBuilt and shipped a token-based design system adopted across 6 product squads.\nMentored two junior designers through their first full product launches.",
    },
    {
      id: uid(),
      role: "Product Designer",
      company: "Fielder Software",
      location: "Remote",
      start: "2019",
      end: "2022",
      current: false,
      description:
        "Redesigned the onboarding flow, lifting activation rate by 18%.\nPartnered with PM and engineering leads on quarterly roadmap planning.",
    },
  ],
  education: [
    {
      id: uid(),
      school: "University of Texas at Austin",
      degree: "B.F.A.",
      field: "Communication Design",
      type: "Degree",
      start: "2015",
      end: "2019",
      gpa: "",
    },
  ],
  skills: [
    "Design Systems",
    "Figma",
    "User Research",
    "Prototyping",
    "Interaction Design",
    "Design Ops",
    "Certification",
  ],
  languages: ["English", "Spanish"],
};

/* ---------------------------------------------------------------------------
   2. SMALL UI ATOMS  (used only inside the sidebar forms)
   ------------------------------------------------------------------------- */

function SectionHeading({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2">
        <Icon size={16} strokeWidth={2.25} className="text-neutral-500" />
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-neutral-800" style={{ fontFamily: FONT_UI }}>
          {title}
        </h2>
      </div>
      {subtitle && <p className="mt-1 text-[12.5px] text-neutral-500 leading-snug">{subtitle}</p>}
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-medium text-neutral-600">{label}</span>
      <input
        {...props}
        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[13.5px] text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
      />
    </label>
  );
}

function TextArea({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-medium text-neutral-600">{label}</span>
      <textarea
        {...props}
        className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[13.5px] text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
      />
    </label>
  );
}

function SelectField({ label, options, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-medium text-neutral-600">{label}</span>
      <select
        {...props}
        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[13.5px] text-neutral-900 outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function EntryCard({ children, onRemove, removeLabel }) {
  return (
    <div className="relative rounded-xl border border-neutral-200 bg-neutral-50/60 p-4">
      <button
        type="button"
        onClick={onRemove}
        title={removeLabel}
        className="absolute right-3 top-3 rounded-md p-1.5 text-neutral-400 transition hover:bg-red-50 hover:text-red-500"
      >
        <Trash2 size={14} />
      </button>
      <div className="flex flex-col gap-3 pr-7">{children}</div>
    </div>
  );
}

function PhotoUpload({ photo, onChange, accent }) {
  const inputRef = React.useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <span className="mb-1 block text-[12px] font-medium text-neutral-600">Photo</span>
      <div className="flex items-center gap-3">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-50 text-neutral-300"
          style={{ borderColor: photo ? accent : undefined }}
        >
          {photo ? (
            <img src={photo} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon size={30} />
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            style={{ borderColor: accent, color: accent }}
            className="flex items-center gap-1.5 rounded-lg border border-dashed px-3 py-1.5 text-[12.5px] font-medium transition hover:bg-neutral-50"
          >
            <Upload size={13} /> {photo ? "Replace" : "Upload"}
          </button>
          {photo && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-left text-[12px] text-neutral-400 transition hover:text-red-500"
            >
              Remove photo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AddButton({ onClick, children, accent }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ borderColor: accent, color: accent }}
      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed py-2.5 text-[13px] font-medium transition hover:bg-neutral-50"
    >
      <Plus size={15} /> {children}
    </button>
  );
}

/* ---------------------------------------------------------------------------
   3. SIDEBAR PANELS
   ------------------------------------------------------------------------- */

function TemplatesPanel({ template, setTemplate, accent }) {
  return (
    <div>
      <SectionHeading icon={LayoutTemplate} title="Templates" subtitle="Switch anytime — your content carries over instantly." />
      <div className="grid grid-cols-1 gap-3">
        {TEMPLATES.map((t) => {
          const active = t.id === template;
          return (
            <button
              type="button"
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className="group text-left rounded-xl border-2 bg-white p-3 transition"
              style={{ borderColor: active ? accent : "#E5E5E5" }}
            >
              {/* Mini CSS-drawn layout preview */}
              <div className="mb-3 h-24 w-full overflow-hidden rounded-md border border-neutral-200 bg-white">
                {t.id === "modern" ? (
                  <div className="flex h-full w-full flex-col gap-1.5 p-2.5">
                    <div className="h-2.5 w-2/3 rounded-sm" style={{ backgroundColor: accent }} />
                    <div className="h-1 w-1/3 rounded-sm bg-neutral-300" />
                    <div className="mt-1.5 h-0.5 w-full rounded-sm bg-neutral-200" />
                    <div className="mt-1 h-1 w-full rounded-sm bg-neutral-200" />
                    <div className="h-1 w-11/12 rounded-sm bg-neutral-200" />
                    <div className="h-1 w-4/5 rounded-sm bg-neutral-200" />
                  </div>
                ) : t.id === "professional" ? (
                  <div className="flex h-full w-full">
                    <div className="flex h-full w-1/3 flex-col gap-1.5 p-2" style={{ backgroundColor: accent }}>
                      <div className="h-1.5 w-3/4 rounded-sm bg-white/70" />
                      <div className="mt-1 h-1 w-full rounded-sm bg-white/40" />
                      <div className="h-1 w-full rounded-sm bg-white/40" />
                    </div>
                    <div className="flex h-full flex-1 flex-col gap-1.5 p-2">
                      <div className="h-1.5 w-2/3 rounded-sm bg-neutral-300" />
                      <div className="mt-1 h-1 w-full rounded-sm bg-neutral-200" />
                      <div className="h-1 w-5/6 rounded-sm bg-neutral-200" />
                    </div>
                  </div>
                ) : t.id === "creative" ? (
                  <div className="flex h-full w-full flex-col gap-2 p-2">
                    <div className="h-2.5 w-full rounded-sm" style={{ backgroundColor: accent }} />
                    <div className="h-1.5 w-3/4 rounded-sm bg-neutral-300" />
                    <div className="h-1 w-full rounded-sm bg-neutral-200" />
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-neutral-300" />
                      <div className="h-1 w-1/2 rounded-sm bg-neutral-200" />
                    </div>
                    <div className="h-1 w-5/6 rounded-sm bg-neutral-200" />
                  </div>
                ) : (
                  <div className="flex h-full w-full gap-2 p-2">
                    <div className="h-full w-1/3 rounded-sm bg-slate-100" />
                    <div className="flex h-full flex-1 flex-col gap-2">
                      <div className="h-2 rounded-sm bg-neutral-300" />
                      <div className="h-2 rounded-sm bg-neutral-300" />
                      <div className="h-1 rounded-sm bg-neutral-200" />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] font-semibold text-neutral-800">{t.name}</span>
                {active && (
                  <span
                    className="flex h-4 w-4 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: accent }}
                  >
                    <Check size={11} strokeWidth={3} />
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[12px] leading-snug text-neutral-500">{t.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PersonalPanel({ personal, onChange, accent }) {
  return (
    <div>
      <SectionHeading icon={User} title="Personal Info" subtitle="This appears at the top of your resume." />
      <div className="flex flex-col gap-3">
        <PhotoUpload photo={personal.photo} onChange={(value) => onChange("photo", value)} accent={accent} />
        <Field label="Full name" placeholder="Jordan Ellis" value={personal.name} onChange={(e) => onChange("name", e.target.value)} />
        <Field label="Job title" placeholder="Senior Product Designer" value={personal.title} onChange={(e) => onChange("title", e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email" placeholder="you@email.com" value={personal.email} onChange={(e) => onChange("email", e.target.value)} />
          <Field label="Phone" placeholder="+1 (555) 000-0000" value={personal.phone} onChange={(e) => onChange("phone", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Location" placeholder="Austin, TX" value={personal.location} onChange={(e) => onChange("location", e.target.value)} />
          <Field label="Website / LinkedIn" placeholder="linkedin.com/in/you" value={personal.website} onChange={(e) => onChange("website", e.target.value)} />
        </div>
        <TextArea
          label="Professional summary"
          rows={5}
          placeholder="A two-to-three sentence pitch of who you are and what you're great at."
          value={personal.summary}
          onChange={(e) => onChange("summary", e.target.value)}
        />
      </div>
    </div>
  );
}

function ExperiencePanel({ experience, update, add, remove, accent }) {
  return (
    <div>
      <SectionHeading icon={Briefcase} title="Experience" subtitle="Most recent role first. One bullet per line." />
      <div className="flex flex-col gap-3">
        {(Array.isArray(experience) ? experience : []).map((job) => (
          <EntryCard key={job.id} onRemove={() => remove(job.id)} removeLabel="Remove this role">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Role" placeholder="Product Designer" value={job.role} onChange={(e) => update(job.id, "role", e.target.value)} />
              <Field label="Company" placeholder="Acme Inc." value={job.company} onChange={(e) => update(job.id, "company", e.target.value)} />
            </div>
            <Field label="Location" placeholder="Remote" value={job.location} onChange={(e) => update(job.id, "location", e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start" placeholder="2022" value={job.start} onChange={(e) => update(job.id, "start", e.target.value)} />
              <Field
                label="End"
                placeholder={job.current ? "Present" : "2024"}
                value={job.end}
                disabled={job.current}
                onChange={(e) => update(job.id, "end", e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 text-[12.5px] text-neutral-600">
              <input
                type="checkbox"
                checked={job.current}
                onChange={(e) => update(job.id, "current", e.target.checked)}
                className="h-3.5 w-3.5 rounded border-neutral-300"
              />
              I currently work here
            </label>
            <TextArea
              label="Highlights"
              rows={4}
              placeholder={"Shipped the v2 checkout flow.\nGrew the design team from 2 to 6."}
              value={job.description}
              onChange={(e) => update(job.id, "description", e.target.value)}
            />
          </EntryCard>
        ))}
        <AddButton onClick={add} accent={accent}>
          Add job
        </AddButton>
      </div>
    </div>
  );
}

function EducationPanel({ education, update, add, remove, accent }) {
  return (
    <div>
      <SectionHeading icon={GraduationCap} title="Education" subtitle="Degrees or bootcamps." />
      <div className="flex flex-col gap-3">
        {education.map((ed) => (
          <EntryCard key={ed.id} onRemove={() => remove(ed.id)} removeLabel="Remove this entry">
            <Field label="Institution / Provider" placeholder="University of Texas" value={ed.school} onChange={(e) => update(ed.id, "school", e.target.value)} />
            <div className="grid grid-cols-4 gap-3">
              <SelectField
                label="Type"
                options={["Degree"]}
                value={ed.type}
                onChange={(e) => update(ed.id, "type", e.target.value)}
              />
              <Field
                label="Degree"
                placeholder="B.F.A."
                value={ed.degree}
                onChange={(e) => update(ed.id, "degree", e.target.value)}
              />
              <Field
                label="Field of study"
                placeholder="Design"
                value={ed.field}
                onChange={(e) => update(ed.id, "field", e.target.value)}
              />
              <Field label="Language" placeholder="English" value={ed.language} onChange={(e) => update(ed.id, "language", e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Start" placeholder="2015" value={ed.start} onChange={(e) => update(ed.id, "start", e.target.value)} />
              <Field label="End" placeholder="2019" value={ed.end} onChange={(e) => update(ed.id, "end", e.target.value)} />
              <Field label="GPA" placeholder="Optional" value={ed.gpa} onChange={(e) => update(ed.id, "gpa", e.target.value)} />
            </div>
          </EntryCard>
        ))}
        <AddButton onClick={add} accent={accent}>
          Add education
        </AddButton>
      </div>
    </div>
  );
}

function SkillsPanel({ skills, add, remove, accent }) {
  const [draft, setDraft] = useState("");

  const submit = () => {
    const value = draft.trim();
    if (!value) return;
    add(value);
    setDraft("");
  };

  return (
    <div>
      <SectionHeading icon={Sparkles} title="Skills" subtitle="Press Enter or tap Add after each one." />
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="e.g. Figma or Certification"
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[13.5px] outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
        />
        <button
          type="button"
          onClick={submit}
          style={{ backgroundColor: accent }}
          className="shrink-0 rounded-lg px-3.5 text-[13px] font-medium text-white transition hover:opacity-90"
        >
          Add
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {skills.length === 0 && <p className="text-[12.5px] text-neutral-400 italic">No skills added yet.</p>}
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="flex items-center gap-1.5 rounded-full bg-neutral-100 py-1 pl-3 pr-1.5 text-[12.5px] font-medium text-neutral-700"
          >
            {skill.name}
            <button
              type="button"
              onClick={() => remove(skill.id)}
              className="rounded-full p-0.5 text-neutral-400 transition hover:bg-neutral-200 hover:text-neutral-600"
            >
              <X size={11} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function LanguagePanel({ languages, add, remove, accent }) {
  const [draft, setDraft] = useState("");

  const submit = () => {
    const value = draft.trim();
    if (!value) return;
    add(value);
    setDraft("");
  };

  return (
    <div>
      <SectionHeading icon={Globe} title="Languages" subtitle="Add the languages you speak or write." />
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="e.g. English"
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[13.5px] outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
        />
        <button
          type="button"
          onClick={submit}
          style={{ backgroundColor: accent }}
          className="shrink-0 rounded-lg px-3.5 text-[13px] font-medium text-white transition hover:opacity-90"
        >
          Add
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {languages.length === 0 && <p className="text-[12.5px] text-neutral-400 italic">No languages added yet.</p>}
        {languages.map((language) => (
          <span
            key={language.id}
            className="flex items-center gap-1.5 rounded-full bg-neutral-100 py-1 pl-3 pr-1.5 text-[12.5px] font-medium text-neutral-700"
          >
            {language.name}
            <button
              type="button"
              onClick={() => remove(language.id)}
              className="rounded-full p-0.5 text-neutral-400 transition hover:bg-neutral-200 hover:text-neutral-600"
            >
              <X size={11} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   4. RESUME TEMPLATES  (pure render of the `data` object — no local state)
   ------------------------------------------------------------------------- */

// Small helper: turns a textarea's newline-separated string into bullet items.
const bullets = (text) =>
  (text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

function LoginPage({
  accent,
  email,
  password,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onRegister,
}) {

  return (
    <div
      className="flex h-screen items-center justify-center px-4 py-10 text-slate-100"
      style={{ background: "linear-gradient(135deg, #e1e3ed 0%, #d7dbe4 45%, #d3d6db 100%)" }}
    >
      <div className="w-full max-w-md rounded-3xl border border-slate-500/20 bg-slate-950 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-200/10 text-3xl text-slate-100" style={{ boxShadow: `0 0 0 1px ${accent}33` }}>
            R
          </div>
          <h1 className="mt-6 text-3xl font-semibold">Resume Builder </h1>
          <p className="mt-2 text-sm text-slate-400"> Login page</p>
        </div>

        <form className="space-y-5" onSubmit={onSubmit}>
          <label className="block text-sm font-medium text-slate-300">
            Email
            <input
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-transparent focus:ring-2 focus:ring-slate-400"
            />
          </label>

          <label className="block text-sm font-medium text-slate-300">
            Password
            <input
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-transparent focus:ring-2 focus:ring-slate-400"
            />
          </label>



          {error && <p className="text-sm text-rose-300">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-2xl bg-slate-100/10 border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-100/15"
            style={{ boxShadow: `0 20px 45px -30px ${accent}` }}
          >
            Login in
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onRegister}
            className="font-semibold text-slate-300 hover:text-white"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

function RegisterPage({
  accent,
  email,
  password,
  confirmPassword,
  error,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onLogin,
}) {
  return (
    <div
      className="flex h-screen items-center justify-center px-4 py-10 text-slate-100"
      style={{
        background:
          "linear-gradient(135deg, #e1e3ed 0%, #d7dbe4 45%, #d3d6db 100%)",
      }}
    >
      <div className="w-full max-w-md rounded-3xl border border-slate-500/20 bg-slate-950 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-200/10 text-3xl text-slate-100"
            style={{ boxShadow: `0 0 0 1px ${accent}33` }}
          >
            R
          </div>

          <h1 className="mt-6 text-3xl font-semibold">
            Resume Builder
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Create your account
          </p>
        </div>

        <form className="space-y-5" onSubmit={onSubmit}>
          <label className="block text-sm font-medium text-slate-300">
            Email
            <input
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-transparent focus:ring-2 focus:ring-slate-400"
            />
          </label>

          <label className="block text-sm font-medium text-slate-300">
            Password
            <input
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-transparent focus:ring-2 focus:ring-slate-400"
            />
          </label>

          <label className="block text-sm font-medium text-slate-300">
            Confirm Password
            <input
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-transparent focus:ring-2 focus:ring-slate-400"
            />
          </label>

          {error && (
            <p className="text-sm text-rose-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-2xl border border-slate-700 bg-slate-100/10 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-100/15"
            style={{ boxShadow: `0 20px 45px -30px ${accent}` }}
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onLogin}
            className="font-semibold text-slate-300 hover:text-white"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   5. APP SHELL
   ------------------------------------------------------------------------- */

const TABS = [
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "personal", label: "Personal Info", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "languages", label: "Languages", icon: Globe },
];

export default function ResumeBuilder() {
  // ---- Unified state -------------------------------------------------
  const [template, setTemplate] = useState("modern");
  const [accent, setAccent] = useState(ACCENT_COLORS[0].value);
  const [zoom, setZoom] = useState(85);
  const [activeTab, setActiveTab] = useState("templates");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState("");

  const [personal, setPersonal] = useState(initialData.personal);
  const [experience, setExperience] = useState(initialData.experience);
  const [education, setEducation] = useState(initialData.education);
  const [skills, setSkills] = useState(initialData.skills.map((name) => ({ id: uid(), name })));
  const [languages, setLanguages] = useState(initialData.languages.map((name) => ({ id: uid(), name })));
  const [projects, setProjects] = useState([]);

  // ---- Handlers --------------------------------------------------------
  const updatePersonal = (field, value) => setPersonal((p) => ({ ...p, [field]: value }));

  const addExperience = () => setExperience((list) => [...list, emptyExperience()]);
  const updateExperience = (id, field, value) =>
    setExperience((list) => list.map((job) => (job.id === id ? { ...job, [field]: value } : job)));
  const removeExperience = (id) => setExperience((list) => list.filter((job) => job.id !== id));

  const addEducation = () => setEducation((list) => [...list, emptyEducation()]);
  const updateEducation = (id, field, value) =>
    setEducation((list) => list.map((ed) => (ed.id === id ? { ...ed, [field]: value } : ed)));
  const removeEducation = (id) => setEducation((list) => list.filter((ed) => ed.id !== id));

  const addSkill = (name) => setSkills((list) => [...list, { id: uid(), name }]);
  const removeSkill = (id) => setSkills((list) => list.filter((s) => s.id !== id));
  const addLanguage = (name) => setLanguages((list) => [...list, { id: uid(), name }]);
  const removeLanguage = (id) => setLanguages((list) => list.filter((language) => language.id !== id));
  const addProject = () =>
    setProjects((list) => [...list, emptyProject()]);

  const updateProject = (id, field, value) =>
    setProjects((list) =>
      list.map((project) =>
        project.id === id
          ? { ...project, [field]: value }
          : project
      )
    );

  const removeProject = (id) =>
    setProjects((list) =>
      list.filter((project) => project.id !== id)
    );

  const resumeData = { personal, experience, education, skills, languages, projects, };
  const zoomIn = () => setZoom((z) => Math.min(150, z + 10));
  const zoomOut = () => setZoom((z) => Math.max(50, z - 10));
  const exportPdf = () => window.print();
  const saveResume = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/resume/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: Number(localStorage.getItem("user_id")),
          full_name: personal.name,
          title: personal.title,
          email: personal.email,
          phone: personal.phone,
          address: personal.location,
          summary: personal.summary,
          education: JSON.stringify(education),
          experience: JSON.stringify(experience),
          skills: JSON.stringify(skills),
          projects: JSON.stringify(projects),
          language: languages.map((language) => language.name).join(", "),
        }),
      });


      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to save resume.");
        return;
      }

      alert("Resume saved successfully!");
      console.log(data);
    } catch (error) {
      console.error(error);
      alert("Unable to connect to backend server.");
    }
  };
  const loadResume = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const response = await fetch(
        `http://localhost:5000/api/resume/load/${userId}`
      );

      const data = await response.json();

      if (!response.ok) {
        console.log("No resume found");
        return;
      }

      console.log("Resume loaded:", data);

      // -------------------------
      // PERSONAL
      // -------------------------
      setPersonal({
        name: data.full_name || "",
        title: data.title || "",
        email: data.email || "",
        phone: data.phone || "",
        location: data.address || "",
        website: data.website || "",
        photo: data.photo || "",
        summary: data.summary || "",
      });
      // -------------------------
      // EXPERIENCE
      // -------------------------
      let experienceData = [];

      try {
        if (Array.isArray(data.experience)) {
          experienceData = data.experience;
        } else if (typeof data.experience === "string") {
          experienceData = JSON.parse(data.experience || "[]");
        }
      } catch (error) {
        console.error("Experience parse error:", error);
        experienceData = [];
      }

      setExperience(
        Array.isArray(experienceData) ? experienceData : []
      );

      // -------------------------
      // EDUCATION
      // -------------------------
      let educationData = [];

      try {
        if (Array.isArray(data.education)) {
          educationData = data.education;
        } else if (typeof data.education === "string") {
          educationData = JSON.parse(data.education || "[]");
        }
      } catch (error) {
        console.error("Education parse error:", error);
        educationData = [];
      }

      setEducation(
        Array.isArray(educationData) ? educationData : []
      );

      // -------------------------
      // SKILLS
      // -------------------------
      let skillsData = [];

      try {
        if (Array.isArray(data.skills)) {
          skillsData = data.skills;
        } else if (typeof data.skills === "string") {
          try {
            const parsedSkills = JSON.parse(data.skills);

            if (Array.isArray(parsedSkills)) {
              skillsData = parsedSkills;
            } else {
              skillsData = data.skills
                .split(",")
                .map((name) => name.trim())
                .filter(Boolean);
            }
          } catch {
            skillsData = data.skills
              .split(",")
              .map((name) => name.trim())
              .filter(Boolean);
          }
        }
      } catch (error) {
        console.error("Skills parse error:", error);
        skillsData = [];
      }

      setSkills(
        skillsData.map((skill) => {
          if (typeof skill === "string") {
            return {
              id: uid(),
              name: skill,
            };
          }

          return {
            ...skill,
            id: skill.id || uid(),
          };
        })
      );

      // -------------------------
      // LANGUAGES
      // -------------------------
      let languagesData = [];

      try {
        if (Array.isArray(data.language)) {
          languagesData = data.language;
        } else if (typeof data.language === "string") {
          try {
            const parsedLanguages = JSON.parse(data.language);

            if (Array.isArray(parsedLanguages)) {
              languagesData = parsedLanguages;
            } else {
              languagesData = data.language
                .split(",")
                .map((name) => name.trim())
                .filter(Boolean);
            }
          } catch {
            languagesData = data.language
              .split(",")
              .map((name) => name.trim())
              .filter(Boolean);
          }
        }
      } catch (error) {
        console.error("Languages parse error:", error);
        languagesData = [];
      }

      setLanguages(
        languagesData.map((language) => {
          if (typeof language === "string") {
            return {
              id: uid(),
              name: language,
            };
          }

          return {
            ...language,
            id: language.id || uid(),
          };
        })
      );
      // -------------------------
      // PROJECTS
      // -------------------------
      let projectsData = [];

      try {
        if (Array.isArray(data.projects)) {
          projectsData = data.projects;
        } else if (typeof data.projects === "string") {
          try {
            const parsedProjects = JSON.parse(data.projects);

            if (Array.isArray(parsedProjects)) {
              projectsData = parsedProjects;
            }
          } catch (error) {
            console.error("Projects parse error:", error);
            projectsData = [];
          }
        }
      } catch (error) {
        console.error("Projects load error:", error);
        projectsData = [];
      }

      setProjects(
        projectsData.map((project) => ({
          ...project,
          id: project.id || uid(),
        }))
      );

    } catch (error) {
      console.error("Load resume error:", error);
    }
  };


  useEffect(() => {
    if (isAuthenticated) {
      loadResume();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginEmail("");
    setLoginPassword("");
    setLoginError("");
  };

  useEffect(() => {
    let inactivityTimer;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);

      inactivityTimer = setTimeout(() => {
        handleLogout();
      }, 5 * 60 * 1000); // 5 minutes
    };

    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    resetInactivityTimer();

    return () => {
      clearTimeout(inactivityTimer);

      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    const email = loginEmail.trim();
    const password = loginPassword.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      setLoginError("Please enter email and password.");
      return;
    }

    if (!emailPattern.test(email)) {
      setLoginError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setLoginError("Password must be at least 8 characters long.");
      return;
    }

    try {
      setLoginError("");

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      console.log("LOGIN DATA:", data);

      if (!response.ok) {
        setLoginError(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("user_id", data.user.id);
      setIsAuthenticated(true);
      setLoginPassword("");
    } catch (error) {
      console.error(error);
      setLoginError("Unable to connect to backend server.");
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const email = registerEmail.trim();
    const password = registerPassword.trim();
    const confirmPassword = registerConfirmPassword.trim();

    if (!email || !password || !confirmPassword) {
      setRegisterError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setRegisterError("Password and Confirm Password do not match.");
      return;
    }

    if (password.length < 8) {
      setRegisterError("Password must be at least 8 characters long.");
      return;
    }

    try {
      setRegisterError("");

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setRegisterError(data.message || "Registration failed.");
        return;
      }

      alert("Registration successful! Please login.");

      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
      setRegisterError("");
      setShowRegister(false);
    } catch (error) {
      console.error(error);
      setRegisterError("Unable to connect to backend server.");
    }
  };
  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <RegisterPage
          accent={accent}
          email={registerEmail}
          password={registerPassword}
          confirmPassword={registerConfirmPassword}
          error={registerError}
          onEmailChange={setRegisterEmail}
          onPasswordChange={setRegisterPassword}
          onConfirmPasswordChange={setRegisterConfirmPassword}
          onSubmit={handleRegister}
          onLogin={() => {
            setShowRegister(false);
            setRegisterError("");
          }}
        />
      );
    }

    return (
      <LoginPage
        accent={accent}
        email={loginEmail}
        password={loginPassword}
        error={loginError}
        onEmailChange={setLoginEmail}
        onPasswordChange={setLoginPassword}
        onSubmit={handleLogin}
        onRegister={() => {
          setShowRegister(true);
          setLoginError("");
        }}
      />
    );
  }


  return (
    <div className="flex h-screen w-full overflow-hidden bg-neutral-100 text-neutral-900" style={{ fontFamily: FONT_UI }}>
      {/* Fonts + print rules. In a real Vite app these @imports can move to index.css */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

        #resume-page::-webkit-scrollbar, .sidebar-scroll::-webkit-scrollbar { width: 8px; }
        #resume-page::-webkit-scrollbar-thumb, .sidebar-scroll::-webkit-scrollbar-thumb { background: #d4d4d4; border-radius: 8px; }

        @media print {
          .no-print { display: none !important; }
          #canvas-scroll { overflow: visible !important; padding: 0 !important; background: white !important; }
          #resume-page-wrapper { transform: none !important; box-shadow: none !important; }
          #resume-page { width: 210mm !important; min-height: 297mm !important; }
          body { margin: 0; }
        }
      `}</style>

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden no-print" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ============ SIDEBAR ============ */}
      <aside
        className={`no-print fixed z-40 flex h-full w-[21rem] shrink-0 flex-col border-r border-neutral-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md text-white" style={{ backgroundColor: accent }}>
              <Sparkles size={15} />
            </div>
            <span className="text-[20px] font-bold tracking-tight">ResumeForge</span>
          </div>
          <button className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <nav className="flex gap-1 overflow-x-auto border-b border-neutral-200 px-3 py-2">
          {TABS.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex shrink-0 flex-col items-center gap-1 rounded-lg px-3 py-2 text-[10.5px] font-medium transition"
                style={{
                  color: active ? accent : "#8A8A8E",
                  backgroundColor: active ? `${accent}14` : "transparent",
                }}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Panel content */}
        <div className="sidebar-scroll flex-1 overflow-y-auto px-5 py-6">
          {activeTab === "templates" && <TemplatesPanel template={template} setTemplate={setTemplate} accent={accent} />}
          {activeTab === "personal" && <PersonalPanel personal={personal} onChange={updatePersonal} accent={accent} />}
          {activeTab === "experience" && (
            <ExperiencePanel experience={experience} update={updateExperience} add={addExperience} remove={removeExperience} accent={accent} />
          )}
          {activeTab === "education" && (
            <EducationPanel education={education} update={updateEducation} add={addEducation} remove={removeEducation} accent={accent} />
          )}
          {activeTab === "projects" && (
            <ProjectsPanel projects={projects} update={updateProject} add={addProject} remove={removeProject} accent={accent} />
          )}
          {activeTab === "skills" && <SkillsPanel skills={skills} add={addSkill} remove={removeSkill} accent={accent} />}
          {activeTab === "languages" && <LanguagePanel languages={languages} add={addLanguage} remove={removeLanguage} accent={accent} />}
        </div>
        <div className="border-t border-neutral-200 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ============ MAIN ============ */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Control bar */}
        <div className="no-print flex h-16 shrink-0 items-center justify-between gap-3 border-b border-neutral-200 bg-white px-5">
          <div className="flex items-center gap-3">
            <button className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu size={18} />
            </button>
            {/* Zoom controls */}
            <div className="flex items-center gap-1 rounded-lg border border-neutral-200 px-1 py-1">
              <button onClick={zoomOut} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100">
                <ZoomOut size={15} />
              </button>
              <span className="w-11 text-center text-[12.5px] font-medium text-neutral-600">{zoom}%</span>
              <button onClick={zoomIn} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100">
                <ZoomIn size={15} />
              </button>
            </div>
            <span className="hidden text-[12px] text-neutral-400 sm:inline">A4 · 210 × 297 mm</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Color picker */}
            <div className="flex items-center gap-1.5">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c.value}
                  title={c.name}
                  onClick={() => setAccent(c.value)}
                  className="h-6 w-6 rounded-full ring-offset-2 transition"
                  style={{
                    backgroundColor: c.value,
                    boxShadow: accent === c.value ? `0 0 0 2px white, 0 0 0 4px ${c.value}` : "none",
                  }}
                />
              ))}
            </div>
            <button
              onClick={saveResume}
              style={{ backgroundColor: accent }}
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold text-white transition hover:opacity-90"
            >
              Save Resume
            </button>
            <button
              onClick={exportPdf}
              style={{ backgroundColor: accent }}
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold text-white transition hover:opacity-90"
            >
              <Download size={14} /> Export PDF
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div id="canvas-scroll" className="flex-1 overflow-auto bg-neutral-200 px-8 py-10">
          <div className="flex justify-center">
            <div
              id="resume-page-wrapper"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", transition: "transform 150ms ease" }}
            >
              <div id="resume-page" className="h-[297mm] w-[210mm] overflow-hidden bg-white shadow-2xl">
                {template === "modern" ? (
                  <ModernTemplate data={resumeData} accent={accent} />
                ) : template === "professional" ? (
                  <ProfessionalTemplate data={resumeData} accent={accent} />
                ) : template === "creative" ? (
                  <CreativeTemplate data={resumeData} accent={accent} />
                ) : (
                  <ClassicTemplate data={resumeData} accent={accent} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
