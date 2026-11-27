import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Brand from '../components/Brand.jsx';
import Icon from '../components/Icon.jsx';
import Segmented from '../components/Segmented.jsx';
import { HERO_IMAGE, HERO_IMAGE_ALT, ROLE_HOME, SHOW_SAMPLE_LABELS } from '../config.js';
import usePageTitle from '../lib/usePageTitle.js';
import './login.css';

/** The sign-in method for each role is an assumption to confirm with the college IT team. */
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
    placeholder: 'The email you use on the alumni portal',
    hint: 'Alumni mentors sign in with their PSG Tech alumni portal account.',
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
  const [role, setRole] = useState('student');
  const [method, setMethod] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const r = ROLES[role];

  const pickRole = (next) => {
    setRole(next);
    setCodeSent(false);
  };
  const toggleMethod = () => {
    setMethod((m) => (m === 'password' ? 'code' : 'password'));
    setCodeSent(false);
  };
  const submit = (event) => {
    event.preventDefault();
    // Wireframe: no credentials are checked or sent. Call the college's sign-in service here.
    navigate(ROLE_HOME[role]);
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

            <form className="stack" style={{ '--gap': '18px' }} onSubmit={submit} noValidate>
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
                />
              </div>

              {method === 'password' ? (
                <>
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
                      <input type="checkbox" name="remember" />
                      Keep me signed in
                    </label>
                    <a href="#signin-title" className="text-link" style={{ fontSize: 15 }}>
                      Forgot password?
                    </a>
                  </div>
                </>
              ) : (
                <div className="stack" style={{ '--gap': '10px' }}>
                  {codeSent ? (
                    <>
                      <p role="status" className="status status--good">
                        Code sent to your registered email or mobile
                      </p>
                      <div className="field">
                        <label className="field__label" htmlFor="login-code">
                          6-digit code
                        </label>
                        <input
                          id="login-code"
                          name="code"
                          className="control auth-code"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={6}
                          placeholder="______"
                        />
                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn btn--outline btn--sm"
                      style={{ alignSelf: 'flex-start' }}
                      onClick={() => setCodeSent(true)}
                    >
                      Send me a one-time code
                    </button>
                  )}
                </div>
              )}

              <button type="submit" className="btn btn--gold btn--lg btn--block">
                Sign in
                <Icon name="arrowRight" size={18} strokeWidth={2.2} />
              </button>
            </form>

            <button type="button" className="btn btn--link" style={{ alignSelf: 'center' }} onClick={toggleMethod}>
              {method === 'password' ? 'Sign in with a one-time code instead' : 'Sign in with a password instead'}
            </button>
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
            {SHOW_SAMPLE_LABELS ? (
              <p className="note" style={{ textAlign: 'center' }}>
                Wireframe: nothing typed here is sent or stored. Sign-in method to be confirmed with the college IT
                team.
              </p>
            ) : null}
          </section>
        </div>
      </main>
    </div>
  );
}
