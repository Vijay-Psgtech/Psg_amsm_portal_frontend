import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Brand from '../components/Brand.jsx';
import Icon from '../components/Icon.jsx';
import Segmented from '../components/Segmented.jsx';
import { HERO_IMAGE, HERO_IMAGE_ALT, ROLE_HOME } from '../config.js';
import { useAuth } from '../context/AuthContext.jsx';
import usePageTitle from '../lib/usePageTitle.js';
import './login.css';

const ROLES = {
  student: {
    label: 'Student',
    idLabel: 'Roll number or college email',
    placeholder: 'Your roll number or college email',
    hint: 'Students sign in with their college account.',
    profile: 'mentee',
  },
  mentor: {
    label: 'Alumni mentor',
    idLabel: 'Email or mobile number',
    placeholder: 'The email or mobile used on your profile',
    hint: 'Use the email or mobile number registered on your profile.',
    profile: 'mentor',
  },
  coordinator: {
    label: 'Program coordinator',
    idLabel: 'Staff email',
    placeholder: 'Your college staff email',
    hint: 'Faculty coordinators and department tutors sign in with their staff account.',
    profile: 'coordinator',
  },
};

const WHO = [
  { icon: 'cap', tone: 'tone-blue', who: 'Students', what: 'request a mentor and track their progress' },
  { icon: 'user', tone: 'tone-gold', who: 'Alumni mentors', what: 'manage their pod, requests and sessions' },
  { icon: 'presentation', tone: 'tone-white', who: 'Program coordinators', what: 'match pods and follow attendance' },
];

export default function Login() {
  usePageTitle('Sign in');

  const navigate = useNavigate();
  const { login } = useAuth();
  const { search } = useLocation();
  const requestedRole = new URLSearchParams(search).get('role');
  const initialRole = requestedRole === 'mentor' || requestedRole === 'coordinator' ? requestedRole : 'student';
  const [role, setRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const r = ROLES[role];

  const pickRole = (next) => {
    setRole(next);
    setIdentifier('');
    setPassword('');
    setError('');
  };
  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login({ role: r.profile, identifier, password, remember });
      navigate(ROLE_HOME[role], { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <header className="site-header">
        <div className="container site-header__inner" style={{ justifyContent: 'space-between' }}>
          <Brand />
          <Link to="/" className="header-link">
            <Icon name="arrowLeft" size={18} strokeWidth={2.2} />
            Back to the program site
          </Link>
        </div>
      </header>

      <main className="auth-main">
        <div className="auth-card">
          <section className="auth-intro" aria-labelledby="welcome-title">
            <p className="eyebrow eyebrow--light" style={{ fontSize: 13 }}>
              From classroom learning to industry readiness
            </p>
            <h2 id="welcome-title" className="auth-intro__title">
              Mentor – Mentee program at PSG Tech
            </h2>
            <p className="auth-intro__text">One sign-in for students, alumni mentors and the program team.</p>
            <ul className="list-reset stack" style={{ '--gap': '14px' }}>
              {WHO.map((item) => (
                <li key={item.who} className="auth-who">
                  <span className={'icon-circle ' + item.tone} style={{ width: 36, height: 36 }}>
                    <Icon name={item.icon} size={18} />
                  </span>
                  <span>
                    <strong>{item.who}</strong> {item.what}
                  </span>
                </li>
              ))}
            </ul>
            <img className="auth-intro__img" src={HERO_IMAGE} alt={HERO_IMAGE_ALT} />
          </section>

          <section className="auth-form" aria-labelledby="signin-title">
            <div className="stack" style={{ '--gap': '4px' }}>
              <h1 id="signin-title" className="auth-form__title">
                Sign in
              </h1>
              <p className="slate">Choose who you are, then sign in.</p>
            </div>

            <Segmented
              label="I am a"
              pill
              value={role}
              onChange={pickRole}
              options={Object.entries(ROLES).map(([value, x]) => ({ value, label: x.label }))}
            />

            <form className="stack" style={{ '--gap': '18px' }} onSubmit={submit}>
              <div className="field">
                <label className="field__label" htmlFor="login-id">
                  {r.idLabel}
                </label>
                <input
                  id="login-id"
                  name="username"
                  type="text"
                  className="control auth-input"
                  autoComplete="username"
                  placeholder={r.placeholder}
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label className="field__label" htmlFor="login-password">
                  Password
                </label>
                <div className="password">
                  <input
                    id="login-password"
                    name="password"
                    className="password__input"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password__toggle"
                    aria-pressed={showPassword}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    <Icon name={showPassword ? 'eyeOff' : 'eye'} size={20} />
                  </button>
                </div>
              </div>
              <div className="row row--between">
                <label className="auth-keep">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                  />
                  Keep me signed in
                </label>
              </div>
              {error ? (
                <p role="alert" className="status status--warn">
                  {error}
                </p>
              ) : null}

              <button type="submit" className="btn btn--gold btn--lg btn--block" disabled={submitting}>
                {submitting ? 'Signing in…' : 'Sign in'}
                <Icon name="arrowRight" size={18} strokeWidth={2.2} />
              </button>
            </form>

            <p className="slate small" style={{ textAlign: 'center' }}>
              {r.hint}
            </p>
            <div className="auth-divider" aria-hidden="true">
              <span />
              New to the program?
              <span />
            </div>
            <Link to={`/profile?role=${r.profile}`} className="btn btn--outline btn--block">
              Create your profile
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
