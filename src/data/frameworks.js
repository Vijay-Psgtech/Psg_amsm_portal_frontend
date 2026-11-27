/**
 * Mentor guides for STAR, IDEA and GRAD (faculty deck, slides 27–30).
 * Each step: overview (the at-a-glance line), tag (the step's short label)
 * and cells (one entry per row label, in order).
 */
export const GUIDES = {
  STAR: {
    title: 'STAR for every student',
    sub: 'One habit for industry problems and for final-year interviews',
    summary: 'The default path: career and industry readiness, and final-year interviews.',
    who: 'STAR is the default for career and industry readiness and for final-year interviews. Applied to a real industry problem it gives students a way in; applied to their own work it gives them honest stories, not scripted answers.',
    rows: ['On the problem', 'In the interview', 'Mentor asks'],
    promptRow: 2,
    quote: true,
    note: 'Not scripted answers · STAR helps students tell true stories from real problem-solving',
    steps: [
      {
        overview: 'Who is affected, and why it matters',
        tag: 'Understand the context',
        cells: [
          'Who is affected? What do we know, and what is missing?',
          'Set the scene in one or two lines.',
          'Who is affected, and what if nothing changes?',
        ],
      },
      {
        overview: 'What exactly is to be solved, and by whom',
        tag: 'Define your part',
        cells: [
          'Write the task in one line, with a measure of success.',
          'Say what was yours to do, not the team’s.',
          'What was yours to solve, and how will you know it worked?',
        ],
      },
      {
        overview: 'What was done, and why this way',
        tag: 'Show how you worked',
        cells: [
          'List the options; choose with reasons and trade-offs.',
          'Say “I”, not “we”: what you did and why.',
          'What else did you consider, and why did you drop it?',
        ],
      },
      {
        overview: 'What changed, and what was learned',
        tag: 'Prove it and learn',
        cells: [
          'Check the result against the measure; note what is next.',
          'Give the outcome, a number if you can, and a lesson.',
          'What changed, and what would you do differently?',
        ],
      },
    ],
  },
  IDEA: {
    title: 'IDEA for aspiring entrepreneurs',
    sub: 'Test a real problem cheaply, learn fast and decide on evidence',
    summary: 'For students curious about starting something: test early, spend little, decide on evidence.',
    who: 'IDEA is for students curious about starting something. Founder-mentors add real customers, a frank view of risk, business basics and their network. The aim is founder thinking, not necessarily starting a company.',
    rows: ['What the student does', 'Mentor asks', 'What a founder-mentor adds'],
    promptRow: 1,
    quote: true,
    note: 'The aim is founder thinking: test early, spend little, decide on evidence.',
    steps: [
      {
        overview: 'A real problem, from real people',
        tag: 'A real problem, from real people',
        cells: [
          'Talk to people who face a real problem; write it in one line.',
          'Who has this problem, and how do they cope today?',
          'Real customers: introductions to people the student can interview',
        ],
      },
      {
        overview: 'The smallest solution that could work',
        tag: 'The smallest solution that could work',
        cells: [
          'Sketch the simplest solution and who would pay for it.',
          'What is the smallest version that could work?',
          'A frank risk check: time, money and what could go wrong',
        ],
      },
      {
        overview: 'A cheap, quick test with real users',
        tag: 'A cheap, quick test with real users',
        cells: [
          'Run a cheap test with real users; measure one thing.',
          'What will you learn this week, and how will you know?',
          'Business basics: pricing, costs and the first sale',
        ],
      },
      {
        overview: 'Scale, change or stop, on evidence',
        tag: 'Scale, change or stop, on evidence',
        cells: [
          'Review the evidence; decide the next step and the resources.',
          'What does the evidence say: scale, change or stop?',
          'A network: advisers, peers and, later, funding contacts',
        ],
      },
    ],
  },
  GRAD: {
    title: 'GRAD for higher studies',
    sub: 'From a clear goal to a well-evidenced decision',
    summary: 'For students aiming for a master’s degree: from a clear goal to a well-evidenced decision.',
    who: 'GRAD is for students planning a master’s degree. The mentor shares experience, reviews drafts and opens doors. Test names are examples: students plan only the tests their chosen path needs.',
    rows: ['What the student does', 'How the mentor helps', 'Output'],
    promptRow: 1,
    quote: false,
    note: 'Guide, don’t write · the statement and the story must be the student’s own',
    steps: [
      {
        overview: 'Why a master’s, and what comes after',
        tag: 'Why a master’s?',
        cells: [
          'Decide what the degree is for: skills, research or a change of field. Talk to alumni who took each route.',
          'Shares how their own degree helped, or did not',
          'A one-page goal',
        ],
      },
      {
        overview: 'Courses, schools, funding and fit',
        tag: 'Courses and schools',
        cells: [
          'Shortlist by curriculum, faculty, outcomes, cost and funding. Mix reach, target and safe options.',
          'Gives an honest view of schools, labs and professors they know',
          'A shortlist',
        ],
      },
      {
        overview: 'Profile, tests, statement, recommenders',
        tag: 'Profile and tests',
        cells: [
          'Build the profile early. Plan the tests (GATE, GRE, CAT, TOEFL or IELTS). Draft the statement; brief recommenders.',
          'Reviews the statement of purpose; runs a mock interview',
          'Applications sent',
        ],
      },
      {
        overview: 'Compare offers; choose on evidence',
        tag: 'Offers and funding',
        cells: [
          'Compare offers on fit, funding and outcomes. Plan the move: travel, housing and the first term.',
          'Acts as a sounding board; connects to alumni at the school',
          'A decision',
        ],
      },
    ],
  },
};
