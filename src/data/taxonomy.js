/**
 * Shared vocabulary for the portal: the three paths, the four-step rhythm,
 * mentor industries and college departments.
 */

export const FRAMEWORK_KEYS = ['STAR', 'IDEA', 'GRAD'];

/** Framework identity. The colours were checked for colour-blind separation. */
export const FRAMEWORKS = {
  STAR: {
    key: 'STAR',
    name: 'Career & industry',
    want: 'I want a job',
    sub: 'Problems and interviews',
    track: 'Career',
    icon: 'briefcase',
    color: '#2F6DB5',
    onColor: '#FFFFFF',
    tint: '#E8EFF8',
    ink: '#1F4F8A',
    letters: ['S', 'T', 'A', 'R'],
    steps: ['Situation', 'Task', 'Action', 'Result'],
  },
  IDEA: {
    key: 'IDEA',
    name: 'Entrepreneurs',
    want: 'I want to build a start-up',
    sub: 'Test, learn, decide',
    track: 'Entrepreneur',
    icon: 'lightbulb',
    color: '#C2861A',
    onColor: '#1B2A4A',
    tint: '#FBF1DC',
    ink: '#7A5608',
    letters: ['I', 'D', 'E', 'A'],
    steps: ['Identify', 'Design', 'Experiment', 'Accelerate'],
  },
  GRAD: {
    key: 'GRAD',
    name: 'Higher studies',
    want: 'I want to pursue higher studies',
    sub: 'From goal to decision',
    track: 'Higher studies',
    icon: 'cap',
    color: '#1E9E83',
    onColor: '#FFFFFF',
    tint: '#E2F3EE',
    ink: '#0E6552',
    letters: ['G', 'R', 'A', 'D'],
    steps: ['Goal', 'Research', 'Apply', 'Decide'],
  },
};

/** The shared rhythm every mentor follows, whatever the path. */
export const RHYTHM = ['Understand', 'Define', 'Act', 'Review'];

/** Mentoring tracks a mentor can offer, and the framework each one uses. */
export const TRACKS = ['Career', 'Entrepreneur', 'Higher studies'];
export const TRACK_FRAMEWORK = { Career: 'STAR', Entrepreneur: 'IDEA', 'Higher studies': 'GRAD' };
export const frameworkOfTrack = (track) => FRAMEWORKS[TRACK_FRAMEWORK[track]];

/** Mentors are grouped by the industry they work in, not by college department. */
export const MENTOR_INDUSTRIES = [
  'Automotive',
  'Banking and Financial Services',
  'Chemical',
  'Construction',
  'Electronics and Semiconductors',
  'Energy',
  'Healthcare and Insurance',
  'Information Technology',
  'Manufacturing',
  'Product',
];

/** The wider list offered on the bio-data form. */
export const PROFILE_INDUSTRIES = [
  'Automotive',
  'Banking and Financial Services',
  'Chemical',
  'Construction',
  'Consulting',
  'Electronics and Semiconductors',
  'Energy',
  'Healthcare and Insurance',
  'Information Technology',
  'Manufacturing',
  'Product',
  'Retail and E-commerce',
  'Other',
];

/** Students, tutors and industry problems belong to college departments. */
export const DEPARTMENTS = [
  'Automobile',
  'Biotechnology',
  'Civil',
  'CSE',
  'ECE',
  'EEE',
  'IT',
  'Mechanical',
  'Metallurgy',
  'Production',
  'Textile',
];
