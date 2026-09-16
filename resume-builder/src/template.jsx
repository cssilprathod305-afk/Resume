import { Mail, Phone, MapPin, Globe } from "lucide-react";

const FONT_UI = "'Outfit', system-ui, sans-serif";
const FONT_BODY = "'Inter', system-ui, sans-serif";
const FONT_DISPLAY = "'Fraunces', Georgia, serif";

const bullets = (text) =>
  (text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

function ContactLine({ personal }) {
  const items = [
    { icon: Mail, value: personal.email },
    { icon: Phone, value: personal.phone },
    { icon: MapPin, value: personal.location },
    { icon: Globe, value: personal.website },
  ].filter((i) => i.value);

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {items.map(({ icon: Icon, value }, i) => (
        <span key={i} className="flex items-center gap-1.5 text-[12px] text-neutral-500">
          <Icon size={12} /> {value}
        </span>
      ))}
    </div>
  );
}

function EmptyHint({ children }) {
  return <p className="text-[12.5px] italic text-neutral-400">{children}</p>;
}

export function ModernTemplate({ data, accent }) {
  const { personal, experience, education, skills, languages, projects } = data;

  const experienceList = Array.isArray(experience) ? experience : [];
  const educationList = Array.isArray(education) ? education : [];
  const skillsList = Array.isArray(skills) ? skills : [];
  const languagesList = Array.isArray(languages) ? languages : [];
  const projectsList = Array.isArray(projects) ? projects : [];


  return (
    <div className="flex h-full w-full flex-col px-14 py-16" style={{ fontFamily: FONT_BODY }}>
      <header className="mb-8">
        <div className="flex items-start gap-5">
          {personal.photo && (
            <img
              src={personal.photo}
              alt={personal.name || "Profile"}
              className="h-20 w-20 shrink-0 rounded-full object-cover"
              style={{ boxShadow: `0 0 0 3px white, 0 0 0 4px ${accent}55` }}
            />
          )}
          <div className="min-w-0">
            <h1
              className="text-[38px] leading-tight text-neutral-900"
              style={{ fontFamily: FONT_DISPLAY, fontWeight: 600 }}
            >
              {personal.name || <span className="text-neutral-300">Your Name</span>}
            </h1>
            {personal.title && (
              <p className="mt-1 text-[14px] font-medium uppercase tracking-wider" style={{ color: accent }}>
                {personal.title}
              </p>
            )}
            <div className="mt-3">
              <ContactLine personal={personal} />
            </div>
          </div>
        </div>
        <div className="mt-6 h-px w-full" style={{ backgroundColor: accent, opacity: 0.35 }} />
      </header>

      {personal.summary && <p className="mb-8 text-[13.5px] leading-relaxed text-neutral-600">{personal.summary}</p>}

      <section className="mb-8">
        <h2 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>
          Experience
        </h2>
        {experienceList.length === 0 && <EmptyHint>No experience added yet — add your first role in the sidebar.</EmptyHint>}
        <div className="flex flex-col gap-6">
          {experienceList.map((job) => (
            <div key={job.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="text-[15px] font-semibold text-neutral-900">
                  {job.role || <span className="text-neutral-300">Role</span>}
                  {job.company && <span className="font-normal text-neutral-500"> · {job.company}</span>}
                </h3>
                {(job.start || job.end || job.current) && (
                  <span className="text-[12px] text-neutral-400">
                    {job.start} — {job.current ? "Present" : job.end}
                  </span>
                )}
              </div>
              {job.location && <p className="text-[12px] italic text-neutral-400">{job.location}</p>}
              {bullets(job.description).length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] leading-relaxed text-neutral-600">
                  {bullets(job.description).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>
          Education
        </h2>
        {educationList.length === 0 && <EmptyHint>No education added yet.</EmptyHint>}
        <div className="flex flex-col gap-3">
          {educationList.map((ed) => (
            <div key={ed.id} className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="text-[14px] font-semibold text-neutral-900">
                {ed.type === "Certification" ? ed.degree || "Certification" : ed.degree || "Degree"}
                {ed.field && <span className="font-normal text-neutral-500">, {ed.field}</span>}
                {ed.language && <span className="font-normal text-neutral-500">, {ed.language}</span>}
                {ed.school && <span className="font-normal text-neutral-500"> — {ed.school}</span>}
              </h3>
              {(ed.start || ed.end) && (
                <span className="text-[12px] text-neutral-400">
                  {ed.start} — {ed.end}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {projectsList.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-3">
            Projects
          </h2>

          <div className="space-y-4">
            {projectsList.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-semibold text-sm">
                      {project.name}
                    </h3>

                    {project.role && (
                      <p className="text-xs text-gray-600">
                        {project.role}
                      </p>
                    )}
                  </div>

                  {(project.start || project.end) && (
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {project.start}
                      {project.start && project.end ? " - " : ""}
                      {project.end}
                    </span>
                  )}
                </div>

                {project.description && (
                  <p className="text-xs text-gray-700 mt-1">
                    {project.description}
                  </p>
                )}

                {project.technologies && (
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>Technologies:</strong>{" "}
                    {project.technologies}
                  </p>
                )}

                {project.link && (
                  <p className="text-xs text-gray-600 mt-1">
                    {project.link}
                  </p>
                )}

                {project.github && (
                  <p className="text-xs text-gray-600">
                    {project.github}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>
          Skills
        </h2>
        {skillsList.length === 0 ? (
          <EmptyHint>No skills added yet.</EmptyHint>
        ) : (
          <p className="text-[13px] leading-relaxed text-neutral-600">{skills.map((s) => s.name).join("   ·   ")}</p>
        )}
      </section>


      <section>
        <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>
          Languages
        </h2>
        {languagesList.length === 0 ? (
          <EmptyHint>No languages added yet.</EmptyHint>
        ) : (
          <p className="text-[13px] leading-relaxed text-neutral-600">{languages.map((language) => language.name).join("   ·   ")}</p>
        )}
      </section>
    </div>
  );
}

export function ClassicTemplate({ data, accent }) {
  const { personal, experience, education, skills, languages, projects } = data;
  const initials =
    (personal.name || "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "?";

  return (
    <div className="flex h-full w-full" style={{ fontFamily: FONT_BODY }}>
      <aside className="w-[32%] border-r border-neutral-200 bg-slate-950 px-8 py-10 text-white">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 text-[28px] font-semibold">
          {personal.photo ? (
            <img src={personal.photo} alt={personal.name || "Profile"} className="h-full w-full rounded-full object-cover" />
          ) : (
            initials
          )}
        </div>

        <h2 className="mb-2 text-[12px] uppercase tracking-[0.2em] text-slate-400">Contact</h2>
        <div className="space-y-2 text-[13px] leading-snug text-slate-100">
          {personal.email && <p>{personal.email}</p>}
          {personal.phone && <p>{personal.phone}</p>}
          {personal.location && <p>{personal.location}</p>}
          {personal.website && <p>{personal.website}</p>}
          {!personal.email && !personal.phone && !personal.location && !personal.website && (
            <p className="text-slate-500 italic">Add contact details in the sidebar.</p>
          )}
        </div>

        <div className="mt-8">
          <h2 className="mb-2 text-[12px] uppercase tracking-[0.2em] text-slate-400">Skills</h2>
          <div className="grid gap-2 text-[13px]">
            {skills.length === 0 ? (
              <p className="text-slate-500 italic">No skills added yet.</p>
            ) : (
              skills.map((skill) => (
                <span key={skill.id} className="inline-flex rounded-full bg-white/10 px-3 py-1 text-white">
                  {skill.name}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-2 text-[12px] uppercase tracking-[0.2em] text-slate-400">Languages</h2>
          <div className="grid gap-2 text-[13px]">
            {languages?.length === 0 ? (
              <p className="text-slate-500 italic">No languages added yet.</p>
            ) : (
              languages.map((language) => (
                <span key={language.id} className="inline-flex rounded-full bg-white/10 px-3 py-1 text-white">
                  {language.name}
                </span>
              ))
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 px-10 py-10">
        <div className="mb-8 border-b border-neutral-200 pb-8">
          <h1 className="text-[34px] font-semibold text-neutral-900" style={{ fontFamily: FONT_DISPLAY }}>
            {personal.name || <span className="text-neutral-300">Your Name</span>}
          </h1>
          {personal.title && <p className="mt-2 text-[14px] font-medium uppercase tracking-[0.18em]" style={{ color: accent }}>{personal.title}</p>}
          {personal.summary && <p className="mt-5 max-w-2xl text-[14px] leading-relaxed text-neutral-600">{personal.summary}</p>}
        </div>

        <section className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-[12px] uppercase tracking-[0.18em] text-neutral-500">Experience</h2>
            {experience.length === 0 ? (
              <EmptyHint>No experience added yet — add your first role in the sidebar.</EmptyHint>
            ) : (
              <div className="space-y-6">
                {experience.map((job) => (
                  <div key={job.id} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <h3 className="text-[15px] font-semibold text-neutral-900">{job.role || <span className="text-neutral-300">Role</span>}</h3>
                      {(job.start || job.end || job.current) && (
                        <span className="text-[12px] text-neutral-400">{job.start} — {job.current ? "Present" : job.end}</span>
                      )}
                    </div>
                    <p className="mt-1 text-[12px] text-neutral-500">
                      {job.company}{job.company && job.location ? " · " : ""}{job.location}
                    </p>
                    {bullets(job.description).length > 0 && (
                      <ul className="mt-3 list-disc space-y-1 pl-4 text-[13px] leading-relaxed text-neutral-600">
                        {bullets(job.description).map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-4 text-[12px] uppercase tracking-[0.18em] text-neutral-500">Education</h2>
            {education.length === 0 ? (
              <EmptyHint>No education added yet.</EmptyHint>
            ) : (
              <div className="space-y-4">
                {education.map((ed) => (
                  <div key={ed.id} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <h3 className="text-[14px] font-semibold text-neutral-900">
                        {ed.type === "Certification" ? ed.degree || "Certification" : ed.degree || "Degree"}
                        {ed.field && <span className="font-normal text-neutral-500">, {ed.field}</span>}
                        {ed.language && <span className="font-normal text-neutral-500">, {ed.language}</span>}
                      </h3>
                      {(ed.start || ed.end) && (
                        <span className="text-[12px] text-neutral-400">{ed.start} — {ed.end}</span>
                      )}
                    </div>
                    {ed.school && <p className="mt-1 text-[12px] text-neutral-500">{ed.school}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
          {Array.isArray(projects) && projects.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-4 text-[12px] uppercase tracking-[0.18em] text-neutral-500">
                Projects
              </h2>

              <div className="grid gap-4 lg:grid-cols-2">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <h3 className="text-[14px] font-semibold text-neutral-900">
                        {project.name || "Project Name"}
                      </h3>

                      {(project.start || project.end) && (
                        <span className="text-[12px] text-neutral-400">
                          {project.start} — {project.end}
                        </span>
                      )}
                    </div>

                    {project.role && (
                      <p className="mt-1 text-[12px] text-neutral-500">
                        {project.role}
                      </p>
                    )}

                    {project.description && (
                      <p className="mt-3 text-[13px] leading-relaxed text-neutral-600">
                        {project.description}
                      </p>
                    )}

                    {project.technologies && (
                      <p className="mt-2 text-[12px] text-neutral-500">
                        <span className="font-semibold">Technologies:</span>{" "}
                        {project.technologies}
                      </p>
                    )}

                    {project.link && (
                      <p className="mt-1 break-all text-[12px] text-neutral-500">
                        {project.link}
                      </p>
                    )}

                    {project.github && (
                      <p className="break-all text-[12px] text-neutral-500">
                        {project.github}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}

export function CreativeTemplate({ data, accent }) {
  const { personal, experience, education, skills, languages, projects } = data;
  const initials =
    (personal.name || "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "?";

  return (
    <div className="flex h-full w-full flex-col gap-8 px-14 py-16" style={{ fontFamily: FONT_BODY }}>
      <header className="rounded-[32px] border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Resume</p>
            <h1 className="mt-3 text-[38px] font-semibold tracking-tight text-neutral-900" style={{ fontFamily: FONT_DISPLAY }}>
              {personal.name || <span className="text-neutral-300">Your Name</span>}
            </h1>
            {personal.title && <p className="mt-2 text-[14px] font-semibold" style={{ color: accent }}>{personal.title}</p>}
          </div>
          <div className="flex items-center gap-3 rounded-3xl bg-slate-950 px-5 py-4 text-white shadow-inner" style={{ borderColor: accent }}>
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl font-semibold">
              {personal.photo ? (
                <img src={personal.photo} alt={personal.name || "Profile"} className="h-full w-full rounded-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div>
              <div className="text-[12px] uppercase tracking-[0.16em] text-slate-300">Contact</div>
              <div className="mt-2 text-sm leading-snug text-slate-100">
                {personal.email || "email@example.com"}
                <br />
                {personal.phone || "+1 (555) 000-0000"}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <main className="space-y-8 rounded-[32px] border border-neutral-200 bg-white p-8 shadow-sm">
          {personal.summary && <p className="text-[13.5px] leading-relaxed text-neutral-600">{personal.summary}</p>}

          <section>
            <h2 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Experience</h2>
            {experience.length === 0 ? (
              <EmptyHint>No experience added yet — add your first role in the sidebar.</EmptyHint>
            ) : (
              <div className="space-y-6">
                {experience.map((job) => (
                  <div key={job.id}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <h3 className="text-[15px] font-semibold text-neutral-900">
                        {job.role || <span className="text-neutral-300">Role</span>}
                      </h3>
                      {(job.start || job.end || job.current) && (
                        <span className="text-[12px] text-neutral-400">
                          {job.start} — {job.current ? "Present" : job.end}
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-neutral-500">
                      {job.company}
                      {job.company && job.location ? " · " : ""}
                      {job.location}
                    </p>
                    {bullets(job.description).length > 0 && (
                      <ul className="mt-3 list-disc space-y-1 pl-4 text-[13px] leading-relaxed text-neutral-600">
                        {bullets(job.description).map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Education</h2>
            {education.length === 0 ? (
              <EmptyHint>No education added yet.</EmptyHint>
            ) : (
              <div className="space-y-4">
                {education.map((ed) => (
                  <div key={ed.id}>
                    <h3 className="text-[14px] font-semibold text-neutral-900">
                      {ed.type === "Certification" ? ed.degree || "Certification" : ed.degree || "Degree"}
                      {ed.field && <span className="font-normal text-neutral-500">, {ed.field}</span>}
                      {ed.language && <span className="font-normal text-neutral-500">, {ed.language}</span>}
                    </h3>
                    <p className="text-[12px] text-neutral-500">{ed.school}</p>
                    {(ed.start || ed.end) && <p className="text-[12px] text-neutral-400">{ed.start} — {ed.end}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>
          {Array.isArray(projects) && projects.length > 0 && (
            <section>
              <h2 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Projects
              </h2>

              <div className="space-y-5">
                {projects.map((project) => (
                  <div key={project.id}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <h3 className="text-[14px] font-semibold text-neutral-900">
                        {project.name || "Project Name"}
                      </h3>

                      {(project.start || project.end) && (
                        <span className="text-[12px] text-neutral-400">
                          {project.start} — {project.end}
                        </span>
                      )}
                    </div>

                    {project.role && (
                      <p className="text-[12px] text-neutral-500">
                        {project.role}
                      </p>
                    )}

                    {project.description && (
                      <p className="mt-2 text-[13px] leading-relaxed text-neutral-600">
                        {project.description}
                      </p>
                    )}

                    {project.technologies && (
                      <p className="mt-1 text-[12px] text-neutral-500">
                        <span className="font-semibold">Technologies:</span>{" "}
                        {project.technologies}
                      </p>
                    )}

                    {project.link && (
                      <p className="mt-1 break-all text-[12px] text-neutral-500">
                        {project.link}
                      </p>
                    )}

                    {project.github && (
                      <p className="break-all text-[12px] text-neutral-500">
                        {project.github}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        <aside className="space-y-6 rounded-[32px] border border-neutral-200 bg-slate-950 p-8 text-white shadow-sm">
          <div>
            <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-300">Highlights</h3>
            <div className="space-y-3 text-[13px] leading-relaxed text-slate-100">
              {skills.length === 0 ? (
                <p className="text-slate-400">No skills yet.</p>
              ) : (
                skills.map((skill) => <p key={skill.id}>• {skill.name}</p>)
              )}
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-300">Contact</h3>
            <div className="space-y-2 text-[13px] text-slate-100">
              {personal.email && <p>{personal.email}</p>}
              {personal.phone && <p>{personal.phone}</p>}
              {personal.location && <p>{personal.location}</p>}
              {personal.website && <p>{personal.website}</p>}
              {!personal.email && !personal.phone && !personal.location && !personal.website && (
                <p className="text-slate-400">No contact details yet.</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-300">
              Languages
            </h3>

            <div className="space-y-2 text-[13px] text-slate-100">
              {Array.isArray(languages) && languages.length > 0 ? (
                languages.map((language) => (
                  <p key={language.id}>• {language.name}</p>
                ))
              ) : (
                <p className="text-slate-400">No languages added yet.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function ProfessionalTemplate({ data, accent }) {
  const { personal, experience, education, skills, languages, projects } = data;
  const initials =
    (personal.name || "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "?";

  return (
    <div className="flex h-full w-full" style={{ fontFamily: FONT_BODY }}>
      <aside className="flex w-[34%] shrink-0 flex-col gap-8 px-7 py-12 text-white" style={{ backgroundColor: accent }}>
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-white/40 text-xl font-semibold">
          {personal.photo ? (
            <img src={personal.photo} alt={personal.name || "Profile"} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>

        <div>
          <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">Contact</h3>
          <div className="flex flex-col gap-2 text-[12.5px]">
            {[
              { icon: Mail, value: personal.email },
              { icon: Phone, value: personal.phone },
              { icon: MapPin, value: personal.location },
              { icon: Globe, value: personal.website },
            ]
              .filter((i) => i.value)
              .map(({ icon: Icon, value }, i) => (
                <span key={i} className="flex items-center gap-2 break-all">
                  <Icon size={12} className="shrink-0 opacity-80" /> {value}
                </span>
              ))}
            {!personal.email && !personal.phone && !personal.location && !personal.website && (
              <span className="text-white/50 italic text-[12px]">No contact details yet.</span>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">Skills</h3>
          {skills.length === 0 ? (
            <span className="text-white/50 italic text-[12px]">No skills added yet.</span>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span key={s.id} className="rounded-full bg-white/15 px-2.5 py-1 text-[11.5px] font-medium">
                  {s.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">Languages</h3>
          {languages?.length === 0 ? (
            <span className="text-white/50 italic text-[12px]">No languages added yet.</span>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {languages.map((language) => (
                <span key={language.id} className="rounded-full bg-white/15 px-2.5 py-1 text-[11.5px] font-medium">
                  {language.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 px-10 py-12">
        <h1 className="text-[30px] font-bold leading-tight text-neutral-900" style={{ fontFamily: FONT_UI }}>
          {personal.name || <span className="text-neutral-300">Your Name</span>}
        </h1>
        {personal.title && (
          <p className="mt-1 text-[14px] font-semibold" style={{ color: accent }}>
            {personal.title}
          </p>
        )}
        {personal.summary && <p className="mt-4 text-[13px] leading-relaxed text-neutral-600">{personal.summary}</p>}

        <section className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-neutral-800">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: accent }} />
            Experience
          </h2>
          {experience.length === 0 && <EmptyHint>No experience added yet — add your first role in the sidebar.</EmptyHint>}
          <div className="flex flex-col gap-5">
            {experience.map((job) => (
              <div key={job.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3 className="text-[14.5px] font-semibold text-neutral-900">
                    {job.role || <span className="text-neutral-300">Role</span>}
                  </h3>
                  {(job.start || job.end || job.current) && (
                    <span className="text-[11.5px] text-neutral-400">
                      {job.start} — {job.current ? "Present" : job.end}
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-neutral-500">
                  {job.company}
                  {job.company && job.location ? " · " : ""}
                  {job.location}
                </p>
                {bullets(job.description).length > 0 && (
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-[12.5px] leading-relaxed text-neutral-600">
                    {bullets(job.description).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-neutral-800">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: accent }} />
            Education
          </h2>
          {education.length === 0 && <EmptyHint>No education added yet.</EmptyHint>}
          <div className="flex flex-col gap-3">
            {education.map((ed) => (
              <div key={ed.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3 className="text-[13.5px] font-semibold text-neutral-900">
                    {ed.degree || "Degree"}
                    {ed.field && <span className="font-normal text-neutral-500">, {ed.field}</span>}
                    {ed.language && <span className="font-normal text-neutral-500">, {ed.language}</span>}
                  </h3>
                  {(ed.start || ed.end) && (
                    <span className="text-[11.5px] text-neutral-400">
                      {ed.start} — {ed.end}
                    </span>
                  )}
                </div>
                {ed.school && <p className="text-[12px] text-neutral-500">{ed.school}</p>}
              </div>
            ))}
          </div>
        </section>
        {Array.isArray(projects) && projects.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-neutral-800">
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: accent }}
              />
              Projects
            </h2>

            <div className="flex flex-col gap-5">
              {projects.map((project) => (
                <div key={project.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <h3 className="text-[14.5px] font-semibold text-neutral-900">
                      {project.name || "Project Name"}
                    </h3>

                    {(project.start || project.end) && (
                      <span className="text-[11.5px] text-neutral-400">
                        {project.start} — {project.end}
                      </span>
                    )}
                  </div>

                  {project.role && (
                    <p className="text-[12px] text-neutral-500">
                      {project.role}
                    </p>
                  )}

                  {project.description && (
                    <p className="mt-2 text-[12.5px] leading-relaxed text-neutral-600">
                      {project.description}
                    </p>
                  )}

                  {project.technologies && (
                    <p className="mt-1 text-[12px] text-neutral-500">
                      <span className="font-semibold">Technologies:</span>{" "}
                      {project.technologies}
                    </p>
                  )}

                  {project.link && (
                    <p className="mt-1 text-[11.5px] text-neutral-500 break-all">
                      {project.link}
                    </p>
                  )}

                  {project.github && (
                    <p className="text-[11.5px] text-neutral-500 break-all">
                      {project.github}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
