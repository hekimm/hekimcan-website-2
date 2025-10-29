import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { to: '/', label: 'Ana Sayfa' },
    { to: '/hakkimda', label: 'Hakkımda' },
    { to: '/projeler', label: 'Projeler' },
    { to: '/egitim', label: 'Eğitim' },
    { to: '/iletisim', label: 'İletişim' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'nav-glass shadow-apple'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 100, 
        damping: 20,
        duration: 0.6 
      }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="group">
            <motion.div
              className="text-xl md:text-2xl font-semibold text-apple-gray-900 dark:text-apple-gray-50 tracking-tight"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              Hekimcan AKTAŞ
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium rounded-apple transition-all duration-300 ${
                      isActive
                        ? 'text-white bg-apple-blue shadow-apple'
                        : 'text-apple-gray-700 dark:text-apple-gray-300 hover:text-apple-blue hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </motion.div>
            ))}

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 ml-4 rounded-apple text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={theme === 'dark' ? 'Açık moda geç' : 'Koyu moda geç'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-2">
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-apple text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={theme === 'dark' ? 'Açık moda geç' : 'Koyu moda geç'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-apple text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden nav-glass border-t border-apple-gray-200/50 dark:border-apple-gray-700/50"
          >
            <nav className="container-custom py-4">
              <div className="flex flex-col space-y-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NavLink
                      to={link.to}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-3 text-base font-medium rounded-apple transition-all duration-300 ${
                          isActive
                            ? 'text-white bg-apple-blue shadow-apple'
                            : 'text-apple-gray-700 dark:text-apple-gray-300 hover:text-apple-blue hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar
