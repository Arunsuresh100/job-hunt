import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Only show if user has scrolled past ~5 items (> 450px)
      if (currentScrollY < 450) {
        setIsVisible(false);
      } else {
        // Show ONLY when scrolling UP; hide when scrolling DOWN
        if (currentScrollY < lastScrollY.current - 5) {
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY.current + 5) {
          setIsVisible(false);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setIsVisible(false);
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      title="Scroll to Top"
      aria-label="Scroll to Top"
      className={`fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-emerald-500 text-black border border-emerald-400 shadow-xl shadow-emerald-500/30 hover:bg-emerald-400 hover:scale-110 active:scale-95 flex items-center justify-center group transition-all duration-300 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-6 scale-90 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-black stroke-[2.5] transform group-hover:-translate-y-0.5 transition-transform duration-200" />
    </button>
  );
};

export default ScrollToTop;
