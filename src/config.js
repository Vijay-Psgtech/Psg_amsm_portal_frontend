// Wireframe aids and site-wide settings. Switch the wireframe aids off when the portal goes live.

/** Shows "Sample view · illustrative data" labels and the sample-data notes. */
export const SHOW_SAMPLE_LABELS = true;

/** Shows the numbered callouts on the mentor home (from the faculty deck's sample portal). */
export const SHOW_ANNOTATIONS = true;

/** Placeholder until the program office confirms its contact address. */
export const PROGRAM_CONTACT_EMAIL = '[PROGRAM CONTACT EMAIL]';

/** Hero photo from the faculty deck. Lives in public/images so it is served as-is. */
export const HERO_IMAGE = `${import.meta.env.BASE_URL}images/hero-mentoring.jpg`;
export const HERO_IMAGE_ALT =
  'An alumna mentoring two students at a table, with a sign reading Once a PSGian Always a PSGian';

/** Where each role lands after signing in. */
export const ROLE_HOME = { student: '/student', mentor: '/mentor', coordinator: '/dashboard' };
