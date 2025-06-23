"use client"

import { Helmet } from "react-helmet"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { Github, Linkedin, Twitter, MapPin, Mail, Download, ExternalLink, Sparkles, Code2, Zap } from "lucide-react"
import { supabase } from "../lib/supabase"
import type { Database } from "../lib/database.types"
import SkillsDetail from "../components/about/SkillsDetail"

type Profil = Database["public"]["Tables"]["profil"]["Row"]

const AboutPage = () => {
  const [profileData, setProfileData] = useState<Profil | null>(null)
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(heroRef, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6])

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
  }, [])

  const aboutParagraphs = profileData?.hakkimda ? profileData.hakkimda.split("\n").filter((p) => p.trim() !== "") : []

  // Floating elements animation variants
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, 0],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const staggerItem = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.25, 0, 1],
      },
    },
  }

  return (
    <>
      <Helmet>
        <title>Hakkımda | {profileData?.isim || "Hekimcan AKTAŞ"}</title>
        <meta
          name="description"
          content={
            profileData?.slogan ||
            "Kıdemli Yazılım Geliştirici Hekimcan AKTAŞ'ın profesyonel özgeçmişi ve yazılım geliştirme deneyimleri."
          }
        />
      </Helmet>

      <div ref={containerRef} className="relative min-h-screen overflow-hidden">
        {/* Premium Background System */}
        <div className="fixed inset-0 -z-10">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/10" />

          {/* Mesh gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/5 to-pink-400/10 dark:from-blue-600/5 dark:via-purple-600/3 dark:to-pink-600/5" />

          {/* Animated gradient orbs */}
          <motion.div
            className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-blue-600/10 dark:to-purple-600/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 -right-40 w-96 h-96 bg-gradient-to-l from-purple-400/15 to-pink-400/15 dark:from-purple-600/8 dark:to-pink-600/8 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 100, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-t from-pink-400/10 to-orange-400/10 dark:from-pink-600/5 dark:to-orange-600/5 rounded-full blur-3xl"
            animate={{
              x: [0, -60, 0],
              y: [0, -40, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 18,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />

          {/* Radial gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_50%)]" />
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 text-blue-400/20 dark:text-blue-400/10"
          variants={floatingVariants}
          animate="animate"
        >
          <Code2 size={24} />
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 text-purple-400/20 dark:text-purple-400/10"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
        >
          <Sparkles size={20} />
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-20 text-pink-400/20 dark:text-pink-400/10"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 4 }}
        >
          <Zap size={18} />
        </motion.div>

        {/* Hero Section */}
        <section ref={heroRef} className="relative pt-32 pb-20">
          <div className="container-custom">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              className="text-center max-w-4xl mx-auto mb-20"
            >
              <motion.div variants={staggerItem} className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/10 dark:to-purple-400/10 border border-blue-200/20 dark:border-blue-700/20 text-sm font-medium text-blue-700 dark:text-blue-300 backdrop-blur-sm">
                  <Sparkles size={14} />
                  Profesyonel Profil
                </span>
              </motion.div>

              <motion.h1 variants={staggerItem} className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 text-transparent bg-clip-text">
                  Hakkımda
                </span>
              </motion.h1>

              <motion.p
                variants={staggerItem}
                className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light leading-relaxed"
              >
                {profileData?.slogan || "Modern web teknolojileri ile yenilikçi çözümler geliştiriyorum."}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Profile Section */}
        <section className="relative py-20">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Profile Image */}
              <motion.div
                className="relative group"
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.25, 0.25, 0, 1] }}
                style={{ y, opacity }}
              >
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 dark:from-blue-600/10 dark:via-purple-600/10 dark:to-pink-600/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700" />

                  {/* Main image container */}
                  <div className="relative aspect-square rounded-3xl overflow-hidden backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 shadow-2xl group-hover:shadow-4xl transition-all duration-700">
                    {loading ? (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse" />
                    ) : (
                      <>
                        {profileData?.resim_url ? (
                          <img
                            src={profileData.resim_url || "/placeholder.svg"}
                            alt={profileData.isim}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-600/10 dark:to-purple-600/10">
                            <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
                              HA
                            </div>
                          </div>
                        )}

                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      </>
                    )}
                  </div>

                  {/* Floating badges */}
                  <motion.div
                    className="absolute -top-4 -right-4 px-4 py-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white text-sm font-semibold shadow-lg backdrop-blur-sm"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    ✨ Available
                  </motion.div>
                </div>
              </motion.div>

              {/* Profile Info */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.25, 0.25, 0, 1], delay: 0.2 }}
              >
                {loading ? (
                  <div className="space-y-6 animate-pulse">
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2" />
                    <div className="space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-full" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Name and Title */}
                    <div className="space-y-4">
                      <motion.h2
                        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 text-transparent bg-clip-text"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                      >
                        {profileData?.isim || "Hekimcan AKTAŞ"}
                      </motion.h2>

                      <motion.div
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/10 dark:to-purple-400/10 border border-blue-200/20 dark:border-blue-700/20 backdrop-blur-sm"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
                        <span className="text-lg font-semibold bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-300 dark:to-purple-300 text-transparent bg-clip-text">
                          {profileData?.unvan || "Kıdemli Yazılım Geliştirici"}
                        </span>
                      </motion.div>
                    </div>

                    {/* Contact Info */}
                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                    >
                      {profileData?.konum && (
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 group hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                            <MapPin size={18} />
                          </div>
                          <span className="font-medium">{profileData.konum}</span>
                        </div>
                      )}
                      {profileData?.email && (
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 group hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                          <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                            <Mail size={18} />
                          </div>
                          <a href={`mailto:${profileData.email}`} className="font-medium hover:underline">
                            {profileData.email}
                          </a>
                        </div>
                      )}
                    </motion.div>

                    {/* About Text */}
                    <motion.div
                      className="space-y-6"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 }}
                    >
                      {aboutParagraphs.map((paragraph, index) => (
                        <motion.p
                          key={index}
                          className="text-lg leading-relaxed text-gray-700 dark:text-gray-300"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                        >
                          {paragraph}
                        </motion.p>
                      ))}

                      {aboutParagraphs.length === 0 && (
                        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                          Yazılım geliştirme alanında uzun yıllara dayanan deneyimim ile modern web teknolojilerini
                          kullanarak kullanıcı dostu, yüksek performanslı ve ölçeklenebilir uygulamalar geliştiriyorum.
                          Front-end ve back-end teknolojilerinde uzmanlaşmış bir yazılım geliştirici olarak, ekip
                          çalışmasına ve temiz kod prensibine büyük önem veriyorum.
                        </p>
                      )}
                    </motion.div>

                    {/* Social Links & Actions */}
                    <motion.div
                      className="flex flex-wrap items-center gap-4 pt-6"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 }}
                    >
                      {/* Social Links */}
                      <div className="flex items-center gap-3">
                        {profileData?.github_url && (
                          <a
                            href={profileData.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
                            aria-label="GitHub"
                          >
                            <Github size={20} />
                          </a>
                        )}
                        {profileData?.linkedin_url && (
                          <a
                            href={profileData.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                            aria-label="LinkedIn"
                          >
                            <Linkedin size={20} />
                          </a>
                        )}
                        {profileData?.twitter_url && (
                          <a
                            href={profileData.twitter_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-900/20 dark:hover:bg-sky-900/30 text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                            aria-label="Twitter"
                          >
                            <Twitter size={20} />
                          </a>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 ml-auto">
                        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                          <Download size={18} />
                          CV İndir
                        </button>
                        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                          <ExternalLink size={18} />
                          İletişim
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <SkillsDetail />
      </div>
    </>
  )
}

export default AboutPage
