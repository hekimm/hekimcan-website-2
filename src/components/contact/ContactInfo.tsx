"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { Mail, MapPin, Phone, Github, Linkedin, Twitter, ExternalLink } from "lucide-react"
import { supabase } from "../../lib/supabase"

interface ContactInfo {
  contact_address: string
  contact_email: string
  contact_phone: string
  social_links: {
    github?: string
    linkedin?: string
    twitter?: string
  }
}

// Mouse Following Social Link Component
const MouseFollowSocialLink = ({ href, icon: Icon, label, color }: any) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const linkRef = useRef<HTMLAnchorElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 200, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 200, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      setMousePosition({ x, y })
      mouseX.set(x * 0.2)
      mouseY.set(y * 0.2)
    }
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.a
      ref={linkRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      <div
        className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:shadow-2xl overflow-hidden`}
      >
        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(255, 255, 255, 0.3)",
              "0 0 0 8px rgba(255, 255, 255, 0)",
              "0 0 0 0 rgba(255, 255, 255, 0)",
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-30"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
          }}
        />

        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <Icon size={24} />
        </motion.div>
      </div>
    </motion.a>
  )
}

const ContactInfo = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const { data, error } = await supabase
          .from("footer_settings")
          .select("contact_address, contact_email, contact_phone, social_links")
          .limit(1)
          .single()

        if (error) throw error
        setContactInfo(data)
      } catch (error) {
        console.error("İletişim bilgileri yüklenemedi:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContactInfo()
  }, [])

  if (loading) {
    return (
      <motion.div
        className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-3xl p-8 border border-white/20 dark:border-gray-700/20 shadow-2xl"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-pulse"></div>
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Glassmorphism container */}
      <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-3xl p-8 border border-white/20 dark:border-gray-700/20 shadow-2xl">
        {/* Animated border */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 p-[1px]">
          <div className="w-full h-full rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl" />
        </div>

        <div className="relative z-10">
          <motion.h3
            className="text-3xl font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              İletişim Bilgileri
            </span>
          </motion.h3>

          <div className="space-y-8">
            {/* Email */}
            <motion.div
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg">
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20"
                  animate={{
                    background: [
                      "linear-gradient(45deg, transparent, rgba(59,130,246,0.3), transparent)",
                      "linear-gradient(45deg, transparent, rgba(59,130,246,0.3), transparent)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />

                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Mail size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">E-posta</h4>
                    <a
                      href={`mailto:${contactInfo?.contact_email}`}
                      className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group"
                    >
                      {contactInfo?.contact_email}
                      <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200/50 dark:border-green-700/50 backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg">
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20"
                  animate={{
                    background: [
                      "linear-gradient(45deg, transparent, rgba(34,197,94,0.3), transparent)",
                      "linear-gradient(45deg, transparent, rgba(34,197,94,0.3), transparent)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />

                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Phone size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Telefon</h4>
                    <a
                      href={`tel:${contactInfo?.contact_phone?.replace(/\s/g, "")}`}
                      className="text-lg font-medium text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-2 group"
                    >
                      {contactInfo?.contact_phone}
                      <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Location */}
            <motion.div
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200/50 dark:border-purple-700/50 backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg">
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20"
                  animate={{
                    background: [
                      "linear-gradient(45deg, transparent, rgba(147,51,234,0.3), transparent)",
                      "linear-gradient(45deg, transparent, rgba(147,51,234,0.3), transparent)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />

                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <MapPin size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Konum</h4>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{contactInfo?.contact_address}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Social Media */}
          <motion.div
            className="mt-12 pt-8 border-t border-gray-200/50 dark:border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-6">Sosyal Medya</h4>
            <div className="flex gap-4">
              {contactInfo?.social_links?.github && (
                <MouseFollowSocialLink
                  href={contactInfo.social_links.github}
                  icon={Github}
                  label="Github"
                  color="from-gray-700 to-gray-900"
                />
              )}
              {contactInfo?.social_links?.linkedin && (
                <MouseFollowSocialLink
                  href={contactInfo.social_links.linkedin}
                  icon={Linkedin}
                  label="LinkedIn"
                  color="from-blue-600 to-blue-800"
                />
              )}
              {contactInfo?.social_links?.twitter && (
                <MouseFollowSocialLink
                  href={contactInfo.social_links.twitter}
                  icon={Twitter}
                  label="Twitter"
                  color="from-sky-500 to-sky-700"
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default ContactInfo
