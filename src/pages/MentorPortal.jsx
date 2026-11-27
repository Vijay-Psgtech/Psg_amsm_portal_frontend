import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PortalHeader from '../components/PortalHeader.jsx';
import Icon from '../components/Icon.jsx';
import ToggleChip from '../components/ToggleChip.jsx';
import StepChips, { StepLegend } from '../components/StepChips.jsx';
import { FrameworkChip, TrackChip } from '../components/FrameworkChip.jsx';
import { SHOW_ANNOTATIONS } from '../config.js';
import { MENTORS, slotsLabel } from '../data/mentors.js';
import { MENTEES, MENTOR_USER, POD_A } from '../data/people.js';
import { PROBLEMS, PROBLEM_DEPARTMENTS, podsLabel } from '../data/problems.js';
import { JOURNEY } from '../data/content.js';
import { FRAMEWORKS, MENTOR_INDUSTRIES, TRACKS } from '../data/taxonomy.js';
import { useAuth } from '../context/AuthContext.jsx';
import { cx, initials } from '../lib/format.js';
import usePageTitle from '../lib/usePageTitle.js';
import SiteFooter from '../components/SiteFooter.jsx';
import './portal.css';

const TABS = [
  { label: 'Overview', to: '/mentor' },
  { label: 'My mentees', to: '/mentor/mentees' },
  { label: 'Industry problems', to: '/mentor/problems' },
  { label: 'My profile', to: '/profile?role=mentor' },
];

const POD_SIZE = 5;
const MENTORS_PREVIEW = 3;
const PROBLEMS_PREVIEW = 4;
const ANNOTATIONS = ['Mentors and their profiles', 'Industry problems from every department', 'Mentee requests to accept', 'Mentee progress'];

/** Other mentors in the program: everyone except the signed-in mentor. */
const OTHER_MENTORS = MENTORS.filter((m) => m.id !== MENTOR_USER.id);

const initialSteps = () => Object.fromEntries(Object.entries(MENTEES).map(([id, m]) => [id, m.step]));

export default function MentorPortal() {
  const { pathname } = useLocation();
  const view = pathname.endsWith('/mentees') ? 'mentees' : pathname.endsWith('/problems') ? 'problems' : 'overview';
  usePageTitle(view === 'mentees' ? 'My mentees' : view === 'problems' ? 'Industry problems' : 'Mentor home');
  const { user, profile } = useAuth();
  const mentorName = profile?.name || user?.name || MENTOR_USER.name;
  const firstName = mentorName.trim().split(/\s+/)[0];

  // Mentors panel
  const [track, setTrack] = useState('all');
  const [industry, setIndustry] = useState('all');
  const [allMentors, setAllMentors] = useState(false);
  // Problems panel
  const [dept, setDept] = useState('all');
  const [allProblems, setAllProblems] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDept, setDraftDept] = useState('Production');
  const [added, setAdded] = useState([]);
  // Pod
  const [members, setMembers] = useState(POD_A.members);
  const [requests, setRequests] = useState(POD_A.requests);
  const [last, setLast] = useState(null);
  const [steps, setSteps] = useState(initialSteps);
  const [session, setSession] = useState(POD_A.session); // the next session to hold
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [saved, setSaved] = useState('');

  const mentorList = OTHER_MENTORS.filter(
    (m) => (track === 'all' || m.tracks.includes(track)) && (industry === 'all' || m.industry === industry)
  );
  const mentorsShown = allMentors ? mentorList : mentorList.slice(0, MENTORS_PREVIEW);

  const pool = [
    ...added.map((a) => ({ ...a, level: 'Awaiting review', source: 'Alumni · you', isNew: true })),
    ...PROBLEMS,
  ];
  const problemList = pool.filter((p) => dept === 'all' || p.dept === dept);
  const problemsShown = allProblems ? problemList : problemList.slice(0, PROBLEMS_PREVIEW);

  const podFull = members.length >= POD_SIZE;
  const open = POD_SIZE - members.length;
  const pending = POD_A.requests.filter((id) => requests.includes(id));
  const allHeld = session > 4;
  const lastHeld = Math.max(1, Math.min(4, session - 1));
  const sessionText = allHeld ? 'All 4 sessions held' : `Session ${session} of 4`;
  const nextSession = JOURNEY.find((item) => item.session === session);

  // Wireframe: the handlers below change local state only. When the portal has an API,
  // call it here: accept or decline a request, record a session, save feedback, add a problem.
  const accept = (id) => {
    if (podFull) return;
    setMembers((m) => [...m, id]);
    setRequests((r) => r.filter((x) => x !== id));
    setLast({ type: 'accepted', id });
  };
  const decline = (id) => {
    setRequests((r) => r.filter((x) => x !== id));
    setLast({ type: 'declined', id });
  };
  const undo = () => {
    if (!last) return;
    if (last.type === 'accepted') setMembers((m) => m.filter((x) => x !== last.id));
    setRequests((r) => [...r, last.id]);
    setLast(null);
  };
  const addProblem = () => {
    const title = draftTitle.trim();
    if (!title) return;
    setAdded((a) => [{ id: `new-${Date.now()}`, title, dept: draftDept, pods: 0 }, ...a]);
    setDraftTitle('');
    setSuggesting(false);
    setDept('all');
  };
  const recordSession = () => {
    if (session <= 4) {
      setSession((s) => s + 1);
      setSaved('');
    }
  };
  const saveFeedback = () => {
    if (!feedback.trim()) return;
    setSaved(`Feedback saved for Session ${lastHeld} and shared with the pod`);
    setFeedback('');
    setFeedbackOpen(false);
  };

  return (
    <div className="page-soft">
      <PortalHeader user={MENTOR_USER} tabs={TABS} view="mentor" />
      <main id="overview" className="container page-main mentor-page">
        {view === 'overview' ? (
          <>
        <header className="mentor-welcome">
          <div>
            <p className="mentor-welcome__eyebrow">MENTOR PORTAL</p>
            <h1 className="h2">Welcome back, {firstName}</h1>
            <p className="slate">Your next session, mentee requests and pod at a glance.</p>
          </div>
          <span className="head-chip">{POD_A.name} · {POD_A.cycle}</span>
        </header>

        <div className="mentor-overview-grid">
          <div className="mentor-overview-main">
            <section id="next-session" className="mentor-session" aria-labelledby="session-title">
              <div className="mentor-session__head">
                <div>
                  <p className="mentor-session__eyebrow">{allHeld ? 'PROGRAM UPDATE' : `NEXT SESSION · ${POD_A.name} · ${POD_A.cycle}`}</p>
                  <h2 id="session-title">
                    {nextSession ? `Session ${session}: ${nextSession.title}` : 'All four sessions are complete'}
                  </h2>
                  <p className="mentor-session__meta">
                    {nextSession ? `${nextSession.phase} · Date and time to be confirmed · Online, 1.5–2 hours` : sessionText}
                  </p>
                </div>
                <span className="mentor-session__number">{nextSession ? `0${session}` : '✓'}</span>
              </div>
              {nextSession ? (
                <>
                  <div className="mentor-session__plan">
                    <span className="mentor-session__label">SESSION PLAN</span>
                    <ul>
                      {nextSession.points.map((point) => <li key={point}>{point}</li>)}
                    </ul>
                  </div>
                  <div className="row" style={{ '--gap': '8px' }}>
                    <button type="button" className="btn btn--gold btn--sm" onClick={recordSession}>
                      Mark Session {session} as held
                    </button>
                    <Link className="btn btn--session-quiet btn--sm" to="/mentor/mentees">Record mentee progress</Link>
                  </div>
                </>
              ) : (
                <p className="mentor-session__meta">Your pod has completed the planned mentorship cycle.</p>
              )}
            </section>

            <section id="mentees" className="panel panel--tight" aria-labelledby="r-title">
              <Annotation n={3} />
              <div className="row row--between" style={{ '--gap': '8px 12px' }}>
                <div>
                  <h2 id="r-title" className="panel-title">Mentee requests</h2>
                  <p className="slate small">Review students who would like to join your pod.</p>
                </div>
                {pending.length ? <span className="chip chip--gold">{pending.length} new</span> : null}
              </div>
              <div className="seat-meter">
                <span className="small" style={{ fontWeight: 700 }}>
                  {POD_A.name} · {members.length} of {POD_SIZE} students
                </span>
                <span className="row" style={{ '--gap': '5px' }} aria-hidden="true">
                  {Array.from({ length: POD_SIZE }, (_, i) => (
                    <span key={i} className={cx('seat', i < members.length && 'is-taken')} />
                  ))}
                </span>
                <span className="small" style={{ fontWeight: 700, color: podFull ? 'var(--gold-ink)' : 'var(--good)' }}>
                  {podFull ? 'Pod full' : `${open} ${open === 1 ? 'slot' : 'slots'} open`}
                </span>
              </div>
              {pending.map((id) => {
                const p = MENTEES[id];
                return (
                  <article key={id} className="mini-card request">
                    <span className="avatar tone-blue" aria-hidden="true" style={{ width: 42, height: 42 }}>
                      {initials(p.name)}
                    </span>
                    <div className="mini-card__body" style={{ flex: '1 1 150px', gap: 2 }}>
                      <span className="row" style={{ '--gap': '6px' }}>
                        <span className="mini-card__name" style={{ fontSize: 16 }}>{p.name}</span>
                        <FrameworkChip fw={p.fw} />
                      </span>
                      <span className="muted" style={{ fontSize: 13 }}>{p.dept} · 3rd year</span>
                      <span className="slate" style={{ fontSize: 13 }}>Problem: {p.problem}</span>
                    </div>
                    <div className="row" style={{ '--gap': '6px' }}>
                      <button
                        type="button"
                        className="btn btn--navy pill-btn"
                        disabled={podFull}
                        aria-label={`Accept ${p.name}`}
                        onClick={() => accept(id)}
                      >
                        Accept
                      </button>
                      <button type="button" className="btn btn--quiet pill-btn" aria-label={`Decline ${p.name}`} onClick={() => decline(id)}>
                        Decline
                      </button>
                    </div>
                  </article>
                );
              })}
              {pending.length === 0 ? <p className="empty">No pending requests. New requests from students appear here.</p> : null}
              {last ? (
                <p role="status" className="row slate small" style={{ '--gap': '6px 10px' }}>
                  {last.type === 'accepted'
                    ? `Accepted ${MENTEES[last.id].name} into ${POD_A.name}.`
                    : `Declined ${MENTEES[last.id].name}’s request.`}
                  <button type="button" className="btn btn--link undo" onClick={undo}>Undo</button>
                </p>
              ) : null}
            </section>
          </div>

          <aside className="panel panel--tight mentor-pod" aria-labelledby="pod-title">
            <div className="row row--between" style={{ '--gap': '8px' }}>
              <div>
                <p className="mentor-pod__eyebrow">YOUR GROUP</p>
                <h2 id="pod-title" className="panel-title">My pod</h2>
              </div>
              <span className="chip chip--navy">{POD_A.cycle}</span>
            </div>
            <p className="mentor-pod__mentor">
              <span className="avatar avatar--sm tone-gold" aria-hidden="true">{initials(mentorName)}</span>
              <span><strong>{mentorName}</strong><small>Mentor</small></span>
            </p>
            <div className="mentor-pod__roster">
              <h3>Mentees <span>{members.length}/{POD_SIZE}</span></h3>
              {members.map((id) => {
                const mentee = MENTEES[id];
                return (
                  <div key={id} className="mentor-pod__member">
                    <span className="avatar avatar--sm tone-blue" aria-hidden="true">{initials(mentee.name)}</span>
                    <span><strong>{mentee.name}</strong><small>{mentee.dept} · 3rd year</small></span>
                  </div>
                );
              })}
              {members.length === 0 ? <p className="slate small">No mentees have joined the pod yet.</p> : null}
            </div>
            <div className="mentor-pod__capacity">
              <span className="small">{podFull ? 'Pod capacity reached' : `${open} ${open === 1 ? 'place' : 'places'} available`}</span>
              <div className="mentor-pod__seats" role="img" aria-label={`${members.length} of ${POD_SIZE} mentee places filled`}>
                {Array.from({ length: POD_SIZE }, (_, i) => <span key={i} className={i < members.length ? 'is-filled' : ''} />)}
              </div>
            </div>
          </aside>
        </div>

        <section className="mentor-quick-actions" aria-labelledby="quick-actions-title">
          <div className="mentor-quick-actions__heading">
            <div>
              <p className="mentor-welcome__eyebrow">KEEP THINGS MOVING</p>
              <h2 id="quick-actions-title">Quick actions</h2>
            </div>
          </div>
          <div className="mentor-quick-actions__grid">
            <Link className="mentor-quick-action" to="/mentor/mentees">
              <strong>Record progress</strong>
              <span>Update each mentee’s framework steps.</span>
            </Link>
            <Link className="mentor-quick-action" to="/mentor/problems" onClick={() => setSuggesting(true)}>
              <strong>Suggest a problem</strong>
              <span>Share a real industry challenge with the program.</span>
            </Link>
            <Link className="mentor-quick-action" to="/frameworks">
              <strong>Mentor guide</strong>
              <span>Review the frameworks for guiding your pod.</span>
            </Link>
            <a className="mentor-quick-action" href="#next-session">
              <strong>Session plans</strong>
              <span>See the topic and plan for your next session.</span>
            </a>
          </div>
        </section>
          </>
        ) : null}

        {view === 'problems' ? (
          <>
        <header className="mentor-welcome">
          <div>
            <p className="mentor-welcome__eyebrow">MENTOR PORTAL</p>
            <h1 className="h2">Industry problems</h1>
            <p className="slate">Browse challenges from mentors and share a problem from your workplace.</p>
          </div>
          <span className="head-chip">{problemList.length} problems</span>
        </header>
        <div className="mentor-resource-grid">
          <section id="problems" className="panel panel--tight" aria-labelledby="p-title">
            <Annotation n={2} />
            <div className="row row--between" style={{ '--gap': '8px 12px' }}>
              <div>
                <h2 id="p-title" className="panel-title">Industry problems</h2>
                <p className="slate small">Explore challenges shared by mentors across departments.</p>
              </div>
              <select
                className="control control--inline pill-select"
                aria-label="Filter problems by department"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
              >
                <option value="all">All departments</option>
                {PROBLEM_DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            {problemsShown.map((p) => (
              <article key={p.id} className="mini-card" style={{ alignItems: 'center' }}>
                <div className="mini-card__body">
                  <span className="mini-card__name" style={{ fontSize: 16 }}>{p.title}</span>
                  <span className="row" style={{ '--gap': '6px' }}>
                    <span className="chip chip--navy">{p.dept}</span>
                    <span className="chip chip--outline">{p.level}</span>
                    <span className="muted" style={{ fontSize: 13 }}>{p.isNew ? p.source : `From: ${p.source}`}</span>
                  </span>
                </div>
                {p.isNew ? (
                  <span className="chip" style={{ flex: 'none', background: FRAMEWORKS.STAR.tint, color: FRAMEWORKS.STAR.ink }}>New</span>
                ) : (
                  <span className={cx('chip', p.pods ? 'chip--outline' : 'chip--gold')} style={{ flex: 'none' }}>{podsLabel(p.pods)}</span>
                )}
              </article>
            ))}
            {problemList.length === 0 ? <p className="slate" style={{ fontSize: 15 }}>No problems from this department yet.</p> : null}
            <div className="row row--between" style={{ '--gap': '8px' }}>
              {problemList.length > PROBLEMS_PREVIEW ? (
                <MoreButton expanded={allProblems} onClick={() => setAllProblems((v) => !v)}>
                  {allProblems ? 'Show fewer problems' : `View all ${problemList.length} problems`}
                </MoreButton>
              ) : <span />}
              <button
                type="button"
                className="btn btn--sm btn--dashed"
                style={{ borderColor: 'var(--navy)', borderWidth: 1 }}
                aria-expanded={suggesting}
                aria-controls="suggest-form"
                onClick={() => setSuggesting((v) => !v)}
              >
                <Icon name="plus" size={16} strokeWidth={2.6} />
                Suggest one from your workplace
              </button>
            </div>
            {suggesting ? (
              <div id="suggest-form" className="suggest">
                <div className="field">
                  <label className="field__label" htmlFor="draft-title">Problem, in one line</label>
                  <input
                    id="draft-title"
                    className="control"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') addProblem(); }}
                    placeholder="e.g. Reduce idle time on a stamping press"
                  />
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="draft-dept">Best suited to</label>
                  <select id="draft-dept" className="control" value={draftDept} onChange={(e) => setDraftDept(e.target.value)}>
                    {PROBLEM_DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="row" style={{ '--gap': '8px' }}>
                  <button type="button" className="btn btn--navy btn--sm" disabled={!draftTitle.trim()} onClick={addProblem}>Add to the pool</button>
                  <button type="button" className="btn btn--quiet btn--sm" onClick={() => setSuggesting(false)}>Cancel</button>
                </div>
                <p className="muted" style={{ fontSize: 13 }}>The college team reviews and tags new problems before pods can pick them.</p>
              </div>
            ) : null}
          </section>

          <section id="mentors" className="panel panel--tight" aria-labelledby="m-title">
            <Annotation n={1} />
            <div>
              <h2 id="m-title" className="panel-title">Mentor directory</h2>
              <p className="slate small">Browse other mentors in the program.</p>
            </div>
            <div className="row" style={{ '--gap': '6px' }} role="group" aria-label="Filter mentors by track">
              {['all', ...TRACKS].map((t) => (
                <ToggleChip key={t} small on={track === t} onClick={() => setTrack(t)}>
                  {t === 'all' ? 'All' : t}
                </ToggleChip>
              ))}
            </div>
            <div className="inline-filter" style={{ display: 'flex' }}>
              <label htmlFor="mentor-industry">Industry</label>
              <select
                id="mentor-industry"
                className="control control--inline"
                style={{ flex: '1 1 200px', minHeight: 40, fontSize: 14 }}
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value="all">All industries</option>
                {MENTOR_INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            {mentorsShown.map((m) => (
              <article key={m.id} className="mini-card">
                <span className={cx('avatar', m.tone)} aria-hidden="true">{initials(m.name)}</span>
                <div className="mini-card__body">
                  <div className="row row--between" style={{ '--gap': '4px 8px' }}>
                    <span className="mini-card__name">{m.name}</span>
                    <span className={cx('chip', m.slots ? 'chip--good' : 'chip--muted')}>{slotsLabel(m.slots)}</span>
                  </div>
                  <span className="slate small">{m.role}</span>
                  <span className="row" style={{ '--gap': '6px' }}>
                    <span className="chip chip--navy">{m.industry}</span>
                    {m.tracks.map((t) => <TrackChip key={t} track={t} />)}
                  </span>
                </div>
              </article>
            ))}
            {mentorList.length === 0 ? <p className="slate" style={{ fontSize: 15 }}>No mentors match these filters yet.</p> : null}
            {mentorList.length > MENTORS_PREVIEW ? (
              <MoreButton expanded={allMentors} onClick={() => setAllMentors((v) => !v)}>
                {allMentors ? 'Show fewer mentors' : `View all ${mentorList.length} mentors`}
              </MoreButton>
            ) : null}
          </section>
        </div>
          </>
        ) : null}

        {view === 'mentees' ? (
          <>
        <header className="mentor-welcome">
          <div>
            <p className="mentor-welcome__eyebrow">MENTOR PORTAL</p>
            <h1 className="h2">My mentees</h1>
            <p className="slate">Review progress across your pod and leave notes for the next session.</p>
          </div>
          <span className="head-chip">{POD_A.name} · {sessionText}</span>
        </header>
        <section id="progress" className="panel panel--tight" aria-labelledby="g-title">
          <Annotation n={4} />
          <div className="row row--between" style={{ alignItems: 'baseline', '--gap': '4px 12px' }}>
            <div>
              <h2 id="g-title" className="panel-title">Mentee progress</h2>
              <p className="slate small">Select a framework step to record where each student is.</p>
            </div>
            <span className="muted small">{POD_A.name} · {sessionText}</span>
          </div>
          {members.map((id) => {
            const p = MENTEES[id];
            const f = FRAMEWORKS[p.fw];
            return (
              <div key={id} className="progress-row">
                <span className="row" style={{ '--gap': '8px', flexWrap: 'nowrap', minWidth: 0 }}>
                  <span className="avatar avatar--sm tone-navy" aria-hidden="true">{initials(p.name)}</span>
                  <span className="stack" style={{ '--gap': '0', minWidth: 0 }}>
                    <strong style={{ fontSize: 15 }}>{p.name}</strong>
                    <span style={{ fontSize: 12, fontWeight: 700, color: f.ink }}>{f.key} · {f.name}</span>
                  </span>
                </span>
                <StepChips
                  large
                  fw={p.fw}
                  name={p.name}
                  reached={steps[id]}
                  onSelect={(no) => setSteps((s) => ({ ...s, [id]: no }))}
                />
              </div>
            );
          })}
          {members.length === 0 ? <p className="empty">Mentee progress will appear here when students join your pod.</p> : null}
          <StepLegend />
          <div className="row" style={{ '--gap': '8px' }}>
            <button
              type="button"
              className="btn btn--quiet btn--sm"
              aria-expanded={feedbackOpen}
              aria-controls="feedback-form"
              onClick={() => setFeedbackOpen((v) => !v)}
            >
              Add session feedback
            </button>
          </div>
          {feedbackOpen ? (
            <div id="feedback-form" className="stack" style={{ '--gap': '8px' }}>
              <label className="field__label" htmlFor="feedback">Feedback for the pod after Session {lastHeld}</label>
              <textarea
                id="feedback"
                className="control"
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What went well, and what each student should prepare next"
              />
              <button type="button" className="btn btn--navy btn--sm" style={{ alignSelf: 'flex-start' }} disabled={!feedback.trim()} onClick={saveFeedback}>
                Save feedback
              </button>
            </div>
          ) : null}
          {saved ? (
            <p role="status" className="row small" style={{ '--gap': '8px', fontWeight: 700, color: 'var(--good)' }}>
              <Icon name="check" size={18} strokeWidth={2.6} />
              {saved}
            </p>
          ) : null}
        </section>
          </>
        ) : null}

        {SHOW_ANNOTATIONS && view === 'overview' ? (
          <ul className="annotations list-reset" aria-label="Annotations">
            {ANNOTATIONS.map((text, i) => (
              <li key={text}>
                <span className="annotations__n" aria-hidden="true">
                  {i + 1}
                </span>
                {text}
              </li>
            ))}
          </ul>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}

function Annotation({ n }) {
  if (!SHOW_ANNOTATIONS) return null;
  return (
    <span className="anno" aria-hidden="true">
      {n}
    </span>
  );
}

function MoreButton({ expanded, onClick, children }) {
  return (
    <button type="button" className="btn btn--link more-btn" aria-expanded={expanded} onClick={onClick}>
      {children}
      <Icon name="chevronRight" size={16} strokeWidth={2.4} style={{ transform: `rotate(${expanded ? -90 : 90}deg)` }} />
    </button>
  );
}
