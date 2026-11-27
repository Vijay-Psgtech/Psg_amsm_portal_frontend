import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Brand from './Brand.jsx';
import Icon from './Icon.jsx';
import { SHOW_SAMPLE_LABELS } from '../config.js';
import { useAuth } from '../context/AuthContext.jsx';
import { initials } from '../lib/format.js';

/**
 * Header for signed-in pages.
 * tabs: [{ label, href }] for sections of this page (the first is the current one)
 *       or [{ label, to }] for other routes.
 */
export default function PortalHeader({ user, tabs, view }) {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState('');
  const displayName = authUser?.profile?.name || authUser?.name || user.name;
  const displayRole = {
    mentor: 'Alumni mentor',
    mentee: 'Student',
    coordinator: 'Program coordinator',
  }[authUser?.role] || user.role;
  const signOut = async () => {
    setSigningOut(true);
    setSignOutError('');
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      setSignOutError(error.message);
    } finally {
      setSigningOut(false);
    }
  };

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
                {authUser ? initials(displayName) : user.initials}
              </span>
              {displayName} · {displayRole}
            </span>
            <button type="button" className="signout" onClick={signOut} disabled={signingOut}>
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
            {signOutError ? (
              <span className="small" role="alert">
                {signOutError}
              </span>
            ) : null}
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
