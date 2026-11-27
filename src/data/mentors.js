/**
 * Mentor directory used by the student and mentor portals. Sample data only:
 * names are illustrative, not the program's real mentors.
 * slots = open places in the mentor's pod this cycle (a pod holds 5 students).
 */
export const MENTORS = [
  { id: 'meera', name: 'Meera Subramanian', role: 'Director, Supply Chain', industry: 'Automotive', tracks: ['Career', 'Entrepreneur'], slots: 2, tone: 'tone-blue' },
  { id: 'karthik', name: 'Karthik Rangan', role: 'Principal Engineer, chip design', industry: 'Electronics and Semiconductors', tracks: ['Career', 'Higher studies'], slots: 1, tone: 'tone-navy' },
  { id: 'anitha', name: 'Anitha Devaraj', role: 'Founder, retail analytics start-up', industry: 'Product', tracks: ['Entrepreneur'], slots: 3, tone: 'tone-gold' },
  { id: 'priya', name: 'Priya Natarajan', role: 'Data Science Lead', industry: 'Banking and Financial Services', tracks: ['Career', 'Higher studies'], slots: 2, tone: 'tone-blue' },
  { id: 'senthil', name: 'Senthil Murugan', role: 'Plant Head, specialty chemicals', industry: 'Chemical', tracks: ['Career', 'Entrepreneur'], slots: 0, tone: 'tone-navy' },
  { id: 'deepa', name: 'Deepa Raghavan', role: 'Research Scientist, energy storage', industry: 'Energy', tracks: ['Higher studies'], slots: 2, tone: 'tone-gold' },
  { id: 'prakash', name: 'Prakash Venkatesh', role: 'Co-founder, precision components start-up', industry: 'Manufacturing', tracks: ['Entrepreneur', 'Career'], slots: 1, tone: 'tone-blue' },
  { id: 'kavitha', name: 'Kavitha Sundaram', role: 'Researcher, biomedical devices', industry: 'Healthcare and Insurance', tracks: ['Higher studies'], slots: 3, tone: 'tone-navy' },
  { id: 'vimal', name: 'Vimal S.', role: 'Engineering Manager, cloud platforms', industry: 'Information Technology', tracks: ['Career', 'Entrepreneur', 'Higher studies'], slots: 2, tone: 'tone-gold' },
  { id: 'ramesh', name: 'Ramesh Chandran', role: 'Project Director, solar parks', industry: 'Construction', tracks: ['Career'], slots: 2, tone: 'tone-blue' },
  { id: 'lakshmi', name: 'Lakshmi Narayanan', role: 'Product Director, health insurance', industry: 'Healthcare and Insurance', tracks: ['Career', 'Entrepreneur'], slots: 2, tone: 'tone-navy' },
];

export const slotsLabel = (slots) =>
  slots === 0 ? 'Pod full' : `${slots} ${slots === 1 ? 'slot' : 'slots'} open`;
