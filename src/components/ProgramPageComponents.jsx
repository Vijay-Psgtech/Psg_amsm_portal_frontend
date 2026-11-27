import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import { JOURNEY, PILLARS, PILLARS_NOTE } from '../data/content.js';

const ABOUT_LINKS = [
  { to: '/#about', label: 'Vision & mission', key: 'about' },
  { to: '/pillars', label: 'Five pillars', key: 'pillars' },
  { to: '/frameworks', label: 'Framework', key: 'frameworks' },
  { to: '/journey', label: 'Mentorship journey', key: 'journey' },
];

export function AboutNavigation({ active }) {
  return (
    <div className="program-page-nav">
      <div className="container program-page-nav__inner">
        <nav className="program-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <Icon name="chevronRight" size={16} />
          <span>About the program</span>
          <Icon name="chevronRight" size={16} />
          <span aria-current="page">{ABOUT_LINKS.find((item) => item.key === active)?.label}</span>
        </nav>
        <nav className="program-about-nav" aria-label="About the program">
          {ABOUT_LINKS.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              className={'program-about-nav__link' + (active === item.key ? ' is-active' : '')}
              aria-current={active === item.key ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export function ProgramPager({ previous, next }) {
  return (
    <nav className="program-pager" aria-label="About pages">
      {previous ? (
        <Link to={previous.to}>
          <Icon name="arrowLeft" size={18} />
          {previous.label}
        </Link>
      ) : <span />}
      {next ? (
        <Link to={next.to}>
          {next.label}
          <Icon name="arrowRight" size={18} />
        </Link>
      ) : null}
    </nav>
  );
}

export function ProgramJoinCta() {
  return (
    <section className="section section--navy program-join" aria-labelledby="program-join-title">
      <div className="container program-join__inner">
        <div className="stack" style={{ '--gap': '6px', flex: '1 1 420px' }}>
          <h2 id="program-join-title" className="h2">Once a PSGian, always a PSGian</h2>
          <p className="sub">Join as a student looking for direction or an alumnus ready to give back.</p>
        </div>
        <div className="row">
          <Link to="/student/request" className="btn btn--gold btn--lg">Request a mentor</Link>
          <Link to="/profile?role=mentor" className="btn btn--outline-light btn--lg">Become a mentor</Link>
        </div>
      </div>
    </section>
  );
}

export function PillarsContent() {
  return (
    <div className="stack" style={{ '--gap': '14px' }}>
      {PILLARS.map((pillar) => (
        <article className="program-pillar" key={pillar.num}>
          <div className="program-pillar__heading">
            <span className="program-pillar__num">{pillar.num}</span>
            <span className="stack" style={{ '--gap': '2px' }}>
              <span className="eyebrow">{pillar.name}</span>
              <span className="serif program-pillar__tagline">{pillar.tagline}</span>
            </span>
          </div>
          <ul className="program-pillar__points list-reset">
            {pillar.points.map((point) => (
              <li key={point}>
                <Icon name="check" size={18} strokeWidth={2.5} />
                {point}
              </li>
            ))}
          </ul>
        </article>
      ))}
      <p className="band band--gold">{PILLARS_NOTE}</p>
    </div>
  );
}

export function JourneyContent() {
  return (
    <>
      <ol className="list-reset grid-auto program-journey-grid" style={{ '--min': '260px', '--gap': '16px' }}>
        {JOURNEY.map((item) => (
          <li className="program-journey-card" key={item.session}>
            <div className="row" style={{ '--gap': '12px', alignItems: 'flex-start' }}>
              <span className={'icon-circle icon-circle--lg ' + (item.accent ? 'tone-gold' : 'tone-navy')}>
                <Icon name={item.icon} size={22} />
              </span>
              <span className="stack" style={{ '--gap': '2px' }}>
                <span className="kicker">Session {item.session} · {item.phase}</span>
                <span className="serif program-journey-card__title">{item.title}</span>
              </span>
            </div>
            <ul className="bullets">
              {item.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
            <div className="program-journey-card__outcome">
              <span className="kicker">Outcome</span>
              <strong>{item.outcome}</strong>
            </div>
          </li>
        ))}
      </ol>
      <p className="band band--gold">
        <strong>4 digital sessions</strong> · 1.5–2 hours each · 6–8 hours in total · slots agreed between mentor and
        mentees
      </p>
    </>
  );
}
