import { FRAMEWORKS, FRAMEWORK_KEYS, frameworkOfTrack } from '../data/taxonomy.js';

/** Path label, e.g. "STAR" or "STAR · Career & industry". */
export function FrameworkChip({ fw, long = false }) {
  const f = FRAMEWORKS[fw];
  return (
    <span className="chip" style={{ background: f.tint, color: f.ink }}>
      {long ? `${f.key} · ${f.name}` : f.key}
    </span>
  );
}

/** Mentoring track label (Career, Entrepreneur, Higher studies) in its framework's colours. */
export function TrackChip({ track, withFramework = false }) {
  const f = frameworkOfTrack(track);
  return (
    <span className="chip" style={{ background: f.tint, color: f.ink }}>
      {withFramework ? `${track} · ${f.key}` : track}
    </span>
  );
}

/** Colour key for charts that split by framework. */
export function FrameworkLegend() {
  return (
    <ul className="legend list-reset" aria-label="Legend">
      {FRAMEWORK_KEYS.map((key) => (
        <li key={key}>
          <span className="swatch" style={{ background: FRAMEWORKS[key].color }} aria-hidden="true" />
          {key}
        </li>
      ))}
    </ul>
  );
}
