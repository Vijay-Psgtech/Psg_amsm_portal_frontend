# Mentor – Mentee Program at PSG Tech

The React/Vite portal and Node/Express API for the program. Profile registration and password sign-in use MongoDB; the mentoring portals, dashboard, and program content still use sample data.

The frontend follows the faculty deck's Vision, Mission, frameworks (STAR, IDEA, GRAD), 1:5 mentor pods, and sample portal design.

## Quick start

You need Node.js 20 or newer.

```bash
npm install
npm run dev       # local server with live reload, usually http://localhost:5173
npm run build     # production files in dist/
npm run preview   # serve dist/ locally to check the build
```

## Start the API

The API requires Node.js 20 or newer and a MongoDB instance. In a separate terminal:

```bash
cd ../server
npm install
```

Create `server/.env` using `server/.env.example` as a reference. Keep any existing local settings, set `MONGO_URI`, and set `JWT_SECRET` to a unique random value of at least 32 characters. Then run:

```bash
npm run dev
```

The API listens on port `5000` by default. Set `VITE_API_URL` in the client's environment if the API is hosted elsewhere; the default is `http://localhost:5000/api`. Set `CLIENT_ORIGIN` on the server when the frontend origin is different from `http://localhost:5173`.

Profiles are stored with their role-specific details; passwords are bcrypt-hashed and never returned. Login uses email for mentors and coordinators, and roll number or email for mentees. Mentors may also sign in with the mobile number in their profile. Successful sign-in uses an HTTP-only session cookie and protected portal routes check both the session and role.

The app's `AuthProvider` loads and owns the current user/profile and exposes login, logout, and refresh actions through `useAuth()`. Components use context and services rather than making authentication requests directly; request handling lives in `src/services/`.

## Pages

| Address | Page | What it shows |
|---|---|---|
| `/` | Home | From classroom learning to industry readiness, Vision and Mission, the five pillars, the three paths, the 1:5 mentor pod and the four-session journey |
| `/frameworks` | Frameworks | STAR, IDEA and GRAD on the shared four-step rhythm (Understand, Define, Act, Review), with a step-by-step mentor guide for each path |
| `/dashboard` | Impact dashboard | Students reached by framework, mentor industry and stage; road to scale; every mentor pod and each student's step (sample data) |
| `/login` | Sign in | Password sign-in for students, alumni mentors and program coordinators |
| `/profile?role=mentor` | Bio-data | Register mentor, mentee (`role=mentee`) and program coordinator (`role=coordinator`) profiles |
| `/student` | Student portal | Choose a path, pick a mentor, attach an industry problem, send the request (sample data) |
| `/mentor` | Mentor portal | Mentor directory, industry problem pool, mentee requests, and progress for the mentor's pod (sample data) |

Any other address goes back to Home.

## Project structure

```
index.html              Page shell and font links
vite.config.js          Build settings (sub-path support, see below)
public/
  .htaccess             Address rewrites for Apache servers
  images/               Hero photo from the faculty deck
src/
  main.jsx              Starts the app and the router
  App.jsx               The list of pages (routes)
  config.js             Site-wide settings and wireframe switches
  pages/                One file per page, each with its own .css
  components/           Shared pieces: headers, footer, icons, form fields,
                        framework chips, step chips, pod diagram
  context/              Global authentication and current-user state
  data/                 Program wording and sample data (see below)
  lib/                  Dashboard calculations, formatting, page titles
  services/             API client, authentication, and profile requests
  styles/
    tokens.css          Brand colours, fonts, spacing, radii
    base.css            Typography, buttons, chips, cards, form controls
    layout.css          Site and portal headers, footer, page shells
```

## Hosting on the college site

### Under a sub-path

If the portal will live at an address such as `https://www.psgtech.edu/mentorship/`, build it with that path:

```bash
VITE_BASE=/mentorship/ npm run build
```

On Windows, use `set "VITE_BASE=/mentorship/" && npm run build` in Command Prompt, or `$env:VITE_BASE="/mentorship/"; npm run build` in PowerShell.

Then copy the contents of `dist/` into that folder on the web server. Links, images and the router all follow the path you set.

### Page addresses and refreshes

The portal uses normal addresses such as `/dashboard`. The web server must send any address that is not a real file to `index.html`, otherwise refreshing a page or opening a shared link shows a "not found" error.

- **Apache:** `public/.htaccess` is copied into `dist/` and does this already. If the site uses an alias, add a line such as `RewriteBase /mentorship/` after `RewriteEngine On`.
- **Nginx:**

  ```nginx
  location /mentorship/ {
    try_files $uri $uri/ /mentorship/index.html;
  }
  ```

- **IIS:** add a URL Rewrite rule that sends requests for missing files to `index.html`.
- **No server rules possible:** in `src/main.jsx`, replace `BrowserRouter` with `HashRouter` (both the import and the tag). Addresses then look like `/mentorship/#/dashboard` and need no server set-up.

## Sample data

Every name, number and pod in `src/data/` is sample data for the wireframe:

| File | Contents |
|---|---|
| `content.js` | Program wording: Vision and Mission (word for word from the deck), origin, pilot figures, five pillars, pod roles, survey figure, the four sessions |
| `frameworks.js` | The STAR, IDEA and GRAD guide content (deck slides 27–30) |
| `taxonomy.js` | Shared lists: the three frameworks and their colours, mentoring tracks, **mentor industries**, college departments |
| `mentors.js` | Mentor directory for the two portals |
| `problems.js` | Industry problem pool, tagged by department |
| `people.js` | The signed-in sample users and the mentor's Pod A |
| `pods.js` | 24 pods and 120 students for the impact dashboard |

Mentors are grouped by **industry** (Manufacturing, Energy, Construction, Chemical, Healthcare and Insurance, Information Technology, Product, Banking and Financial Services, and so on). Students, tutors and industry problems stay grouped by college **department**. To change either list, edit `MENTOR_INDUSTRIES`, `PROFILE_INDUSTRIES` or `DEPARTMENTS` in `taxonomy.js`.

## Connecting real data

The mentoring workflows and dashboard still read sample data from `src/data/`. The remaining connections are:

| Where | What to connect |
|---|---|
| `server/routes/authRoutes.js`, `server/controllers/authController.js` | Profile registration, password login and session lookup |
| `src/pages/StudentPortal.jsx`, `send` | Sending a mentor request; load mentors and problems from the API instead of `data/` |
| `src/pages/MentorPortal.jsx`, `accept`, `decline`, `undo`, `addProblem`, `recordSession`, `saveFeedback` and the step chips | The mentor's pod, requests, sessions and feedback |
| `src/pages/Dashboard.jsx` with `src/data/pods.js` | Pod records. The calculations in `src/lib/dashboard.js` take pods in the same shape as `pods.js`, so only the data source needs to change |

Each of these places has a comment starting `Wireframe:`.

## Settings

In `src/config.js`:

| Setting | Use |
|---|---|
| `SHOW_SAMPLE_LABELS` | Shows the "Sample view · illustrative data" labels and sample-data notes. Set to `false` when the portal goes live |
| `SHOW_ANNOTATIONS` | Shows the numbered callouts (1–4) on the mentor portal, as in the deck's sample portal |
| `PROGRAM_CONTACT_EMAIL` | Contact shown in the footer, a placeholder for now |
| `ROLE_HOME` | Which page each role opens after signing in |

## Look and feel

- Colours, fonts and spacing are CSS variables in `src/styles/tokens.css`. Navy `#1B2A4A` and gold `#E0A526` are the brand colours. Each framework has a fixed colour: STAR blue, IDEA amber, GRAD green.
- Fonts are Caladea (headings) and Carlito (text) from Google Fonts. They match Cambria and Calibri, which are the fallbacks. To host the fonts yourself, remove the links in `index.html` and add `@font-face` rules to `tokens.css`.
- Each page's styles sit next to it in `src/pages/`. Shared styles load first, so a page's own styles can adjust them.
- Layouts adapt from wide screens down to phones.

## Accessibility

- Every control works with the keyboard and shows a gold focus ring.
- Selections and toggles say whether they are on (`aria-pressed`), and results that change after an action are announced to screen readers.
- Colour is never the only signal: framework chips carry their names, and charts have a legend, labels and a table view.
- Each page sets its own browser tab title.
