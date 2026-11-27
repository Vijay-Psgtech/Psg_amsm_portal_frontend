import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ROLE_HOME } from '../config.js';
import { apiRequest } from '../lib/api.js';

const HOME_FOR_ROLE = {
  mentor: ROLE_HOME.mentor,
  mentee: ROLE_HOME.student,
  coordinator: ROLE_HOME.coordinator,
};

export default function ProtectedRoute({ role, children }) {
  const [attempt, setAttempt] = useState(0);
  const [access, setAccess] = useState({ status: 'checking' });

  useEffect(() => {
    let active = true;
    setAccess({ status: 'checking' });
    apiRequest('/auth/me')
      .then(({ user }) => {
        if (active) setAccess({ status: user.role === role ? 'allowed' : 'wrong-role', role: user.role });
      })
      .catch((error) => {
        if (!active) return;
        setAccess(error.status === 401 ? { status: 'unauthenticated' } : { status: 'error', message: error.message });
      });

    return () => {
      active = false;
    };
  }, [role, attempt]);

  if (access.status === 'checking') {
    return (
      <main className="container page-main" role="status">
        Checking your sign-in…
      </main>
    );
  }
  if (access.status === 'unauthenticated') {
    return <Navigate to={`/login?role=${role === 'mentee' ? 'student' : role}`} replace />;
  }
  if (access.status === 'wrong-role') {
    return <Navigate to={HOME_FOR_ROLE[access.role] || '/login'} replace />;
  }
  if (access.status === 'error') {
    return (
      <main className="container page-main">
        <div className="card stack" role="alert">
          <p>Unable to verify your sign-in: {access.message}</p>
          <button type="button" className="btn btn--outline" onClick={() => setAttempt((value) => value + 1)}>
            Try again
          </button>
          <Link to="/login">Return to sign in</Link>
        </div>
      </main>
    );
  }

  return children;
}
