import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Brand from '../components/Brand.jsx';
import Icon from '../components/Icon.jsx';
import { CheckField, ChipField, SelectField, TextField } from '../components/Field.jsx';
import { DEPARTMENTS, FRAMEWORKS, PROFILE_INDUSTRIES, TRACKS, TRACK_FRAMEWORK, frameworkOfTrack } from '../data/taxonomy.js';
import { initials, pct } from '../lib/format.js';
import { apiRequest } from '../lib/api.js';
import usePageTitle from '../lib/usePageTitle.js';
import './biodata.css';

const ROLES = [
  { key: 'mentor', title: 'Mentor', sub: 'PSG Tech alumni', icon: 'user', tone: 'tone-navy-gold' },
  { key: 'mentee', title: 'Mentee', sub: 'Pre-final year student', icon: 'cap', tone: 'tone-blue' },
  { key: 'coordinator', title: 'Program coordinator', sub: 'Faculty coordinator or department tutor', icon: 'presentation', tone: 'tone-gold' },
];

const DUTIES = {
  'Faculty coordinator':
    'Selects the pilot batch, pairs mentors with student batches, adds and tags industry problems from every department, matches any pod that has no mentor, and follows attendance and completion across all pods.',
  'Department tutor':
    'Joins pod sessions with the students, may stay for part of a session and interact, encourages participation, ensures attendance and follows up after sessions.',
};

const FORMATS = ['Online', 'In person (on campus)', 'Either'];
const ACCOUNT_SECTION = {
  title: 'Account security',
  fields: [
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      minLength: 8,
      maxLength: 72,
      autoComplete: 'new-password',
      hint: 'Use at least 8 characters.',
    },
    {
      name: 'confirmPassword',
      label: 'Confirm password',
      type: 'password',
      required: true,
      maxLength: 72,
      autoComplete: 'new-password',
    },
  ],
};

/**
 * The bio-data forms, as data. Field types: text (default), email, tel, url,
 * select, textarea, chips (one choice), multichips, check and info.
 * wide: true makes a field span the full row.
 */
const FORMS = {
  mentor: [
    {
      title: 'About you',
      fields: [
        { name: 'name', label: 'Full name', required: true },
        { name: 'batch', label: 'PSG Tech batch', required: true, placeholder: 'e.g. 1994–98' },
        { name: 'degree', label: 'Degree at PSG Tech', optional: true, placeholder: 'e.g. BE' },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'mobile', label: 'Mobile number', type: 'tel', optional: true },
        { name: 'city', label: 'City and country', required: true, placeholder: 'e.g. Chennai, India' },
        { name: 'linkedin', label: 'LinkedIn profile', type: 'url', optional: true, placeholder: 'Profile link' },
      ],
    },
    {
      title: 'Your work',
      fields: [
        { name: 'role', label: 'Current role', required: true, placeholder: 'e.g. Engineering Manager' },
        { name: 'org', label: 'Organisation', required: true },
        {
          name: 'industry',
          label: 'Industry',
          type: 'select',
          required: true,
          options: PROFILE_INDUSTRIES,
          placeholder: 'Select your industry',
          hint: 'Mentors are grouped by industry, not by college department.',
        },
        {
          name: 'experience',
          label: 'Years of experience',
          type: 'select',
          required: true,
          options: ['Under 10 years', '10–15 years', '15–20 years', '20–25 years', '25+ years'],
          placeholder: 'Select',
        },
        { name: 'expertise', label: 'Areas of expertise', optional: true, placeholder: 'e.g. Cloud platforms, data governance' },
        { name: 'bio', label: 'Short bio', type: 'textarea', required: true, rows: 4, counter: 500, wide: true, placeholder: 'Your career so far, in a few lines' },
      ],
    },
    {
      title: 'How you will mentor',
      fields: [
        {
          name: 'tracks',
          label: 'Tracks you can guide',
          type: 'multichips',
          required: true,
          wide: true,
          options: TRACKS.map((t) => ({ value: t, label: `${t} · ${TRACK_FRAMEWORK[t]}` })),
        },
        {
          name: 'pods',
          label: 'Pods this cycle',
          type: 'chips',
          wide: true,
          options: [
            { value: '1', label: '1 pod · 5 students' },
            { value: '2', label: '2 pods · 10 students' },
          ],
        },
        { name: 'format', label: 'Preferred format', type: 'chips', wide: true, options: FORMATS },
        { name: 'slots', label: 'Preferred time slots', type: 'multichips', wide: true, options: ['Weekday evenings', 'Weekend mornings', 'Weekend afternoons'] },
        { name: 'timezone', label: 'Time zone', type: 'select', options: ['IST (India)', 'GST (Gulf)', 'SGT (Singapore)', 'UK time', 'US Eastern', 'US Pacific', 'Other'] },
        { name: 'problem', label: 'An industry problem you could bring', type: 'textarea', optional: true, wide: true, placeholder: 'A real problem from your workplace that a pod could solve in Session 3' },
        { name: 'consent', label: 'Show my profile to students and the program team', missing: 'consent to show your profile', type: 'check', required: true, wide: true },
      ],
    },
  ],
  mentee: [
    {
      title: 'About you',
      fields: [
        { name: 'name', label: 'Full name', required: true },
        { name: 'roll', label: 'Roll number', required: true },
        { name: 'dept', label: 'Department', type: 'select', required: true, options: DEPARTMENTS, placeholder: 'Select your department' },
        { name: 'year', label: 'Year', type: 'select', required: true, options: ['3rd year (pre-final)', 'Final year'], placeholder: 'Select' },
        { name: 'email', label: 'College email', type: 'email', required: true },
        { name: 'mobile', label: 'Mobile number', type: 'tel', optional: true },
        { name: 'tutor', label: 'Department tutor', optional: true, placeholder: 'Your tutor’s name' },
      ],
    },
    {
      title: 'Your path and interests',
      fields: [
        {
          name: 'path',
          label: 'Your path',
          type: 'chips',
          required: true,
          wide: true,
          options: Object.values(FRAMEWORKS).map((f) => ({ value: f.key, label: `${f.key} · ${f.want}` })),
        },
        { name: 'industries', label: 'Industries you are interested in', type: 'multichips', max: 3, wide: true, options: PROFILE_INDUSTRIES.filter((i) => i !== 'Other') },
        {
          name: 'help',
          label: 'Where you want guidance',
          type: 'multichips',
          required: true,
          wide: true,
          options: ['Internship and placement preparation', 'Skills beyond the syllabus', 'Choosing a career path', 'Higher studies, job or start-up', 'Electives'],
        },
        { name: 'skills', label: 'Skills you have', optional: true, wide: true, placeholder: 'e.g. Python, CAD, circuit design' },
        { name: 'project', label: 'A project, internship or paper you could present', type: 'textarea', optional: true, wide: true, placeholder: 'You present this to your mentor in Session 2' },
      ],
    },
    {
      title: 'Session preferences',
      fields: [
        { name: 'format', label: 'Format', type: 'chips', wide: true, options: FORMATS },
        { name: 'frequency', label: 'How often', type: 'chips', wide: true, options: ['Monthly', 'Fortnightly'] },
        { name: 'consent', label: 'Share this profile with my mentor and my department tutor', missing: 'consent to share your profile', type: 'check', required: true, wide: true },
      ],
    },
  ],
  coordinator: [
    {
      title: 'About you',
      fields: [
        { name: 'name', label: 'Full name', required: true },
        { name: 'staffId', label: 'Staff ID', required: true },
        { name: 'designation', label: 'Designation', type: 'select', required: true, options: ['Professor', 'Associate Professor', 'Assistant Professor', 'Other'], placeholder: 'Select' },
        { name: 'dept', label: 'Department', type: 'select', required: true, options: DEPARTMENTS, placeholder: 'Select your department' },
        { name: 'email', label: 'Staff email', type: 'email', required: true },
        { name: 'mobile', label: 'Mobile number', type: 'tel', optional: true },
      ],
    },
    {
      title: 'Your role in the program',
      fields: [
        { name: 'programRole', label: 'Role', type: 'chips', required: true, wide: true, options: Object.keys(DUTIES) },
        { name: 'duties', label: 'What this role does', type: 'info', wide: true, text: (v) => DUTIES[v.programRole] || 'Choose a role to see what it does.' },
        { name: 'depts', label: 'Departments you cover', type: 'multichips', optional: true, wide: true, options: DEPARTMENTS },
        { name: 'batch', label: 'Batch or class you tutor', optional: true, wide: true, placeholder: 'e.g. 3rd year, Section A' },
        { name: 'consent', label: 'I confirm these details are correct', missing: 'confirmation that the details are correct', type: 'check', required: true, wide: true },
      ],
    },
  ],
};

const MULTI = new Set(['multichips']);
const emptyValue = (field) => (MULTI.has(field.type) ? [] : field.type === 'check' ? false : '');
const sectionsForRole = (role) => [...FORMS[role], ACCOUNT_SECTION];
const initialValues = () =>
  Object.fromEntries(
    Object.entries(FORMS).map(([role, sections]) => {
      const values = {};
      [...sections, ACCOUNT_SECTION].forEach((s) => s.fields.forEach((f) => (values[f.name] = emptyValue(f))));
      return [role, values];
    })
  );

/** How a missing field is named in "Still needed: …" (keeps acronyms such as PSG and ID). */
const missingName = (field) =>
  field.missing || (/^[A-Z]{2}/.test(field.label) ? field.label : field.label.charAt(0).toLowerCase() + field.label.slice(1));

const isFilled = (value) => (Array.isArray(value) ? value.length > 0 : typeof value === 'boolean' ? value : String(value ?? '').trim() !== '');

const DONE = {
  mentor: {
    title: 'Profile saved',
    body: 'Your profile is ready. Sign in to continue to the mentor portal.',
    to: '/login?role=mentor',
    cta: 'Sign in',
  },
  mentee: { title: 'Profile saved', body: 'Your profile is ready. Sign in to request a mentor.', to: '/login?role=student', cta: 'Sign in' },
  coordinator: {
    title: 'Profile saved',
    body: 'Your profile is ready. Sign in to continue to the program dashboard.',
    to: '/login?role=coordinator',
    cta: 'Sign in',
  },
};

function preview(role, v) {
  if (role === 'mentor') {
    return {
      label: 'How students see you in the mentor directory',
      name: v.name,
      line: (v.role || 'Your role') + (v.org ? ` · ${v.org}` : ''),
      chips: [
        { label: v.industry || 'Industry', bg: 'var(--navy)', ink: '#fff' },
        ...v.tracks.map((t) => ({ label: `${t} · ${TRACK_FRAMEWORK[t]}`, bg: frameworkOfTrack(t).tint, ink: frameworkOfTrack(t).ink })),
      ],
      meta: [
        v.batch && `PSG Tech batch ${v.batch}`,
        v.city,
        `${v.pods === '2' ? '2 pods · 10 students' : '1 pod · 5 students'}${v.format ? ` · ${v.format}` : ''}`,
      ],
      text: v.bio,
      placeholder: 'Your short bio appears here.',
    };
  }
  if (role === 'mentee') {
    const f = FRAMEWORKS[v.path];
    return {
      label: 'How your mentor sees you',
      name: v.name,
      line: `${v.dept || 'Department'} · ${v.year || 'Year'}`,
      chips: [
        ...(f ? [{ label: `${f.key} · ${f.name}`, bg: f.tint, ink: f.ink }] : []),
        ...v.industries.map((i) => ({ label: i, bg: 'var(--chip-soft)', ink: 'var(--navy)' })),
      ],
      meta: [
        v.tutor && `Tutor: ${v.tutor}`,
        v.help.length > 0 && `Wants guidance on: ${v.help.join(', ').toLowerCase()}`,
        v.format && `Prefers ${v.format.toLowerCase()}${v.frequency ? `, ${v.frequency.toLowerCase()}` : ''}`,
      ],
      text: v.project,
      placeholder: 'Your project, internship or paper appears here.',
    };
  }
  return {
    label: 'How mentors and students see you',
    name: v.name,
    line: `${v.designation || 'Designation'} · ${v.dept || 'Department'}`,
    chips: [
      ...(v.programRole ? [{ label: v.programRole, bg: 'var(--gold)', ink: 'var(--navy)' }] : []),
      ...v.depts.map((d) => ({ label: d, bg: 'var(--chip-soft)', ink: 'var(--navy)' })),
    ],
    meta: [v.batch && `Tutors ${v.batch}`, v.email],
    text: '',
    placeholder: DUTIES[v.programRole] || 'Choose a role to see what it does.',
  };
}

export default function Biodata() {
  usePageTitle('Create your profile');

  const { search } = useLocation();
  const asked = new URLSearchParams(search).get('role');
  const [role, setRole] = useState(FORMS[asked] ? asked : 'mentor');
  const [values, setValues] = useState(initialValues);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const v = values[role];
  const sections = sectionsForRole(role);
  const required = sections.flatMap((s) => s.fields.filter((f) => f.required));
  const missing = required.filter((f) => !isFilled(v[f.name]));
  const passwordValid = v.password.length >= 8 && new TextEncoder().encode(v.password).length <= 72;
  const passwordMatches = v.password === v.confirmPassword;
  const done = required.filter(
    (field) =>
      isFilled(v[field.name]) &&
      (field.name !== 'password' || passwordValid) &&
      (field.name !== 'confirmPassword' || passwordMatches)
  ).length;
  const complete = done === required.length;
  const missingLabels = [
    ...missing.map(missingName),
    !passwordValid && v.password ? 'a password of at least 8 characters' : null,
    !passwordMatches && v.confirmPassword ? 'matching passwords' : null,
  ].filter(Boolean);
  const pv = preview(role, v);

  const pickRole = (key) => {
    setRole(key);
    setSubmitted(false);
    setError('');
  };
  const setField = (name) => (value) => {
    setValues((current) => ({ ...current, [role]: { ...current[role], [name]: value } }));
    setError('');
  };
  const submit = async (event) => {
    event.preventDefault();
    if (!complete) return;

    setSaving(true);
    setError('');
    const { password, confirmPassword: _confirmPassword, ...profile } = v;
    try {
      await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ role, profile, password }),
      });
      setValues((current) => ({
        ...current,
        [role]: { ...current[role], password: '', confirmPassword: '' },
      }));
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-soft">
      <header className="site-header">
        <div className="container site-header__inner" style={{ justifyContent: 'space-between' }}>
          <Brand />
          <span className="row" style={{ '--gap': '8px 14px', color: 'var(--line-2)', fontSize: 15 }}>
            Already registered?
            <Link to="/login" className="btn btn--outline-light btn--sm" style={{ borderWidth: 1 }}>
              Sign in
            </Link>
          </span>
        </div>
      </header>
      <div className="subnav">
        <div className="container subnav__inner" style={{ minHeight: 48 }}>
          <nav aria-label="Breadcrumb" className="row small" style={{ '--gap': '6px' }}>
            <Link to="/login" style={{ fontWeight: 700, textDecoration: 'none' }}>
              Sign in
            </Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page" style={{ fontWeight: 700 }}>
              Bio-data
            </span>
          </nav>
        </div>
      </div>

      <main className="container page-main">
        <div className="page-title">
          <p className="eyebrow">Bio-data</p>
          <h1 className="h2">Create your profile</h1>
          <p className="sub" style={{ fontSize: 18 }}>
            Tell us about yourself so the program team can form the right pods. Fields marked{' '}
            <span className="field__req" style={{ fontWeight: 700 }}>
              *
            </span>{' '}
            are required.
          </p>
        </div>

        <div className="grid-auto" style={{ '--min': '250px', '--gap': '12px' }} role="group" aria-label="I am filling this in as">
          {ROLES.map((r) => (
            <button key={r.key} type="button" className={'role-card' + (role === r.key ? ' is-on' : '')} aria-pressed={role === r.key} onClick={() => pickRole(r.key)}>
              <span className={'icon-circle ' + r.tone} style={{ width: 46, height: 46 }}>
                <Icon name={r.icon} size={22} />
              </span>
              <span className="stack" style={{ '--gap': '0' }}>
                <span className="role-card__title">{r.title}</span>
                <span className="slate small">{r.sub}</span>
              </span>
            </button>
          ))}
        </div>

        <form className="split" onSubmit={submit} noValidate>
          <div className="split__main stack" style={{ '--gap': '20px' }}>
            {sections.map((section, i) => (
              <section key={section.title} className="card stack" style={{ '--gap': '18px' }} aria-labelledby={`${role}-s${i}`}>
                <div className="numbered-title">
                  <span className="numbered-title__n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h2 id={`${role}-s${i}`} className="title">
                    {section.title}
                  </h2>
                </div>
                <div className="bio-grid">
                  {section.fields.map((field) => (
                    <div key={field.name} className={field.wide ? 'bio-grid__wide' : undefined}>
                      <FormField field={field} values={v} onChange={setField(field.name)} idPrefix={role} />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="split__side stack" style={{ '--gap': '16px' }} aria-label="Profile summary">
            <div className="card stack" style={{ '--gap': '8px', padding: '20px 22px' }}>
              <span className="kicker">Profile completion</span>
              <span className="bio-done">
                {done} of {required.length} required fields
              </span>
              <div className="bio-meter" aria-hidden="true">
                <div className="bio-meter__fill" style={{ width: `${pct(done, required.length)}%` }} />
              </div>
              <span className="slate small">
                {complete
                  ? 'All required fields are complete.'
                  : missingLabels.length > 0
                    ? `Still needed: ${missingLabels.join(', ')}.`
                    : 'Complete the required fields to save your profile.'}
              </span>
            </div>

            <div className="card card--gold stack" style={{ '--gap': '12px', padding: '20px 22px' }}>
              <span className="kicker" style={{ color: 'var(--gold-text)' }}>
                {pv.label}
              </span>
              <div className="row" style={{ flexWrap: 'nowrap' }}>
                <span className="avatar avatar--lg tone-navy" aria-hidden="true">
                  {initials(pv.name)}
                </span>
                <span className="stack" style={{ '--gap': '0', minWidth: 0 }}>
                  <span className="bio-preview__name">{pv.name || 'Your name'}</span>
                  <span className="slate small">{pv.line}</span>
                </span>
              </div>
              <div className="row" style={{ '--gap': '6px' }}>
                {pv.chips.map((c) => (
                  <span key={c.label} className="chip" style={{ background: c.bg, color: c.ink }}>
                    {c.label}
                  </span>
                ))}
              </div>
              <ul className="list-reset stack slate small" style={{ '--gap': '4px' }}>
                {pv.meta.filter(Boolean).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="slate small" style={{ fontStyle: pv.text ? 'normal' : 'italic' }}>
                {pv.text || pv.placeholder}
              </p>
            </div>

            {submitted ? (
              <div className="card stack" style={{ '--gap': '12px', padding: '20px 22px' }} role="status">
                <span className="icon-circle tone-good" style={{ width: 48, height: 48 }}>
                  <Icon name="check" size={24} strokeWidth={2.6} />
                </span>
                <h2 className="h3" style={{ fontSize: 24 }}>
                  {DONE[role].title}
                </h2>
                <p className="slate">{DONE[role].body}</p>
                <Link to={DONE[role].to} className="btn btn--gold btn--block">
                  {DONE[role].cta}
                </Link>
                <button type="button" className="btn btn--outline btn--sm" onClick={() => setSubmitted(false)}>
                  Edit profile
                </button>
              </div>
            ) : (
              <div className="card stack" style={{ '--gap': '10px', padding: '20px 22px' }}>
                {error ? (
                  <p className="status status--warn" role="alert">
                    {error}
                  </p>
                ) : null}
                <button type="submit" className="btn btn--gold btn--lg btn--block" disabled={!complete || saving}>
                  {saving ? 'Saving profile…' : 'Save profile'}
                </button>
              </div>
            )}
          </aside>
        </form>
      </main>
    </div>
  );
}

function FormField({ field, values, onChange, idPrefix }) {
  const id = `${idPrefix}-${field.name}`;
  const value = values[field.name];
  const common = { label: field.label, required: field.required, optional: field.optional };
  switch (field.type) {
    case 'select':
      return <SelectField id={id} {...common} value={value} onChange={onChange} options={field.options} placeholder={field.placeholder} hint={field.hint} />;
    case 'textarea':
      return (
        <div className="stack" style={{ '--gap': '4px' }}>
          <TextField id={id} {...common} multiline rows={field.rows} value={value} onChange={onChange} placeholder={field.placeholder} />
          {field.counter ? (
            <span className="field__hint" style={{ alignSelf: 'flex-end' }}>
              {String(value || '').length} / {field.counter} characters
            </span>
          ) : null}
        </div>
      );
    case 'chips':
      return <ChipField legend={field.label} required={field.required} optional={field.optional} options={field.options} value={value} onChange={onChange} />;
    case 'multichips':
      return <ChipField multiple max={field.max} legend={field.label} required={field.required} optional={field.optional} options={field.options} value={value} onChange={onChange} />;
    case 'check':
      return <CheckField id={id} label={field.label} required={field.required} checked={value} onChange={onChange} />;
    case 'info':
      return (
        <div className="bio-info">
          <span className="kicker" style={{ color: 'var(--gold-ink)' }}>
            {field.label}
          </span>
          <span>{field.text(values)}</span>
        </div>
      );
    default:
      return (
        <TextField
          id={id}
          {...common}
          type={field.type || 'text'}
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
          hint={field.hint}
          minLength={field.minLength}
          maxLength={field.maxLength}
          autoComplete={field.autoComplete}
        />
      );
  }
}
