/**
 * Pure functions behind the impact dashboard. They take pods in the shape of
 * src/data/pods.js, so the page keeps working when the sample data is replaced
 * by records from the portal's API.
 */
import { FRAMEWORK_KEYS } from '../data/taxonomy.js';

export const DEFAULT_FILTERS = { cycle: 'all', fw: 'all', dept: 'all', industry: 'all' };

/** Targets from the faculty deck: all 1,500 pre-final year students at 1 mentor to 5 students. */
export const SCALE_TARGETS = { students: 1500, mentors: 300, pods: 300 };

export const isFiltered = (f) =>
  f.cycle !== 'all' || f.fw !== 'all' || f.dept !== 'all' || f.industry !== 'all';

export const matchesFilters = (pod, mentee, f) =>
  (f.fw === 'all' || mentee.fw === f.fw) &&
  (f.dept === 'all' || mentee.dept === f.dept) &&
  (f.industry === 'all' || pod.mentor.industry === f.industry);

/** Rows are { pod, m } pairs for the mentees that pass the filters. */
export function applyFilters(pods, f) {
  const inCycle = pods.filter((p) => f.cycle === 'all' || String(p.cycle) === f.cycle);
  const rows = [];
  inCycle.forEach((pod) =>
    pod.mentees.forEach((m) => {
      if (matchesFilters(pod, m, f)) rows.push({ pod, m });
    })
  );
  const shownPods = inCycle.filter((pod) => pod.mentees.some((m) => matchesFilters(pod, m, f)));
  return { rows, pods: shownPods };
}

const attendanceShare = (pod, m) => (pod.sessions ? m.attended / pod.sessions : 0);

export function podAttendance(pod) {
  const total = pod.mentees.reduce((sum, m) => sum + attendanceShare(pod, m), 0);
  return Math.round((100 * total) / pod.mentees.length);
}

export function keyFigures(rows, pods) {
  const n = rows.length;
  return {
    students: n,
    pods: pods.length,
    mentors: new Set(pods.map((p) => p.mentorId)).size,
    industries: new Set(pods.map((p) => p.mentor.industry)).size,
    sessions: pods.reduce((sum, p) => sum + p.sessions, 0),
    attendance: n ? Math.round((100 * rows.reduce((sum, r) => sum + attendanceShare(r.pod, r.m), 0)) / n) : 0,
    completed: rows.filter((r) => r.pod.status === 'completed' && r.m.step === 4).length,
    cycles: new Set(pods.map((p) => p.cycle)).size,
  };
}

const splitByFramework = (rows) =>
  FRAMEWORK_KEYS.map((key) => ({ key, count: rows.filter((r) => r.m.fw === key).length }));

export const byFramework = (rows) => splitByFramework(rows);

export const byStage = (rows) =>
  [1, 2, 3, 4].map((step) => {
    const at = rows.filter((r) => r.m.step === step);
    return { step, count: at.length, parts: splitByFramework(at) };
  });

export const byIndustry = (rows, industries) =>
  industries
    .map((name, order) => {
      const at = rows.filter((r) => r.pod.mentor.industry === name);
      return { name, order, total: at.length, parts: splitByFramework(at) };
    })
    .sort((a, b) => b.total - a.total || a.order - b.order);

export function programScale(pods) {
  return {
    students: pods.reduce((sum, p) => sum + p.mentees.length, 0),
    mentors: new Set(pods.map((p) => p.mentorId)).size,
    pods: pods.length,
  };
}
