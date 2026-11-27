import { Link } from 'react-router-dom';
import Brand from './Brand.jsx';
import Icon from './Icon.jsx';
import { SHOW_SAMPLE_LABELS } from '../config.js';

/**
 * Header for signed-in pages.
 * tabs: [{ label, href }] for sections of this page (the first is the current one)
 *       or [{ label, to }] for other routes.
 */
export default function PortalHeader({ user, tabs, view }) {
  return (
    <>
      <header className="portal-header">
        <div className="container portal-header__inner">
          <Brand />
          <div className="portal-tools">
            <label className="portal-search">
              <Icon name="search" size={18} />
              <span className="sr-only">Search mentors or problems</span>
              <input type="search" placeholder="Search mentors or problems" />
            </label>
            <span className="user-chip">
              <span className="avatar avatar--md tone-gold" aria-hidden="true">
                {user.initials}
              </span>
              {user.name} · {user.role}
            </span>
            <Link to="/login" className="signout">
              Sign out
            </Link>
          </div>
        </div>
      </header>
      <nav className="subnav" aria-label="Portal">
        <div className="container subnav__inner">
          {tabs.map((tab, i) =>
            tab.to ? (
              <Link key={tab.label} to={tab.to} className="subnav__link">
                {tab.label}
              </Link>
            ) : (
              <a
                key={tab.label}
                href={tab.href}
                className={'subnav__link' + (i === 0 ? ' is-active' : '')}
                aria-current={i === 0 ? 'page' : undefined}
              >
                {tab.label}
              </a>
            )
          )}
          <span className="subnav__meta">
            {SHOW_SAMPLE_LABELS ? (
              <>
                <em>Sample view · illustrative data</em>
                <span className="vrule" aria-hidden="true" />
              </>
            ) : null}
            <span className="subnav__viewas">
              View as
              <Link
                to="/student"
                className={'viewas' + (view === 'student' ? ' is-active' : '')}
                aria-current={view === 'student' ? 'page' : undefined}
              >
                Student
              </Link>
              <Link
                to="/mentor"
                className={'viewas' + (view === 'mentor' ? ' is-active' : '')}
                aria-current={view === 'mentor' ? 'page' : undefined}
              >
                Mentor
              </Link>
            </span>
          </span>
        </div>
      </nav>
    </>
  );
}
