import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type Profil = Database['public']['Tables']['profil']['Row'];

const AboutContent = () => {
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

  // Hakkımda içeriğini satırlara böl
  const aboutParagraphs = profileData?.hakkimda
    ? profileData.hakkimda.split('\n').filter(p => p.trim() !== '')
    : [];

  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Sol taraf - resim */}
          <motion.div 
            className="relative h-80 md:h-[500px] overflow-hidden rounded-2xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {loading ? (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-2xl" />
            ) : (
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg">
                {profileData?.resim_url ? (
                  <img 
                    src={profileData.resim_url} 
                    alt={profileData.isim} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <div className="text-6xl font-bold text-gray-400 dark:text-gray-600">
                      HA
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Sağ taraf - hakkımda içeriği */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Hakkımda
            </h2>
            
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                ))}
              </div>
            ) : (
              <div className="prose prose-lg dark:prose-invert">
                {aboutParagraphs.map((paragraph, index) => (
                  <p 
                    key={index} 
                    className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
                
                {aboutParagraphs.length === 0 && (
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    Yazılım geliştirme alanında uzun yıllara dayanan deneyimim ile modern web teknolojilerini kullanarak kullanıcı dostu, yüksek performanslı ve ölçeklenebilir uygulamalar geliştiriyorum. Front-end ve back-end teknolojilerinde uzmanlaşmış bir yazılım geliştirici olarak, ekip çalışmasına ve temiz kod prensibine büyük önem veriyorum.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutContent;