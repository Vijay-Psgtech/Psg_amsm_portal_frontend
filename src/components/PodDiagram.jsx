import Icon from './Icon.jsx';
import './PodDiagram.css';

/** Centres of the five students along the 135° arc, in % of the 520 × 420 frame. */
const STUDENT_POSITIONS = [
  [9.26, 48.73],
  [24.52, 32.16],
  [44.23, 26.19],
  [63.94, 32.16],
  [79.2, 48.73],
];

/**
 * The 1 mentor : 5 students pod, with the tutor alongside.
 *
 * students:  up to five { label, initials, bg, ink, dim } (omit for the default cap icons)
 * highlight: 'mentor' | 'students' | 'tutor' | null
 * onSelect:  when given, every node is a button that reports its role
 */
export default function PodDiagram({ students = [], highlight = null, onSelect, labels = true, small = false }) {
  const opacity = (role) => (highlight && highlight !== role ? 0.35 : 1);
  const ring = (role) => (highlight === role ? '0 0 0 6px rgba(224, 165, 38, 0.65)' : undefined);

  // A plain function (not a component) so nodes keep focus across re-renders.
  const node = (key, role, label, className, style, children) =>
    onSelect ? (
      <button
        key={key}
        type="button"
        className={className}
        style={style}
        aria-label={label}
        aria-pressed={highlight === role}
        onClick={() => onSelect(role)}
      >
        {children}
      </button>
    ) : (
      <span key={key} className={className} style={style} title={label}>
        {children}
      </span>
    );

  return (
    <div className={'pod' + (small ? ' pod--sm' : '')}>
      <svg className="pod__svg" viewBox="0 0 520 420" aria-hidden="true">
        <path className="pod__fan" d="M260 362 L17.94 261.74 A262 262 0 0 1 502.06 261.74 Z" />
        <path className="pod__arc" d="M149.13 316.08 A120 120 0 0 1 370.87 316.08" />
        <line className="pod__link" x1="447" y1="88" x2="429" y2="158" />
      </svg>

      {STUDENT_POSITIONS.map(([left, top], i) => {
        const s = students[i] || {};
        return node(
          `student-${i}`,
          'students',
          s.label || `Student ${i + 1} of 5`,
          'pod__node pod__node--student',
          {
            left: `${left}%`,
            top: `${top}%`,
            background: s.bg,
            color: s.ink,
            opacity: s.dim ? 0.35 : opacity('students'),
            boxShadow: ring('students'),
          },
          s.initials ? <span className="pod__initials">{s.initials}</span> : <Icon name="cap" size={small ? 18 : 24} />
        )
      })}

      {node(
        'mentor',
        'mentor',
        'Mentor',
        'pod__node pod__node--mentor',
        { opacity: opacity('mentor'), boxShadow: ring('mentor') },
        <Icon name="user" size={small ? 24 : 34} />
      )}
      {labels ? (
        <span className="pod__label pod__label--mentor" aria-hidden="true">
          MENTOR
        </span>
      ) : null}

      {node(
        'tutor',
        'tutor',
        'Tutor (facilitator)',
        'pod__node pod__node--tutor',
        { opacity: opacity('tutor'), boxShadow: ring('tutor') },
        <Icon name="presentation" size={small ? 18 : 26} />
      )}
      {labels ? (
        <span className="pod__label pod__label--tutor" aria-hidden="true">
          TUTOR
        </span>
      ) : null}
    </div>
  );
}
