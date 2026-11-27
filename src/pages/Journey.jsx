import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import {
  AboutNavigation,
  JourneyContent,
  ProgramJoinCta,
  ProgramPager,
} from '../components/ProgramPageComponents.jsx';
import usePageTitle from '../lib/usePageTitle.js';
import './program-pages.css';

export default function Journey() {
  usePageTitle('The mentorship journey');

  return (
    <>
      <SiteHeader />
      <AboutNavigation active="journey" />
      <main>
        <section className="section program-about-page" aria-labelledby="journey-title">
          <div className="container stack" style={{ '--gap': '24px' }}>
            <header className="page-title">
              <h1 id="journey-title" className="h2">The mentorship journey</h1>
              <p className="sub">Four sessions, four phases: from understanding the student to a fast-track roadmap.</p>
            </header>
            <JourneyContent />
            <ProgramPager previous={{ to: '/frameworks', label: 'The framework' }} next={{ to: '/student/request', label: 'Next: Request a mentor' }} />
          </div>
        </section>
      </main>
      <ProgramJoinCta />
      <SiteFooter />
    </>
  );
}
