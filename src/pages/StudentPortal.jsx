import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PortalHeader from '../components/PortalHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Icon from '../components/Icon.jsx';
import { TrackChip } from '../components/FrameworkChip.jsx';
import { SHOW_SAMPLE_LABELS } from '../config.js';
import { JOURNEY } from '../data/content.js';
import { MENTORS, slotsLabel } from '../data/mentors.js';
import { STUDENT_USER } from '../data/people.js';
import { PROBLEMS, PROBLEM_DEPARTMENTS, podsLabel } from '../data/problems.js';
import { FRAMEWORKS, FRAMEWORK_KEYS, MENTOR_INDUSTRIES } from '../data/taxonomy.js';
import { useAuth } from '../context/AuthContext.jsx';
import { cx, initials } from '../lib/format.js';
import usePageTitle from '../lib/usePageTitle.js';
import './portal.css';

const TABS = [
  { label: 'Overview', to: '/student' },
  { label: 'Request a mentor', to: '/student/request' },
  { label: 'My progress', to: '/student/progress' },
  { label: 'My profile', to: '/profile?role=mentee' },
];
const SUGGEST = 'mentor';
const pathLabel = (key) => `${key} · ${FRAMEWORKS[key].name}`;

export default function StudentPortal() {
  const { pathname } = useLocation();
  const { user, profile } = useAuth();
  const view = pathname.endsWith('/request') ? 'request' : pathname.endsWith('/progress') ? 'progress' : 'overview';
  const pageTitles = { overview: 'Student overview', request: 'Request a mentor', progress: 'My progress' };
  usePageTitle(pageTitles[view]);

  const [path, setPath] = useState('');
  const [mentorId, setMentorId] = useState('');
  const [problemId, setProblemId] = useState('');
  const [industry, setIndustry] = useState('all');
  const [dept, setDept] = useState('all');
  const [showAll, setShowAll] = useState(false);
  const [note, setNote] = useState('');
  const [wizardStep, setWizardStep] = useState(1);
  const [sent, setSent] = useState(false);

  const f = path ? FRAMEWORKS[path] : null;
  const mentor = MENTORS.find((item) => item.id === mentorId) || null;
  const problem = PROBLEMS.find((item) => item.id === problemId) || null;
  const suggest = problemId === SUGGEST;
  const hasProblem = Boolean(problem) || suggest;
  const canSend = Boolean(mentor && hasProblem);
  const mentors = MENTORS.filter((item) => (showAll || !f || item.tracks.includes(f.track)))
    .filter((item) => industry === 'all' || item.industry === industry)
    .sort((a, b) => Number(Boolean(f && b.tracks.includes(f.track))) - Number(Boolean(f && a.tracks.includes(f.track))) || b.slots - a.slots);
  const problems = PROBLEMS.filter((item) => dept === 'all' || item.dept === dept);
  const studentName = profile?.name || user?.name || STUDENT_USER.name;
  const stepLabels = ['Choose your path', 'Pick a mentor', 'Attach a problem', 'Check and send'];
  const steps = stepLabels.map((label, index) => ({
    label,
    done: sent || index + 1 < wizardStep,
    current: !sent && index + 1 === wizardStep,
  }));
  const canContinue = wizardStep === 1 ? Boolean(f) : wizardStep === 2 ? Boolean(mentor) : wizardStep === 3 ? hasProblem : canSend;

  const pickPath = (key) => {
    setPath(key);
    if (mentor && !mentor.tracks.includes(FRAMEWORKS[key].track)) setMentorId('');
    setSent(false);
  };
  const pickMentor = (item) => {
    if (item.slots === 0) return;
    setMentorId((current) => current === item.id ? '' : item.id);
    setSent(false);
  };
  const pickProblem = (id) => {
    setProblemId((current) => current === id ? '' : id);
    setSent(false);
  };
  const advance = () => {
    if (!canContinue) return;
    if (wizardStep === 4) {
      setSent(true);
      return;
    }
    setWizardStep((step) => Math.min(4, step + 1));
  };

  return (
    <div className="page-soft">
      <PortalHeader user={STUDENT_USER} tabs={TABS} view="student" />
      {view === 'overview' ? (
        <StudentOverview name={studentName} sent={sent} path={path} mentor={mentor} problem={problem} suggest={suggest} />
      ) : view === 'progress' ? (
        <StudentProgress path={path} sent={sent} mentor={mentor} />
      ) : (
        <RequestWizard
          path={path}
          framework={f}
          mentor={mentor}
          problem={problem}
          suggest={suggest}
          hasProblem={hasProblem}
          canSend={canSend}
          canContinue={canContinue}
          mentors={mentors}
          problems={problems}
          industry={industry}
          dept={dept}
          showAll={showAll}
          wizardStep={wizardStep}
          steps={steps}
          note={note}
          sent={sent}
          onPickPath={pickPath}
          onPickMentor={pickMentor}
          onPickProblem={pickProblem}
          onIndustryChange={setIndustry}
          onDeptChange={setDept}
          onShowAllChange={setShowAll}
          onNoteChange={setNote}
          onAdvance={advance}
          onBack={() => setWizardStep((step) => Math.max(1, step - 1))}
          onWithdraw={() => setSent(false)}
        />
      )}
      <SiteFooter white />
    </div>
  );
}

function StudentOverview({ name, sent, path, mentor, problem, suggest }) {
  return (
    <main className="container page-main">
      <header className="page-title">
        <p className="eyebrow">STUDENT PORTAL</p>
        <h1 className="h2">Welcome, {name}</h1>
        <p className="sub" style={{ fontSize: 18 }}>
          {sent ? 'Your mentor request is waiting for a response.' : 'Find a mentor and join a pod in three quick steps.'}
        </p>
      </header>
      <div className="student-overview-grid">
        <section className="panel student-overview-card" aria-labelledby="student-next-title">
          <div className="row row--between">
            <div>
              <p className="kicker">YOUR NEXT STEP</p>
              <h2 id="student-next-title" className="panel-title">{sent ? 'Request sent' : 'Request a mentor'}</h2>
            </div>
            <span className={cx('chip', sent ? 'chip--gold' : 'chip--navy')}>{sent ? 'Awaiting response' : 'Not started'}</span>
          </div>
          {sent ? (
            <>
              <p className="slate">
                Your request is with {mentor?.name || 'your selected mentor'}. The preview currently keeps requests in
                page state; they are not yet saved to the server.
              </p>
              <dl className="summary__list">
                <div><dt className="kicker">Path</dt><dd>{path ? pathLabel(path) : 'Not selected'}</dd></div>
                <div><dt className="kicker">Problem</dt><dd>{suggest ? 'Mentor to suggest one' : problem?.title || 'Not selected'}</dd></div>
              </dl>
            </>
          ) : (
            <p className="slate">
              Choose a path, find a mentor with an open slot, and attach an industry problem for your pod to work on.
            </p>
          )}
          <Link to="/student/request" className="btn btn--gold btn--lg" style={{ alignSelf: 'flex-start' }}>
            {sent ? 'Review your request' : 'Start a request'} <Icon name="arrowRight" size={20} />
          </Link>
        </section>
        <section className="panel student-overview-card" aria-labelledby="student-progress-title">
          <div>
            <p className="kicker">MY PROGRESS</p>
            <h2 id="student-progress-title" className="panel-title">Sessions and framework steps</h2>
          </div>
          <p className="slate">
            {sent
              ? 'Session and framework updates will appear here after your mentor accepts and your pod begins.'
              : 'Your sessions and framework progress will appear here once your pod is formed.'}
          </p>
          <Link to="/student/progress" className="text-link">View my progress <Icon name="arrowRight" size={18} /></Link>
        </section>
      </div>
      {SHOW_SAMPLE_LABELS ? <p className="muted small">Sample view · request actions are local to this page until portal APIs are connected.</p> : null}
    </main>
  );
}

function RequestWizard({
  path, framework, mentor, problem, suggest, hasProblem, canSend, canContinue, mentors, problems, industry, dept,
  showAll, wizardStep, steps, note, sent, onPickPath, onPickMentor, onPickProblem, onIndustryChange, onDeptChange,
  onShowAllChange, onNoteChange, onAdvance, onBack, onWithdraw,
}) {
  const problemText = suggest ? 'Mentor to suggest one in Session 1' : problem?.title || 'Not chosen yet';
  const mentorHint = framework
    ? `Mentors who list ${framework.track} as a track, for your ${path} path`
    : 'Choose a path to see mentors who can guide you.';

  return (
    <main className="container page-main">
      <div className="page-title">
        <p className="eyebrow">STUDENT PORTAL · REQUEST</p>
        <h1 className="h2">Request a mentor</h1>
        <p className="sub" style={{ fontSize: 18 }}>
          Choose your path, pick a mentor with an open slot, and attach an industry problem for your pod.
        </p>
      </div>
      {sent ? (
        <section className="panel request-sent" role="status">
          <span className="icon-circle icon-circle--lg tone-good"><Icon name="check" size={26} strokeWidth={2.6} /></span>
          <h2 className="panel-title">Request sent</h2>
          <p className="slate">
            {mentor?.name || 'Your mentor'} will accept or decline in the portal. The request is currently held in this
            page state and is not yet persisted by a request API.
          </p>
          <p className="slate">Status: waiting for the mentor to accept. Then your pod agrees on a time for Session 1.</p>
          <div className="row">
            <Link to="/student" className="btn btn--gold">Go to my overview <Icon name="arrowRight" size={18} /></Link>
            <button type="button" className="btn btn--outline" onClick={onWithdraw}>Withdraw request</button>
          </div>
        </section>
      ) : (
        <>
          <ol className="stepper list-reset" aria-label="Request steps">
            {steps.map((step, index) => (
              <li key={step.label} className={cx('stepper__item', step.done && 'is-done', step.current && 'is-current')}>
                <span className="stepper__dot" aria-hidden="true">
                  {step.done ? <Icon name="check" size={16} strokeWidth={3} /> : index + 1}
                </span>
                {step.label}
              </li>
            ))}
          </ol>
          <div className="portal-layout">
            <div className="portal-layout__main">
              {wizardStep === 1 ? <PathPicker path={path} onPick={onPickPath} /> : null}
              {wizardStep === 2 ? (
                <MentorPicker
                  framework={framework}
                  mentors={mentors}
                  selected={mentor}
                  industry={industry}
                  showAll={showAll}
                  hint={mentorHint}
                  onIndustryChange={onIndustryChange}
                  onShowAllChange={onShowAllChange}
                  onPick={onPickMentor}
                />
              ) : null}
              {wizardStep === 3 ? (
                <ProblemPicker problems={problems} selected={problem} suggest={suggest} dept={dept} onDeptChange={onDeptChange} onPick={onPickProblem} />
              ) : null}
              {wizardStep === 4 ? (
                <section className="panel stack" aria-labelledby="request-review-title">
                  <div className="panel__head">
                    <div>
                      <p className="kicker">STEP 4 · FINAL CHECK</p>
                      <h2 id="request-review-title" className="panel__title">Check and send</h2>
                    </div>
                  </div>
                  <dl className="summary__list">
                    <div><dt className="kicker">Path</dt><dd>{pathLabel(path)}</dd></div>
                    <div><dt className="kicker">Mentor</dt><dd>{mentor?.name || 'Not chosen'}</dd></div>
                    <div><dt className="kicker">Industry problem</dt><dd>{problemText}</dd></div>
                  </dl>
                  <label className="field__label" htmlFor="request-note">A line about you (optional)</label>
                  <textarea id="request-note" className="control" rows={3} value={note} onChange={(event) => onNoteChange(event.target.value)} placeholder="What you hope to get from the program" />
                </section>
              ) : null}
              <div className="request-wizard-actions">
                <button type="button" className="btn btn--outline" onClick={onBack} disabled={wizardStep === 1}>
                  <Icon name="arrowLeft" size={18} /> Back
                </button>
                <span className="muted small" role="status">
                  {wizardStep === 1 && !framework ? 'Pick one path to continue.' : null}
                  {wizardStep === 2 && !mentor ? 'Select a mentor with an open slot.' : null}
                  {wizardStep === 3 && !hasProblem ? 'Attach a problem or let your mentor suggest one.' : null}
                </span>
                <button type="button" className="btn btn--gold" onClick={onAdvance} disabled={!canContinue}>
                  {wizardStep === 4 ? 'Send request' : 'Continue'} <Icon name="arrowRight" size={18} />
                </button>
              </div>
            </div>
            <aside className="portal-layout__side summary" aria-labelledby="request-summary-title">
              <h2 id="request-summary-title" className="summary__title">Your request</h2>
              <dl className="summary__list">
                <div><dt className="kicker">Path</dt><dd className={path ? '' : 'is-empty'}>{path ? pathLabel(path) : 'Not chosen yet'}</dd></div>
                <div><dt className="kicker">Mentor</dt><dd className={mentor ? '' : 'is-empty'}>{mentor?.name || 'Not chosen yet'}</dd></div>
                <div><dt className="kicker">Industry problem</dt><dd className={hasProblem ? '' : 'is-empty'}>{problemText}</dd></div>
              </dl>
              {SHOW_SAMPLE_LABELS ? <p className="muted small">Your choices stay in this browser session; submission is not connected to a request API yet.</p> : null}
            </aside>
          </div>
        </>
      )}
    </main>
  );
}

function PathPicker({ path, onPick }) {
  return (
    <section className="panel" aria-labelledby="path-title">
      <div className="panel__head">
        <div>
          <p className="kicker">STEP 1</p>
          <h2 id="path-title" className="panel__title">Choose your path</h2>
        </div>
        <Link to="/frameworks" className="text-link">How the frameworks work <Icon name="arrowRight" size={17} /></Link>
      </div>
      <div className="path-grid" role="group" aria-label="Your path">
        {FRAMEWORK_KEYS.map((key) => {
          const item = FRAMEWORKS[key];
          const selected = key === path;
          return (
            <button
              key={key}
              type="button"
              className="path-btn"
              aria-pressed={selected}
              onClick={() => onPick(key)}
              style={selected ? { background: item.tint, borderColor: item.color } : undefined}
            >
              <span className="row" style={{ '--gap': '10px' }}>
                <span className="path-btn__icon" style={{ background: item.color, color: item.onColor }}><Icon name={item.icon} size={20} /></span>
                <span className="path-btn__key" style={{ color: item.ink }}>{key}</span>
              </span>
              <span className="path-btn__want">{item.want}</span>
              <span className="slate small">{item.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function MentorPicker({ framework, mentors, selected, industry, showAll, hint, onIndustryChange, onShowAllChange, onPick }) {
  return (
    <section className="panel" aria-labelledby="mentors-title">
      <div className="panel__head">
        <div>
          <p className="kicker">STEP 2</p>
          <h2 id="mentors-title" className="panel__title">Pick a mentor</h2>
          <p className="muted small">{hint}</p>
        </div>
        <div className="row" style={{ '--gap': '8px' }}>
          <label className="inline-filter" htmlFor="ind-filter">Industry</label>
          <select id="ind-filter" className="control control--inline" value={industry} onChange={(event) => onIndustryChange(event.target.value)}>
            <option value="all">All industries</option>
            {MENTOR_INDUSTRIES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <button type="button" className="btn btn--quiet btn--sm" aria-pressed={showAll} onClick={() => onShowAllChange((value) => !value)}>
            {showAll ? 'Show mentors for my path' : 'Show all mentors'}
          </button>
        </div>
      </div>
      <div className="mentor-grid">
        {mentors.map((item) => {
          const on = selected?.id === item.id;
          const full = item.slots === 0;
          return (
            <article key={item.id} className={cx('mentor-card', on && 'is-on')}>
              <div className="mentor-card__head">
                <span className={cx('avatar', on ? 'tone-gold' : 'tone-navy')} aria-hidden="true">{initials(item.name)}</span>
                <div className="mentor-card__who"><span className="mentor-card__name">{item.name}</span><span className="muted small">{item.role}</span></div>
                <span className={cx('chip', full ? 'chip--muted' : 'chip--good')}>{slotsLabel(item.slots)}</span>
              </div>
              <div className="row" style={{ '--gap': '6px' }}>
                <span className="chip chip--navy">{item.industry}</span>
                {item.tracks.map((track) => <TrackChip key={track} track={track} />)}
              </div>
              {framework && !item.tracks.includes(framework.track) ? <span className="small" style={{ color: 'var(--gold-ink)' }}>Does not list {framework.track} as a track</span> : null}
              <button type="button" className={cx('btn btn--sm', on ? 'btn--navy' : 'btn--outline')} disabled={full} aria-pressed={on} onClick={() => onPick(item)}>
                {full ? 'Pod full' : on ? 'Selected' : 'Select mentor'}
              </button>
            </article>
          );
        })}
      </div>
      {mentors.length === 0 ? <p className="empty">No mentors match this filter. Try another industry or show all mentors.</p> : null}
    </section>
  );
}

function ProblemPicker({ problems, selected, suggest, dept, onDeptChange, onPick }) {
  return (
    <section className="panel" aria-labelledby="problems-title">
      <div className="panel__head">
        <div>
          <p className="kicker">STEP 3</p>
          <h2 id="problems-title" className="panel__title">Attach an industry problem</h2>
          <p className="muted small">Your pod works on it in Session 3, solving it as professionals would, not as an exam.</p>
        </div>
        <div className="row" style={{ '--gap': '8px' }}>
          <label className="inline-filter" htmlFor="prob-dept">Department</label>
          <select id="prob-dept" className="control control--inline" value={dept} onChange={(event) => onDeptChange(event.target.value)}>
            <option value="all">All departments</option>
            {PROBLEM_DEPARTMENTS.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>
      <ul className="list-reset stack" style={{ '--gap': '10px' }}>
        {problems.map((item) => {
          const on = selected?.id === item.id;
          return (
            <li key={item.id} className={cx('problem-item', on && 'is-on')}>
              <div className="problem-item__copy">
                <span className="problem-item__title">{item.title}</span>
                <span className="row" style={{ '--gap': '6px' }}>
                  <span className="chip chip--navy">{item.dept}</span>
                  <span className="chip chip--outline">{item.level}</span>
                  <span className="muted small">From: {item.source}</span>
                </span>
              </div>
              <span className={cx('chip', item.pods ? 'chip--outline' : 'chip--gold')}>{podsLabel(item.pods)}</span>
              <button type="button" className={cx('btn btn--sm', on ? 'btn--navy' : 'btn--outline')} aria-pressed={on} onClick={() => onPick(item.id)}>
                {on ? 'Attached' : 'Attach'}
              </button>
            </li>
          );
        })}
      </ul>
      {problems.length === 0 ? <p className="empty">No open problems from this department yet. Try another department.</p> : null}
      <button type="button" className={cx('btn btn--sm btn--dashed', suggest && 'is-on')} aria-pressed={suggest} onClick={() => onPick(SUGGEST)}>
        Not sure yet? Let my mentor suggest one
      </button>
    </section>
  );
}

function StudentProgress({ path, sent, mentor }) {
  const framework = path ? FRAMEWORKS[path] : null;
  return (
    <main className="container page-main">
      <header className="page-title">
        <p className="eyebrow">STUDENT PORTAL</p>
        <h1 className="h2">My progress</h1>
        <p className="sub" style={{ fontSize: 18 }}>
          {framework ? pathLabel(path) : 'Your sessions and framework steps will appear here when your pod begins.'}
          {sent && mentor ? ` · Request with ${mentor.name}` : ''}
        </p>
      </header>
      {sent ? (
        <p className="status status--warn">Your request is waiting for the mentor to accept. Session updates will appear once your pod starts.</p>
      ) : (
        <p className="status">No pod progress yet. <Link to="/student/request">Request a mentor</Link> to get started.</p>
      )}
      {framework ? (
        <section className="panel stack" aria-labelledby="framework-steps-title">
          <div className="panel__head">
            <div>
              <p className="kicker">{framework.key} · {framework.sub}</p>
              <h2 id="framework-steps-title" className="panel__title">{framework.key} steps</h2>
            </div>
            <Link to="/frameworks" className="text-link">Open the framework guide <Icon name="arrowRight" size={17} /></Link>
          </div>
          <p className="muted small">Your mentor records the step reached after each session.</p>
          <ol className="list-reset progress-steps" aria-label="Framework steps">
            {framework.letters.map((letter, index) => (
              <li className="progress-step" key={letter + index}>
                <span className="step step--lg" aria-hidden="true">{letter}</span>
                <span className="stack" style={{ '--gap': 0 }}>
                  <strong style={{ fontSize: 15 }}>{framework.steps[index]}</strong>
                  <span className="muted small">Not started</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
      <section className="panel stack" aria-labelledby="sessions-title">
        <div>
          <p className="kicker">SESSIONS</p>
          <h2 id="sessions-title" className="panel__title">The mentorship journey</h2>
        </div>
        <ol className="list-reset session-list">
          {JOURNEY.map((session) => (
            <li key={session.session} className="session-item">
              <span className="kicker" style={{ color: 'var(--gold-text)' }}>Session {session.session} · {session.phase}</span>
              <strong style={{ fontSize: 15 }}>{session.title}</strong>
              <span className="muted small">Not started</span>
            </li>
          ))}
        </ol>
      </section>
      {SHOW_SAMPLE_LABELS ? <p className="muted small">Sample view · live session attendance and mentor notes are not connected to the backend yet.</p> : null}
    </main>
  );
}
