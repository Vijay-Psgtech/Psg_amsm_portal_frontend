/** Signed-in sample users and the mentor's pod (illustrative). */

export const STUDENT_USER = { name: 'Nila V.', initials: 'NV', role: 'Student' };
export const MENTOR_USER = { id: 'vimal', name: 'Vimal S.', initials: 'VS', role: 'Mentor' };

export const POD_A = {
  name: 'Pod A',
  cycle: 'Cycle 2',
  session: 2, // the next session to hold
  members: ['arjun', 'kavya', 'sneha'],
  requests: ['divya', 'rahul'],
};

/** step = the framework step reached (1–4). */
export const MENTEES = {
  arjun: { name: 'Arjun P.', dept: 'CSE', fw: 'STAR', step: 3 },
  kavya: { name: 'Kavya R.', dept: 'IT', fw: 'IDEA', step: 2 },
  sneha: { name: 'Sneha K.', dept: 'ECE', fw: 'GRAD', step: 4 },
  divya: { name: 'Divya S.', dept: 'CSE', fw: 'STAR', step: 1, problem: 'Cut rejections on a packaging line' },
  rahul: { name: 'Rahul M.', dept: 'Mechanical', fw: 'IDEA', step: 1, problem: 'Reduce energy use in a dyeing unit' },
};
