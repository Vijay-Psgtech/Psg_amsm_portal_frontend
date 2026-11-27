import { NavLink } from 'react-router-dom';
import Icon from './Icon.jsx';

const LINKS = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/student', label: 'Student portal', icon: 'userCheck' },
  { to: '/mentor', label: 'Mentor portal', icon: 'user' },
];

export default function MainNavigation() {
  return (
    <nav className="primary-nav" aria-label="Main">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) => 'primary-nav__link' + (isActive ? ' is-active' : '')}
        >
          <Icon name={link.icon} size={18} />
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
