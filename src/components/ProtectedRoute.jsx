import { Link, Navigate } from 'react-router-dom';
import { ROLE_HOME } from '../config.js';
import { useAuth } from '../context/AuthContext.jsx';

const HOME_FOR_ROLE = {
  mentor: ROLE_HOME.mentor,
  mentee: ROLE_HOME.student,
  coordinator: ROLE_HOME.coordinator,
};

export default function ProtectedRoute({ role, children }) {
  const { user, status, error, isAuthenticated, refreshUser } = useAuth();

  if (status === 'loading') {
    return (
      <main className="container page-main" role="status">
        Checking your sign-in…
      </main>
    );
  }
  if (status === 'error') {
    return (
      <main className="container page-main">
        <div className="card stack" role="alert">
          <p>Unable to verify your sign-in: {error.message}</p>
          <button type="button" className="btn btn--outline" onClick={refreshUser}>
            Try again
          </button>
          <Link to="/login">Return to sign in</Link>
        </div>
      </main>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to={`/login?role=${role === 'mentee' ? 'student' : role}`} replace />;
  }
  if (user.role !== role) {
    return <Navigate to={HOME_FOR_ROLE[user.role] || '/login'} replace />;
  }

  return children;
}
