import { createContext, useContext, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { FRAME_NOTES } from "@/content/annotations";
import { frameById, nextFrame, type FrameId } from "./registry";

type FrameContextValue = { id: FrameId; primary: boolean };
const FrameContext = createContext<FrameContextValue | null>(null);

function useFrame(): FrameContextValue {
  const value = useContext(FrameContext);
  if (!value) throw new Error("FrameTitle and Heading must render inside <Frame>");
  return value;
}

type FrameProps = {
  id: FrameId;
  /** True when this frame's title is the page's h1: always in page layout, only Home on the canvas. */
  primary: boolean;
  children: ReactNode;
};

/** A frame section. Its children must render exactly one FrameTitle, which labels the section. */
export function Frame({ id, primary, children }: FrameProps) {
  const def = frameById(id);
  const next = nextFrame(id);
  const sticky = FRAME_NOTES[id].sticky;
  return (
    <section
      className="frame"
      data-frame={id}
      aria-labelledby={`${id}-title`}
      tabIndex={-1}
      style={{ "--frame-w": `${def.width}px` } as CSSProperties}
    >
      <FrameLabel label={def.label} />
      <FrameContext.Provider value={{ id, primary }}>
        <div className="frame-body">{children}</div>
      </FrameContext.Provider>
      {sticky && <Sticky frame={id} text={sticky} />}
      {next && (
        <Link className="frame-next" to={next.path}>
          Next: {next.label} <ArrowRight size={16} aria-hidden="true" />
        </Link>
      )}
    </section>
  );
}

// #region layer:frame-label
export function FrameLabel({ label }: { label: string }) {
  return (
    <p className="frame-label" aria-hidden="true" data-layer="frame-label">
      <span className="frame-label-mark">#</span> {label}
    </p>
  );
}
// #endregion

// #region layer:frame-title
export function FrameTitle({
  children,
  className = "frame-title",
  layer = "frame-title",
}: {
  children: ReactNode;
  className?: string;
  layer?: string;
}) {
  const { id, primary } = useFrame();
  const Tag = primary ? "h1" : "h2";
  return (
    <Tag id={`${id}-title`} className={className} data-layer={layer}>
      {children}
    </Tag>
  );
}
// #endregion

/** A heading one (depth 1) or two (depth 2) levels below the frame title. */
export function Heading({ depth, ...props }: { depth: 1 | 2 } & HTMLAttributes<HTMLHeadingElement>) {
  const { primary } = useFrame();
  const level = (primary ? 1 : 2) + depth;
  const Tag = level === 2 ? "h2" : level === 3 ? "h3" : "h4";
  return <Tag {...props} />;
}

// #region layer:sticky
function Sticky({ frame, text }: { frame: FrameId; text: string }) {
  return (
    <div className="sticky" data-sticky={frame} data-layer="sticky" aria-hidden="true">
      {text}
    </div>
  );
}
// #endregion
