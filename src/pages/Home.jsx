import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Icon from '../components/Icon.jsx';
import { HERO_IMAGE, HERO_IMAGE_ALT } from '../config.js';
import { MISSION, ORIGIN, ORIGIN_STEPS, VISION } from '../data/content.js';
import { PODS } from '../data/pods.js';
import { applyFilters, DEFAULT_FILTERS, keyFigures } from '../lib/dashboard.js';
import usePageTitle from '../lib/usePageTitle.js';
import './home.css';

const all = applyFilters(PODS, DEFAULT_FILTERS);
const IMPACT = keyFigures(all.rows, all.pods);
const IMPACT_STATS = [
  { value: IMPACT.mentors, label: 'Alumni mentors', icon: 'users' },
  { value: IMPACT.students, label: 'Students reached', icon: 'cap' },
  { value: IMPACT.pods, label: 'Mentor pods', icon: 'network' },
  { value: IMPACT.sessions, label: 'Sessions held', icon: 'monitor' },
  { value: `${IMPACT.attendance}%`, label: 'Average attendance', icon: 'userCheck' },
];

const ABOUT_CARDS = [
  {
    to: '/pillars',
    icon: 'network',
    eyebrow: 'Five pillars',
    title: 'What students build',
    text: 'Connect ideas, think through problems, explore options, choose a direction and build through practice.',
  },
  {
    to: '/frameworks',
    icon: 'compass',
    eyebrow: 'The framework',
    title: 'Three paths, one rhythm',
    text: 'STAR, IDEA and GRAD bring a shared four-step mentoring rhythm to different student goals.',
  },
  {
    to: '/journey',
    icon: 'route',
    eyebrow: 'Mentorship journey',
    title: 'Four sessions, real progress',
    text: 'Move from getting to know each other to a practical, personal 90-day roadmap.',
  },
];

export default function Home() {
  usePageTitle();

  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ImpactStrip />
        <VisionMission />
        <AboutCards />
        <ProgramEntry />
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
          <h1 id="hero-title" className="h1">Mentor – Mentee program at PSG Tech</h1>
          <p className="lead">
            An alumni-led bridge between academia and industry. PSG Tech alumni mentor pre-final year students in
            small pods, helping them understand what industry expects and plan their early careers.
          </p>
          <div className="row home-hero__actions">
            <Link to="/student/request" className="btn btn--gold btn--lg">
              Request a mentor <Icon name="arrowRight" size={20} strokeWidth={2.2} />
            </Link>
            <Link to="/profile?role=mentor" className="btn btn--outline btn--lg">Become a mentor</Link>
          </div>
          <p className="muted">Four digital sessions over three months · One mentor · Five students · One tutor</p>
        </div>
        <div className="home-hero__media">
          <img className="home-hero__img" src={HERO_IMAGE} alt={HERO_IMAGE_ALT} width="1252" height="704" />
          <div className="home-hero__badge">
            <span className="icon-circle tone-gold"><Icon name="users" size={22} /></span>
            <span className="stack" style={{ '--gap': '2px' }}>
              <span className="eyebrow eyebrow--light" style={{ fontSize: 12 }}>One pod</span>
              <span className="serif home-hero__badge-text">1 mentor · 5 students · 1 tutor</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImpactStrip() {
  return (
    <section className="home-impact" aria-labelledby="impact-title">
      <div className="container">
        <div className="row row--between" style={{ alignItems: 'baseline', marginBottom: 18 }}>
          <h2 id="impact-title" className="eyebrow">The program at a glance</h2>
          <Link className="text-link" to="/dashboard">
            Explore the impact dashboard <Icon name="arrowRight" size={17} />
          </Link>
        </div>
        <div className="home-impact__grid">
          {IMPACT_STATS.map((stat) => (
            <div className="home-impact__item" key={stat.label}>
              <span className="icon-circle tone-navy"><Icon name={stat.icon} size={21} /></span>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
        <p className="muted small" style={{ marginTop: 12 }}>Illustrative sample figures; see the dashboard for the full breakdown.</p>
      </div>
    </section>
  );
}

function VisionMission() {
  return (
    <section id="about" className="section section--soft home-about" aria-labelledby="about-title">
      <div className="container stack" style={{ '--gap': '20px' }}>
        <header className="page-title">
          <p className="eyebrow">Why we do this</p>
          <h2 id="about-title" className="h2">A mentorship program rooted in PSG Tech</h2>
          <p className="sub">A shared vision, made practical through alumni guidance and real-world experience.</p>
        </header>
        <div className="home-about__grid">
          <details className="home-disclosure home-disclosure--dark">
            <summary><Icon name="eye" size={22} /> Our vision</summary>
            <p>{VISION}</p>
          </details>
          <details className="home-disclosure">
            <summary><Icon name="target" size={22} /> Our mission</summary>
            <p>{MISSION}</p>
          </details>
        </div>
        <details className="home-story">
          <summary>Where it all started</summary>
          <p>{ORIGIN}</p>
          <ol className="home-story__steps">
            {ORIGIN_STEPS.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </details>
      </div>
    </section>
  );
}

function AboutCards() {
  return (
    <section className="section" aria-labelledby="about-pages-title">
      <div className="container stack" style={{ '--gap': '24px' }}>
        <header className="page-title">
          <p className="eyebrow">About the program</p>
          <h2 id="about-pages-title" className="h2">How the program helps students grow</h2>
        </header>
        <div className="grid-auto" style={{ '--min': '260px', '--gap': '16px' }}>
          {ABOUT_CARDS.map((card) => (
            <Link className="home-about-card lift" key={card.to} to={card.to}>
              <span className="icon-circle tone-navy"><Icon name={card.icon} size={22} /></span>
              <span className="eyebrow">{card.eyebrow}</span>
              <h3 className="serif">{card.title}</h3>
              <p>{card.text}</p>
              <span className="text-link">Explore <Icon name="arrowRight" size={17} /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProgramEntry() {
  return (
    <section className="section section--soft" aria-labelledby="entry-title">
      <div className="container stack" style={{ '--gap': '22px' }}>
        <header className="page-title">
          <p className="eyebrow">Already in the program?</p>
          <h2 id="entry-title" className="h2">Continue to your portal</h2>
        </header>
        <div className="grid-auto" style={{ '--min': '280px', '--gap': '16px' }}>
          <Link className="home-entry-card" to="/student">
            <Icon name="cap" size={24} />
            <span><strong>Student portal</strong><small>Request a mentor and follow your progress.</small></span>
            <Icon name="arrowRight" size={18} />
          </Link>
          <Link className="home-entry-card" to="/mentor">
            <Icon name="user" size={24} />
            <span><strong>Mentor portal</strong><small>Manage your pod, sessions and industry problems.</small></span>
            <Icon name="arrowRight" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function JoinCta() {
  return (
    <section className="section section--navy home-join" aria-labelledby="join-title">
      <div className="container">
        <div className="section-head">
          <h2 id="join-title" className="h2">Once a PSGian, always a PSGian</h2>
          <p className="sub home-join__sub">Join as a student looking for direction or an alumnus ready to give back.</p>
        </div>
        <div className="grid-auto" style={{ '--min': '320px' }}>
          <div className="join-card">
            <span className="eyebrow eyebrow--light">For students</span>
            <h3 className="h3">Request a mentor</h3>
            <p className="join-card__text">Choose your path and find a mentor for your pod.</p>
            <Link to="/profile?role=mentee" className="btn btn--gold">
              Create a student profile <Icon name="arrowRight" size={18} strokeWidth={2.2} />
            </Link>
          </div>
          <div className="join-card">
            <span className="eyebrow eyebrow--light">For alumni</span>
            <h3 className="h3">Become a mentor</h3>
            <p className="join-card__text">Give 6–8 hours over three months to a pod of five students, from anywhere.</p>
            <Link to="/profile?role=mentor" className="btn btn--outline-light">
              Create a mentor profile <Icon name="arrowRight" size={18} strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
