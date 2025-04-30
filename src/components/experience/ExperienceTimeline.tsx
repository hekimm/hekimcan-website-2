import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type Deneyim = Database['public']['Tables']['deneyimler']['Row'];

const ExperienceTimeline = () => {
  const [experiences, setExperiences] = useState<Deneyim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const { data, error } = await supabase
          .from('deneyimler')
          .select('*')
          .order('baslangic_tarihi', { ascending: false });
        
        if (error) throw error;
        setExperiences(data || []);
      } catch (error) {
        console.error('Deneyimler çekilemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  // Tarih formatını düzenle: YYYY-MM-DD -> Ay Yıl
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const months = [
      "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
      "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];
    
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <section className="py-16">
      <div className="container-custom">
        {loading ? (
          <div className="space-y-12 max-w-3xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex animate-pulse">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mr-8"></div>
                <div className="flex-1 pt-1 space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="flex gap-2">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {experiences.length > 0 ? (
              <div className="relative">
                {/* Zaman çizgisi */}
                <div className="absolute left-8 top-0 h-full w-0.5 bg-primary-200 dark:bg-primary-800" />
                
                {/* Deneyimler */}
                <div className="space-y-16">
                  {experiences.map((experience, index) => (
                    <motion.div 
                      key={experience.id} 
                      className="relative flex"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      {/* Çember */}
                      <div className="flex-shrink-0 z-10">
                        <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 border-4 border-white dark:border-gray-900 flex items-center justify-center shadow-md mr-8">
                          <span className="text-primary-600 dark:text-primary-400 font-bold">
                            {experience.sirket_adi.charAt(0)}
                          </span>
                        </div>
                      </div>
                      
                      {/* İçerik */}
                      <div className="flex-1 pt-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {experience.pozisyon}
                        </h3>
                        <h4 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">
                          {experience.sirket_adi}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          {formatDate(experience.baslangic_tarihi)} - {experience.devam_ediyor ? 'Günümüz' : formatDate(experience.bitis_tarihi)}
                        </p>
                        
                        <div className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line">
                          {experience.sorumluluklar}
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {experience.teknolojiler.map((tech, i) => (
                            <span 
                              key={i} 
                              className="px-3 py-1 text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Henüz deneyim bilgisi eklenmemiş.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperienceTimeline;