import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';

/** Logo lockup. The gold circle is a placeholder until the college supplies its logo. */
export default function Brand() {
  return (
    <Link to="/" className="brand">
      <span className="brand__mark">
        <Icon name="cap" size={22} />
      </span>
      <span className="brand__name">PSG Tech Alumni Portal</span>
      <span className="brand__divider" aria-hidden="true" />
      <span className="brand__tag">MENTORSHIP</span>
    </Link>
  );
}
