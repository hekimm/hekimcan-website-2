"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { NavLink, Link } from "react-router-dom"
import { Moon, Sun, Menu, X, Sparkles } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"
import { motion, AnimatePresence } from "framer-motion"

// Mouse Following Nav Link Component
const MouseFollowNavLink = ({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const linkRef = useRef<HTMLAnchorElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      setMousePosition({ x: x * 0.1, y: y * 0.1 })
    }
  }

  return (
    <NavLink
      ref={linkRef}
      to={to}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setMousePosition({ x: 0, y: 0 })
      }}
      className={({ isActive }) =>
        `relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg overflow-hidden group ${
          isActive ? "text-white" : "text-gray-700 dark:text-gray-300 hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Animated Background */}
          <motion.div
            className={`absolute inset-0 rounded-lg transition-all duration-300 ${
              isActive
                ? "bg-gradient-to-r from-blue-500 via-purple-500 to-blue-700"
                : "bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-700/0 group-hover:from-blue-500/80 group-hover:via-purple-500/80 group-hover:to-blue-700/80"
            }`}
            animate={{
              x: mousePosition.x,
              y: mousePosition.y,
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
          />

          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
            }}
            animate={{
              x: isHovered ? ["-100%", "100%"] : "-100%",
            }}
            transition={{
              repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
              duration: 1.5,
              ease: "linear",
            }}
          />

          {/* Ripple Effect */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 rounded-lg bg-white/20"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}

          {/* Text */}
          <motion.span
            className="relative z-10"
            animate={{
              x: mousePosition.x * 0.2,
              y: mousePosition.y * 0.2,
            }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
          >
            {label}
          </motion.span>
        </>
      )}
    </NavLink>
  )
}

// Mouse Following Theme Toggle
const MouseFollowThemeToggle = ({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      setMousePosition({ x: x * 0.15, y: y * 0.15 })
    }
  }

  return (
    <motion.button
      ref={buttonRef}
      onClick={toggleTheme}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setMousePosition({ x: 0, y: 0 })
      }}
      className="relative p-3 rounded-full overflow-hidden group"
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
        scale: isHovered ? 1.1 : 1,
      }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      aria-label={theme === "dark" ? "Açık moda geç" : "Koyu moda geç"}
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        animate={{
          rotate: isHovered ? 360 : 0,
        }}
        transition={{
          repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
          duration: 3,
          ease: "linear",
        }}
      />

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 via-indigo-500/20 to-purple-500/20 blur-md scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        animate={{
          scale: isHovered ? [1.5, 2, 1.5] : 1.5,
        }}
        transition={{
          repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
          duration: 2,
          ease: "easeInOut",
        }}
      />

      {/* Icon */}
      <motion.div
        className="relative z-10 text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors duration-300"
        animate={{
          rotate: isHovered ? (theme === "dark" ? 180 : -180) : 0,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </motion.div>
    </motion.button>
  )
}

const Navbar = () => {
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navLinks = [
    { to: "/", label: "Ana Sayfa" },
    { to: "/hakkimda", label: "Hakkımda" },
    { to: "/projeler", label: "Projeler" },
    { to: "/egitim", label: "Eğitim" },
    { to: "/iletisim", label: "İletişim" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  return (
    <>
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {/* Animated Mesh Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-purple-50/20 to-pink-50/20 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10" />

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + (i % 3) * 5}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              x: [-5, 5, -5],
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 3 + i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl border-b border-white/20"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Glassmorphism Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 dark:from-gray-900/10 dark:via-gray-900/5 dark:to-gray-900/10 backdrop-blur-xl" />

        <div className="container-custom py-6 relative z-10">
          <div className="flex items-center justify-between">
            {/* Premium Logo */}
            <Link to="/" className="group relative">
              <motion.div
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                    ease: "linear",
                  }}
                />
                {/* Floating Icons */}
                <motion.div
                  className="absolute -top-2 -right-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    y: [-2, -8, -2],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles size={12} />
                </motion.div>
                Hekimcan AKTAŞ
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MouseFollowNavLink to={link.to} label={link.label} />
                </motion.div>
              ))}

              {/* Theme Toggle */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <MouseFollowThemeToggle theme={theme} toggleTheme={toggleTheme} />
              </motion.div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden space-x-2">
              <MouseFollowThemeToggle theme={theme} toggleTheme={toggleTheme} />

              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-white transition-colors duration-300 group overflow-hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
              >
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />

                {/* Icon */}
                <motion.div
                  className="relative z-10"
                  animate={{ rotate: isMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Premium Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden relative z-40"
          >
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl" />

            {/* Floating Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-32 h-32 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-xl"
                  style={{
                    left: `${i * 25}%`,
                    top: `${20 + (i % 2) * 40}%`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 4 + i,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            <nav className="container-custom py-6 relative z-10">
              <div className="flex flex-col space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <MouseFollowNavLink to={link.to} label={link.label} onClick={() => setIsMenuOpen(false)} />
                  </motion.div>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
