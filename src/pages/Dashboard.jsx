import { useMemo, useState } from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Icon from '../components/Icon.jsx';
import Segmented from '../components/Segmented.jsx';
import PodDiagram from '../components/PodDiagram.jsx';
import StepChips, { StepLegend } from '../components/StepChips.jsx';
import { FrameworkChip, FrameworkLegend } from '../components/FrameworkChip.jsx';
import { SHOW_SAMPLE_LABELS } from '../config.js';
import { PODS } from '../data/pods.js';
import { DEPARTMENTS, FRAMEWORKS, FRAMEWORK_KEYS, MENTOR_INDUSTRIES, RHYTHM } from '../data/taxonomy.js';
import {
  DEFAULT_FILTERS,
  SCALE_TARGETS,
  applyFilters,
  byFramework,
  byIndustry,
  byStage,
  isFiltered,
  keyFigures,
  matchesFilters,
  podAttendance,
  programScale,
} from '../lib/dashboard.js';
import { formatNumber, initials, pct, plural } from '../lib/format.js';
import usePageTitle from '../lib/usePageTitle.js';
import './dashboard.css';

const CYCLE_OPTIONS = [
  { value: 'all', label: 'All cycles' },
  { value: '1', label: 'Cycle 1 · pilot' },
  { value: '2', label: 'Cycle 2' },
];
const FW_OPTIONS = [
  { value: 'all', label: 'All' },
  ...FRAMEWORK_KEYS.map((key) => ({ value: key, label: key, dot: FRAMEWORKS[key].color })),
];
/** "Situation · Identify · Goal" etc., for when no single framework is selected. */
const STAGE_NAMES_ALL = RHYTHM.map((_, i) => FRAMEWORK_KEYS.map((key) => FRAMEWORKS[key].steps[i]).join(' · '));

export default function Dashboard() {
  usePageTitle('Impact dashboard');

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedPod, setSelectedPod] = useState('C2-04');
  const [view, setView] = useState('chart');
  const [focusIndustry, setFocusIndustry] = useState(null);
  const setFilter = (key) => (value) => setFilters((current) => ({ ...current, [key]: value }));

  const { rows, pods } = useMemo(() => applyFilters(PODS, filters), [filters]);
  const kpi = useMemo(() => keyFigures(rows, pods), [rows, pods]);
  const scale = useMemo(() => programScale(PODS), []);
  const fwSplit = useMemo(() => byFramework(rows), [rows]);
  const stages = useMemo(() => byStage(rows), [rows]);
  const industries = useMemo(() => byIndustry(rows, MENTOR_INDUSTRIES), [rows]);
  const podCards = useMemo(
    () => [...pods].sort((a, b) => b.cycle - a.cycle || a.id.localeCompare(b.id)),
    [pods]
  );
  const detail = pods.find((p) => p.id === selectedPod) || null;
  const match = (pod, m) => matchesFilters(pod, m, filters);

  return (
    <div className="page-soft">
      <SiteHeader />
      <main className="container page-main">
        <div className="row row--between" style={{ alignItems: 'flex-end' }}>
          <div className="page-title">
            <p className="eyebrow">Mentor – Mentee program at PSG Tech</p>
            <h1 className="h2">Impact dashboard</h1>
            <p className="sub" style={{ fontSize: 18 }}>
              How many students the program reaches, by framework, industry and stage, and how every mentor pod is
              doing.
            </p>
          </div>
          {SHOW_SAMPLE_LABELS ? (
            <span className="dash-badge">
              <Icon name="info" size={16} />
              Sample data for the wireframe
            </span>
          ) : null}
        </div>

        <ScaleBand scale={scale} />

        <section className="dash-filters" aria-label="Filters">
          <div className="dash-filter">
            <span className="dash-filter__label">Cycle</span>
            <Segmented label="Cycle" options={CYCLE_OPTIONS} value={filters.cycle} onChange={setFilter('cycle')} />
          </div>
          <div className="dash-filter">
            <span className="dash-filter__label">Framework</span>
            <Segmented label="Framework" options={FW_OPTIONS} value={filters.fw} onChange={setFilter('fw')} />
          </div>
          <div className="inline-filter">
            <label htmlFor="filter-dept">Student department</label>
            <select
              id="filter-dept"
              className="control control--inline"
              value={filters.dept}
              onChange={(e) => setFilter('dept')(e.target.value)}
            >
              <option value="all">All departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="inline-filter">
            <label htmlFor="filter-industry">Mentor industry</label>
            <select
              id="filter-industry"
              className="control control--inline"
              value={filters.industry}
              onChange={(e) => setFilter('industry')(e.target.value)}
            >
              <option value="all">All industries</option>
              {MENTOR_INDUSTRIES.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="btn btn--link dash-filters__reset"
            disabled={!isFiltered(filters)}
            onClick={() => setFilters(DEFAULT_FILTERS)}
          >
            Reset filters
          </button>
        </section>

        {kpi.students === 0 ? (
          <p role="status" className="status status--warn">
            No students match these filters. Try another framework, department or industry, or reset the filters.
          </p>
        ) : null}

        <KeyFigures kpi={kpi} />

        <div className="dash-row">
          <FrameworkCard split={fwSplit} total={kpi.students} />
          <StageCard stages={stages} total={kpi.students} fw={filters.fw} />
        </div>

        <IndustryCard
          industries={industries}
          total={kpi.students}
          view={view}
          onView={setView}
          focus={focusIndustry}
          onFocus={setFocusIndustry}
        />

        <section className="stack" style={{ '--gap': '16px', marginTop: 8 }} aria-labelledby="pods-title">
          <div className="row row--between" style={{ alignItems: 'flex-end' }}>
            <div className="stack" style={{ '--gap': '6px' }}>
              <h2 id="pods-title" className="h3" style={{ fontSize: 32 }}>
                Mentor pods
              </h2>
              <p className="slate">
                1 mentor · 5 students · 1 tutor in every pod. Select a pod to see its students and the step each has
                reached.
              </p>
            </div>
            <p className="muted small">Each dot is a student, coloured by path. Dimmed dots fall outside the current filters.</p>
          </div>
          {detail ? <PodDetail pod={detail} match={match} onClose={() => setSelectedPod(null)} /> : null}
          <div className="grid-fill" style={{ '--min': '260px' }}>
            {podCards.map((pod) => (
              <PodCard
                key={pod.id}
                pod={pod}
                match={match}
                selected={pod.id === selectedPod}
                onSelect={() => setSelectedPod((current) => (current === pod.id ? null : pod.id))}
              />
            ))}
          </div>
        </section>

        {SHOW_SAMPLE_LABELS ? (
          <p className="muted small">
            All figures on this page are sample data for the wireframe. Live figures would come from portal records:
            pod pairing, session attendance, and the framework step each mentor records after a session.
          </p>
        ) : null}
      </main>
      <SiteFooter white />
    </div>
  );
}

function ScaleBand({ scale }) {
  const meters = [
    { label: 'Students mentored', value: scale.students, target: SCALE_TARGETS.students, of: 'of all pre-final year students' },
    { label: 'Alumni mentors', value: scale.mentors, target: SCALE_TARGETS.mentors, of: 'of the mentors needed' },
    { label: 'Mentor pods', value: scale.pods, target: SCALE_TARGETS.pods, of: 'of the pods needed' },
  ];
  return (
    <section className="dash-scale" aria-labelledby="scale-title">
      <div className="dash-scale__intro">
        <h2 id="scale-title" className="serif dash-scale__title">
          Road to scale
        </h2>
        <p className="dash-scale__text">
          From the pilot to all 1,500 pre-final year students, at one mentor to five students. All cycles; the filters
          below do not change these.
        </p>
      </div>
      <div className="dash-scale__meters">
        {meters.map((m) => {
          const share = (100 * m.value) / m.target;
          return (
            <div key={m.label} className="meter">
              <span className="meter__label">{m.label}</span>
              <span className="meter__value">
                {formatNumber(m.value)} of {formatNumber(m.target)}
              </span>
              <div className="meter__track" aria-hidden="true">
                <div className="meter__fill" style={{ width: `${Math.max(1, share).toFixed(1)}%` }} />
              </div>
              <span className="meter__label">
                {share.toFixed(1)}% {m.of}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function KeyFigures({ kpi }) {
  const sub =
    `in ${plural(kpi.pods, 'pod', 'pods')} across ${plural(kpi.cycles, 'cycle', 'cycles')}` +
    (kpi.completed ? ` · ${kpi.completed} completed all four steps` : '');
  const tiles = [
    { label: 'Mentor pods', value: kpi.pods, sub: '1 mentor · 5 students · 1 tutor each' },
    { label: 'Alumni mentors', value: kpi.mentors, sub: 'One pod each per cycle' },
    { label: 'Industries', value: kpi.industries, sub: 'Where the mentors work' },
    { label: 'Sessions held', value: kpi.sessions, sub: 'Digital, 1.5–2 hours each' },
    { label: 'Attendance', value: `${kpi.attendance}%`, sub: 'Average across students' },
  ];
  return (
    <section className="kpis" aria-label="Key figures">
      <div className="kpi kpi--hero">
        <span className="kpi__label">Students mentored</span>
        <span className="kpi__value kpi__value--hero">{formatNumber(kpi.students)}</span>
        <span className="kpi__sub">{sub}</span>
      </div>
      {tiles.map((t) => (
        <div key={t.label} className="kpi">
          <span className="kpi__label">{t.label}</span>
          <span className="kpi__value">{t.value}</span>
          <span className="kpi__sub">{t.sub}</span>
        </div>
      ))}
    </section>
  );
}

function FrameworkCard({ split, total }) {
  return (
    <section className="dash-card dash-card--narrow" aria-labelledby="fwc-title">
      <div>
        <h2 id="fwc-title" className="title">
          By framework
        </h2>
        <p className="muted">The path each student chose</p>
      </div>
      <div className="splitbar" aria-hidden="true">
        {split
          .filter((s) => s.count > 0)
          .map((s) => {
            const f = FRAMEWORKS[s.key];
            const share = pct(s.count, total);
            return (
              <div
                key={s.key}
                className="splitbar__seg"
                title={`${s.key}: ${s.count} students (${share}%)`}
                style={{ flexGrow: s.count, background: f.color, color: f.onColor }}
              >
                {share >= 16 ? `${share}%` : ''}
              </div>
            );
          })}
      </div>
      <ul className="list-reset stack" style={{ '--gap': '12px' }}>
        {split.map((s) => (
          <li key={s.key} className="fw-legend-row">
            <span className="swatch" style={{ width: 14, height: 14, background: FRAMEWORKS[s.key].color }} aria-hidden="true" />
            <span className="fw-legend-row__name">
              <strong>{s.key}</strong> · {FRAMEWORKS[s.key].name}
            </span>
            <strong className="num">{s.count}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}

function StageCard({ stages, total, fw }) {
  return (
    <section className="dash-card dash-card--wide" aria-labelledby="stage-title">
      <div className="row row--between row--start">
        <div>
          <h2 id="stage-title" className="title">
            By stage
          </h2>
          <p className="muted">The step each student has reached in the shared four-step rhythm</p>
        </div>
        <FrameworkLegend />
      </div>
      <ol className="list-reset grid-auto" style={{ '--min': '150px', '--gap': '12px' }}>
        {stages.map((stage, i) => {
          const parts = stage.parts.filter((p) => p.count > 0);
          return (
            <li key={stage.step} className="stage">
              <span className="kicker">
                {stage.step} · {RHYTHM[i]}
              </span>
              <span className="stage__names">{fw === 'all' ? STAGE_NAMES_ALL[i] : FRAMEWORKS[fw].steps[i]}</span>
              <span className="stage__count">{stage.count}</span>
              <span className="muted small">{pct(stage.count, total)}% of students</span>
              <div className="thinbar" aria-hidden="true">
                {parts.map((p) => (
                  <div key={p.key} title={`${p.key}: ${p.count}`} style={{ flexGrow: p.count, background: FRAMEWORKS[p.key].color }} />
                ))}
              </div>
              <span className="slate" style={{ fontSize: 13 }}>
                {parts.length ? parts.map((p) => `${p.key} ${p.count}`).join(' · ') : 'No students at this step'}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function IndustryCard({ industries, total, view, onView, focus, onFocus }) {
  const max = Math.max(1, ...industries.map((r) => r.total));
  const shown = industries.find((r) => r.name === focus) || industries[0];
  return (
    <section className="dash-card" aria-labelledby="ind-title">
      <div className="row row--between row--start">
        <div>
          <h2 id="ind-title" className="title">
            By mentor industry
          </h2>
          <p className="muted">Students mentored, by the industry their mentor works in, split by framework</p>
        </div>
        <div className="row" style={{ '--gap': '10px 20px' }}>
          <FrameworkLegend />
          <div className="view-toggle">
            <Segmented
              label="Show as"
              pill
              value={view}
              onChange={onView}
              options={[
                { value: 'chart', label: 'Chart' },
                { value: 'table', label: 'Table' },
              ]}
            />
          </div>
        </div>
      </div>

      {view === 'chart' ? (
        <>
          <div className="stack" style={{ '--gap': '4px' }}>
            {industries.map((r) => {
              const parts = r.parts.filter((p) => p.count > 0);
              return (
                <button
                  key={r.name}
                  type="button"
                  className={'ind-row' + (r.name === shown.name ? ' is-on' : '')}
                  onMouseEnter={() => onFocus(r.name)}
                  onFocus={() => onFocus(r.name)}
                  onClick={() => onFocus(r.name)}
                  aria-label={`${r.name}: ${plural(r.total, 'student', 'students')}. ${r.parts
                    .map((p) => `${p.key} ${p.count}`)
                    .join(', ')}`}
                >
                  <span className="ind-row__name">{r.name}</span>
                  <span className="ind-row__track">
                    <span className="ind-row__bar" style={{ width: `${((98 * r.total) / max).toFixed(2)}%` }}>
                      {parts.map((p, j) => (
                        <span
                          key={p.key}
                          title={`${p.key}: ${p.count}`}
                          style={{
                            flexGrow: p.count,
                            background: FRAMEWORKS[p.key].color,
                            borderRadius: j === parts.length - 1 ? '0 4px 4px 0' : 0,
                          }}
                        />
                      ))}
                    </span>
                  </span>
                  <span className="ind-row__total num">{r.total}</span>
                </button>
              );
            })}
          </div>
          <p className="readout" aria-live="polite">
            <strong>{shown.name}</strong> · {plural(shown.total, 'student', 'students')} ({pct(shown.total, total)}% of
            all shown) · {shown.parts.map((p) => `${p.key} ${p.count}`).join(' · ')}
          </p>
        </>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Mentor industry</th>
                {FRAMEWORK_KEYS.map((key) => (
                  <th key={key} scope="col" className="num">
                    {key}
                  </th>
                ))}
                <th scope="col" className="num">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {industries.map((r) => (
                <tr key={r.name}>
                  <th scope="row">{r.name}</th>
                  {r.parts.map((p) => (
                    <td key={p.key} className="num">
                      {p.count}
                    </td>
                  ))}
                  <td className="num">
                    <strong>{r.total}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function PodCard({ pod, match, selected, onSelect }) {
  const done = pod.status === 'completed';
  const attendance = podAttendance(pod);
  const mix = FRAMEWORK_KEYS.map((key) => {
    const c = pod.mentees.filter((m) => m.fw === key).length;
    return c ? `${c} ${key}` : '';
  })
    .filter(Boolean)
    .join(', ');
  return (
    <button
      type="button"
      className={'pod-card lift' + (selected ? ' is-on' : '')}
      aria-pressed={selected}
      aria-label={`Pod ${pod.id}, mentor ${pod.mentor.name} (${pod.mentor.industry}), ${mix}, ${
        done ? 'completed' : `session ${pod.sessions} of 4`
      }, attendance ${attendance}%`}
      onClick={onSelect}
    >
      <span className="row row--between" style={{ width: '100%' }}>
        <span className="pod-card__id">Pod {pod.id}</span>
        <span className={'chip ' + (done ? 'chip--good' : 'chip--warn')}>
          {done ? 'Completed' : `Session ${pod.sessions} of 4`}
        </span>
      </span>
      <span className="stack" style={{ '--gap': '2px' }}>
        <span className="pod-card__mentor">{pod.mentor.name}</span>
        <span className="muted small">{pod.mentor.role}</span>
        <span className="chip chip--navy" style={{ alignSelf: 'flex-start', marginTop: 4, fontSize: 12 }}>
          {pod.mentor.industry}
        </span>
      </span>
      <span className="stack" style={{ '--gap': '6px' }}>
        <span className="row" style={{ '--gap': '6px' }}>
          {pod.mentees.map((m) => (
            <span
              key={m.name}
              className="pod-card__dot"
              title={`${m.name} · ${m.fw} · ${FRAMEWORKS[m.fw].steps[m.step - 1]}`}
              style={{ background: FRAMEWORKS[m.fw].color, opacity: match(pod, m) ? 1 : 0.25 }}
            />
          ))}
        </span>
        <span className="muted" style={{ fontSize: 13 }}>
          {pod.tutorDept} tutor
        </span>
      </span>
      <span className="row row--between" style={{ width: '100%' }}>
        <span className="sessions-bar" aria-hidden="true">
          {[1, 2, 3, 4].map((k) => (
            <span key={k} className={k <= pod.sessions ? 'is-held' : ''} />
          ))}
        </span>
        <span className="slate small">Attendance {attendance}%</span>
      </span>
    </button>
  );
}

function PodDetail({ pod, match, onClose }) {
  const done = pod.status === 'completed';
  const students = pod.mentees.map((m) => ({
    label: `${m.name} · ${m.fw}`,
    initials: initials(m.name),
    bg: FRAMEWORKS[m.fw].color,
    ink: FRAMEWORKS[m.fw].onColor,
    dim: !match(pod, m),
  }));
  const facts = [
    { label: 'Mentor', value: pod.mentor.name, sub: `${pod.mentor.role} · ${pod.mentor.industry}` },
    { label: 'Tutor', value: `${pod.tutorDept} department`, sub: 'Facilitator' },
    { label: 'Sessions', value: `${pod.sessions} of 4 held`, sub: 'Digital, 1.5–2 hours' },
    { label: 'Attendance', value: `${podAttendance(pod)}%`, sub: 'Pod average' },
  ];
  return (
    <div className="pod-detail" aria-live="polite">
      <div className="row row--between">
        <div className="row" style={{ '--gap': '6px 14px', alignItems: 'baseline' }}>
          <h3 className="h3">Pod {pod.id}</h3>
          <span className="slate" style={{ fontWeight: 700, fontSize: 15 }}>
            {done ? 'Cycle 1 · pilot · completed' : 'Cycle 2 · in progress'}
          </span>
        </div>
        <button type="button" className="btn btn--quiet btn--sm" onClick={onClose} aria-label="Close pod details">
          <Icon name="x" size={18} strokeWidth={2.2} />
          Close
        </button>
      </div>
      <div className="split" style={{ '--gap': '24px' }}>
        <figure className="pod-detail__figure">
          <PodDiagram small students={students} labels={false} />
          <figcaption className="slate small" style={{ textAlign: 'center' }}>
            {pod.mentor.name} with five students; the {pod.tutorDept} tutor facilitates
          </figcaption>
        </figure>
        <div className="stack" style={{ '--gap': '16px', flex: '2 1 520px', minWidth: 0 }}>
          <div className="grid-auto" style={{ '--min': '150px', '--gap': '12px' }}>
            {facts.map((f) => (
              <div key={f.label} className="fact">
                <span className="kicker">{f.label}</span>
                <strong>{f.value}</strong>
                <span className="slate small">{f.sub}</span>
              </div>
            ))}
          </div>
          <div className="table-wrap">
            <table className="data-table pod-students">
              <thead>
                <tr>
                  <th scope="col">Student</th>
                  <th scope="col" className="col-dept">
                    Department
                  </th>
                  <th scope="col">Path</th>
                  <th scope="col">Step reached</th>
                  <th scope="col" className="col-att">
                    Attended
                  </th>
                </tr>
              </thead>
              <tbody>
                {pod.mentees.map((m) => (
                  <tr key={m.name} style={{ opacity: match(pod, m) ? 1 : 0.45 }}>
                    <th scope="row">
                      {m.name}
                      <span className="pod-students__dept">
                        {m.dept} · {m.attended}/{pod.sessions} attended
                      </span>
                    </th>
                    <td className="col-dept">{m.dept}</td>
                    <td>
                      <FrameworkChip fw={m.fw} />
                    </td>
                    <td>
                      <StepChips fw={m.fw} reached={m.step} completed={done} />
                    </td>
                    <td className="num col-att">
                      {m.attended} of {pod.sessions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <StepLegend />
        </div>
      </div>
    </div>
  );
}
