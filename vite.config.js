import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// If the portal is served from a sub-path of the college site, set VITE_BASE
// when building, for example:  VITE_BASE=/mentorship/ npm run build
// The value is tidied to the form Vite expects, with a slash at each end.
const base = `/${process.env.VITE_BASE || ''}/`.replace(/\/+/g, '/');

export default defineConfig({
  base,
  plugins: [react()],
});
