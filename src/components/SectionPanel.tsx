import {
  useEffect,
  type ComponentType,
  type ReactNode,
} from "react";
import {
  destinations,
  type DestinationKey,
} from "../data/destinations";
import {
  certifications,
  freelanceExperience,
  practicalExperience,
  profile,
  projects,
  skillGroups,
} from "../data/profile";
import { usePortfolioStore } from "../store/usePortfolioStore";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  children: ReactNode;
}

interface TagListProps {
  items: readonly string[];
}

interface ContactItem {
  label: string;
  value: string;
  href: string;
}

function SectionHeader({
  eyebrow,
  title,
  children,
}: SectionHeaderProps) {
  return (
    <>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <div className="section-intro">{children}</div>
    </>
  );
}

function TagList({ items }: TagListProps) {
  return (
    <div className="tag-list">
      {items.map((item) => (
        <span className="tag" key={item}>
          {item}
        </span>
      ))}
    </div>
  );
}

function HomeContent() {
  const travelTo = usePortfolioStore((state) => state.travelTo);

  return (
    <>
      <SectionHeader
        eyebrow="INTERACTIVE DEVELOPER PORTFOLIO"
        title="Android & Full-Stack Developer"
      >
        <p>{profile.summary}</p>
      </SectionHeader>

      <div className="status-row">
        <span className="status-dot" aria-hidden="true" />
        <span>{profile.status}</span>
        <span className="status-divider">/</span>
        <span>Open to opportunities</span>
      </div>

      <div className="action-row">
        <button
          type="button"
          className="primary-action"
          onClick={() => travelTo("projects")}
        >
          Explore Projects
        </button>

        <a
          className="secondary-action"
          href={profile.resume}
          target="_blank"
          rel="noreferrer"
        >
          View Resume
        </a>
      </div>
    </>
  );
}

function AboutContent() {
  return (
    <>
      <SectionHeader eyebrow="PROFILE NODE" title="About Me">
        <p>
          I build Android and full-stack applications and study how Android
          applications work internally through basic reverse engineering, APK
          decompilation, static analysis, hexadecimal inspection, network
          inspection, and controlled security testing.
        </p>
      </SectionHeader>

      <div className="info-grid">
        <article className="info-card">
          <span className="card-label">Education</span>
          <h2>{profile.education.degree}</h2>
          <p>{profile.education.institution}</p>
          <strong>{profile.education.period}</strong>
        </article>

        <article className="info-card">
          <span className="card-label">Certifications</span>

          <ul className="compact-list">
            {certifications.map((certification) => (
              <li key={certification}>{certification}</li>
            ))}
          </ul>
        </article>
      </div>

      <article className="info-card wide-card">
        <span className="card-label">Practical Experience</span>

        <ul className="compact-list two-column-list">
          {practicalExperience.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </>
  );
}

function SkillsContent() {
  return (
    <>
      <SectionHeader eyebrow="TECHNICAL INVENTORY" title="Skills">
        <p>
          My current toolkit covers Android development, full-stack
          development, databases, deployment, APK analysis, and basic
          reverse-engineering workflows.
        </p>
      </SectionHeader>

      <div className="skill-grid">
        {skillGroups.map((group) => (
          <article className="skill-card" key={group.title}>
            <h2>{group.title}</h2>
            <TagList items={group.items} />
          </article>
        ))}
      </div>
    </>
  );
}

function ExperienceContent() {
  return (
    <>
      <SectionHeader
        eyebrow="PROFESSIONAL EXPERIENCE"
        title={freelanceExperience.role}
      >
        <p>{freelanceExperience.summary}</p>
      </SectionHeader>

      <article className="info-card wide-card">
        <div className="experience-heading">
          <span className="card-label">Client Project</span>
          <strong>{freelanceExperience.period}</strong>
        </div>

        <ul className="compact-list">
          {freelanceExperience.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>

        <TagList items={freelanceExperience.technologies} />
      </article>
    </>
  );
}

function ProjectsContent() {
  return (
    <>
      <SectionHeader
        eyebrow="PROJECT DISTRICT"
        title="Selected Projects"
      >
        <p>
          Android projects demonstrating network filtering, on-device
          machine-learning inference, and maintainable offline application
          architecture.
        </p>
      </SectionHeader>

      <div className="project-list">
        {projects.map((project, index) => (
          <article className="project-card" key={project.title}>
            <span className="project-number">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="project-content">
              <h2>{project.title}</h2>
              <p>{project.summary}</p>

              <ul className="compact-list">
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>

              <TagList items={project.technologies} />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function ContactContent() {
  const contacts: ContactItem[] = [
    {
      label: "Email",
      value: profile.email,
      href: profile.emailHref,
    },
    {
      label: "Phone",
      value: profile.phoneDisplay,
      href: profile.phoneHref,
    },
    {
      label: "LinkedIn",
      value: "Sharbin Joe",
      href: profile.linkedin,
    },
    {
      label: "GitHub",
      value: "sharbinjo-sudo",
      href: profile.github,
    },
  ];

  return (
    <>
      <SectionHeader
        eyebrow="COMMUNICATION PORTAL"
        title="Contact Me"
      >
        <p>
          Reach me by email or phone, or visit my professional and development
          profiles.
        </p>
      </SectionHeader>

      <div className="contact-grid">
        {contacts.map((contact) => {
          const isExternalLink = contact.href.startsWith("http");

          return (
            <a
              className="contact-card"
              href={contact.href}
              key={contact.label}
              target={isExternalLink ? "_blank" : undefined}
              rel={isExternalLink ? "noreferrer" : undefined}
            >
              <span>{contact.label}</span>
              <strong>{contact.value}</strong>
              <small>Open link</small>
            </a>
          );
        })}
      </div>

      <a
        className="resume-link"
        href={profile.resume}
        target="_blank"
        rel="noreferrer"
      >
        Download resume PDF
      </a>
    </>
  );
}

const sectionContent: Record<
  DestinationKey,
  ComponentType
> = {
  home: HomeContent,
  about: AboutContent,
  skills: SkillsContent,
  experience: ExperienceContent,
  projects: ProjectsContent,
  contact: ContactContent,
};

export function SectionPanel() {
  const activeSection = usePortfolioStore(
    (state) => state.activeSection,
  );

  const isPanelVisible = usePortfolioStore(
    (state) => state.isPanelVisible,
  );

  const closePanel = usePortfolioStore(
    (state) => state.closePanel,
  );

  const Content = sectionContent[activeSection];

  useEffect(() => {
    if (!isPanelVisible) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePanel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [closePanel, isPanelVisible]);

  if (!isPanelVisible) {
    return null;
  }

  return (
    <div
      className="section-modal-backdrop"
      onMouseDown={closePanel}
      role="presentation"
    >
      <section
        className="section-panel section-panel-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="section-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="section-close-button"
          onClick={closePanel}
          aria-label="Close details panel"
        >
          ×
        </button>

        <div className="section-content">
          <span className="dialog-location-label">
            {destinations[activeSection].label}
          </span>

          <div id="section-dialog-title">
            <Content />
          </div>
        </div>

        <div className="section-meta">
          <span>Current location</span>

          <strong>
            {destinations[activeSection].label}
          </strong>
        </div>
      </section>
    </div>
  );
}