"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ExternalLink, Github, Star, Search, Grid, List } from "lucide-react"
import { supabase } from "../../lib/supabase"
import type { Database } from "../../lib/database.types"

type Proje = Database["public"]["Tables"]["projeler"]["Row"]

// Mouse Following Button Component
const MouseFollowButton = ({ children, className = "", href, onClick, ...props }: any) => {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseX = useSpring(x)
  const mouseY = useSpring(y)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.15)
    y.set((e.clientY - centerY) * 0.15)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const Component = href ? "a" : "button"

  return (
    <motion.div
      className="relative inline-block"
      style={{ x: mouseX, y: mouseY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Component
        ref={ref}
        href={href}
        target={href ? "_blank" : undefined}
        rel={href ? "noopener noreferrer" : undefined}
        onClick={onClick}
        className={`relative overflow-hidden ${className}`}
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
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
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
      </Component>
    </motion.div>
  )
}

// Premium Search Bar Component
const PremiumSearchBar = ({
  searchTerm,
  setSearchTerm,
}: { searchTerm: string; setSearchTerm: (term: string) => void }) => {
  return (
    <motion.div
      className="relative max-w-md mx-auto mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Proje ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
        />

        {/* Animated border */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-focus-within:opacity-100"
          style={{ padding: "2px" }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>
    </motion.div>
  )
}

// Premium View Toggle Component
const PremiumViewToggle = ({
  viewMode,
  setViewMode,
}: { viewMode: "grid" | "list"; setViewMode: (mode: "grid" | "list") => void }) => {
  return (
    <motion.div
      className="flex justify-center mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex bg-white/10 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl p-1 border border-white/20 dark:border-gray-700/30">
        <motion.button
          onClick={() => setViewMode("grid")}
          className={`flex items-center px-4 py-2 rounded-xl transition-all duration-300 ${
            viewMode === "grid"
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Grid size={18} className="mr-2" />
          <span className="font-medium">Grid</span>
        </motion.button>

        <motion.button
          onClick={() => setViewMode("list")}
          className={`flex items-center px-4 py-2 rounded-xl transition-all duration-300 ${
            viewMode === "list"
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <List size={18} className="mr-2" />
          <span className="font-medium">List</span>
        </motion.button>
      </div>
    </motion.div>
  )
}

// Premium Project Card Component
const PremiumProjectCard = ({
  project,
  index,
  viewMode,
}: { project: Proje; index: number; viewMode: "grid" | "list" }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]))
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]))

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || viewMode === "list") return
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

  if (viewMode === "list") {
    return (
      <motion.div
        className="group relative mb-6"
        variants={{
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 },
        }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
        <div className="flex bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
          {/* Image */}
          <div className="relative w-80 h-48 overflow-hidden">
            <motion.img
              src={project.gorsel_url}
              alt={project.baslik}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
            />

            {project.one_cikan && (
              <div className="absolute top-4 left-4">
                <div className="flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg">
                  <Star size={12} className="text-white mr-1.5" />
                  <span className="text-xs font-bold text-white">Featured</span>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{project.baslik}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{project.aciklama}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.teknolojiler.map((tech, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              {project.github_url && (
                <MouseFollowButton
                  href={project.github_url}
                  className="flex items-center px-6 py-3 rounded-full text-white font-medium group"
                >
                  <Github size={18} className="mr-2" />
                  <span>GitHub</span>
                </MouseFollowButton>
              )}

              {project.canli_demo_url && (
                <MouseFollowButton
                  href={project.canli_demo_url}
                  className="flex items-center px-6 py-3 rounded-full text-white font-medium group"
                >
                  <ExternalLink size={18} className="mr-2" />
                  <span>Demo</span>
                </MouseFollowButton>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    )
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
                  className="flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-lg text-white font-medium group"
                >
                  <Github size={16} className="mr-2" />
                  <span>GitHub</span>
                </MouseFollowButton>
              )}

              {project.canli_demo_url && (
                <MouseFollowButton
                  href={project.canli_demo_url}
                  className="flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-lg text-white font-medium group"
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

const ProjectsGrid = () => {
  const [projects, setProjects] = useState<Proje[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [error, setError] = useState<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase.from("projeler").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setProjects(data || [])
      } catch (error) {
        setError(error)
        console.error("Projeler çekilemedi:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchTerm === "" ||
      project.baslik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.aciklama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.teknolojiler.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesSearch
  })

  return (
    <section className="relative py-20">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:via-blue-900/10" />

        {/* Floating background elements */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute bottom-40 right-32 w-40 h-40 bg-gradient-to-r from-pink-400/10 to-orange-400/10 rounded-full blur-2xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </div>

      <div ref={containerRef} className="relative z-10 container mx-auto px-6">
        {/* Controls */}
        <div className="mb-12">
          <PremiumSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <PremiumViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>

        {/* Projects */}
        {loading ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={
                  viewMode === "grid"
                    ? "h-[500px] rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 animate-pulse"
                    : "h-48 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 animate-pulse"
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
            ))}
          </div>
        ) : (
          <motion.div
            className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}
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
            {filteredProjects.map((project, index) => (
              <PremiumProjectCard key={project.id} project={project} index={index} viewMode={viewMode} />
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {filteredProjects.length === 0 && !loading && (
          <motion.div className="text-center py-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6">
              <Search className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {searchTerm ? "Arama sonucu bulunamadı" : "Henüz proje eklenmemiş"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm
                ? "Farklı anahtar kelimeler deneyebilir veya arama terimini temizleyebilirsiniz."
                : "Yakında harika projeler burada görünecek."}
            </p>

            {searchTerm && (
              <motion.button
                onClick={() => setSearchTerm("")}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Aramayı Temizle
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Project count */}
        {!loading && filteredProjects.length > 0 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-blue-600 dark:text-blue-400">{filteredProjects.length}</span> proje
              gösteriliyor
              {searchTerm && (
                <>
                  {" "}
                  <span className="font-medium">"{searchTerm}"</span> için
                </>
              )}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default ProjectsGrid
