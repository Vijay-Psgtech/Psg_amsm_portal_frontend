import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import {
  AboutNavigation,
  PillarsContent,
  ProgramJoinCta,
  ProgramPager,
} from '../components/ProgramPageComponents.jsx';
import usePageTitle from '../lib/usePageTitle.js';
import './program-pages.css';

export default function Pillars() {
  usePageTitle('The five pillars');

  return (
    <>
      <SiteHeader />
      <AboutNavigation active="pillars" />
      <main>
        <section className="section program-about-page" aria-labelledby="pillars-title">
          <div className="container stack" style={{ '--gap': '24px' }}>
            <header className="page-title">
              <h1 id="pillars-title" className="h2">The five pillars</h1>
              <p className="sub">A focused framework for industry readiness, not another academic program.</p>
            </header>
            <PillarsContent />
            <ProgramPager previous={{ to: '/', label: 'Back to Home' }} next={{ to: '/frameworks', label: 'Next: The framework' }} />
          </div>
        </section>
      </main>
      <ProgramJoinCta />
      <SiteFooter />
    </>
  );
}
