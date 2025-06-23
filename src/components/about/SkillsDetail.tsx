"use client"

import { useRef } from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import type { Database } from "../../lib/database.types"
import { supabase } from "../../lib/supabase"
import { Sparkles, Code2, Zap, Star } from "lucide-react"

type Skill = Database["public"]["Tables"]["yetenekler"]["Row"]

const SkillsDetail = () => {
  const [skills, setSkills] = useState<Skill[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const skillsRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(skillsRef, { once: true, margin: "-100px" })

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data, error } = await supabase.from("yetenekler").select("*").order("created_at", { ascending: true })

        if (error) throw error

        if (data) {
          setSkills(data)
          const uniqueCategories = [...new Set(data.map((skill) => skill.kategori))]
          setCategories(uniqueCategories)
          setActiveCategory(uniqueCategories[0] || "")
        }
      } catch (error) {
        console.error("Error fetching skills:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  const filteredSkills = activeCategory ? skills.filter((skill) => skill.kategori === activeCategory) : skills

  // Category color mapping
  const getCategoryColor = (category: string) => {
    const colors = {
      Frontend: "from-blue-500 to-cyan-500",
      Backend: "from-green-500 to-emerald-500",
      Database: "from-purple-500 to-violet-500",
      DevOps: "from-orange-500 to-red-500",
      Mobile: "from-pink-500 to-rose-500",
      Tools: "from-indigo-500 to-blue-500",
    }
    return colors[category as keyof typeof colors] || "from-gray-500 to-gray-600"
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const staggerItem = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0, 1],
      },
    },
  }

  return (
    <section ref={skillsRef} className="relative py-32 overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/20 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/5" />

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-r from-blue-400/15 to-purple-400/15 dark:from-blue-600/8 dark:to-purple-600/8 rounded-full blur-3xl"
          animate={{
            x: [0, 80, 0],
            y: [0, -60, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-l from-purple-400/20 to-pink-400/20 dark:from-purple-600/10 dark:to-pink-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 80, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-32 left-16 text-blue-400/20 dark:text-blue-400/10"
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <Code2 size={28} />
      </motion.div>
      <motion.div
        className="absolute top-48 right-24 text-purple-400/20 dark:text-purple-400/10"
        animate={{ y: [0, -15, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
      >
        <Sparkles size={24} />
      </motion.div>
      <motion.div
        className="absolute bottom-48 left-32 text-pink-400/20 dark:text-pink-400/10"
        animate={{ y: [0, -25, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 4 }}
      >
        <Zap size={22} />
      </motion.div>

      <div className="container-custom relative">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: [0.25, 0.25, 0, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/10 dark:to-purple-400/10 border border-blue-200/20 dark:border-blue-700/20 text-sm font-medium text-blue-700 dark:text-blue-300 backdrop-blur-sm mb-6">
            <Star size={14} />
            Teknik Uzmanlık
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 text-transparent bg-clip-text">
              Yetenekler & Teknolojiler
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Modern yazılım geliştirme süreçlerinde kullandığım teknolojiler ve uzmanlaştığım alanlar
          </p>
        </motion.div>

        {/* Category Filters */}
        {!loading && categories.length > 0 && (
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative px-8 py-4 rounded-2xl text-sm font-semibold transition-all duration-500 overflow-hidden group ${
                  activeCategory === category
                    ? "text-white shadow-2xl scale-105"
                    : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/50 dark:hover:border-gray-600/50 backdrop-blur-sm hover:scale-105"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {activeCategory === category && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(category)} rounded-2xl`}
                    layoutId="activeCategory"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{category}</span>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Skills Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  variants={staggerItem}
                  className="group relative"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 dark:from-blue-600/10 dark:via-purple-600/10 dark:to-pink-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />

                  {/* Main card */}
                  <div className="relative bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 group-hover:border-gray-300/50 dark:group-hover:border-gray-600/50 shadow-lg group-hover:shadow-2xl transition-all duration-500 overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-400/5 dark:to-purple-400/5 rounded-full blur-2xl transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700" />

                    <div className="relative">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                          <img
                            src={skill.ikon_url || "/placeholder.svg"}
                            alt={skill.isim}
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            {skill.isim}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{skill.aciklama}</p>
                        </div>
                      </div>

                      {/* Category badge */}
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/10 dark:to-purple-400/10 text-xs font-medium text-blue-700 dark:text-blue-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
                        {skill.kategori}
                      </div>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  )
}

export default SkillsDetail
