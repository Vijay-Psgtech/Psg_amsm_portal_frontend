/**
 * Industry problem pool. Problems are tagged by college department.
 * pods = how many pods are already working on it (0 = open).
 */
export const PROBLEMS = [
  { id: 'p1', title: 'Cut rejections on a packaging line', dept: 'Production', level: 'Intermediate', source: 'Department', pods: 0 },
  { id: 'p2', title: 'Forecast retail supply-chain demand', dept: 'CSE', level: 'Advanced', source: 'Alumni', pods: 0 },
  { id: 'p3', title: 'Reduce energy use in a dyeing unit', dept: 'Textile', level: 'Intermediate', source: 'Industry contact', pods: 2 },
  { id: 'p4', title: 'Detect faults in EV battery packs', dept: 'EEE', level: 'Advanced', source: 'Department', pods: 0 },
  { id: 'p5', title: 'Predict tool wear on CNC machines', dept: 'Mechanical', level: 'Advanced', source: 'Alumni', pods: 0 },
  { id: 'p6', title: 'Automate visual checks on a PCB line', dept: 'ECE', level: 'Intermediate', source: 'Industry contact', pods: 1 },
  { id: 'p7', title: 'Flag duplicate health-insurance claims', dept: 'IT', level: 'Intermediate', source: 'Alumni', pods: 0 },
  { id: 'p8', title: 'Schedule panel cleaning at a solar park', dept: 'Civil', level: 'Intermediate', source: 'Industry contact', pods: 0 },
];

export const PROBLEM_DEPARTMENTS = ['Civil', 'CSE', 'ECE', 'EEE', 'IT', 'Mechanical', 'Production', 'Textile'];

export const podsLabel = (pods) => (pods ? `${pods} ${pods === 1 ? 'pod' : 'pods'} on it` : 'Open');
