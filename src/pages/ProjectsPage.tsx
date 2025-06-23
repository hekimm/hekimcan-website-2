"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Helmet } from "react-helmet"
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion"
import { ExternalLink, Github, Star, Code, Layers, Sparkles, Zap, ChevronDown } from "lucide-react"
import { supabase } from "../lib/supabase"
import type { Database } from "../lib/database.types"

type Proje = Database["public"]["Tables"]["projeler"]["Row"]

// Simple Mouse Scroll Indicator
const MouseScrollIndicator = () => {
  const { scrollY } = useScroll()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsVisible(latest < 100)
    })
    return unsubscribe
  }, [scrollY])

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: 2 }}
    >
      {/* Mouse */}
      <motion.div
        className="w-6 h-10 border-2 border-white/40 dark:border-gray-400/40 rounded-full mb-2 relative"
        whileHover={{ scale: 1.1 }}
      >
        <motion.div
          className="w-1 h-2 bg-white/60 dark:bg-gray-400/60 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, 6, 0],
            opacity: [1, 0.3, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Arrow */}
      <motion.div
        animate={{
          y: [0, 6, 0],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <ChevronDown className="w-5 h-5 text-white/60 dark:text-gray-400/60" />
      </motion.div>
    </motion.div>
  )
}

// Mouse Following Button Component
const MouseFollowButton = ({ children, className = "", href, ...props }: any) => {
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseX = useSpring(x)
  const mouseY = useSpring(y)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.1)
    y.set((e.clientY - centerY) * 0.1)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative overflow-hidden ${className}`}
      style={{ x: mouseX, y: mouseY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-100"
        animate={{
          background: [
            "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
            "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
          ],
          backgroundPosition: ["-200% 0", "200% 0"],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10">{children}</div>
    </motion.a>
  )
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Proje[]>([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase.from("projeler").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setProjects(data || [])
      } catch (error) {
        console.error("Projeler çekilemedi:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <>
      <Helmet>
        <title>Projeler | Hekimcan AKTAŞ</title>
        <meta name="description" content="Hekimcan AKTAŞ'ın geliştirdiği yazılım projeleri ve çalışmaları" />
      </Helmet>

      {/* Mouse Scroll Indicator */}
      <MouseScrollIndicator />

      {/* Premium Hero Section */}
      <motion.div
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Multi-layer animated background */}
        <div className="absolute inset-0">
          {/* Mesh gradient base */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />

          {/* Animated orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/30 to-orange-400/30 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1.2, 1, 1.2],
            }}
            transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />

          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23000&quot; fillOpacity=&quot;0.05&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] dark:opacity-20" />
        </div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-20 left-20 text-blue-500/20 dark:text-blue-400/20"
          animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <Code size={60} />
        </motion.div>

        <motion.div
          className="absolute bottom-32 right-32 text-purple-500/20 dark:text-purple-400/20"
          animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <Layers size={80} />
        </motion.div>

        <motion.div
          className="absolute top-40 right-40 text-pink-500/20 dark:text-pink-400/20"
          animate={{
            y: [-15, 15, -15],
            x: [-5, 5, -5],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <Sparkles size={40} />
        </motion.div>

        <motion.div
          className="absolute bottom-20 left-32 text-orange-500/20 dark:text-orange-400/20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <Zap size={50} />
        </motion.div>

        {/* Main content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 dark:bg-gray-800/20 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 mb-6">
              <Sparkles className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                 Portfolio
              </span>
            </div>

            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Projelerim
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              Yaratıcılık ve teknolojinin buluştuğu noktada geliştirdiğim
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
                {" "}
                premium projeler
              </span>
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <div ref={containerRef} className="relative py-20">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:via-blue-900/10" />
        </div>

        <div className="relative z-10 container mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-[500px] rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 animate-pulse"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 },
                },
              }}
            >
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </motion.div>
          )}

          {projects.length === 0 && !loading && (
            <motion.div className="text-center py-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6">
                <Code className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Henüz proje eklenmemiş</h3>
              <p className="text-gray-600 dark:text-gray-400">Yakında harika projeler burada görünecek.</p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}

// Project Card Component
const ProjectCard = ({ project, index }: { project: Proje; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]))
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]))

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      className="group relative"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative h-[500px] rounded-3xl overflow-hidden bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 shadow-xl"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.2 },
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />

        {/* Featured badge */}
        {project.one_cikan && (
          <motion.div
            className="absolute top-6 left-6 z-20"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <div className="flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg">
              <Star size={12} className="text-white mr-1.5" />
              <span className="text-xs font-bold text-white">Featured</span>
            </div>
          </motion.div>
        )}

        {/* Image container */}
        <div className="relative h-64 overflow-hidden">
          <motion.img
            src={project.gorsel_url}
            alt={project.baslik}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          />

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
              {project.github_url && (
                <MouseFollowButton
                  href={project.github_url}
                  className="flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-lg text-white font-medium"
                >
                  <Github size={16} className="mr-2" />
                  <span>GitHub</span>
                </MouseFollowButton>
              )}

              {project.canli_demo_url && (
                <MouseFollowButton
                  href={project.canli_demo_url}
                  className="flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-lg text-white font-medium"
                >
                  <ExternalLink size={16} className="mr-2" />
                  <span>Demo</span>
                </MouseFollowButton>
              )}
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6 h-[236px] flex flex-col">
          <motion.h3
            className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2"
            style={{ transform: "translateZ(20px)" }}
          >
            {project.baslik}
          </motion.h3>

          <motion.p
            className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow"
            style={{ transform: "translateZ(10px)" }}
          >
            {project.aciklama}
          </motion.p>

          <motion.div className="flex flex-wrap gap-2" style={{ transform: "translateZ(15px)" }}>
            {project.teknolojiler.slice(0, 4).map((tech, i) => (
              <motion.span
                key={i}
                className="text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20"
                whileHover={{ scale: 1.05 }}
              >
                {tech}
              </motion.span>
            ))}
            {project.teknolojiler.length > 4 && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-500/10 text-gray-600 dark:text-gray-400">
                +{project.teknolojiler.length - 4}
              </span>
            )}
          </motion.div>
        </div>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
                "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
              ],
              backgroundPosition: ["-200% 0", "200% 0"],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default ProjectsPage
