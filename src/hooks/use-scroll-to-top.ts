import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ----------------------------------------------------------------------

export function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function useGetScrollToTop() {

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  }

  return scrollToTop;
}

