import { roles } from "@/content/experience";
import type { Role } from "@/content/types";
import { Frame, FrameTitle, Heading } from "./Frame";

export function Experience({ primary }: { primary: boolean }) {
  return (
    <Frame id="experience" primary={primary}>
      <header className="frame-head">
        <p className="eyebrow">Experience</p>
        <FrameTitle>7+ years, two companies</FrameTitle>
        <p className="frame-lede">
          Frontend architecture and team leadership on micro-frontend platforms, and since 2025, AI products.
        </p>
      </header>
      <ol className="roles" role="list">
        {roles.map((role) => (
          <RoleEntry key={role.id} role={role} />
        ))}
      </ol>
    </Frame>
  );
}

// #region layer:experience-entry
function RoleEntry({ role }: { role: Role }) {
  return (
    <li className="role" id={`entry-${role.id}`} data-layer="experience-entry">
      <div className="role-head">
        <Heading depth={1} className="role-title">
          {role.title}
        </Heading>
        <p className="role-meta">
          {role.company} · {role.location}
        </p>
        <p className="role-years">{role.years}</p>
      </div>
      {role.engagements.length > 0 && (
        <ol className="engagements" role="list">
          {role.engagements.map((e) => (
            <li key={e.id} className="engagement" id={`entry-${e.id}`}>
              <Heading depth={2} className="engagement-title">
                {e.title}
              </Heading>
              <p className="engagement-years">{e.years}</p>
              <ul className="points">
                {e.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
      {role.points.length > 0 && (
        <ul className="points">
          {role.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      )}
    </li>
  );
}
// #endregion
