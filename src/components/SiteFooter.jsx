import { Link } from 'react-router-dom';
import { PROGRAM_CONTACT_EMAIL } from '../config.js';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/frameworks', label: 'Frameworks' },
  { to: '/dashboard', label: 'Impact dashboard' },
  { to: '/student', label: 'Student portal' },
  { to: '/mentor', label: 'Mentor portal' },
];

export default function SiteFooter({ white = false }) {
  return (
    <footer className={'site-footer' + (white ? ' site-footer--white' : '')}>
      <div className="container site-footer__inner">
        <div className="stack" style={{ '--gap': '6px' }}>
          <span className="site-footer__title">Mentor – Mentee program at PSG Tech</span>
          <span className="small">
            An initiative of PSG Tech alumni, batch 1994–98 · Contact: {PROGRAM_CONTACT_EMAIL}
          </span>
        </div>
        <nav className="site-footer__links" aria-label="Footer">
          {LINKS.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
