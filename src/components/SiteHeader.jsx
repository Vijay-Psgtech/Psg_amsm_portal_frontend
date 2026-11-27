import { Link, NavLink } from 'react-router-dom';
import Brand from './Brand.jsx';
import Icon from './Icon.jsx';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/frameworks', label: 'Frameworks' },
  { to: '/dashboard', label: 'Impact dashboard' },
  { to: '/student', label: 'Student portal' },
  { to: '/mentor', label: 'Mentor portal' },
];

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Brand />
        <nav className="site-nav" aria-label="Main">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => 'site-nav__link' + (isActive ? ' is-active' : '')}
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/login" className="btn btn--gold btn--sm">
            <Icon name="logIn" size={18} strokeWidth={2.2} />
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
