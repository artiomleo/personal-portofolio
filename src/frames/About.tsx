import { Download } from "lucide-react";
import { certifications, education, languages, skills } from "@/content/about";
import { profile } from "@/content/profile";
import { Frame, FrameTitle, Heading } from "./Frame";
import { NewTabNote, StackTags } from "./ui";

export function About({ primary }: { primary: boolean }) {
  const { portrait } = profile;
  return (
    <Frame id="about" primary={primary}>
      <header className="frame-head">
        <p className="eyebrow">About</p>
        <FrameTitle>Skills and background</FrameTitle>
      </header>
      <div className="about-intro">
        <picture className="about-portrait">
          <source srcSet={portrait.avif} type="image/avif" />
          <img src={portrait.webp} alt={portrait.alt} width={portrait.width} height={portrait.height} loading={primary ? "eager" : "lazy"} decoding="async" />
        </picture>
        <div className="about-bio">
          {profile.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <a className="btn btn--ghost" href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
            <Download size={16} aria-hidden="true" /> Download CV
            <NewTabNote />
          </a>
        </div>
      </div>
      <section className="about-block" aria-labelledby="skills-title">
        <Heading depth={1} id="skills-title" className="block-title">
          Skills
        </Heading>
        <dl className="skills">
          {skills.map((group) => (
            <div key={group.name} className="skill-group">
              <dt>{group.name}</dt>
              <dd>
                <StackTags items={group.items} label={`${group.name} skills`} />
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="about-block" id="certifications" aria-labelledby="certifications-title">
        <Heading depth={1} id="certifications-title" className="block-title">
          Certifications
        </Heading>
        <ul className="certs" role="list">
          {certifications.map((c) => (
            <li key={c.issuer}>
              <p className="cert-issuer">
                {c.issuer} <span>{c.year}</span>
              </p>
              <ul>
                {c.courses.map((course) => (
                  <li key={course}>{course}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
      <div className="about-row">
        <section className="about-block" aria-labelledby="education-title">
          <Heading depth={1} id="education-title" className="block-title">
            Education
          </Heading>
          {education.map((e) => (
            <div key={e.id} id={`entry-${e.id}`} className="edu">
              <p className="edu-degree">{e.degree}</p>
              <p className="edu-school">{e.school}</p>
              <p className="edu-years">{e.years}</p>
            </div>
          ))}
        </section>
        <section className="about-block" aria-labelledby="languages-title">
          <Heading depth={1} id="languages-title" className="block-title">
            Languages
          </Heading>
          <ul className="languages" role="list">
            {languages.map((l) => (
              <li key={l.name}>
                <span>{l.name}</span> <span>{l.level}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Frame>
  );
}
