import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Github, Linkedin, Twitter, MapPin, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import SkillsDetail from '../components/about/SkillsDetail';

type Profil = Database['public']['Tables']['profil']['Row'];

const AboutPage = () => {
  const [profileData, setProfileData] = useState<Profil | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data, error } = await supabase
          .from('profil')
          .select('*')
          .limit(1)
          .maybeSingle();
        
        if (error) throw error;
        setProfileData(data);
      } catch (error) {
        console.error('Profil verisi çekilemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const aboutParagraphs = profileData?.hakkimda
    ? profileData.hakkimda.split('\n').filter(p => p.trim() !== '')
    : [];

  return (
    <>
      <Helmet>
        <title>Hakkımda | {profileData?.isim || 'Hekimcan AKTAŞ'}</title>
        <meta 
          name="description" 
          content={profileData?.slogan || 'Kıdemli Yazılım Geliştirici Hekimcan AKTAŞ\'ın profesyonel özgeçmişi ve yazılım geliştirme deneyimleri.'} 
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-white/20 to-secondary-50/50 dark:from-primary-950/30 dark:via-gray-900/50 dark:to-secondary-950/30">
          <motion.div 
            className="absolute top-20 -left-20 w-72 h-72 bg-primary-200/20 dark:bg-primary-800/10 rounded-full blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200/20 dark:bg-secondary-800/10 rounded-full blur-3xl"
            animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
        </div>

        <div className="container-custom relative">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 text-transparent bg-clip-text mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Hakkımda
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {profileData?.slogan || 'Modern web teknolojileri ile yenilikçi çözümler geliştiriyorum.'}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Profil Fotoğrafı */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {loading ? (
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
              ) : (
                <div className="relative group">
                  {/* GÖRSEL KAPSAYICI */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow duration-500 bg-white dark:bg-gray-900">
                    {profileData?.resim_url ? (
                      <img 
                        src={profileData.resim_url} 
                        alt={profileData.isim} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-8xl font-extrabold tracking-wider">
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white/80 to-white/50">
                            HA
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Profil Bilgileri */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {profileData?.isim || 'Hekimcan AKTAŞ'}
                    </h2>
                    <p className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 text-transparent bg-clip-text">
                      {profileData?.unvan || 'Kıdemli Yazılım Geliştirici'}
                    </p>
                  </div>

                  <div className="flex flex-col space-y-2">
                    {profileData?.konum && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <MapPin size={18} className="mr-2" />
                        <span>{profileData.konum}</span>
                      </div>
                    )}
                    {profileData?.email && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Mail size={18} className="mr-2" />
                        <a 
                          href={`mailto:${profileData.email}`}
                          className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          {profileData.email}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="prose prose-lg dark:prose-invert">
                    {aboutParagraphs.map((paragraph, index) => (
                      <motion.p 
                        key={index}
                        className="text-gray-700 dark:text-gray-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      >
                        {paragraph}
                      </motion.p>
                    ))}
                  </div>

                  {(profileData?.linkedin_url || profileData?.github_url || profileData?.twitter_url) && (
                    <div className="flex items-center gap-4 pt-4">
                      {profileData?.github_url && (
                        <a 
                          href={profileData.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                          aria-label="GitHub"
                        >
                          <Github size={24} />
                        </a>
                      )}
                      {profileData?.linkedin_url && (
                        <a 
                          href={profileData.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                          aria-label="LinkedIn"
                        >
                          <Linkedin size={24} />
                        </a>
                      )}
                      {profileData?.twitter_url && (
                        <a 
                          href={profileData.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                          aria-label="Twitter"
                        >
                          <Twitter size={24} />
                        </a>
                      )}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <SkillsDetail />
    </>
  );
};

export default AboutPage;
