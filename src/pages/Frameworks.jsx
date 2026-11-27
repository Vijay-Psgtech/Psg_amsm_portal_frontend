import { useState } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Icon from '../components/Icon.jsx';
import { FRAMEWORKS, FRAMEWORK_KEYS, RHYTHM } from '../data/taxonomy.js';
import { GUIDES } from '../data/frameworks.js';
import usePageTitle from '../lib/usePageTitle.js';
import './frameworks.css';

export default function Frameworks() {
  usePageTitle('Frameworks');

  const [fw, setFw] = useState('STAR');
  const [step, setStep] = useState(0);
  const pick = (key) => {
    setFw(key);
    setStep(0);
  };

  return (
    <>
      <SiteHeader />
      <main>
        <section className="section section--soft fw-intro" aria-labelledby="fw-title">
          <div className="container stack" style={{ '--gap': '26px' }}>
            <div className="page-title" style={{ maxWidth: 860 }}>
              <p className="eyebrow">For every mentor</p>
              <h1 id="fw-title" className="h1">
                One framework for every mentor
              </h1>
              <p className="lead">
                A shared four-step rhythm, with a lens for each student’s path. Every mentor understands the
                situation, defines the task, acts and reviews the result, whether the student is heading for a job, a
                start-up or a master’s degree.
              </p>
            </div>
            <ol className="rhythm list-reset" aria-label="The four-step rhythm">
              {RHYTHM.map((phase, i) => (
                <li key={phase} className="row" style={{ '--gap': '10px' }}>
                  {i > 0 ? <Icon name="chevronRight" size={20} strokeWidth={2.4} style={{ color: 'var(--muted)' }} /> : null}
                  <span className={'rhythm__pill' + (i === 3 ? ' is-review' : '')}>{phase}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section" aria-labelledby="glance-title">
          <div className="container stack" style={{ '--gap': '24px' }}>
            <div className="stack" style={{ '--gap': '8px' }}>
              <h2 id="glance-title" className="h2">
                Three lenses at a glance
              </h2>
              <p className="sub">Pick a path to open its full guide below.</p>
            </div>
            <div className="fw-table-wrap">
              <table className="fw-table">
                <caption className="sr-only">The STAR, IDEA and GRAD frameworks mapped to the shared four-step rhythm</caption>
                <thead>
                  <tr>
                    <td />
                    {RHYTHM.map((phase, i) => (
                      <th key={phase} scope="col" className={'fw-table__phase' + (i === 3 ? ' is-review' : '')}>
                        {phase}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FRAMEWORK_KEYS.map((key) => {
                    const f = FRAMEWORKS[key];
                    return (
                      <tr key={key}>
                        <th scope="row" className={'fw-table__fw' + (key === fw ? ' is-selected' : '')}>
                          <span className="row row--between">
                            <span className="fw-table__key">{key}</span>
                            <span className="icon-circle" style={{ width: 40, height: 40, background: f.color, color: f.onColor }}>
                              <Icon name={f.icon} size={20} />
                            </span>
                          </span>
                          <span className="fw-table__name">{f.name}</span>
                          <span className="fw-table__sub">{f.sub}</span>
                          <a href="#guide" className="fw-table__open" onClick={() => pick(key)}>
                            Open {key} guide
                            <Icon name="arrowDown" size={16} strokeWidth={2.4} />
                          </a>
                        </th>
                        {GUIDES[key].steps.map((s, i) => (
                          <td key={f.steps[i]}>
                            <p className="fw-table__step">{f.steps[i]}</p>
                            <p className="fw-table__line">{s.overview}</p>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="band band--gold">The student chooses the path; the mentor brings the questions.</p>
          </div>
        </section>

        <Guide fw={fw} step={step} onPick={pick} onStep={setStep} />

        <section className="section" aria-labelledby="start-title" style={{ paddingBlock: 64 }}>
          <div className="container">
            <div className="start-card">
              <div className="stack" style={{ '--gap': '6px', flex: '1 1 480px' }}>
                <h2 id="start-title" className="h3">
                  Ready to start on your path?
                </h2>
                <p className="sub" style={{ fontSize: 18 }}>
                  Request a mentor who supports your path, and attach an industry problem for your pod to work on.
                </p>
              </div>
              <div className="row">
                <Link to="/student" className="btn btn--gold btn--lg">
                  Request a mentor
                  <Icon name="arrowRight" size={20} strokeWidth={2.2} />
                </Link>
                <Link to="/dashboard" className="btn btn--outline btn--lg">
                  See the impact
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Guide({ fw, step, onPick, onStep }) {
  const f = FRAMEWORKS[fw];
  const g = GUIDES[fw];
  const prompt = g.steps[step].cells[g.promptRow];

  return (
    <section id="guide" className="section section--soft" aria-labelledby="guide-title">
      <div className="container stack" style={{ '--gap': '26px' }}>
        <div className="stack" style={{ '--gap': '8px' }}>
          <p className="eyebrow">Mentor guide</p>
          <h2 id="guide-title" className="h2">
            Step by step, for each path
          </h2>
        </div>

        <div className="row" role="group" aria-label="Choose a path">
          {FRAMEWORK_KEYS.map((key) => {
            const k = FRAMEWORKS[key];
            const on = key === fw;
            return (
              <button
                key={key}
                type="button"
                className="fw-tab"
                aria-pressed={on}
                onClick={() => onPick(key)}
                style={on ? { background: k.tint, borderColor: k.color } : undefined}
              >
                <span className="fw-tab__key" style={{ background: k.color, color: k.onColor }}>
                  {key}
                </span>
                {k.name}
              </button>
            );
          })}
        </div>

        <div className="stack" style={{ '--gap': '6px', maxWidth: 900 }}>
          <h3 className="fw-guide__title">{g.title}</h3>
          <p className="fw-guide__sub">{g.sub}</p>
          <p className="slate">{g.who}</p>
        </div>

        <div className="grid-auto" style={{ '--min': '250px', '--gap': '16px' }}>
          {g.steps.map((s, i) => {
            const on = i === step;
            return (
              <article key={f.steps[i]} className={'guide-step' + (on ? ' is-on' : '')} style={on ? { borderColor: f.color } : undefined}>
                <button
                  type="button"
                  className="guide-step__head"
                  aria-pressed={on}
                  aria-label={`Step ${i + 1} of 4: ${f.steps[i]}`}
                  onClick={() => onStep(i)}
                  style={on ? { background: f.tint } : undefined}
                >
                  <span className="guide-step__letter" style={{ background: f.color, color: f.onColor }}>
                    {f.letters[i]}
                  </span>
                  <span className="stack" style={{ '--gap': '2px' }}>
                    <span className="kicker">
                      0{i + 1} · {RHYTHM[i]}
                    </span>
                    <span className="guide-step__name">{f.steps[i]}</span>
                    <span className="slate small">{s.tag}</span>
                  </span>
                </button>
                <dl className="guide-step__body">
                  {g.rows.map((label, r) => (
                    <div key={label} className="stack" style={{ '--gap': '4px' }}>
                      <dt className="kicker" style={{ color: f.ink }}>
                        {label}
                      </dt>
                      <dd
                        className={
                          'guide-step__cell' +
                          (r === g.promptRow ? ' is-prompt' : '') +
                          (fw === 'GRAD' && r === 2 ? ' is-output' : '')
                        }
                      >
                        {s.cells[r]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            );
          })}
        </div>

        <div className="prompt" aria-live="polite">
          <div className="prompt__copy">
            <span className="eyebrow eyebrow--light" style={{ fontSize: 13 }}>
              {g.rows[g.promptRow]} · Step {step + 1} of 4 · {f.steps[step]}
            </span>
            <p className="prompt__text">{g.quote ? `“${prompt}”` : prompt}</p>
          </div>
          <div className="row">
            <button type="button" className="btn btn--sm btn--outline-light" disabled={step === 0} onClick={() => onStep(step - 1)}>
              <Icon name="arrowLeft" size={18} strokeWidth={2.2} />
              Previous step
            </button>
            <button type="button" className="btn btn--sm btn--gold" disabled={step === 3} onClick={() => onStep(step + 1)}>
              Next step
              <Icon name="arrowRight" size={18} strokeWidth={2.2} />
            </button>
          </div>
        </div>
        <p className="fw-note">{g.note}</p>
      </div>
    </section>
  );
}
