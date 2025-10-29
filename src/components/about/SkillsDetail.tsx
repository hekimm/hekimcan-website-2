"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Database } from "../../lib/database.types"
import { supabase } from "../../lib/supabase"

type Skill = Database["public"]["Tables"]["yetenekler"]["Row"]

const SkillsDetail = () => {
  const [skills, setSkills] = useState<Skill[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [loading, setLoading] = useState(true)

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

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        {/* Apple-style section header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.25, 0, 1] }}
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6">
            Yeteneklerim
          </h2>
          <p className="text-2xl md:text-3xl font-light text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
            Teknoloji yolculuğumda edindiğim uzmanlık alanları
          </p>
        </motion.div>

        {/* Category Filters - Apple Style */}
        {!loading && categories.length > 0 && (
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full text-base font-medium transition-all duration-300 ${activeCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                  }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Skills Grid - Apple Style */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 aspect-square shadow-sm border border-gray-200 dark:border-gray-800">
                  <div className="flex flex-col items-center justify-center h-full space-y-3">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, ease: [0.25, 0.25, 0, 1] }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
            >
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.4,
                    ease: [0.25, 0.25, 0, 1]
                  }}
                  className="group"
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 aspect-square shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700">
                    <div className="flex flex-col items-center justify-center h-full space-y-3 text-center">
                      {/* Icon */}
                      <motion.div
                        className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
                        whileHover={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={skill.ikon_url || "/placeholder.svg"}
                          alt={skill.isim}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const parent = target.parentElement
                            if (parent) {
                              parent.innerHTML = `<div class="text-lg font-semibold text-gray-400">${skill.isim.charAt(0)}</div>`
                            }
                          }}
                        />
                      </motion.div>

                      {/* Name */}
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                        {skill.isim}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Empty State */}
        {!loading && filteredSkills.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Bu kategoride yetenek bulunamadı
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Başka bir kategori seçmeyi deneyin
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default SkillsDetail
