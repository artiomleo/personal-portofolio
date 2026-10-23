import { Link } from "react-router-dom";
import { profile } from "@/content/profile";
import { Frame, FrameTitle, Heading } from "./Frame";
import { PrimaryButton } from "./ui";

export function Home({ primary }: { primary: boolean }) {
  return (
    <Frame id="home" primary={primary}>
      <div className="home">
        <p className="eyebrow">
          {profile.title} · {profile.focus}
        </p>
        <HeroTitle />
        <HeroLede />
        <div className="hero-actions">
          <PrimaryButton to="/projects">See projects</PrimaryButton>
          <Link className="btn btn--ghost" to="/contact">
            Get in touch
          </Link>
        </div>
        <div className="hero-now">
          <Heading depth={1} className="hero-now-title">
            Currently
          </Heading>
          <ul>
            {profile.currently.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </Frame>
  );
}

// #region layer:hero-title
function HeroTitle() {
  return (
    <FrameTitle className="hero-title" layer="hero-title">
      {profile.name} {profile.headline.lead} <em>{profile.headline.accent}</em>
    </FrameTitle>
  );
}
// #endregion

// #region layer:hero-lede
function HeroLede() {
  return (
    <p className="hero-lede" id="hero-lede" data-layer="hero-lede">
      {profile.lede}
    </p>
  );
}
// #endregion
