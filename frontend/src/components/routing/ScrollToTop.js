import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ScrollToTop component ensures each navigation starts from the top of the page
// Using React Router's location to detect path changes.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the very top-left of the window on every route change
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null; // This component doesn\'t render anything
};

export default ScrollToTop;
