"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { ArrowRight, Github, Linkedin, Twitter, Play, Sparkles, ChevronDown } from "lucide-react"
import { Link } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import type { Database } from "../../lib/database.types"
import CodeEditor from "./CodeEditor"

type Profil = Database["public"]["Tables"]["profil"]["Row"]

// Mouse-following button component
const MouseFollowButton = ({ children, className, ...props }: any) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const buttonRef = useRef<HTMLAnchorElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      setMousePosition({ x: x * 0.1, y: y * 0.1 })
    }
  }

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 })
  }

  const springConfig = { damping: 25, stiffness: 700 }
  const x = useSpring(mousePosition.x, springConfig)
  const y = useSpring(mousePosition.y, springConfig)

  return (
    <motion.div
      ref={buttonRef}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative group"
    >
      <Link {...props} className={`${className} relative overflow-hidden`}>
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600"
          animate={{
            background: [
              "linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4)",
              "linear-gradient(45deg, #8b5cf6, #06b6d4, #3b82f6)",
              "linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6)",
            ],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          whileHover={{
            boxShadow: ["0 0 0 0 rgba(59, 130, 246, 0.7)", "0 0 0 20px rgba(59, 130, 246, 0)"],
          }}
          transition={{ duration: 0.6 }}
        />

        <span className="relative z-10">{children}</span>
      </Link>
    </motion.div>
  )
}

// Mouse-following social link component
const MouseFollowSocialLink = ({ href, icon, label, color }: any) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const linkRef = useRef<HTMLAnchorElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      setMousePosition({ x: x * 0.15, y: y * 0.15 })
    }
  }

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 })
  }

  const springConfig = { damping: 25, stiffness: 700 }
  const x = useSpring(mousePosition.x, springConfig)
  const y = useSpring(mousePosition.y, springConfig)

  return (
    <motion.div style={{ x, y }}>
      <a
        ref={linkRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative group w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden"
        aria-label={label}
      >
        {/* Animated background */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${color}`}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          whileHover={{
            boxShadow: ["0 0 0 0 rgba(255, 255, 255, 0.7)", "0 0 0 15px rgba(255, 255, 255, 0)"],
          }}
          transition={{ duration: 0.6 }}
        />

        {/* Icon */}
        <motion.div
          className="relative z-10 text-white"
          whileHover={{ scale: 1.2, rotate: 10 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {icon}
        </motion.div>
      </a>
    </motion.div>
  )
}

const HeroSection = () => {
  const [profileData, setProfileData] = useState<Profil | null>(null)
  const [loading, setLoading] = useState(true)
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)
  const { scrollY } = useScroll()

  // Parallax effects
  const y1 = useTransform(scrollY, [0, 300], [0, -50])
  const y2 = useTransform(scrollY, [0, 300], [0, -100])
  // const opacity = useTransform(scrollY, [0, 300], [1, 0])

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data, error } = await supabase.from("profil").select("*").limit(1).maybeSingle()

        if (error) throw error
        setProfileData(data)
      } catch (error) {
        console.error("Profil verisi çekilemedi:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()

    // Show scroll indicator after 2 seconds
    const timer = setTimeout(() => {
      setShowScrollIndicator(true)
    }, 2000)

    // Hide scroll indicator on scroll
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Premium Multi-layer Background */}
      <div className="absolute inset-0">
        {/* Base gradient with animation */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 25%, #e0e7ff 50%, #f1f5f9 100%)",
              "linear-gradient(135deg, #f1f5f9 0%, #e0e7ff 25%, #e0f2fe 50%, #f8fafc 100%)",
            ],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        {/* Dark mode gradient */}
        <motion.div
          className="absolute inset-0 dark:block hidden"
          animate={{
            background: [
              "linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #312e81 50%, #1e293b 100%)",
              "linear-gradient(135deg, #1e293b 0%, #312e81 25%, #1e293b 50%, #0f172a 100%)",
            ],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        {/* Animated floating orbs */}
        <motion.div className="absolute inset-0 opacity-40" style={{ y: y1 }}>
          <motion.div
            className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl"
            animate={{
              background: [
                "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(147,51,234,0.2) 50%, transparent 100%)",
                "radial-gradient(circle, rgba(147,51,234,0.3) 0%, rgba(6,182,212,0.2) 50%, transparent 100%)",
                "radial-gradient(circle, rgba(6,182,212,0.3) 0%, rgba(59,130,246,0.2) 50%, transparent 100%)",
              ],
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl"
            animate={{
              background: [
                "radial-gradient(circle, rgba(147,51,234,0.3) 0%, rgba(236,72,153,0.2) 50%, transparent 100%)",
                "radial-gradient(circle, rgba(236,72,153,0.3) 0%, rgba(59,130,246,0.2) 50%, transparent 100%)",
                "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(147,51,234,0.2) 50%, transparent 100%)",
              ],
              scale: [1, 1.3, 1],
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full blur-3xl"
            animate={{
              background: [
                "radial-gradient(circle, rgba(6,182,212,0.3) 0%, rgba(59,130,246,0.2) 50%, transparent 100%)",
                "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(147,51,234,0.2) 50%, transparent 100%)",
                "radial-gradient(circle, rgba(147,51,234,0.3) 0%, rgba(6,182,212,0.2) 50%, transparent 100%)",
              ],
              scale: [1, 1.1, 1],
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 4 }}
          />
        </motion.div>

        {/* Floating geometric patterns */}
        <motion.div className="absolute inset-0 opacity-10 dark:opacity-20" style={{ y: y2 }}>
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 border-2 border-blue-500/30 rounded-2xl"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <motion.div
            className="absolute top-40 right-32 w-24 h-24 border-2 border-purple-500/30 rounded-xl"
            animate={{
              rotate: [360, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-32 left-1/3 w-20 h-20 border-2 border-cyan-500/30 rounded-lg"
            animate={{
              rotate: [0, -360],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)]"
          style={{ backgroundSize: "30px 30px" }}
        />
      </div>

      <motion.div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-screen py-20">
          {/* Left Content - 7 columns */}
          <div className="lg:col-span-7 space-y-8">
            {/* Premium Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative inline-flex items-center gap-3 px-6 py-3 bg-white/10 dark:bg-gray-800/10 backdrop-blur-xl rounded-full border border-white/20 dark:border-gray-700/20 shadow-2xl"
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-blue-400/20 to-purple-400/20 rounded-full"
                animate={{
                  background: [
                    "linear-gradient(45deg, rgba(34,197,94,0.2), rgba(59,130,246,0.2), rgba(147,51,234,0.2))",
                    "linear-gradient(45deg, rgba(147,51,234,0.2), rgba(34,197,94,0.2), rgba(59,130,246,0.2))",
                    "linear-gradient(45deg, rgba(59,130,246,0.2), rgba(147,51,234,0.2), rgba(34,197,94,0.2))",
                  ],
                }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />

              {/* Floating sparkles */}
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3"
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <Sparkles className="w-3 h-3 text-yellow-400" />
              </motion.div>

              <motion.div
                className="w-3 h-3 bg-green-500 rounded-full relative z-10"
                animate={{
                  scale: [1, 1.2, 1],
                  boxShadow: ["0 0 0 0 rgba(34, 197, 94, 0.7)", "0 0 0 10px rgba(34, 197, 94, 0)"],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 relative z-10">
                Yeni projeler için müsait
              </span>
            </motion.div>

            {/* Premium Profile Image Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.25, 0, 1] }}
              className="relative w-32 h-32 mx-auto lg:mx-0 mb-8"
            >
              {/* Outer glow ring */}
              <motion.div
                className="absolute -inset-4 rounded-full opacity-60"
                animate={{
                  background: [
                    "conic-gradient(from 0deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)",
                    "conic-gradient(from 120deg, #8b5cf6, #06b6d4, #3b82f6, #8b5cf6)",
                    "conic-gradient(from 240deg, #06b6d4, #3b82f6, #8b5cf6, #06b6d4)",
                  ],
                }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />

              {/* Middle glow ring */}
              <motion.div
                className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-cyan-400/30 blur-md"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />

              {/* Floating particles around image */}
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                    style={{
                      left: `${50 + Math.cos((i * Math.PI * 2) / 8) * 60}%`,
                      top: `${50 + Math.sin((i * Math.PI * 2) / 8) * 60}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 0.8, 0],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              {/* Main image container */}
              <motion.div
                className="relative w-32 h-32 rounded-full overflow-hidden backdrop-blur-xl bg-white/10 dark:bg-gray-800/10 border border-white/20 dark:border-gray-700/20 shadow-2xl group cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {/* Shimmer overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 3,
                    ease: "easeInOut",
                  }}
                />

                {/* Profile Image */}
                {loading ? (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse" />
                ) : (
                  <>
                    {profileData?.resim_url ? (
                      <motion.img
                        src={profileData.resim_url}
                        alt={profileData.isim}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-600/20 dark:to-purple-600/20">
                        <motion.div
                          className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text"
                          animate={{
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                          }}
                          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          style={{ backgroundSize: "200% 200%" }}
                        >
                          HA
                        </motion.div>
                      </div>
                    )}

                    {/* Inner glow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </>
                )}

                {/* Status indicator */}
                <motion.div
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-800 shadow-lg flex items-center justify-center"
                  animate={{
                    scale: [1, 1.1, 1],
                    boxShadow: ["0 0 0 0 rgba(34, 197, 94, 0.7)", "0 0 0 8px rgba(34, 197, 94, 0)"],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                </motion.div>
              </motion.div>

              {/* Floating sparkles */}
              <motion.div
                className="absolute -top-2 -right-2 w-4 h-4"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400 opacity-80" />
              </motion.div>

              <motion.div
                className="absolute -bottom-2 -left-2 w-3 h-3"
                animate={{
                  rotate: [360, 0],
                  scale: [1, 1.3, 1],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
              >
                <Sparkles className="w-3 h-3 text-blue-400 opacity-60" />
              </motion.div>
            </motion.div>

            {/* Enhanced Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <motion.span
                  className="block text-gray-900 dark:text-white relative"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {loading ? "Hekimcan AKTAŞ" : profileData?.isim || "Hekimcan AKTAŞ"}

                  {/* Floating sparkles around name */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-6 h-6"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    <Sparkles className="w-6 h-6 text-yellow-400 opacity-60" />
                  </motion.div>
                </motion.span>

                <motion.span
                  className="block relative"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {/* Animated gradient text */}
                  <motion.span
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 text-transparent bg-clip-text"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    style={{ backgroundSize: "200% 200%" }}
                  >
                    {loading ? "Yazılım Geliştirici" : profileData?.unvan || "Yazılım Geliştirici"}
                  </motion.span>

                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear", delay: 1 }}
                  />
                </motion.span>
              </h1>
            </motion.div>

            {/* Enhanced Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl relative"
            >
              {loading
                ? "Modern web teknolojileri ile yenilikçi çözümler geliştiriyorum."
                : profileData?.slogan ||
                  "Modern web teknolojileri ile yenilikçi çözümler geliştiriyorum. Kullanıcı deneyimini ön planda tutan, performanslı ve güvenli yazılımlar oluşturuyorum."}

              {/* Floating accent */}
              <motion.div
                className="absolute -right-8 top-0 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-40"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
            </motion.p>

            {/* Premium CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <MouseFollowButton
                to="/projeler"
                className="group relative inline-flex items-center justify-center px-10 py-5 text-white font-bold rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-3 text-lg">
                  Projelerimi Keşfet
                  <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </span>
              </MouseFollowButton>

              <MouseFollowButton
                to="/iletisim"
                className="group relative inline-flex items-center justify-center px-10 py-5 bg-white/10 dark:bg-gray-800/10 backdrop-blur-xl text-gray-900 dark:text-white font-bold rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-2xl transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-3 text-lg">
                  <Play className="w-6 h-6" />
                  İletişime Geç
                </span>
              </MouseFollowButton>
            </motion.div>

            {/* Premium Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex items-center gap-6 pt-6"
            >
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Takip edin:</span>
              <div className="flex items-center gap-4">
                {profileData?.github_url && (
                  <MouseFollowSocialLink
                    href={profileData.github_url}
                    icon={<Github size={24} />}
                    label="GitHub"
                    color="from-gray-700 to-gray-900"
                  />
                )}
                {profileData?.linkedin_url && (
                  <MouseFollowSocialLink
                    href={profileData.linkedin_url}
                    icon={<Linkedin size={24} />}
                    label="LinkedIn"
                    color="from-blue-600 to-blue-800"
                  />
                )}
                {profileData?.twitter_url && (
                  <MouseFollowSocialLink
                    href={profileData.twitter_url}
                    icon={<Twitter size={24} />}
                    label="Twitter"
                    color="from-sky-400 to-sky-600"
                  />
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Content - 5 columns - Code Editor stays the same */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative"
            >
              <CodeEditor />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Premium Mouse Scroll Indicator */}
      {showScrollIndicator && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
        >
          {/* Floating particles around indicator */}
          <div className="relative">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                style={{
                  left: `${Math.cos((i * Math.PI * 2) / 6) * 20 + 10}px`,
                  top: `${Math.sin((i * Math.PI * 2) / 6) * 20 + 10}px`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Mouse icon */}
            <motion.div
              className="w-8 h-12 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center relative bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm"
              animate={{
                y: [0, 5, 0],
                boxShadow: ["0 0 0 0 rgba(59, 130, 246, 0.4)", "0 0 0 10px rgba(59, 130, 246, 0)"],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <motion.div
                className="w-1 h-3 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mt-2"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </motion.div>
          </div>

          {/* Chevron arrow */}
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6 text-gray-400 dark:text-gray-600" />
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}

export default HeroSection
