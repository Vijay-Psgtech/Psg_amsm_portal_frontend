import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Home from './pages/Home.jsx';
import Pillars from './pages/Pillars.jsx';
import Frameworks from './pages/Frameworks.jsx';
import Journey from './pages/Journey.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Biodata from './pages/Biodata.jsx';
import StudentPortal from './pages/StudentPortal.jsx';
import MentorPortal from './pages/MentorPortal.jsx';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pillars" element={<Pillars />} />
        <Route path="/frameworks" element={<Frameworks />} />
        <Route path="/journey" element={<Journey />} />
        <Route path="/dashboard" element={<ProtectedRoute role="coordinator"><Dashboard /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Biodata />} />
        <Route path="/student/*" element={<ProtectedRoute role="mentee"><StudentPortal /></ProtectedRoute>} />
        <Route path="/mentor/*" element={<ProtectedRoute role="mentor"><MentorPortal /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
