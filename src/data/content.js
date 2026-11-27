/** Copy for the public pages, taken from the faculty familiarisation deck. */

export const VISION =
  'Our Vision is to elevate PSG Tech students into confident, industry-ready change-makers who solve real-life problems, innovate and shape the future as successful professionals and entrepreneurs in an AI-driven world.';

export const MISSION =
  'Our Mission is to guide PSG Tech students through alumni mentorship and professional networking that bridges academia and industry, helping them imbibe real-world insights, clarify their career direction and fast-track their progression.';

export const ORIGIN =
  'Dr Radhakrishnan, our Principal from 1994 to 2002, believed that an institution’s real wealth lies in the journeys of its alumni, and that what alumni can return is not only resources but wisdom. The alumni batch of 1994–98 shaped that thought into this structured mentorship program.';

export const ORIGIN_STEPS = ['Dr Radhakrishnan’s vision', 'Alumni guidance', 'Mentorship program'];

export const PILOT_STATS = [
  { icon: 'user', value: '~10', label: 'Alumni mentors', note: 'Virtual-first, so alumni abroad can join too' },
  { icon: 'cap', value: '3rd yr', label: 'Engineering students', note: 'A pilot of about 50 students' },
  { icon: 'users', value: '1 : 5', label: 'Mentor to students', note: 'Small pods for real conversation' },
  { icon: 'monitor', value: '4', label: 'Digital sessions', note: '1.5–2 hours each, over 3 months' },
];

export const PILLARS = [
  {
    num: '01',
    name: 'CONNECT',
    tagline: 'From knowledge to application',
    icon: 'network',
    points: ['Connect concepts across subjects', 'Understand where and how skills fit together'],
  },
  {
    num: '02',
    name: 'THINK',
    tagline: 'Develop industry problem-solving',
    icon: 'brain',
    points: ['Systems thinking, design, build, test and iterate', 'Explore options, trade-offs and failure cases'],
  },
  {
    num: '03',
    name: 'EXPLORE',
    tagline: 'Navigate the AI-driven world',
    icon: 'compass',
    points: ['Understand changing jobs, tools and skills', 'Learn what matters, where and to what depth', 'Learn judgement'],
  },
  {
    num: '04',
    name: 'CHOOSE',
    tagline: 'Make informed career decisions',
    icon: 'route',
    points: [
      'Explore technology, AI, product, startups, higher studies',
      'Understand options',
      'Choose a path that matches your aptitude and talent',
    ],
  },
  {
    num: '05',
    name: 'BUILD',
    tagline: 'Learn through practice & feedback',
    icon: 'wrench',
    accent: true,
    points: ['Work through small real-world challenges', 'Experiment, explain decisions and improve'],
  },
];

export const PILLARS_NOTE =
  'The emphasis is on developing judgement and capability, not collecting technologies for a résumé.';

export const POD_ROLES = [
  {
    key: 'mentor',
    title: 'Mentor',
    text: 'An alumnus who leads each session and shapes its content',
    icon: 'user',
    tone: 'tone-navy-gold',
  },
  {
    key: 'students',
    title: 'Students',
    text: '5 pre-final year students: a close group, all facing the mentor',
    icon: 'cap',
    tone: 'tone-blue',
  },
  {
    key: 'tutor',
    title: 'Tutor (facilitator)',
    text: 'Joins with the students, stays for part of the session, may interact and can drop off',
    icon: 'presentation',
    tone: 'tone-gold',
  },
];

export const SURVEY_STAT = {
  value: '65%',
  text: 'of the 34 pre-final year students we surveyed prefer small groups of 5–8, in line with our 1:5 pods',
};

export const JOURNEY = [
  {
    session: 1,
    phase: 'Understand',
    title: 'Getting to know each other',
    icon: 'message',
    points: ['Introductions and icebreakers (~30 min)', 'Mentees share their expectations', 'Mentor sets prep for Session 2'],
    outcome: 'A clear starting point',
  },
  {
    session: 2,
    phase: 'Explore',
    title: 'Cracking the interview',
    icon: 'userCheck',
    points: [
      'What panels expect, by sector (e.g. manufacturing vs IT)',
      'Present area of interest; mentor probes',
      'Present a project or paper',
    ],
    outcome: 'A broader view of possibilities',
  },
  {
    session: 3,
    phase: 'Apply',
    title: 'Getting industry-ready',
    icon: 'factory',
    points: ['Mentor explains an industry-related problem', 'Students solve it as professionals would, not as an exam'],
    outcome: 'Evidence of application',
  },
  {
    session: 4,
    phase: 'Reflect & next step',
    title: 'Your first 90 days',
    icon: 'rocket',
    points: [
      'Plan the first 90 days in the organisation',
      'Habits that get them seen as exemplar performers',
      'Get on the fast track',
    ],
    outcome: 'A personal roadmap',
    accent: true,
  },
];
