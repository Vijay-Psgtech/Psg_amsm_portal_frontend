import { useEffect } from 'react';

const SITE = 'Mentor – Mentee Program · PSG Tech';

/** Sets the browser tab title for the current page. */
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : SITE;
  }, [title]);
}
