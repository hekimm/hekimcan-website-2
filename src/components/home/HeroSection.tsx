import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';
import CodeEditor from './CodeEditor';

type Profil = Database['public']['Tables']['profil']['Row'];

const HeroSection = () => {
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

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Dinamik Arkaplan */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 -left-20 w-72 h-72 bg-primary-200/20 dark:bg-primary-800/10 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200/20 dark:bg-secondary-800/10 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Sol taraf - metin içeriği */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {loading ? (
              <div className="space-y-6">
                <div className="h-12 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                <div className="h-12 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              </div>
            ) : (
              <>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  {profileData?.isim || 'Hekimcan AKTAŞ'}
                </h1>
                <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 text-transparent bg-clip-text mb-6">
                  {profileData?.unvan || 'Kıdemli Yazılım Geliştirici'}
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl lg:max-w-none mx-auto lg:mx-0">
                  {profileData?.slogan || 'Modern web teknolojileri ile yenilikçi çözümler geliştiriyorum. Kullanıcı deneyimini ön planda tutan, performanslı ve güvenli yazılımlar oluşturuyorum.'}
                </p>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <Link 
                    to="/projeler" 
                    className="btn-primary group"
                  >
                    <span>Projelerimi Gör</span>
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                  <Link 
                    to="/iletisim" 
                    className="btn-outline"
                  >
                    İletişime Geç
                  </Link>
                </div>
                <div className="flex items-center space-x-4 mt-8 justify-center lg:justify-start">
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
              </>
            )}
          </motion.div>

          {/* Sağ taraf - VS Code Editor */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <CodeEditor />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;