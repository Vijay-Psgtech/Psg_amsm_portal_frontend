import { useState } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Icon from '../components/Icon.jsx';
import PodDiagram from '../components/PodDiagram.jsx';
import { HERO_IMAGE, HERO_IMAGE_ALT } from '../config.js';
import {
  JOURNEY,
  MISSION,
  ORIGIN,
  ORIGIN_STEPS,
  PILLARS,
  PILLARS_NOTE,
  PILOT_STATS,
  POD_ROLES,
  SURVEY_STAT,
  VISION,
} from '../data/content.js';
import { FRAMEWORKS, FRAMEWORK_KEYS, RHYTHM } from '../data/taxonomy.js';
import { GUIDES } from '../data/frameworks.js';
import usePageTitle from '../lib/usePageTitle.js';
import './home.css';

export default function Home() {
  usePageTitle();

  const [path, setPath] = useState('STAR');
  const [role, setRole] = useState(null);
  const toggleRole = (next) => setRole((current) => (current === next ? null : next));

  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <PilotStats />
        <VisionMission />
        <Pillars />
        <Paths path={path} onPick={setPath} />
        <PodSection role={role} onSelect={toggleRole} />
        <Journey />
        <JoinCta />
      </main>
      <SiteFooter />
    </>
  );
}

function Hero() {
  return (
    <section className="home-hero" aria-labelledby="hero-title">
      <div className="container home-hero__inner">
        <div className="home-hero__copy">
          <p className="eyebrow">From classroom learning to industry readiness</p>
          <h1 id="hero-title" className="h1">
            Mentor – Mentee program at PSG Tech
          </h1>
          <p className="lead">
            An alumni-led bridge between academia and industry. PSG Tech alumni mentor pre-final year students in
            small pods, so they understand what industry expects and plan their early careers, not just placements.
          </p>
          <div className="row home-hero__actions">
            <Link to="/student" className="btn btn--gold btn--lg">
              Request a mentor
              <Icon name="arrowRight" size={20} strokeWidth={2.2} />
            </Link>
            <Link to="/profile?role=mentor" className="btn btn--outline btn--lg">
              Become a mentor
            </Link>
          </div>
          <p className="muted">
            Pilot: about 10 alumni mentors and 50 third-year students, four digital sessions over three months
          </p>
        </div>
        <div className="home-hero__media">
          <img className="home-hero__img" src={HERO_IMAGE} alt={HERO_IMAGE_ALT} width="1252" height="704" />
          <div className="home-hero__badge">
            <span className="icon-circle tone-gold">
              <Icon name="users" size={22} />
            </span>
            <span className="stack" style={{ '--gap': '2px' }}>
              <span className="eyebrow eyebrow--light" style={{ fontSize: 12 }}>
                One pod
              </span>
              <span className="serif home-hero__badge-text">1 mentor · 5 students · 1 tutor</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PilotStats() {
  return (
    <section className="section home-glance" aria-labelledby="glance-title">
      <div className="container stack" style={{ '--gap': '24px' }}>
        <h2 id="glance-title" className="eyebrow">
          The pilot at a glance
        </h2>
        <div className="grid-auto" style={{ '--min': '250px' }}>
          {PILOT_STATS.map((stat) => (
            <div key={stat.label} className="stat-tile">
              <span className="icon-circle tone-navy">
                <Icon name={stat.icon} size={22} />
              </span>
              <span className="stat-tile__value">{stat.value}</span>
              <span className="stat-tile__label">{stat.label}</span>
              <span className="slate">{stat.note}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VisionMission() {
  return (
    <section id="vision" className="section home-vm" aria-labelledby="vm-title">
      <div className="container">
        <SectionHeading
          id="vm-title"
          eyebrow="Why we do this"
          title="Vision & Mission"
          sub="Where we are headed, and how we will get there"
        />
        <div className="grid-auto" style={{ '--min': '440px', '--gap': '24px' }}>
          <article className="vm-card vm-card--dark">
            <div className="row" style={{ '--gap': '16px' }}>
              <span className="icon-circle icon-circle--lg tone-gold">
                <Icon name="eye" size={26} />
              </span>
              <h3 className="vm-card__label">Our Vision</h3>
            </div>
            <p className="vm-card__text">{VISION}</p>
          </article>
          <article className="vm-card">
            <div className="row" style={{ '--gap': '16px' }}>
              <span className="icon-circle icon-circle--lg tone-navy">
                <Icon name="target" size={26} />
              </span>
              <h3 className="vm-card__label vm-card__label--gold">Our Mission</h3>
            </div>
            <p className="vm-card__text">{MISSION}</p>
          </article>
        </div>
        <div className="origin">
          <div className="origin__copy">
            <h3 className="eyebrow">Where it all started</h3>
            <p className="slate">{ORIGIN}</p>
          </div>
          <div className="origin__steps">
            {ORIGIN_STEPS.map((step, i) => (
              <span key={step} className="row" style={{ '--gap': '8px' }}>
                {i > 0 ? <Icon name="chevronRight" size={20} strokeWidth={2.4} style={{ color: 'var(--gold-dark)' }} /> : null}
                <span className={'pill' + (i === ORIGIN_STEPS.length - 1 ? ' pill--dark' : '')}>{step}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Pillars() {
  return (
    <section id="pillars" className="section section--rule" aria-labelledby="pillars-title">
      <div className="container">
        <SectionHeading
          id="pillars-title"
          eyebrow="How students grow"
          title="The five pillars"
          sub="A focused framework for industry readiness, not another academic program"
        />
        <div className="grid-auto" style={{ '--min': '210px' }}>
          {PILLARS.map((pillar) => (
            <article key={pillar.name} className="pillar-card lift">
              <div className="row row--between">
                <span className={'icon-circle ' + (pillar.accent ? 'tone-gold' : 'tone-navy')} style={{ width: 48, height: 48 }}>
                  <Icon name={pillar.icon} size={24} />
                </span>
                <span className="pillar-card__num">{pillar.num}</span>
              </div>
              <h3 className="pillar-card__name">{pillar.name}</h3>
              <p className="pillar-card__tagline">{pillar.tagline}</p>
              <ul className="bullets">
                {pillar.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="band band--gold" style={{ marginTop: 36 }}>
          {PILLARS_NOTE}
        </p>
      </div>
    </section>
  );
}

function Paths({ path, onPick }) {
  const fw = FRAMEWORKS[path];
  const guide = GUIDES[path];
  return (
    <section id="paths" className="section section--soft" aria-labelledby="paths-title">
      <div className="container">
        <SectionHeading
          id="paths-title"
          eyebrow="One framework for every mentor"
          title="Three paths, one rhythm"
          sub="Every mentor follows the same four steps: understand, define, act and review, with a lens for each student’s path. The student chooses the path; the mentor brings the questions."
        />
        <div className="grid-auto" style={{ '--min': '300px', '--gap': '16px' }}>
          {FRAMEWORK_KEYS.map((key) => {
            const f = FRAMEWORKS[key];
            const on = key === path;
            return (
              <button
                key={key}
                type="button"
                className="path-card lift"
                aria-pressed={on}
                onClick={() => onPick(key)}
                style={on ? { background: f.tint, borderColor: f.color } : undefined}
              >
                <span className="badge-square" style={{ background: f.color, color: f.onColor }}>
                  <Icon name={f.icon} size={26} />
                </span>
                <span className="path-card__text">
                  <span className="path-card__key" style={{ color: f.ink }}>
                    {f.key}
                  </span>
                  <span className="path-card__want">{f.want}</span>
                  <span className="path-card__sub">
                    {f.name} · {f.sub.toLowerCase()}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="path-panel" aria-live="polite">
          <div className="row row--between row--start">
            <div className="stack" style={{ '--gap': '6px' }}>
              <h3 className="h3">
                {fw.key} · {fw.name}
              </h3>
              <p className="slate">{guide.summary}</p>
            </div>
            <Link to="/frameworks" className="text-link">
              Explore {fw.key} in depth
              <Icon name="arrowRight" size={18} strokeWidth={2.2} />
            </Link>
          </div>
          <div className="grid-auto" style={{ '--min': '220px', '--gap': '16px' }}>
            {guide.steps.map((step, i) => (
              <div key={fw.steps[i]} className="step-card">
                <p className="kicker">{RHYTHM[i]}</p>
                <div className="row">
                  <span className="letter-badge" style={{ background: fw.color, color: fw.onColor }}>
                    {fw.letters[i]}
                  </span>
                  <span className="step-card__name">{fw.steps[i]}</span>
                </div>
                <p className="slate">{step.overview}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PodSection({ role, onSelect }) {
  return (
    <section id="pod" className="section" aria-labelledby="pod-title">
      <div className="container">
        <SectionHeading
          id="pod-title"
          eyebrow="How each group is organised"
          title="The mentor pod"
          sub="One mentor, five students and a tutor: a close group where every student gets real time with the mentor."
        />
        <div className="pod-layout">
          <figure className="pod-figure">
            <PodDiagram highlight={role} onSelect={onSelect} />
            <figcaption className="muted small">
              Five students along a 135° arc, all facing the mentor. Select a role to highlight it.
            </figcaption>
          </figure>
          <div className="pod-roles">
            <p className="eyebrow">One pod</p>
            <p className="pod-roles__title serif">1 mentor · 5 students · 1 tutor</p>
            {POD_ROLES.map((item) => {
              const on = role === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  className={'role-btn' + (on ? ' is-on' : '')}
                  aria-pressed={on}
                  onClick={() => onSelect(item.key)}
                >
                  <span className={'icon-circle ' + item.tone} style={{ width: 48, height: 48 }}>
                    <Icon name={item.icon} size={24} />
                  </span>
                  <span className="stack" style={{ '--gap': '4px' }}>
                    <span className="role-btn__title">{item.title}</span>
                    <span className="slate">{item.text}</span>
                  </span>
                </button>
              );
            })}
            <p className="pod-roles__note">
              A 1:5 ratio gives every student real time with the mentor; the tutor keeps the department connected.
            </p>
            <div className="survey-stat">
              <span className="survey-stat__value">{SURVEY_STAT.value}</span>
              <span>{SURVEY_STAT.text}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section id="journey" className="section section--soft" aria-labelledby="journey-title">
      <div className="container">
        <SectionHeading
          id="journey-title"
          eyebrow="How it runs"
          title="The mentorship journey"
          sub="Four sessions, four phases: from understanding the student to a fast-track roadmap"
        />
        <ol className="list-reset grid-auto" style={{ '--min': '250px', '--gap': '18px' }}>
          {JOURNEY.map((item) => (
            <li key={item.session} className="journey-card">
              <span className={'icon-circle icon-circle--lg ' + (item.accent ? 'tone-gold' : 'tone-navy')}>
                <Icon name={item.icon} size={24} />
              </span>
              <span className="kicker">
                Session {item.session} · <span className="journey-card__phase">{item.phase}</span>
              </span>
              <h3 className="journey-card__title">{item.title}</h3>
              <ul className="bullets" style={{ flexGrow: 1 }}>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <div className={'journey-card__outcome' + (item.accent ? ' is-accent' : '')}>
                <span className="kicker">Outcome</span>
                <strong>{item.outcome}</strong>
              </div>
            </li>
          ))}
        </ol>
        <p className="band band--navy" style={{ marginTop: 32 }}>
          <strong>4 digital sessions</strong> · 1.5–2 hours each · 6–8 hours in total · slots agreed between mentor
          and mentees
        </p>
      </div>
    </section>
  );
}

function JoinCta() {
  return (
    <section className="section section--navy home-join" aria-labelledby="join-title">
      <div className="container">
        <div className="section-head">
          <h2 id="join-title" className="h2">
            Once a PSGian, always a PSGian
          </h2>
          <p className="sub home-join__sub">
            Join the program as a student looking for direction, or as an alumnus ready to give back.
          </p>
        </div>
        <div className="grid-auto" style={{ '--min': '420px' }}>
          <div className="join-card">
            <span className="eyebrow eyebrow--light">For students</span>
            <h3 className="h3">Request a mentor</h3>
            <p className="join-card__text">
              Choose your path, pick a mentor with open slots and attach an industry problem for your pod.
            </p>
            <Link to="/student" className="btn btn--gold">
              Request a mentor
              <Icon name="arrowRight" size={18} strokeWidth={2.2} />
            </Link>
          </div>
          <div className="join-card">
            <span className="eyebrow eyebrow--light">For alumni</span>
            <h3 className="h3">Become a mentor</h3>
            <p className="join-card__text">
              Give 6–8 hours over three months to a pod of five students. Sessions are digital, so you can mentor
              from anywhere.
            </p>
            <Link to="/profile?role=mentor" className="btn btn--outline-light">
              Become a mentor
              <Icon name="arrowRight" size={18} strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
