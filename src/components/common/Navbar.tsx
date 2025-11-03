import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const headerRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Apple-style Header */}
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-black/10 dark:border-white/10'
          : 'bg-transparent'
          }`}
      >
        <div className="max-w-[980px] mx-auto px-6">
          <div className="flex items-center justify-between h-11">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                to="/"
                className="flex items-center hover:opacity-70 transition-opacity"
              >
                <span className="text-lg font-semibold text-black dark:text-white">
                  Hekimcan AKTAŞ
                </span>
              </Link>
            </div>

            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-xs font-normal text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 transition-colors"
              >
                Ana Sayfa
              </Link>
              <Link
                to="/hakkimda"
                className="text-xs font-normal text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 transition-colors"
              >
                Hakkımda
              </Link>
              <Link
                to="/projeler"
                className="text-xs font-normal text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 transition-colors"
              >
                Projeler
              </Link>
              <Link
                to="/egitim"
                className="text-xs font-normal text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 transition-colors"
              >
                Eğitim
              </Link>
              <Link
                to="/iletisim"
                className="text-xs font-normal text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 transition-colors"
              >
                İletişim
              </Link>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                to="/iletisim"
                className="hidden sm:inline-flex items-center text-xs font-normal text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 transition-colors"
              >
                İletişim
              </Link>

              {/* Apple-style Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label={theme === 'dark' ? 'Açık moda geç' : 'Koyu moda geç'}
              >
                {theme === 'dark' ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" className="text-black dark:text-white">
                    <path
                      fill="currentColor"
                      d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"
                    />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" className="text-black dark:text-white">
                    <path
                      fill="currentColor"
                      d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"
                    />
                  </svg>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden hover:opacity-70 transition-opacity"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <svg width="18" height="18" viewBox="0 0 18 18" className="text-black dark:text-white">
                    <path
                      fill="currentColor"
                      d="M9.7 9L16.85 1.85C17.04 1.66 17.04 1.34 16.85 1.15C16.66 0.96 16.34 0.96 16.15 1.15L9 8.3L1.85 1.15C1.66 0.96 1.34 0.96 1.15 1.15C0.96 1.34 0.96 1.66 1.15 1.85L8.3 9L1.15 16.15C0.96 16.34 0.96 16.66 1.15 16.85C1.25 16.95 1.37 17 1.5 17C1.63 17 1.75 16.95 1.85 16.85L9 9.7L16.15 16.85C16.25 16.95 16.37 17 16.5 17C16.63 17 16.75 16.95 16.85 16.85C17.04 16.66 17.04 16.34 16.85 16.15L9.7 9Z"
                    />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" className="text-black dark:text-white">
                    <path
                      fill="currentColor"
                      d="M1.5 4.5H16.5C16.78 4.5 17 4.28 17 4C17 3.72 16.78 3.5 16.5 3.5H1.5C1.22 3.5 1 3.72 1 4C1 4.28 1.22 4.5 1.5 4.5ZM16.5 8.5H1.5C1.22 8.5 1 8.72 1 9C1 9.28 1.22 9.5 1.5 9.5H16.5C16.78 9.5 17 9.28 17 9C17 8.72 16.78 8.5 16.5 8.5ZM16.5 13.5H1.5C1.22 13.5 1 13.72 1 14C1 14.28 1.22 14.5 1.5 14.5H16.5C16.78 14.5 17 14.28 17 14C17 13.72 16.78 13.5 16.5 13.5Z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-black md:hidden">
          {/* Mobile Header with Close Button */}
          <div className="flex items-center justify-between h-11 px-6 border-b border-black/10 dark:border-white/10">
            <span className="text-lg font-semibold text-black dark:text-white">Hekimcan AKTAŞ</span>
            <button
              className="hover:opacity-70 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" className="text-black dark:text-white">
                <path
                  fill="currentColor"
                  d="M9.7 9L16.85 1.85C17.04 1.66 17.04 1.34 16.85 1.15C16.66 0.96 16.34 0.96 16.15 1.15L9 8.3L1.85 1.15C1.66 0.96 1.34 0.96 1.15 1.15C0.96 1.34 0.96 1.66 1.15 1.85L8.3 9L1.15 16.15C0.96 16.34 0.96 16.66 1.15 16.85C1.25 16.95 1.37 17 1.5 17C1.63 17 1.75 16.95 1.85 16.85L9 9.7L16.15 16.85C16.25 16.95 16.37 17 16.5 17C16.63 17 16.75 16.95 16.85 16.85C17.04 16.66 17.04 16.34 16.85 16.15L9.7 9Z"
                />
              </svg>
            </button>
          </div>

          <div className="pt-8 px-6">
            <nav className="space-y-6">
              <Link
                to="/"
                className="block text-2xl font-light text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
              <Link
                to="/hakkimda"
                className="block text-2xl font-light text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hakkımda
              </Link>
              <Link
                to="/projeler"
                className="block text-2xl font-light text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Projeler
              </Link>
              <Link
                to="/egitim"
                className="block text-2xl font-light text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Eğitim
              </Link>
              <Link
                to="/iletisim"
                className="block text-2xl font-light text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                İletişim
              </Link>

              {/* Mobile Theme Toggle */}
              <div className="pt-8 space-y-4">
                <Link
                  to="/iletisim"
                  className="block text-lg font-light text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  İletişim
                </Link>
                <button
                  onClick={() => {
                    toggleTheme();
                    setIsMobileMenuOpen(false);
                  }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gray-100 dark:bg-gray-900 text-black dark:text-white rounded-full text-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                >
                  {theme === 'dark' ? (
                    <>
                      <svg width="20" height="20" viewBox="0 0 16 16" className="text-black dark:text-white">
                        <path
                          fill="currentColor"
                          d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"
                        />
                      </svg>
                      <span>Açık Mod</span>
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 16 16" className="text-black dark:text-white">
                        <path
                          fill="currentColor"
                          d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"
                        />
                      </svg>
                      <span>Koyu Mod</span>
                    </>
                  )}
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar
