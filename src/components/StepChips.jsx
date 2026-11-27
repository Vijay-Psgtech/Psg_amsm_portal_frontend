import { FRAMEWORKS } from '../data/taxonomy.js';
import { cx } from '../lib/format.js';

/**
 * The four framework letters for one student (e.g. S T A R), showing which
 * steps are done, which is current and which have not started.
 * Pass onSelect to let a mentor record the step reached.
 */
export default function StepChips({ fw, reached, completed = false, onSelect, name = 'Student', large = false }) {
  const f = FRAMEWORKS[fw];
  const chips = f.letters.map((letter, i) => {
    const no = i + 1;
    const done = no < reached || (completed && no === reached);
    const current = !done && no === reached;
    const state = done ? 'done' : current ? 'current step' : 'not started';
    const className = cx('step', large && 'step--lg', done && 'is-done', current && 'is-current');
    if (onSelect) {
      return (
        <button
          key={no}
          type="button"
          className={className}
          aria-pressed={current}
          aria-label={`${name}: ${f.steps[i]}, ${state}`}
          onClick={() => onSelect(no)}
        >
          {letter}
        </button>
      );
    }
    return (
      <span key={no} className={className} title={`${f.steps[i]}: ${state}`} aria-hidden="true">
        {letter}
      </span>
    );
  });

  return (
    <span
      className={cx('steps', large && 'steps--lg')}
      role={onSelect ? 'group' : undefined}
      aria-label={onSelect ? `Step reached by ${name}` : undefined}
    >
      {chips}
      {onSelect ? null : (
        <span className="sr-only">
          {completed && reached === 4 ? 'Completed all four steps' : `Reached step ${reached} of 4, ${f.steps[reached - 1]}`}
        </span>
      )}
    </span>
  );
}

export function StepLegend() {
  return (
    <ul className="legend list-reset">
      <li>
        <span className="swatch swatch--dot" style={{ background: 'var(--navy)' }} aria-hidden="true" />
        Step done
      </li>
      <li>
        <span className="swatch swatch--dot" style={{ background: 'var(--gold)' }} aria-hidden="true" />
        Current step
      </li>
      <li>
        <span className="swatch swatch--dot swatch--empty" aria-hidden="true" />
        Not started
      </li>
    </ul>
  );
}
