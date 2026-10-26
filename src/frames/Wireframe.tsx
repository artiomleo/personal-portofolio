import type { ReactElement } from "react";
import type { WireframeKind } from "@/content/types";

const W = 320;
const H = 132;

const bars = [40, 64, 52, 88, 70];
const lines = [160, 120, 180, 90, 140, 100];
const rows = [180, 140, 200, 120];

const SHAPES: Record<WireframeKind, ReactElement> = {
  chat: (
    <g>
      <rect className="wf-soft" x="16" y="16" width="150" height="26" rx="13" />
      <rect className="wf-accent" x="154" y="52" width="150" height="26" rx="13" />
      <rect className="wf-soft" x="16" y="88" width="190" height="26" rx="13" />
    </g>
  ),
  dashboard: (
    <g>
      <rect className="wf-line" x="16" y="16" width="60" height="100" rx="4" />
      {bars.map((h, i) => (
        <rect key={i} className={i === 3 ? "wf-accent" : "wf-soft"} x={96 + i * 42} y={116 - h} width="28" height={h} rx="3" />
      ))}
    </g>
  ),
  form: (
    <g>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect className="wf-line" x="16" y={16 + i * 34} width="60" height="6" rx="3" />
          <rect className="wf-soft" x="16" y={26 + i * 34} width="200" height="16" rx="4" />
        </g>
      ))}
      <rect className="wf-accent" x="236" y="94" width="68" height="22" rx="6" />
    </g>
  ),
  document: (
    <g>
      <rect className="wf-soft" x="96" y="12" width="128" height="108" rx="3" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} className="wf-line" x="108" y={24 + i * 14} width={i === 5 ? 60 : 104} height="5" rx="2.5" />
      ))}
      <rect className="wf-accent" x="180" y="100" width="36" height="10" rx="3" />
    </g>
  ),
  list: (
    <g>
      {rows.map((w, i) => (
        <g key={i}>
          <rect className={i === 1 ? "wf-accent" : "wf-soft"} x="16" y={14 + i * 28} width="18" height="18" rx="4" />
          <rect className="wf-line" x="44" y={19 + i * 28} width={w} height="8" rx="4" />
        </g>
      ))}
    </g>
  ),
  editor: (
    <g>
      <rect className="wf-line" x="16" y="16" width="44" height="100" rx="4" />
      {lines.map((w, i) => (
        <rect key={i} className={i === 2 ? "wf-accent" : "wf-soft"} x={72 + (i % 3) * 12} y={20 + i * 16} width={w} height="8" rx="4" />
      ))}
    </g>
  ),
};

export function Wireframe({ kind }: { kind: WireframeKind }) {
  return (
    <svg className="wireframe" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
      <rect className="wf-bg" width={W} height={H} rx="8" />
      {SHAPES[kind]}
    </svg>
  );
}
