import React from "react";
import { FolderKanban, Plus, Trash2 } from "lucide-react";

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-medium text-neutral-600">
        {label}
      </span>

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
      <span className="mb-1 block text-[12px] font-medium text-neutral-600">
        {label}
      </span>

      <textarea
        {...props}
        className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[13.5px] text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
      />
    </label>
  );
}

function EntryCard({ children, onRemove }) {
  return (
    <div className="relative rounded-xl border border-neutral-200 bg-neutral-50/60 p-4">
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-3 top-3 rounded-md p-1.5 text-neutral-400 transition hover:bg-red-50 hover:text-red-500"
        title="Remove project"
      >
        <Trash2 size={14} />
      </button>

      <div className="flex flex-col gap-3 pr-7">
        {children}
      </div>
    </div>
  );
}

function AddButton({ onClick, accent, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ borderColor: accent, color: accent }}
      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed py-2.5 text-[13px] font-medium transition hover:bg-neutral-50"
    >
      <Plus size={15} />
      {children}
    </button>
  );
}

export default function ProjectsPanel({
  projects,
  update,
  add,
  remove,
  accent,
}) {
  return (
    <div>
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <FolderKanban
            size={16}
            strokeWidth={2.25}
            className="text-neutral-500"
          />

          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-neutral-800">
            Projects
          </h2>
        </div>

        <p className="mt-1 text-[12.5px] text-neutral-500 leading-snug">
          Add academic, personal, or professional projects.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {projects.map((project) => (
          <EntryCard
            key={project.id}
            onRemove={() => remove(project.id)}
          >
            <Field
              label="Project Name"
              placeholder="Resume Builder"
              value={project.name}
              onChange={(e) =>
                update(project.id, "name", e.target.value)
              }
            />

            <TextArea
              label="Description"
              rows={4}
              placeholder="Describe your project and what you achieved."
              value={project.description}
              onChange={(e) =>
                update(project.id, "description", e.target.value)
              }
            />

            <Field
              label="Technologies Used"
              placeholder="React, JavaScript, Node.js, MySQL"
              value={project.technologies}
              onChange={(e) =>
                update(project.id, "technologies", e.target.value)
              }
            />

            <Field
              label="Your Role"
              placeholder="Frontend Developer"
              value={project.role}
              onChange={(e) =>
                update(project.id, "role", e.target.value)
              }
            />

            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Start Year"
                placeholder="2025"
                value={project.start}
                onChange={(e) =>
                  update(project.id, "start", e.target.value)
                }
              />

              <Field
                label="End Year"
                placeholder="2026"
                value={project.end}
                onChange={(e) =>
                  update(project.id, "end", e.target.value)
                }
              />
            </div>

            <Field
              label="Project Link"
              placeholder="https://yourproject.com"
              value={project.link}
              onChange={(e) =>
                update(project.id, "link", e.target.value)
              }
            />

            <Field
              label="GitHub Link"
              placeholder="https://github.com/username/project"
              value={project.github}
              onChange={(e) =>
                update(project.id, "github", e.target.value)
              }
            />
          </EntryCard>
        ))}

        <AddButton onClick={add} accent={accent}>
          Add project
        </AddButton>
      </div>
    </div>
  );
}