import { useState } from 'react';
import { Link } from 'react-router-dom';
import PortalHeader from '../components/PortalHeader.jsx';
import Icon from '../components/Icon.jsx';
import { TrackChip } from '../components/FrameworkChip.jsx';
import { TextField } from '../components/Field.jsx';
import { JOURNEY } from '../data/content.js';
import { MENTORS, slotsLabel } from '../data/mentors.js';
import { STUDENT_USER } from '../data/people.js';
import { PROBLEMS, PROBLEM_DEPARTMENTS, podsLabel } from '../data/problems.js';
import { FRAMEWORKS, FRAMEWORK_KEYS, MENTOR_INDUSTRIES } from '../data/taxonomy.js';
import { cx, initials } from '../lib/format.js';
import usePageTitle from '../lib/usePageTitle.js';
import './portal.css';

const TABS = [
  { label: 'Request a mentor', href: '#request' },
  { label: 'Mentors', href: '#mentors' },
  { label: 'Industry problems', href: '#problems' },
  { label: 'My progress', href: '#progress' },
  { label: 'My profile', to: '/profile?role=mentee' },
];

/** Problem value meaning "let my mentor suggest one in Session 1". */
const SUGGEST = 'mentor';

const pathLabel = (key) => `${key} · ${FRAMEWORKS[key].name}`;

export default function StudentPortal() {
  usePageTitle('Request a mentor');

  const [path, setPath] = useState('STAR');
  const [mentorId, setMentorId] = useState('');
  const [problemId, setProblemId] = useState('');
  const [industry, setIndustry] = useState('all');
  const [dept, setDept] = useState('all');
  const [showAll, setShowAll] = useState(false);
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);

  const f = FRAMEWORKS[path];
  const track = f.track;
  const supports = (m) => m.tracks.includes(track);
  const mentor = MENTORS.find((m) => m.id === mentorId) || null;
  const problem = PROBLEMS.find((p) => p.id === problemId) || null;
  const suggest = problemId === SUGGEST;
  const hasProblem = Boolean(problem) || suggest;
  const canSend = Boolean(mentor) && hasProblem;

  // Any change to the request takes it back to a draft.
  const edit = (fn) => (...args) => {
    fn(...args);
    setSent(false);
  };

  const pickPath = edit((key) => {
    setPath(key);
    // Keep the chosen mentor only if they also guide the new path.
    if (mentor && !mentor.tracks.includes(FRAMEWORKS[key].track)) setMentorId('');
  });
  const pickMentor = edit((m) => setMentorId((current) => (current === m.id ? '' : m.id)));
  const pickProblem = edit((id) => setProblemId((current) => (current === id ? '' : id)));

  const mentors = (showAll ? MENTORS : MENTORS.filter(supports))
    .filter((m) => industry === 'all' || m.industry === industry)
    .sort((a, b) => Number(supports(b)) - Number(supports(a)) || b.slots - a.slots);
  const problems = PROBLEMS.filter((p) => dept === 'all' || p.dept === dept);

  const steps = [
    ['Choose your path', true],
    ['Pick a mentor', Boolean(mentor)],
    ['Attach a problem', hasProblem],
    ['Send request', sent],
  ];

  const mentorHint =
    (showAll
      ? 'All mentors. Those who list your path come first.'
      : `Mentors who list ${track} as a track, for your ${path} path`) + (industry === 'all' ? '' : ` · ${industry}`);
  const noMentorsText =
    `No ${industry === 'all' ? '' : `${industry} `}mentors ` +
    (showAll ? 'yet. Try another industry.' : `list ${track} as a track yet. Try another industry, or show all mentors.`);
  const problemText = suggest ? 'Mentor to suggest one in Session 1' : problem ? problem.title : 'Not chosen yet';

  const send = () => {
    // Wireframe: nothing is sent. Post the request to the portal's API here.
    if (canSend) setSent(true);
  };

  return (
    <div className="page-soft">
      <PortalHeader user={STUDENT_USER} tabs={TABS} view="student" />
      <main className="container page-main">
        <div id="request" className="page-title">
          <h1 className="h2">Request a mentor</h1>
          <p className="sub" style={{ fontSize: 18 }}>
            Choose your path, pick a mentor with open slots, and attach an industry problem for your pod to work on.
          </p>
        </div>

        <ol className="stepper list-reset" aria-label="Progress">
          {steps.map(([label, done], i) => (
            <li key={label} className={cx('stepper__item', done && 'is-done')}>
              <span className="stepper__dot" aria-hidden="true">
                {done ? <Icon name="check" size={16} strokeWidth={3} /> : i + 1}
              </span>
              {label}
              <span className="sr-only">{done ? '(done)' : '(to do)'}</span>
            </li>
          ))}
        </ol>

        <div className="portal-layout">
          <div className="portal-layout__main">
            <section id="path" className="panel" aria-labelledby="path-title">
              <div className="panel__head" style={{ alignItems: 'baseline' }}>
                <h2 id="path-title" className="panel__title">
                  1 · Choose your path
                </h2>
                <Link to="/frameworks" className="text-link" style={{ fontSize: 15 }}>
                  How the frameworks work
                </Link>
              </div>
              <div className="path-grid" role="group" aria-label="Your path">
                {FRAMEWORK_KEYS.map((key) => {
                  const k = FRAMEWORKS[key];
                  const on = key === path;
                  return (
                    <button
                      key={key}
                      type="button"
                      className="path-btn"
                      aria-pressed={on}
                      onClick={() => pickPath(key)}
                      style={on ? { background: k.tint, borderColor: k.color } : undefined}
                    >
                      <span className="row" style={{ '--gap': '10px' }}>
                        <span className="path-btn__icon" style={{ background: k.color, color: k.onColor }}>
                          <Icon name={k.icon} size={20} />
                        </span>
                        <span className="path-btn__key" style={{ color: k.ink }}>
                          {key}
                        </span>
                      </span>
                      <span className="path-btn__want">{k.want}</span>
                      <span className="slate small">{k.name}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section id="mentors" className="panel" aria-labelledby="mentors-title">
              <div className="panel__head">
                <div>
                  <h2 id="mentors-title" className="panel__title">
                    2 · Pick a mentor
                  </h2>
                  <p className="muted" style={{ fontSize: 15, marginTop: 2 }}>
                    {mentorHint}
                  </p>
                </div>
                <div className="row" style={{ '--gap': '8px' }}>
                  <label className="inline-filter" htmlFor="ind-filter">
                    Industry
                  </label>
                  <select
                    id="ind-filter"
                    className="control control--inline"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  >
                    <option value="all">All industries</option>
                    {MENTOR_INDUSTRIES.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                  <button type="button" className="btn btn--quiet btn--sm" aria-pressed={showAll} onClick={() => setShowAll((v) => !v)}>
                    {showAll ? 'Show mentors for my path' : 'Show all mentors'}
                  </button>
                </div>
              </div>
              <div className="mentor-grid">
                {mentors.map((m) => {
                  const on = m.id === mentorId;
                  const full = m.slots === 0;
                  return (
                    <article key={m.id} className={cx('mentor-card', on && 'is-on')}>
                      <div className="mentor-card__head">
                        <span className={cx('avatar', on ? 'tone-gold' : 'tone-navy')} aria-hidden="true">
                          {initials(m.name)}
                        </span>
                        <div className="mentor-card__who">
                          <span className="mentor-card__name">{m.name}</span>
                          <span className="muted small">{m.role}</span>
                        </div>
                        <span className={cx('chip', full ? 'chip--muted' : 'chip--good')} style={{ flex: 'none' }}>
                          {slotsLabel(m.slots)}
                        </span>
                      </div>
                      <div className="row" style={{ '--gap': '6px' }}>
                        <span className="chip chip--navy">{m.industry}</span>
                        {m.tracks.map((t) => (
                          <TrackChip key={t} track={t} />
                        ))}
                      </div>
                      {supports(m) ? null : (
                        <span className="small" style={{ color: 'var(--gold-ink)' }}>
                          Does not list {track} as a track
                        </span>
                      )}
                      <button
                        type="button"
                        className={cx('btn btn--sm', on ? 'btn--navy' : 'btn--outline')}
                        style={{ alignSelf: 'flex-start' }}
                        aria-pressed={on}
                        aria-label={(on ? 'Selected: ' : 'Select ') + m.name}
                        disabled={full}
                        onClick={() => pickMentor(m)}
                      >
                        {full ? 'Pod full' : on ? 'Selected' : 'Select mentor'}
                      </button>
                    </article>
                  );
                })}
              </div>
              {mentors.length === 0 ? <p className="empty">{noMentorsText}</p> : null}
            </section>

            <section id="problems" className="panel" aria-labelledby="problems-title">
              <div className="panel__head">
                <div>
                  <h2 id="problems-title" className="panel__title">
                    3 · Attach an industry problem
                  </h2>
                  <p className="muted" style={{ fontSize: 15, marginTop: 2 }}>
                    Your pod works on it in Session 3, solving it as professionals would, not as an exam.
                  </p>
                </div>
                <div className="row" style={{ '--gap': '8px' }}>
                  <label className="inline-filter" htmlFor="prob-dept">
                    Department
                  </label>
                  <select id="prob-dept" className="control control--inline" value={dept} onChange={(e) => setDept(e.target.value)}>
                    <option value="all">All departments</option>
                    {PROBLEM_DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <ul className="list-reset stack" style={{ '--gap': '10px' }}>
                {problems.map((p) => {
                  const on = p.id === problemId;
                  return (
                    <li key={p.id} className={cx('problem-item', on && 'is-on')}>
                      <div className="problem-item__copy">
                        <span className="problem-item__title">{p.title}</span>
                        <span className="row" style={{ '--gap': '6px' }}>
                          <span className="chip chip--navy">{p.dept}</span>
                          <span className="chip chip--outline">{p.level}</span>
                          <span className="muted" style={{ fontSize: 13 }}>
                            From: {p.source}
                          </span>
                        </span>
                      </div>
                      <span className={cx('chip', p.pods ? 'chip--outline' : 'chip--gold')}>{podsLabel(p.pods)}</span>
                      <button
                        type="button"
                        className={cx('btn btn--sm', on ? 'btn--navy' : 'btn--outline')}
                        aria-pressed={on}
                        aria-label={(on ? 'Attached: ' : 'Attach ') + p.title}
                        onClick={() => pickProblem(p.id)}
                      >
                        {on ? 'Attached' : 'Attach'}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {problems.length === 0 ? (
                <p className="empty">
                  No open problems from this department yet. Try another department, or let your mentor suggest one.
                </p>
              ) : null}
              <button
                type="button"
                className={cx('btn btn--sm btn--dashed', suggest && 'is-on')}
                style={{ alignSelf: 'flex-start' }}
                aria-pressed={suggest}
                onClick={() => pickProblem(SUGGEST)}
              >
                Not sure yet? Let my mentor suggest one
              </button>
            </section>

            <section id="progress" className="panel" aria-labelledby="progress-title">
              <div className="panel__head" style={{ alignItems: 'center' }}>
                <h2 id="progress-title" className="panel__title">
                  My progress
                </h2>
                <span className="chip" style={{ background: f.tint, color: f.ink, fontSize: 14, padding: '4px 12px' }}>
                  {pathLabel(path)}
                </span>
              </div>
              <p className="slate" style={{ fontSize: 15 }}>
                {sent && mentor
                  ? `Request sent. Your progress appears here once ${mentor.name} accepts and your pod starts. After each session, your mentor records the step you have reached.`
                  : 'Your progress appears here once your pod starts. After each session, your mentor records the step you have reached.'}
              </p>
              <ol className="list-reset progress-steps" aria-label="Framework steps">
                {f.letters.map((letter, i) => (
                  <li key={letter + i} className="progress-step">
                    <span className="step step--lg" aria-hidden="true">
                      {letter}
                    </span>
                    <span className="stack" style={{ '--gap': '0' }}>
                      <strong style={{ fontSize: 15 }}>{f.steps[i]}</strong>
                      <span className="muted" style={{ fontSize: 13 }}>
                        Not started
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
              <ol className="list-reset session-list" aria-label="Sessions">
                {JOURNEY.map((s) => (
                  <li key={s.session} className="session-item">
                    <span className="kicker" style={{ color: 'var(--gold-text)' }}>
                      Session {s.session} · {s.phase}
                    </span>
                    <strong style={{ fontSize: 15 }}>{s.title}</strong>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <aside className="portal-layout__side summary" aria-labelledby="sum-title">
            {sent ? (
              <div role="status" className="stack" style={{ '--gap': '14px' }}>
                <span className="icon-circle icon-circle--lg tone-good">
                  <Icon name="check" size={26} strokeWidth={2.6} />
                </span>
                <h2 id="sum-title" className="summary__title">
                  Request sent
                </h2>
                <p className="slate">
                  {mentor.name} will accept or decline in the portal. Your request carries your {path} path and{' '}
                  {suggest ? 'asks the mentor to suggest a problem.' : `the problem “${problem.title}”.`}
                </p>
                <div className="summary__status">
                  <span className="kicker">Status</span>
                  <strong>Waiting for the mentor to accept</strong>
                  <span className="slate small">Then: Session 1 · Understand, at a slot your pod agrees</span>
                </div>
                <button type="button" className="btn btn--outline btn--sm" style={{ alignSelf: 'flex-start' }} onClick={() => setSent(false)}>
                  Withdraw request
                </button>
                <Link to="/" className="text-link" style={{ fontSize: 15 }}>
                  Back to the program site
                </Link>
              </div>
            ) : (
              <>
                <h2 id="sum-title" className="summary__title">
                  Your request
                </h2>
                <dl className="summary__list">
                  <div>
                    <dt className="kicker">Path</dt>
                    <dd>{pathLabel(path)}</dd>
                  </div>
                  <div>
                    <dt className="kicker">Mentor</dt>
                    <dd className={mentor ? undefined : 'is-empty'}>{mentor ? mentor.name : 'Not chosen yet'}</dd>
                  </div>
                  <div>
                    <dt className="kicker">Industry problem</dt>
                    <dd className={hasProblem ? undefined : 'is-empty'}>{problemText}</dd>
                  </div>
                </dl>
                <TextField
                  id="note"
                  label="A line about you"
                  optional
                  multiline
                  rows={3}
                  value={note}
                  onChange={setNote}
                  placeholder="What you hope to get from the mentor"
                />
                <button type="button" className="btn btn--gold btn--lg btn--block" disabled={!canSend} onClick={send}>
                  Send request
                  <Icon name="arrowRight" size={20} strokeWidth={2.2} />
                </button>
                <p className="muted small">
                  {canSend
                    ? 'Your mentor accepts or declines in the portal, and you will see the answer here.'
                    : 'Pick a mentor and attach a problem (or let your mentor suggest one) to send your request.'}
                </p>
              </>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
