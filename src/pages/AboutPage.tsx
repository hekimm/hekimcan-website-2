"use client"

import { Helmet } from "react-helmet"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import type { Database } from "../lib/database.types"
import AboutContent from "../components/about/AboutContent"
import SkillsDetail from "../components/about/SkillsDetail"

type Profil = Database["public"]["Tables"]["profil"]["Row"]

const AboutPage = () => {
  const [profileData, setProfileData] = useState<Profil | null>(null)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data, error } = await supabase.from("profil").select("*").limit(1).maybeSingle()

        if (error) throw error
        setProfileData(data)
      } catch (error) {
        console.error("Profil verisi çekilemedi:", error)
      }
    }

    fetchProfileData()
  }, [])

  return (
    <>
      <Helmet>
        <title>Hakkımda | {profileData?.isim || "Hekimcan AKTAŞ"}</title>
        <meta
          name="description"
          content={
            profileData?.slogan ||
            "Junior Yazılım Geliştirici Hekimcan AKTAŞ'ın  özgeçmişi ve yazılım geliştirme deneyimleri."
          }
        />
      </Helmet>

      <div>
        {/* About Content with Apple-style sticky stepper */}
        <AboutContent />

        {/* Skills Section */}
        <SkillsDetail />
      </div>
    </>
  )
}

export default AboutPage
