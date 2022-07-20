import { useEffect } from 'react';

export default function TopScroll() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
}
