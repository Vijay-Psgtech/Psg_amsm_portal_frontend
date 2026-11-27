import { Link } from 'react-router-dom';
import Brand from './Brand.jsx';
import Icon from './Icon.jsx';
import MainNavigation from './MainNavigation.jsx';

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Brand />
        <MainNavigation />
        <Link to="/login" className="site-header__login btn btn--gold btn--sm">
            <Icon name="logIn" size={18} strokeWidth={2.2} />
            Sign in
        </Link>
      </div>
    </header>
  );
}
