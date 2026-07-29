import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

const PageTransition = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <div key={pathname} className="animate-page-switch">
      {children}
    </div>
  );
};

export default PageTransition;
