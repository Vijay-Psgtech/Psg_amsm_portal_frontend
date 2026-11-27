import { Navigate, Route, Routes } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import Home from './pages/Home.jsx';
import Frameworks from './pages/Frameworks.jsx';
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
        <Route path="/frameworks" element={<Frameworks />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Biodata />} />
        <Route path="/student" element={<StudentPortal />} />
        <Route path="/mentor" element={<MentorPortal />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
