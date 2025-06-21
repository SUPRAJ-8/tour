import React, { useEffect, useState } from 'react';

// Simple full-page loading overlay that shows an animated spinner and a
// smoothly increasing percentage (0-100%).
export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  // Increment the percentage until it reaches 95. The last jump to 100 will be
  // triggered when the parent component unmounts this screen.
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p < 95 ? p + 1 : p));
    }, 25); // ~2.5s to reach 95%

    // Apply blur to the whole UI until loading finishes.
    document.body.classList.add('blurred');

    return () => {
      clearInterval(interval);
      document.body.classList.remove('blurred');
    };
  }, []);

  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="loading-spinner" />
      <span className="loading-percent">{progress}%</span>
    </div>
  );
}
